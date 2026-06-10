from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ScoreCreate(BaseModel):
    board_size: Literal["9x9", "16x16", "30x16"]
    time_seconds: float


class ScoreResponse(BaseModel):
    id: int
    board_size: str
    time_seconds: float
    created_at: datetime
    user_email: str

    model_config = {"from_attributes": True}
