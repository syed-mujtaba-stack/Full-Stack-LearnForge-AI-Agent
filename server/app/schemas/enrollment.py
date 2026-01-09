from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .course import Course

class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: int
    user_id: str
    enrolled_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class CourseWithProgress(Course):
    progress: float = 0.0
