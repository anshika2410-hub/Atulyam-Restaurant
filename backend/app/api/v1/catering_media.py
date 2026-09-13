import os
import uuid
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.catering_media import CateringMedia
from app.schemas.catering_media import CateringMediaResponse
from app.core.deps import get_current_admin


router = APIRouter(
    prefix="/catering-media",
    tags=["Catering Media"],
)


UPLOAD_DIR = "uploads/catering"
os.makedirs(UPLOAD_DIR, exist_ok=True)


ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".webm",
    ".mov",
}


# =========================================================
# PUBLIC — GET ALL MEDIA
# =========================================================

@router.get(
    "/",
    response_model=List[CateringMediaResponse],
)
def get_catering_media(
    db: Session = Depends(get_db),
):
    return (
        db.query(CateringMedia)
        .order_by(
            CateringMedia.occasion.asc(),
            CateringMedia.display_order.asc(),
            CateringMedia.id.desc(),
        )
        .all()
    )


# =========================================================
# ADMIN — UPLOAD IMAGE / VIDEO
# =========================================================

@router.post(
    "/upload",
    response_model=CateringMediaResponse,
)
async def upload_catering_media(
    occasion: str = Form(...),
    title: str = Form(...),
    description: str = Form(None),
    display_order: int = Form(0),
    media: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    extension = os.path.splitext(
        media.filename or ""
    )[1].lower()

    if extension in ALLOWED_IMAGE_EXTENSIONS:
        media_type = "image"

    elif extension in ALLOWED_VIDEO_EXTENSIONS:
        media_type = "video"

    else:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG, PNG, WEBP, MP4, "
                "WEBM and MOV files are allowed."
            ),
        )

    filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )

    try:
        contents = await media.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to upload catering media.",
        )

    media_url = f"/uploads/catering/{filename}"

    catering_media = CateringMedia(
        occasion=occasion,
        title=title,
        description=description,
        media_url=media_url,
        media_type=media_type,
        display_order=display_order,
    )

    db.add(catering_media)
    db.commit()
    db.refresh(catering_media)

    return catering_media


# =========================================================
# ADMIN — UPDATE
# =========================================================

@router.put(
    "/{media_id}",
    response_model=CateringMediaResponse,
)
async def update_catering_media(
    media_id: int,
    occasion: str = Form(...),
    title: str = Form(...),
    description: str = Form(None),
    display_order: int = Form(0),
    media: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    catering_media = (
        db.query(CateringMedia)
        .filter(CateringMedia.id == media_id)
        .first()
    )

    if not catering_media:
        raise HTTPException(
            status_code=404,
            detail="Catering media not found.",
        )

    catering_media.occasion = occasion
    catering_media.title = title
    catering_media.description = description
    catering_media.display_order = display_order

    if media:

        extension = os.path.splitext(
            media.filename or ""
        )[1].lower()

        if extension in ALLOWED_IMAGE_EXTENSIONS:
            media_type = "image"

        elif extension in ALLOWED_VIDEO_EXTENSIONS:
            media_type = "video"

        else:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Only JPG, JPEG, PNG, WEBP, MP4, "
                    "WEBM and MOV files are allowed."
                ),
            )

        filename = f"{uuid.uuid4().hex}{extension}"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename,
        )

        try:
            contents = await media.read()

            with open(file_path, "wb") as buffer:
                buffer.write(contents)

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Unable to upload replacement media.",
            )

        old_media_url = catering_media.media_url

        if old_media_url:
            old_file_path = old_media_url.lstrip("/")

            if os.path.exists(old_file_path):
                try:
                    os.remove(old_file_path)
                except Exception:
                    pass

        catering_media.media_url = (
            f"/uploads/catering/{filename}"
        )

        catering_media.media_type = media_type

    db.commit()
    db.refresh(catering_media)

    return catering_media


# =========================================================
# ADMIN — DELETE
# =========================================================

@router.delete(
    "/{media_id}",
)
def delete_catering_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    catering_media = (
        db.query(CateringMedia)
        .filter(CateringMedia.id == media_id)
        .first()
    )

    if not catering_media:
        raise HTTPException(
            status_code=404,
            detail="Catering media not found.",
        )

    if catering_media.media_url:

        file_path = catering_media.media_url.lstrip("/")

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

    db.delete(catering_media)
    db.commit()

    return {
        "message": "Catering media deleted successfully."
    }