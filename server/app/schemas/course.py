from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Lesson ---
class LessonBase(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    order: int = 0

class LessonCreate(LessonBase):
    pass

class LessonUpdate(LessonBase):
    title: Optional[str] = None
    order: Optional[int] = None

class Lesson(LessonBase):
    id: int
    module_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Module ---
class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 0

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(ModuleBase):
    title: Optional[str] = None
    order: Optional[int] = None

class Module(ModuleBase):
    id: int
    course_id: int
    created_at: datetime
    lessons: List[Lesson] = []

    class Config:
        from_attributes = True

# --- Course ---
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_published: bool = False

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    title: Optional[str] = None

class Course(CourseBase):
    id: int
    instructor_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    modules: List[Module] = []

    class Config:
        from_attributes = True
