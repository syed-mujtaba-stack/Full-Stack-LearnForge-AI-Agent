from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app import schemas, models
from app.db import session as deps
from app.core import security

router = APIRouter()

@router.post("/{course_id}/enroll", response_model=schemas.EnrollmentResponse)
async def enroll_in_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    course_id: int,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Enroll the current user in a course.
    """
    uid = current_user["uid"]
    
    # Check if course exists
    result = await db.execute(select(models.course.Course).filter(models.course.Course.id == course_id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    # Check if already enrolled
    result = await db.execute(
        select(models.enrollment.Enrollment).filter(
            models.enrollment.Enrollment.user_id == uid,
            models.enrollment.Enrollment.course_id == course_id
        )
    )
    enrollment = result.scalars().first()
    if enrollment:
        return enrollment

    # Create new enrollment
    enrollment = models.enrollment.Enrollment(
        user_id=uid,
        course_id=course_id
    )
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

@router.get("/my-courses", response_model=List[schemas.enrollment.CourseWithProgress])
async def get_my_courses(
    *,
    db: AsyncSession = Depends(deps.get_db),
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Get all courses the current user is enrolled in with progress.
    """
    uid = current_user["uid"]
    
    result = await db.execute(
        select(models.course.Course)
        .join(models.enrollment.Enrollment)
        .filter(models.enrollment.Enrollment.user_id == uid)
    )
    db_courses = result.scalars().all()
    
    courses_with_progress = []
    from app.crud.crud_course import course as crud_course
    for db_course in db_courses:
        progress = await crud_course.get_course_progress(db, course_id=db_course.id, user_id=uid)
        
        # Convert SQLAlchemy object to Pydantic and add progress
        course_data = schemas.course.Course.model_validate(db_course)
        course_with_progress = schemas.enrollment.CourseWithProgress(
            **course_data.model_dump(),
            progress=progress
        )
        courses_with_progress.append(course_with_progress)
        
    return courses_with_progress
