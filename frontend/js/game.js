const SIZES = {
  '9x9':   { rows: 9,  cols: 9,  mines: 10 },
  '16x16': { rows: 16, cols: 16, mines: 40 },
  '30x16': { rows: 16, cols: 30, mines: 99 },
};

let board = [];
let gameState = 'idle'; // idle | playing | won | lost
let selectedSize = '9x9';
let minesLeft = 0;
let timerInterval = null;
let elapsedSeconds = 0;
let firstClick = true;

// ── DOM refs ──────────────────────────────────────────────
const boardEl = document.getElementById('board');
const minesEl = document.getElementById('mines-left');
const timerEl = document.getElementById('timer');
const overlay  = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMsg   = document.getElementById('overlay-msg');

// ── Size selection ────────────────────────────────────────
document.querySelectorAll('.btn-size').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-size').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.dataset.size;
  });
});

// ── Start game ────────────────────────────────────────────
function startGame() {
  clearInterval(timerInterval);
  elapsedSeconds = 0;
  firstClick = true;
  gameState = 'playing';
  overlay.classList.remove('show');

  const { rows, cols, mines } = SIZES[selectedSize];
  minesLeft = mines;
  minesEl.textContent = minesLeft;
  timerEl.textContent = '0';

  board = buildBoard(rows, cols);
  renderBoard(rows, cols);
}

// ── Build empty board ─────────────────────────────────────
function buildBoard(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r, c,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

// ── Place mines after first click ────────────────────────
function placeMines(safeR, safeC) {
  const { rows, cols, mines } = SIZES[selectedSize];
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    board[r][c].mine = true;
    placed++;
  }
  // calculate adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].mine) {
        board[r][c].adjacent = countAdjacentMines(r, c);
      }
    }
  }
}

function countAdjacentMines(r, c) {
  return getNeighbors(r, c).filter(n => n.mine).length;
}

function getNeighbors(r, c) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (board[nr]?.[nc]) neighbors.push(board[nr][nc]);
    }
  }
  return neighbors;
}

// ── Render ────────────────────────────────────────────────
function renderBoard(rows, cols) {
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 32px)`;
  boardEl.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', onLeftClick);
      cell.addEventListener('contextmenu', onRightClick);
      boardEl.appendChild(cell);
    }
  }
}

function updateCell(r, c) {
  const cell = boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  const data = board[r][c];

  cell.className = 'cell';
  cell.textContent = '';

  if (data.flagged && !data.revealed) {
    cell.classList.add('flagged');
    cell.textContent = '🚩';
  } else if (data.revealed) {
    cell.classList.add('revealed');
    if (data.mine) {
      cell.classList.add('mine-revealed');
      cell.textContent = '💣';
    } else if (data.adjacent > 0) {
      cell.textContent = data.adjacent;
      cell.classList.add(`n${data.adjacent}`);
    }
  }
}

// ── Click handlers ────────────────────────────────────────
function onLeftClick(e) {
  if (gameState !== 'playing') return;
  const r = +e.currentTarget.dataset.r;
  const c = +e.currentTarget.dataset.c;
  const data = board[r][c];

  if (data.revealed || data.flagged) return;

  if (firstClick) {
    firstClick = false;
    placeMines(r, c);
    startTimer();
  }

  if (data.mine) {
    revealAllMines(r, c);
    endGame(false);
    return;
  }

  reveal(r, c);
  checkWin();
}

function onRightClick(e) {
  e.preventDefault();
  if (gameState !== 'playing') return;
  const r = +e.currentTarget.dataset.r;
  const c = +e.currentTarget.dataset.c;
  const data = board[r][c];

  if (data.revealed) return;
  data.flagged = !data.flagged;
  minesLeft += data.flagged ? -1 : 1;
  minesEl.textContent = minesLeft;
  updateCell(r, c);
}

// ── Flood fill reveal ─────────────────────────────────────
function reveal(r, c) {
  const data = board[r][c];
  if (data.revealed || data.flagged || data.mine) return;
  data.revealed = true;
  updateCell(r, c);
  if (data.adjacent === 0) {
    getNeighbors(r, c).forEach(n => reveal(n.r, n.c));
  }
}

// ── Win / lose ────────────────────────────────────────────
function checkWin() {
  const { rows, cols } = SIZES[selectedSize];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].mine && !board[r][c].revealed) return;
    }
  }
  endGame(true);
}

function revealAllMines(explodedR, explodedC) {
  const { rows, cols } = SIZES[selectedSize];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) {
        board[r][c].revealed = true;
        updateCell(r, c);
        if (r === explodedR && c === explodedC) {
          boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`)
            .classList.add('mine-exploded');
        }
      }
    }
  }
}

async function endGame(won) {
  clearInterval(timerInterval);
  gameState = won ? 'won' : 'lost';

  if (won) {
    try {
      const token = getToken();
      console.log('Salvando score:', { board_size: selectedSize, time_seconds: elapsedSeconds });
      const result = await apiPost('/scores', { board_size: selectedSize, time_seconds: elapsedSeconds }, token);
      console.log('Score salvo com sucesso:', result);
    } catch (e) {
      console.error('Erro ao salvar score:', e.message);
    }
    overlayTitle.textContent = '🎉 Vitória!';
    overlayMsg.textContent = `Você ganhou em ${elapsedSeconds}s no tabuleiro ${selectedSize}.`;
  } else {
    overlayTitle.textContent = '💥 Derrota!';
    overlayMsg.textContent = 'Você clicou em uma mina. Tente novamente!';
  }

  overlay.classList.add('show');
}

// ── Timer ─────────────────────────────────────────────────
function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    timerEl.textContent = elapsedSeconds;
  }, 1000);
}

// ── Teste: simula vitória sem jogar ──────────────────────
function simulateWin() {
  elapsedSeconds = 42;
  gameState = 'playing';
  endGame(true);
}
