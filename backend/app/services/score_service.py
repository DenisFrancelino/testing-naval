from sqlalchemy.orm import Session
from app.repositories import score_repository, user_repository
from app.schemas.score import ScoreCreate, ScoreResponse


def save_score(db: Session, user_id: int, data: ScoreCreate) -> ScoreResponse:
    score = score_repository.create(db, user_id, data.board_size, data.time_seconds)
    user = user_repository.get_by_id(db, user_id)
    return ScoreResponse(
        id=score.id,
        board_size=score.board_size,
        time_seconds=score.time_seconds,
        created_at=score.created_at,
        user_email=user.email,
    )


def get_ranking(db: Session) -> list[ScoreResponse]:
    scores = score_repository.get_top30(db)
    return [
        ScoreResponse(
            id=s.id,
            board_size=s.board_size,
            time_seconds=s.time_seconds,
            created_at=s.created_at,
            user_email=s.user.email,
        )
        for s in scores
    ]
