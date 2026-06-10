from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
import app.models  # noqa: F401 - garante que os models sejam registrados
from app.api.auth_router import router as auth_router

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campo Minado API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}
