from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_admin
from app.crud.crud_slide import (
    get_home_slides,
    get_slide_by_id,
    create_slide,
    update_slide,
    delete_slide,
)
from app.schemas.slide import HomeSlideCreate, HomeSlideUpdate, HomeSlideResponse
from app.models.admin import Admin

router = APIRouter(prefix="/slides", tags=["Homepage Slides"])


@router.get("", response_model=List[HomeSlideResponse])
def list_slides(active_only: bool = True, db: Session = Depends(get_db)):
    return get_home_slides(db, active_only=active_only)


@router.get("/{slide_id}", response_model=HomeSlideResponse)
def get_slide(slide_id: int, db: Session = Depends(get_db)):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


@router.post("", response_model=HomeSlideResponse, status_code=status.HTTP_201_CREATED)
def add_slide(
    slide_in: HomeSlideCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    return create_slide(db, slide_in)


@router.put("/{slide_id}", response_model=HomeSlideResponse)
def modify_slide(
    slide_id: int,
    slide_in: HomeSlideUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return update_slide(db, slide, slide_in)


@router.delete("/{slide_id}", status_code=status.HTTP_200_OK)
def remove_slide(
    slide_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    success = delete_slide(db, slide_id)
    if not success:
        raise HTTPException(status_code=404, detail="Slide not found")
    return {"message": "Slide deleted successfully"}
