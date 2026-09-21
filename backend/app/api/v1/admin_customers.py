from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.customer import Customer
from app.models.customer_address import CustomerAddress

# Apne existing admin auth dependency ka import yahan use karo
from app.core.deps import get_current_admin


router = APIRouter(
    prefix="/admin/customers",
    tags=["Admin Customers"],
)
@router.patch("/{customer_id}/status")
def update_customer_status(
    customer_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    customer.is_active = is_active

    db.commit()
    db.refresh(customer)

    return {
        "message": (
            "Customer activated successfully."
            if is_active
            else "Customer deactivated successfully."
        ),
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "is_active": customer.is_active,
        },
    }

@router.get("")
def get_all_customers(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    customers = (
        db.query(Customer)
        .order_by(Customer.created_at.desc())
        .all()
    )

    result = []

    for customer in customers:
        addresses = (
            db.query(CustomerAddress)
            .filter(
                CustomerAddress.customer_id == customer.id
            )
            .order_by(CustomerAddress.created_at.desc())
            .all()
        )

        result.append(
            {
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "is_active": customer.is_active,
                "created_at": customer.created_at,
                "updated_at": customer.updated_at,
                "address_count": len(addresses),
                "addresses": [
                    {
                        "id": address.id,
                        "label": address.label,
                        "house_number": address.house_number,
                        "full_address": address.full_address,
                        "city": address.city,
                        "pincode": address.pincode,
                        "phone": address.phone,
                        "landmark": address.landmark,
                        "latitude": address.latitude,
                        "longitude": address.longitude,
                        "is_default": address.is_default,
                        "created_at": address.created_at,
                    }
                    for address in addresses
                ],
            }
        )

    return result