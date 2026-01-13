from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any
from app import schemas
from app.core import security
from app.db import session as deps
from app.services.ai.agents import AITutorService, QuizGeneratorService, CodeAssistantService

router = APIRouter()

@router.post("/chat", response_model=schemas.ChatResponse)
async def tutor_chat(
    *,
    db: AsyncSession = Depends(deps.get_db),
    chat_in: schemas.ChatRequest,
    current_user_token: dict = Depends(security.get_current_user),
) -> Any:
    """
    Chat with the AI Tutor.
    """
    tutor = AITutorService(db)
    response = await tutor.chat(
        user_id=current_user_token.get("uid"),
        course_id=chat_in.course_id,
        message=chat_in.message,
        history=chat_in.history
    )
    return {"response": response, "context_used": True}

@router.post("/generate-quiz", response_model=schemas.QuizResponse)
async def generate_quiz(
    *,
    db: AsyncSession = Depends(deps.get_db),
    quiz_in: schemas.QuizGenerateRequest,
    current_user_token: dict = Depends(security.get_current_user),
) -> Any:
    """
    Generate a quiz for a lesson.
    """
    quiz_service = QuizGeneratorService(db)
    quiz = await quiz_service.generate_lesson_quiz(lesson_id=quiz_in.lesson_id)
    
    if "error" in quiz:
        raise HTTPException(status_code=404, detail=quiz["error"])
        
    return quiz

@router.post("/explain-code", response_model=schemas.CodeExplainResponse)
async def explain_code(
    *,
    db: AsyncSession = Depends(deps.get_db),
    code_in: schemas.CodeExplainRequest,
    current_user_token: dict = Depends(security.get_current_user),
) -> Any:
    """
    Get AI explanation for a code snippet.
    """
    code_service = CodeAssistantService(db)
    explanation = await code_service.explain_code(
        code=code_in.code,
        language=code_in.language
    )
    return {"explanation": explanation}
