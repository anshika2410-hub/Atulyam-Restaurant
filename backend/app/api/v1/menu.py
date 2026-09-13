from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
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
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.models.admin import Admin

router = APIRouter(prefix="/menu", tags=["Menu Items"])


@router.get("", response_model=List[MenuItemResponse])
def list_menu_items(
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    is_veg: Optional[bool] = Query(None, description="Filter vegetarian items"),
    is_featured: Optional[bool] = Query(None, description="Filter featured chef specials"),
    available_only: bool = Query(True, description="Only show currently available dishes"),
    search: Optional[str] = Query(None, description="Search by dish name or description"),
    db: Session = Depends(get_db)
):
    return get_menu_items(
        db,
        category_id=category_id,
        is_veg=is_veg,
        is_featured=is_featured,
        available_only=available_only,
        search=search
    )


@router.get("/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = get_menu_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def add_menu_item(
    item_in: MenuItemCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    cat = get_category_by_id(db, item_in.category_id)
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category_id: Category does not exist")
    return create_menu_item(db, item_in)


@router.put("/{item_id}", response_model=MenuItemResponse)
def modify_menu_item(
    item_id: int,
    item_in: MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    item = get_menu_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    if item_in.category_id is not None:
        cat = get_category_by_id(db, item_in.category_id)
        if not cat:
            raise HTTPException(status_code=400, detail="Invalid category_id")
    return update_menu_item(db, item, item_in)


@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
def remove_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    success = delete_menu_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}
