from .user import User, UserCreate, UserUpdate
from .course import (
    Course, CourseCreate, CourseUpdate,
    Module, ModuleCreate, ModuleUpdate,
    Lesson, LessonCreate, LessonUpdate
)
from .progress import UserProgress, UserProgressCreate, UserProgressUpdate
from .enrollment import EnrollmentResponse, EnrollmentCreate
from .ai import ChatRequest, ChatResponse, QuizGenerateRequest, QuizResponse, CodeExplainRequest, CodeExplainResponse
