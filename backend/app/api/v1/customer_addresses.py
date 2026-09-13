from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.deps import get_current_customer

from app.models.customer import Customer

from app.schemas.customer_address import (
    CustomerAddressCreate,
    CustomerAddressUpdate,
    CustomerAddressResponse,
)

from app.crud.crud_customer_address import (
    get_customer_addresses,
    get_customer_address,
    create_customer_address,
    update_customer_address,
    delete_customer_address,
)


router = APIRouter(
    prefix="/customer-addresses",
    tags=["Customer Addresses"],
)


@router.get(
    "",
    response_model=List[CustomerAddressResponse],
)
def list_addresses(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    return get_customer_addresses(
        db,
        current_customer.id,
    )


@router.post(
    "",
    response_model=CustomerAddressResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_address(
    address_in: CustomerAddressCreate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    return create_customer_address(
        db,
        current_customer.id,
        address_in,
    )


@router.patch(
    "/{address_id}",
    response_model=CustomerAddressResponse,
)
def edit_address(
    address_id: int,
    address_in: CustomerAddressUpdate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    address = get_customer_address(
        db,
        address_id,
        current_customer.id,
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found.",
        )

    return update_customer_address(
        db,
        address,
        address_in,
    )


@router.delete(
    "/{address_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    address = get_customer_address(
        db,
        address_id,
        current_customer.id,
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found.",
        )

    delete_customer_address(db, address)

    return None