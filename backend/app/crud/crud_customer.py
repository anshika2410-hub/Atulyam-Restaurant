from typing import Optional

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerSignup
from app.core.security import get_password_hash


def get_customer_by_email(
    db: Session,
    email: str
) -> Optional[Customer]:
    return (
        db.query(Customer)
        .filter(Customer.email == email.lower().strip())
        .first()
    )


def get_customer_by_id(
    db: Session,
    customer_id: int
) -> Optional[Customer]:
    return (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )


def create_customer(
    db: Session,
    customer_in: CustomerSignup
) -> Customer:

    customer = Customer(
        name=customer_in.name.strip(),
        email=customer_in.email.lower().strip(),
        phone=customer_in.phone.strip() if customer_in.phone else None,
        password_hash=get_password_hash(customer_in.password),
        is_active=True,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer