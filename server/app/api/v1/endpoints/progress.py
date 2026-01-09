from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import schemas, models
from app.db import session as deps
from app.core import security

router = APIRouter()

@router.get("/{lesson_id}", response_model=schemas.UserProgress)
async def read_progress(
    *,
    db: AsyncSession = Depends(deps.get_db),
    lesson_id: int,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Get user progress for a specific lesson.
    """
    result = await db.execute(
        select(models.progress.UserProgress).filter(
            models.progress.UserProgress.user_id == current_user["uid"],
            models.progress.UserProgress.lesson_id == lesson_id
        )
    )
    progress = result.scalars().first()
    if not progress:
        # Return default empty progress
        return {
            "user_id": current_user["uid"],
            "lesson_id": lesson_id,
            "is_completed": False,
            "video_progress": 0.0,
            "last_accessed": None
        }
    return progress

@router.post("/{lesson_id}", response_model=schemas.UserProgress)
async def update_progress(
    *,
    db: AsyncSession = Depends(deps.get_db),
    lesson_id: int,
    progress_in: schemas.UserProgressUpdate,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Update or create user progress for a lesson.
    """
    uid = current_user["uid"]
    
    result = await db.execute(
        select(models.progress.UserProgress).filter(
            models.progress.UserProgress.user_id == uid,
            models.progress.UserProgress.lesson_id == lesson_id
        )
    )
    db_obj = result.scalars().first()
    
    if db_obj:
        # Update existing
        update_data = progress_in.model_dump(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
    else:
        # Create new
        db_obj = models.progress.UserProgress(
            user_id=uid,
            lesson_id=lesson_id,
            **progress_in.model_dump()
        )
        db.add(db_obj)
        
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
