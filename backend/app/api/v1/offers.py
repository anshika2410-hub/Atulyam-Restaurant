from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.offer import Offer
from app.models.admin import Admin
from app.schemas.offer import (
    OfferCreate,
    OfferUpdate,
    OfferResponse,
    OfferValidateResponse,
)
from app.core.deps import get_current_admin


router = APIRouter(
    prefix="/offers",
    tags=["Offers"],
)


# =========================================================
# GET ALL OFFERS
# Public
# =========================================================
@router.get("", response_model=List[OfferResponse])
def get_offers(
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    query = db.query(Offer)

    if active_only:
        query = query.filter(Offer.is_active == True)

    return query.order_by(Offer.id.desc()).all()



# =========================================================
# CREATE OFFER
# Admin only
# =========================================================
@router.post("", response_model=OfferResponse)
def create_offer(
    offer: OfferCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    # Check duplicate offer code
    existing_offer = (
        db.query(Offer)
        .filter(Offer.code == offer.code)
        .first()
    )

    if existing_offer:
        raise HTTPException(
            status_code=400,
            detail="Offer code already exists",
        )

    new_offer = Offer(
        title=offer.title,
        code=offer.code,
        description=offer.description,
        discount_percentage=offer.discount_percentage,
        min_order_amount=offer.min_order_amount,
        valid_from=offer.valid_from or datetime.utcnow(),
        valid_until=offer.valid_until,
        is_active=offer.is_active,
        banner_url=offer.banner_url,
    )

    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)

    return new_offer


# =========================================================
# UPDATE OFFER
# Admin only
# =========================================================
@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(
    offer_id: int,
    offer: OfferUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    existing_offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not existing_offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found",
        )

    update_data = offer.model_dump(
        exclude_unset=True
    )

    # Check duplicate code if code is being changed
    if "code" in update_data:
        duplicate_code = (
            db.query(Offer)
            .filter(
                Offer.code == update_data["code"],
                Offer.id != offer_id,
            )
            .first()
        )

        if duplicate_code:
            raise HTTPException(
                status_code=400,
                detail="Offer code already exists",
            )

    for field, value in update_data.items():
        setattr(existing_offer, field, value)

    db.commit()
    db.refresh(existing_offer)

    return existing_offer


# =========================================================
# DELETE OFFER
# Admin only
# =========================================================
@router.delete("/{offer_id}")
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    existing_offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not existing_offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found",
        )

    db.delete(existing_offer)
    db.commit()

    return {
        "message": "Offer deleted successfully"
    }


# =========================================================
# VALIDATE OFFER CODE
# Public
# =========================================================
@router.get(
    "/validate/{code}",
    response_model=OfferValidateResponse,
)
def validate_offer(
    code: str,
    order_amount: float = 0.0,
    db: Session = Depends(get_db),
):
    offer = (
        db.query(Offer)
        .filter(
            Offer.code == code,
            Offer.is_active == True,
        )
        .first()
    )

    if not offer:
        return OfferValidateResponse(
            valid=False,
            code=code,
            discount_percentage=0,
            message="Invalid or inactive offer code.",
            min_order_amount=0.0,
        )

    now = datetime.utcnow()

    # Check start date
    if offer.valid_from and now < offer.valid_from:
        return OfferValidateResponse(
            valid=False,
            code=offer.code,
            discount_percentage=offer.discount_percentage,
            message="This offer is not active yet.",
            min_order_amount=offer.min_order_amount,
        )

    # Check expiry
    if offer.valid_until and now > offer.valid_until:
        return OfferValidateResponse(
            valid=False,
            code=offer.code,
            discount_percentage=offer.discount_percentage,
            message="This offer has expired.",
            min_order_amount=offer.min_order_amount,
        )

    # Check minimum order amount
    if order_amount < offer.min_order_amount:
        return OfferValidateResponse(
            valid=False,
            code=offer.code,
            discount_percentage=offer.discount_percentage,
            message=(
                f"Minimum order amount is "
                f"₹{offer.min_order_amount:.0f}."
            ),
            min_order_amount=offer.min_order_amount,
        )

    return OfferValidateResponse(
        valid=True,
        code=offer.code,
        discount_percentage=offer.discount_percentage,
        message="Offer applied successfully.",
        min_order_amount=offer.min_order_amount,
    )

@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer(
    offer_id: int,
    db: Session = Depends(get_db),
):
    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found",
        )

    return offer
