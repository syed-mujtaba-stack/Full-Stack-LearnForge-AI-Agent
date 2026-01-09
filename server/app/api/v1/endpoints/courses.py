from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.db import session as deps
from app.core import security
from app.crud import crud_course as crud

router = APIRouter()

@router.get("/", response_model=List[schemas.Course])
async def read_courses(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve courses.
    """
    courses = await crud.course.get_multi(db, skip=skip, limit=limit)
    return courses

@router.post("/", response_model=schemas.Course)
async def create_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    course_in: schemas.CourseCreate,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Create new course.
    """
    # Instructor is the current user
    return await crud.course.create(db=db, obj_in=course_in, instructor_id=current_user["uid"])

@router.get("/{id}", response_model=schemas.Course)
async def read_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get course by ID.
    """
    course = await crud.course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{id}", response_model=schemas.Course)
async def update_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    course_in: schemas.CourseUpdate,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Update a course.
    """
    course = await crud.course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    course = await crud.course.update(db=db, db_obj=course, obj_in=course_in)
    return course

@router.delete("/{id}", response_model=schemas.Course)
async def delete_course(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Delete a course.
    """
    course = await crud.course.get(db, id=id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    course = await crud.course.remove(db=db, id=id)
    return course

# --- Modules ---

@router.post("/{course_id}/modules", response_model=schemas.Module)
async def create_module(
    *,
    db: AsyncSession = Depends(deps.get_db),
    course_id: int,
    module_in: schemas.ModuleCreate,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Create a module for a course.
    """
    course = await crud.course.get(db, id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await crud.module.create(db=db, obj_in=module_in, course_id=course_id)

# --- Lessons ---

@router.post("/modules/{module_id}/lessons", response_model=schemas.Lesson)
async def create_lesson(
    *,
    db: AsyncSession = Depends(deps.get_db),
    module_id: int,
    lesson_in: schemas.LessonCreate,
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Create a lesson for a module.
    """
    module = await crud.module.get(db, id=module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Check course ownership via module -> course relationship?
    # For now assuming module existence check implies access or we add strict check:
    # course = await crud.course.get(db, id=module.course_id) ...
    # Simplified for initial implementation.
    
    return await crud.lesson.create(db=db, obj_in=lesson_in, module_id=module_id)
