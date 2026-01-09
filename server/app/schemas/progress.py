from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserProgressBase(BaseModel):
    is_completed: bool = False
    video_progress: float = 0.0

class UserProgressCreate(UserProgressBase):
    lesson_id: int

class UserProgressUpdate(UserProgressBase):
    pass

class UserProgress(UserProgressBase):
    user_id: str
    lesson_id: int
    last_accessed: datetime

    class Config:
        from_attributes = True
