import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import MessageResponse

router = APIRouter()

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed image types and max size
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_TYPES)}"
        )


@router.post("/profile-image", response_model=MessageResponse)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a profile image for the current user."""
    validate_image(file)

    # Read file content to check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )

    # Generate unique filename
    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    unique_filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}.{file_ext}"

    # Create user upload directory
    user_dir = UPLOAD_DIR / current_user.id
    user_dir.mkdir(exist_ok=True)

    # Save file
    file_path = user_dir / unique_filename
    with open(file_path, "wb") as f:
        f.write(content)

    # Update user profile_image in database
    image_url = f"/api/v1/upload/images/{current_user.id}/{unique_filename}"
    current_user.profile_image = image_url
    db.commit()

    return MessageResponse(message="Profile image uploaded successfully")


@router.get("/images/{user_id}/{filename}")
async def get_uploaded_image(
    user_id: str,
    filename: str,
    current_user: User = Depends(get_current_user),
):
    """Serve an uploaded image."""
    file_path = UPLOAD_DIR / user_id / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    # Security: Only allow users to access their own images or make this public
    # For profile images, you might want to make this public
    return FileResponse(file_path)


@router.delete("/profile-image", response_model=MessageResponse)
async def delete_profile_image(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete the current user's profile image."""
    if current_user.profile_image:
        # Extract file path from URL
        file_path = Path(current_user.profile_image.replace("/api/v1/upload/", ""))
        if file_path.exists():
            os.remove(file_path)

        current_user.profile_image = None
        db.commit()

    return MessageResponse(message="Profile image deleted successfully")
