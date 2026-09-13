from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.offer import Offer
from app.schemas.offer import OfferCreate, OfferUpdate, OfferValidateResponse


def get_offers(db: Session, active_only: bool = True) -> List[Offer]:
    query = db.query(Offer)
    if active_only:
        now = datetime.utcnow()
        query = query.filter(
            Offer.is_active == True,
            Offer.valid_from <= now
        )
    return query.order_by(Offer.id.desc()).all()


def get_offer_by_id(db: Session, offer_id: int) -> Optional[Offer]:
    return db.query(Offer).filter(Offer.id == offer_id).first()


def get_offer_by_code(db: Session, code: str) -> Optional[Offer]:
    return db.query(Offer).filter(Offer.code == code.strip().upper()).first()


def validate_offer_code(db: Session, code: str, order_amount: float) -> OfferValidateResponse:
    offer = get_offer_by_code(db, code)
    if not offer or not offer.is_active:
        return OfferValidateResponse(
            valid=False,
            code=code,
            discount_percentage=0,
            message="Invalid or expired promo code.",
            min_order_amount=0.0
        )
    now = datetime.utcnow()
    if offer.valid_until and offer.valid_until < now:
        return OfferValidateResponse(
            valid=False,
            code=code,
            discount_percentage=0,
            message="This offer has expired.",
            min_order_amount=offer.min_order_amount
        )
    if order_amount < offer.min_order_amount:
        return OfferValidateResponse(
            valid=False,
            code=code,
            discount_percentage=0,
            message=f"Minimum order value of ₹{offer.min_order_amount:.2f} required.",
            min_order_amount=offer.min_order_amount
        )
    return OfferValidateResponse(
        valid=True,
        code=offer.code,
        discount_percentage=offer.discount_percentage,
        message=f"{offer.discount_percentage}% discount applied successfully!",
        min_order_amount=offer.min_order_amount
    )


def create_offer(db: Session, offer_in: OfferCreate) -> Offer:
    data = offer_in.model_dump()
    data["code"] = data["code"].strip().upper()
    offer = Offer(**data)
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


def update_offer(db: Session, offer: Offer, offer_in: OfferUpdate) -> Offer:
    data = offer_in.model_dump(exclude_unset=True)
    if "code" in data and data["code"]:
        data["code"] = data["code"].strip().upper()
    for field, val in data.items():
        setattr(offer, field, val)
    db.commit()
    db.refresh(offer)
    return offer


def delete_offer(db: Session, offer_id: int) -> bool:
    offer = get_offer_by_id(db, offer_id)
    if not offer:
        return False
    db.delete(offer)
    db.commit()
    return True
