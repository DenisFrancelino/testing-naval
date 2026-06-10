from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.score import ScoreCreate, ScoreResponse
from app.services import score_service

router = APIRouter(prefix="/scores", tags=["scores"])


@router.post("", response_model=ScoreResponse, status_code=201)
def save_score(
    data: ScoreCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return score_service.save_score(db, user_id, data)


@router.get("/ranking", response_model=list[ScoreResponse])
def get_ranking(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return score_service.get_ranking(db)
