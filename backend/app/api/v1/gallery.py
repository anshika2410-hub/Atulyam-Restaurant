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
from app.models.gallery import Gallery
from app.schemas.gallery import GalleryResponse
from app.core.deps import get_current_admin

router = APIRouter(
    prefix="/gallery",
    tags=["Gallery"]
)

UPLOAD_DIR = "uploads/gallery"
os.makedirs(UPLOAD_DIR, exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


@router.get("/", response_model=List[GalleryResponse])
def get_gallery(
    db: Session = Depends(get_db),
):
    return (
        db.query(Gallery)
        .order_by(
            Gallery.display_order.asc(),
            Gallery.id.desc()
        )
        .all()
    )


@router.post(
    "/upload",
    response_model=GalleryResponse,
)
async def upload_gallery_image(
    title: str = Form(...),
    category: str = Form("Ambience"),
    caption: str = Form(None),
    display_order: int = Form(0),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    extension = os.path.splitext(
        image.filename or ""
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    try:
        contents = await image.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to upload image."
        )

    image_url = f"/uploads/gallery/{filename}"

    gallery_item = Gallery(
        title=title,
        image_url=image_url,
        category=category,
        caption=caption,
        display_order=display_order,
    )

    db.add(gallery_item)
    db.commit()
    db.refresh(gallery_item)

    return gallery_item

@router.put(
    "/{gallery_id}",
    response_model=GalleryResponse,
)
async def update_gallery_image(
    gallery_id: int,
    title: str = Form(...),
    category: str = Form("Ambience"),
    caption: str = Form(None),
    display_order: int = Form(0),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    gallery_item = (
        db.query(Gallery)
        .filter(Gallery.id == gallery_id)
        .first()
    )

    if not gallery_item:
        raise HTTPException(
            status_code=404,
            detail="Gallery image not found."
        )

    # Update text fields
    gallery_item.title = title
    gallery_item.category = category
    gallery_item.caption = caption
    gallery_item.display_order = display_order

    # Replace image only if a new image was selected
    if image:
        extension = os.path.splitext(
            image.filename or ""
        )[1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed."
            )

        filename = f"{uuid.uuid4().hex}{extension}"
        file_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        try:
            contents = await image.read()

            with open(file_path, "wb") as buffer:
                buffer.write(contents)

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Unable to upload replacement image."
            )

        # Delete old image file
        old_image_url = gallery_item.image_url

        if old_image_url:
            old_file_path = old_image_url.lstrip("/")

            if os.path.exists(old_file_path):
                try:
                    os.remove(old_file_path)
                except Exception:
                    pass

        gallery_item.image_url = (
            f"/uploads/gallery/{filename}"
        )

    db.commit()
    db.refresh(gallery_item)

    return gallery_item

@router.delete(
    "/{gallery_id}",
)
def delete_gallery_image(
    gallery_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    gallery_item = (
        db.query(Gallery)
        .filter(Gallery.id == gallery_id)
        .first()
    )

    if not gallery_item:
        raise HTTPException(
            status_code=404,
            detail="Gallery image not found."
        )

    # Delete image file from uploads/gallery
    if gallery_item.image_url:
        file_path = gallery_item.image_url.lstrip("/")

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

    db.delete(gallery_item)
    db.commit()

    return {
        "message": "Gallery image deleted successfully."
    }