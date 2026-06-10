# Campo Minado — Desafio Técnico FullStack Python

FastAPI + PostgreSQL + HTML/CSS/JS

## Stack

- **Frontend:** HTML + CSS + JavaScript puro
- **Backend:** FastAPI (Python 3.11+)
- **Banco:** PostgreSQL (Neon) + SQLAlchemy
- **Auth:** JWT (email + senha)

## Como rodar localmente

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Crie um arquivo `.env` em `backend/` com:

```
DATABASE_URL=sua_connection_string_aqui
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend

Abra os arquivos HTML diretamente no navegador ou sirva com qualquer servidor estático.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastro |
| POST | `/auth/login` | Login (retorna JWT) |
| POST | `/scores` | Salva score (auth) |
| GET | `/scores/ranking` | Top 30 scores (auth) |
