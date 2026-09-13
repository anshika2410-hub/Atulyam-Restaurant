from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# =========================
# CUSTOMER SIGNUP
# =========================

class CustomerSignup(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=20
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=100
    )

class CustomerProfileUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(
        default=None,
        max_length=10
    )
# =========================
# CUSTOMER LOGIN
# =========================

class CustomerLogin(BaseModel):
    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=100
    )


# =========================
# CUSTOMER RESPONSE
# =========================

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =========================
# AUTH RESPONSE
# =========================

class CustomerAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerResponse