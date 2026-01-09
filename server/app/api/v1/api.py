from fastapi import APIRouter
from app.api.v1.endpoints import users

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
from app.api.v1.endpoints import courses
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
from app.api.v1.endpoints import media, progress, enrollments
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["enrollments"])

@api_router.get("/health")
def health_check():
    return {"status": "ok", "message": "Server is running"}
