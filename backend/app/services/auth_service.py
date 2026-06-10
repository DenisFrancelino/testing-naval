from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import user_repository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate, Token


def register(db: Session, data: UserCreate) -> Token:
    if user_repository.get_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado",
        )
    hashed = hash_password(data.password)
    user = user_repository.create(db, data.email, hashed)
    token = create_access_token(user.id)
    return Token(access_token=token)


def login(db: Session, email: str, password: str) -> Token:
    user = user_repository.get_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )
    token = create_access_token(user.id)
    return Token(access_token=token)
