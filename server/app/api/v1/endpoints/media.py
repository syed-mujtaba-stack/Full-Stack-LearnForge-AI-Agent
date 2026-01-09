from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.services.media_service import media_service
from app.core import security

router = APIRouter()

@router.post("/upload", response_model=dict)
async def upload_media(
    file: UploadFile = File(...),
    current_user: dict = Depends(security.get_current_user),
) -> Any:
    """
    Upload media files.
    """
    # Simple check for instructor role if needed
    # if not current_user.get("is_instructor"): ...
    
    file_path = await media_service.upload_file(file)
    return {
        "filename": file.filename,
        "url": media_service.get_file_url(file_path),
        "path": file_path
    }
