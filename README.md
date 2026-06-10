# Campo Minado — Desafio Técnico FullStack Python

Jogo de Campo Minado fullstack com autenticação JWT, ranking global e três tamanhos de tabuleiro.

## Stack

- **Frontend:** HTML + CSS + JavaScript puro (sem framework)
- **Backend:** FastAPI (Python 3.11+)
- **Banco:** PostgreSQL + SQLAlchemy
- **Auth:** JWT com bcrypt

---

## Pré-requisitos

- Python 3.11+
- Uma instância PostgreSQL (local ou na nuvem — ex: [Neon](https://neon.tech))

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/DenisFrancelino/testing-naval.git
cd testing-naval
```

### 2. Configure o backend

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

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` dentro da pasta `backend/`:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
SECRET_KEY=uma-chave-secreta-longa-qualquer
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> O `DATABASE_URL` deve apontar para o seu banco PostgreSQL. As tabelas são criadas automaticamente na primeira execução.

### 3. Suba o backend

```bash
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.  
Documentação interativa: `http://localhost:8000/docs`

### 4. Abra o frontend

Com o backend rodando, abra o arquivo no navegador:

```
frontend/login.html
```

Ou arraste o arquivo direto para o navegador.

---

## Páginas

| Arquivo | Rota | Descrição |
|---|---|---|
| `login.html` | `/login` | Login e cadastro |
| `index.html` | `/` | Jogo (protegido) |
| `ranking.html` | `/ranking` | Top 30 por tabuleiro (protegido) |

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
- **Clique direito** — marca/desmarca uma bandeira 🚩
- Os números indicam quantas minas existem nas células vizinhas
- Vença revelando todas as células sem minas
- Ao vencer, o score (tempo) é salvo automaticamente no ranking

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
├── app/
│   ├── api/                 # Routers (controllers)
│   ├── services/            # Lógica de negócio
│   ├── repositories/        # Acesso ao banco
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic DTOs
│   └── core/                # Config, DB, JWT, segurança
```
