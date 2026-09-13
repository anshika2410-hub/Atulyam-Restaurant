from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.catering import Catering
from app.schemas.catering import CateringCreate


def create_catering_inquiry(db: Session, cat_in: CateringCreate) -> Catering:
    inquiry = Catering(**cat_in.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


def get_catering_inquiries(db: Session, status: Optional[str] = None) -> List[Catering]:
    query = db.query(Catering)
    if status:
        query = query.filter(Catering.status == status)
    return query.order_by(Catering.id.desc()).all()


def get_catering_by_id(db: Session, inquiry_id: int) -> Optional[Catering]:
    return db.query(Catering).filter(Catering.id == inquiry_id).first()


def update_catering_status(db: Session, inquiry: Catering, status: str) -> Catering:
    inquiry.status = status
    db.commit()
    db.refresh(inquiry)
    return inquiry


def delete_catering(db: Session, inquiry_id: int) -> bool:
    inquiry = get_catering_by_id(db, inquiry_id)
    if not inquiry:
        return False
    db.delete(inquiry)
    db.commit()
    return True
