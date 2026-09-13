from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_admin
from app.crud.crud_catering import (
    create_catering_inquiry,
    get_catering_inquiries,
    get_catering_by_id,
    update_catering_status,
    delete_catering,
)
from app.schemas.catering import CateringCreate, CateringStatusUpdate, CateringResponse
from app.models.admin import Admin

router = APIRouter(prefix="/catering", tags=["Catering & Events"])


@router.post("", response_model=CateringResponse, status_code=status.HTTP_201_CREATED)
def submit_catering_inquiry(cat_in: CateringCreate, db: Session = Depends(get_db)):
    return create_catering_inquiry(db, cat_in)


@router.get("", response_model=List[CateringResponse])
def list_catering_inquiries(
    status: Optional[str] = Query(None, description="Filter by inquiry status"),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    return get_catering_inquiries(db, status=status)


@router.patch("/{inquiry_id}/status", response_model=CateringResponse)
def change_catering_status(
    inquiry_id: int,
    status_update: CateringStatusUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    inquiry = get_catering_by_id(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Catering inquiry not found")
    return update_catering_status(db, inquiry, status_update.status)


@router.delete("/{inquiry_id}", status_code=status.HTTP_200_OK)
def remove_catering_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    success = delete_catering(db, inquiry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Catering inquiry not found")
    return {"message": "Catering inquiry deleted successfully"}
