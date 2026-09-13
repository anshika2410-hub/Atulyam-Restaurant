from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class OfferBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    code: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = None
    discount_percentage: int = Field(default=10, ge=1, le=100)
    min_order_amount: float = Field(default=0.0, ge=0.0)
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: bool = True
    banner_url: Optional[str] = None


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    code: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None
    discount_percentage: Optional[int] = Field(None, ge=1, le=100)
    min_order_amount: Optional[float] = Field(None, ge=0.0)
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = None
    banner_url: Optional[str] = None


class OfferResponse(OfferBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class OfferValidateResponse(BaseModel):
    valid: bool
    code: str
    discount_percentage: int
    message: str
    min_order_amount: float
