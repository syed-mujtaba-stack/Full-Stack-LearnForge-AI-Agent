from fastapi import APIRouter, Depends
from app.core.security import get_current_user

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {"status": "ok", "message": "Server is running"}

@api_router.get("/health/secure")
def secure_health_check(user: dict = Depends(get_current_user)):
    return {"status": "ok", "message": "Secure Access Granted", "user_uid": user.get("uid")}
