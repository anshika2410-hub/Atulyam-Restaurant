from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.customer_address import CustomerAddress
from app.schemas.customer_address import (
    CustomerAddressCreate,
    CustomerAddressUpdate,
)


def get_customer_addresses(
    db: Session,
    customer_id: int
) -> List[CustomerAddress]:
    return (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id == customer_id
        )
        .order_by(
            CustomerAddress.is_default.desc(),
            CustomerAddress.id.desc()
        )
        .all()
    )


def get_customer_address(
    db: Session,
    address_id: int,
    customer_id: int
) -> Optional[CustomerAddress]:
    return (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id == customer_id
        )
        .first()
    )


def clear_default_address(
    db: Session,
    customer_id: int
):
    (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id == customer_id
        )
        .update(
            {"is_default": False}
        )
    )


def create_customer_address(
    db: Session,
    customer_id: int,
    address_in: CustomerAddressCreate
) -> CustomerAddress:

    existing_count = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id == customer_id
        )
        .count()
    )

    make_default = (
        address_in.is_default
        or existing_count == 0
    )

    if make_default:
        clear_default_address(
            db,
            customer_id
        )

    address = CustomerAddress(
        customer_id=customer_id,
        label=address_in.label.strip(),
        house_number=(
            address_in.house_number.strip()
            if address_in.house_number
            else None
        ),
        full_address=address_in.full_address.strip(),
        city=address_in.city.strip(),
        pincode=address_in.pincode.strip(),
        phone=address_in.phone.strip(),
        landmark=(
            address_in.landmark.strip()
            if address_in.landmark
            else None
        ),
        latitude=address_in.latitude,
        longitude=address_in.longitude,
        is_default=make_default,
    )

    db.add(address)
    db.commit()
    db.refresh(address)

    return address


def update_customer_address(
    db: Session,
    address: CustomerAddress,
    address_in: CustomerAddressUpdate
) -> CustomerAddress:

    if address_in.is_default:
        clear_default_address(
            db,
            address.customer_id
        )

    update_data = address_in.model_dump(
        exclude_unset=True
    )

    if "label" in update_data and update_data["label"]:
        update_data["label"] = (
            update_data["label"].strip()
        )

    if (
        "house_number" in update_data
        and update_data["house_number"]
    ):
        update_data["house_number"] = (
            update_data["house_number"].strip()
        )

    if "full_address" in update_data:
        update_data["full_address"] = (
            update_data["full_address"].strip()
        )

    if "city" in update_data:
        update_data["city"] = (
            update_data["city"].strip()
        )

    if "pincode" in update_data:
        update_data["pincode"] = (
            update_data["pincode"].strip()
        )

    if "phone" in update_data:
        update_data["phone"] = (
            update_data["phone"].strip()
        )

    if (
        "landmark" in update_data
        and update_data["landmark"]
    ):
        update_data["landmark"] = (
            update_data["landmark"].strip()
        )

    for key, value in update_data.items():
        setattr(address, key, value)

    db.commit()
    db.refresh(address)

    return address


def delete_customer_address(
    db: Session,
    address: CustomerAddress
):
    was_default = address.is_default
    customer_id = address.customer_id

    db.delete(address)
    db.commit()

    if was_default:
        remaining = (
            db.query(CustomerAddress)
            .filter(
                CustomerAddress.customer_id == customer_id
            )
            .order_by(
                CustomerAddress.id.desc()
            )
            .first()
        )

        if remaining:
            remaining.is_default = True
            db.commit()