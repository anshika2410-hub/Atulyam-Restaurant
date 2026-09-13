from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_customer
from app.schemas.customer import CustomerResponse
from app.db.database import get_db
from app.core.security import (
    verify_password,
    create_access_token,
)
from app.crud.crud_customer import (
    get_customer_by_email,
    create_customer,
)

from app.schemas.customer import (
    CustomerSignup,
    CustomerLogin,
    CustomerResponse,
    CustomerAuthResponse,
    CustomerProfileUpdate,
)
router = APIRouter(
    prefix="/customer-auth",
    tags=["Customer Authentication"],
)


@router.post(
    "/signup",
    response_model=CustomerAuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def customer_signup(
    customer_in: CustomerSignup,
    db: Session = Depends(get_db),
):
    existing_customer = get_customer_by_email(
        db,
        customer_in.email,
    )

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    customer = create_customer(
        db,
        customer_in,
    )

    access_token = create_access_token(
        subject=f"customer:{customer.id}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "customer": customer,
    }


@router.post(
    "/login",
    response_model=CustomerAuthResponse,
)
def customer_login(
    customer_in: CustomerLogin,
    db: Session = Depends(get_db),
):
    customer = get_customer_by_email(
        db,
        customer_in.email,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    if not verify_password(
        customer_in.password,
        customer.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        subject=f"customer:{customer.id}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "customer": customer,
    }

@router.get(
    "/me",
    response_model=CustomerResponse,
)
def get_customer_profile(
    current_customer=Depends(get_current_customer),
):
    return current_customer

@router.patch("/me", response_model=CustomerResponse)
def update_customer_profile(
    profile_in: CustomerProfileUpdate,
    db: Session = Depends(get_db),
    current_customer=Depends(get_current_customer),
):
    current_customer.name = profile_in.name.strip()

    if profile_in.phone:
        current_customer.phone = profile_in.phone.strip()
    else:
        current_customer.phone = None

    db.commit()
    db.refresh(current_customer)

    return current_customer