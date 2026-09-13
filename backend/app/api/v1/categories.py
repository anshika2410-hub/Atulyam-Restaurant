from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_admin
from app.crud.crud_menu import (
    get_categories,
    get_category_by_id,
    get_category_by_slug,
    create_category,
    update_category,
    delete_category,
)
from app.schemas.menu import CategoryCreate, CategoryUpdate, CategoryResponse
from app.models.admin import Admin

router = APIRouter(prefix="/categories", tags=["Menu Categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(active_only: bool = True, db: Session = Depends(get_db)):
    return get_categories(db, active_only=active_only)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = get_category_by_id(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def add_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    existing = get_category_by_slug(db, cat_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    return create_category(db, cat_in)


@router.put("/{category_id}", response_model=CategoryResponse)
def modify_category(
    category_id: int,
    cat_in: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    cat = get_category_by_id(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return update_category(db, cat, cat_in)


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    success = delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
