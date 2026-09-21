from typing import List, Optional
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    UploadFile,
    File,
    status,
)

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.deps import get_current_admin

from app.crud.crud_menu import (
    get_menu_items,
    get_menu_item_by_id,
    create_menu_item,
    update_menu_item,
    delete_menu_item,
    get_category_by_id,
)

from app.schemas.menu import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
)

from app.models.admin import Admin


router = APIRouter(prefix="/menu", tags=["Menu Items"])


# ---------------------------------------------------------
# LIST MENU
# ---------------------------------------------------------
@router.get("", response_model=List[MenuItemResponse])
def list_menu_items(
    category_id: Optional[int] = Query(
        None,
        description="Filter by category ID",
    ),
    is_veg: Optional[bool] = Query(
        None,
        description="Filter vegetarian items",
    ),
    is_featured: Optional[bool] = Query(
        None,
        description="Filter featured chef specials",
    ),
    available_only: bool = Query(
        True,
        description="Only show currently available dishes",
    ),
    search: Optional[str] = Query(
        None,
        description="Search by dish name or description",
    ),
    db: Session = Depends(get_db),
):
    return get_menu_items(
        db,
        category_id=category_id,
        is_veg=is_veg,
        is_featured=is_featured,
        available_only=available_only,
        search=search,
    )


# ---------------------------------------------------------
# GET SINGLE MENU ITEM
# ---------------------------------------------------------
@router.get("/{item_id}", response_model=MenuItemResponse)
def get_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = get_menu_item_by_id(db, item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    return item


# ---------------------------------------------------------
# UPLOAD MENU IMAGE
# ---------------------------------------------------------
@router.post("/upload-image")
async def upload_menu_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    original_name = file.filename or ""
    extension = Path(original_name).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed.",
        )

    # backend/uploads/menu
    upload_dir = Path("uploads") / "menu"
    upload_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid4().hex}{extension}"
    file_path = upload_dir / filename

    try:
        contents = await file.read()

        # 5 MB limit
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 5 MB.",
            )

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

    except HTTPException:
        raise

    except Exception as error:
        print("Menu image upload error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to upload menu image.",
        )

    return {
        "message": "Menu image uploaded successfully",
        "url": f"/uploads/menu/{filename}",
    }


# ---------------------------------------------------------
# ADD MENU ITEM
# ---------------------------------------------------------
@router.post(
    "",
    response_model=MenuItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_menu_item(
    item_in: MenuItemCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    cat = get_category_by_id(
        db,
        item_in.category_id,
    )

    if not cat:
        raise HTTPException(
            status_code=400,
            detail="Invalid category_id: Category does not exist",
        )

    return create_menu_item(
        db,
        item_in,
    )


# ---------------------------------------------------------
# UPDATE MENU ITEM
# ---------------------------------------------------------
@router.put(
    "/{item_id}",
    response_model=MenuItemResponse,
)
def modify_menu_item(
    item_id: int,
    item_in: MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    item = get_menu_item_by_id(
        db,
        item_id,
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    if item_in.category_id is not None:
        cat = get_category_by_id(
            db,
            item_in.category_id,
        )

        if not cat:
            raise HTTPException(
                status_code=400,
                detail="Invalid category_id",
            )

    return update_menu_item(
        db,
        item,
        item_in,
    )


# ---------------------------------------------------------
# DELETE MENU ITEM
# ---------------------------------------------------------
@router.delete(
    "/{item_id}",
    status_code=status.HTTP_200_OK,
)
def remove_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    success = delete_menu_item(
        db,
        item_id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found",
        )

    return {
        "message": "Menu item deleted successfully"
    }