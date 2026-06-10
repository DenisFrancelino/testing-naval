# Campo Minado — Desafio Técnico FullStack Python

Jogo de Campo Minado fullstack com autenticação JWT, ranking global e três tamanhos de tabuleiro.

## Stack

- **Frontend:** HTML + CSS + JavaScript puro (sem framework)
- **Backend:** FastAPI (Python 3.11+)
- **Banco:** PostgreSQL + SQLAlchemy
- **Auth:** JWT com bcrypt

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/DenisFrancelino/testing-naval.git
cd testing-naval
```

### 2. Configure o ambiente virtual

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual:

```bash
# Windows
.venv\Scripts\activate

# Linux / Mac
source .venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e renomeie para `.env`:

```bash
# Windows
copy .env.sample .env

# Linux / Mac
cp .env.sample .env
```

Abra o arquivo `.env` e preencha com os seus dados:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
SECRET_KEY=troque-por-uma-chave-longa-e-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> As tabelas são criadas automaticamente no banco na primeira execução, não é necessário rodar migrations.

### 5. Suba o backend

```bash
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.
Documentação interativa (Swagger): `http://localhost:8000/docs`

### 6. Abra o frontend

Com o backend rodando, abra o arquivo abaixo no navegador:

```
frontend/login.html
```

Arraste o arquivo para o navegador ou cole o caminho completo na barra de endereço. Essa é a página inicial — a partir dela você acessa o jogo e o ranking.

---

## Páginas

| Arquivo | Descrição |
|---|---|
| `frontend/login.html` | **Comece aqui** — login e cadastro |
| `frontend/index.html` | Jogo (redireciona para login se não autenticado) |
| `frontend/ranking.html` | Top 30 por tamanho de tabuleiro |

---

## Endpoints da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cadastro de usuário |
| POST | `/auth/login` | Não | Login — retorna JWT |
| POST | `/scores` | Sim | Salva score de vitória |
| GET | `/scores/ranking` | Sim | Retorna top 30 scores |

---

## Como jogar

- **Clique esquerdo** — revela a célula
- **Clique direito** — marca/desmarca bandeira 🚩
- Os números indicam quantas minas existem nas células vizinhas
- Vença revelando todas as células sem minas
- Ao vencer, o score (tempo em segundos) é salvo automaticamente no ranking

### Tamanhos disponíveis

| Tamanho | Minas | Dificuldade |
|---|---|---|
| 9×9 | 10 | Fácil |
| 16×16 | 40 | Médio |
| 30×16 | 99 | Difícil |

---

## Arquitetura do backend

```
backend/
├── main.py                  # Entry point FastAPI
├── requirements.txt         # Dependências Python
├── .env.sample              # Exemplo de configuração
└── app/
    ├── api/                 # Routers — recebem e respondem requisições HTTP
    ├── services/            # Regras de negócio
    ├── repositories/        # Acesso ao banco de dados
    ├── models/              # SQLAlchemy models (tabelas)
    ├── schemas/             # Pydantic DTOs (validação de dados)
    └── core/                # Config, conexão com banco, JWT e segurança
```
