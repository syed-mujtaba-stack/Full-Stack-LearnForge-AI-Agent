from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class ChatRequest(BaseModel):
    course_id: int
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str
    context_used: bool = False

class QuizGenerateRequest(BaseModel):
    lesson_id: int

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    title: str
    questions: List[QuizQuestion]

class CodeExplainRequest(BaseModel):
    code: str
    language: str = "python"

class CodeExplainResponse(BaseModel):
    explanation: str

class CourseGenerateRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "beginner"
    target_audience: Optional[str] = None

class CourseGenerateResponse(BaseModel):
    course_id: int
    title: str
    message: str
