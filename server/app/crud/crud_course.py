from typing import Any, Dict, List, Optional, Union

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.course import Course, Module, Lesson
from app.schemas.course import (
    CourseCreate, CourseUpdate,
    ModuleCreate, ModuleUpdate,
    LessonCreate, LessonUpdate
)

class CRUDCourse:
    async def get(self, db: AsyncSession, id: int) -> Optional[Course]:
        result = await db.execute(
            select(Course)
            .options(selectinload(Course.modules).selectinload(Module.lessons))
            .filter(Course.id == id)
        )
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Course]:
        result = await db.execute(select(Course).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: CourseCreate, instructor_id: str) -> Course:
        db_obj = Course(
            title=obj_in.title,
            description=obj_in.description,
            is_published=obj_in.is_published,
            instructor_id=instructor_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: Course, obj_in: Union[CourseUpdate, Dict[str, Any]]) -> Course:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Course]:
        result = await db.execute(select(Course).filter(Course.id == id))
        obj = result.scalars().first()
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

class CRUDModule:
    async def create(self, db: AsyncSession, *, obj_in: ModuleCreate, course_id: int) -> Module:
        db_obj = Module(
            title=obj_in.title,
            description=obj_in.description,
            order=obj_in.order,
            course_id=course_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: int) -> Optional[Module]:
        result = await db.execute(select(Module).filter(Module.id == id))
        return result.scalars().first()

class CRUDLesson:
    async def create(self, db: AsyncSession, *, obj_in: LessonCreate, module_id: int) -> Lesson:
        db_obj = Lesson(
            title=obj_in.title,
            content=obj_in.content,
            video_url=obj_in.video_url,
            order=obj_in.order,
            module_id=module_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: int) -> Optional[Lesson]:
        result = await db.execute(select(Lesson).filter(Lesson.id == id))
        return result.scalars().first()

course = CRUDCourse()
module = CRUDModule()
lesson = CRUDLesson()
