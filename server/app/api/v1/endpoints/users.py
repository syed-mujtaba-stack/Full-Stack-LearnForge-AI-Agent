from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.core import security
from app.db import session as deps
from app.crud import user as crud_user

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def read_user_me(
    db: AsyncSession = Depends(deps.get_db),
    current_user_token: dict = Depends(security.get_current_user),
) -> Any:
    """
    Get current user.
    If user does not exist in DB (first login), create them from token data.
    """
    uid = current_user_token.get("uid")
    email = current_user_token.get("email")
    
    user = await crud_user.get(db, id=uid)
    
    if not user:
        # Auto-register user from Firebase token
        if not email:
             raise HTTPException(status_code=400, detail="Email not found in token")
             
        user_in = schemas.UserCreate(
            id=uid,
            email=email,
            full_name=current_user_token.get("name"),
            is_active=True
        )
        user = await crud_user.create(db, obj_in=user_in)
        
    return user

@router.put("/me", response_model=schemas.User)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user_token: dict = Depends(security.get_current_user),
) -> Any:
    """
    Update own user.
    """
    uid = current_user_token.get("uid")
    user = await crud_user.get(db, id=uid)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = await crud_user.update(db, db_obj=user, obj_in=user_in)
    return user
