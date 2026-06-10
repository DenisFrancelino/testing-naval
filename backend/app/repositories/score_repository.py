from sqlalchemy.orm import Session, joinedload
from app.models.score import Score


def create(db: Session, user_id: int, board_size: str, time_seconds: float) -> Score:
    score = Score(user_id=user_id, board_size=board_size, time_seconds=time_seconds)
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


def get_top30(db: Session) -> list[Score]:
    return (
        db.query(Score)
        .options(joinedload(Score.user))
        .order_by(Score.time_seconds.asc())
        .limit(30)
        .all()
    )
