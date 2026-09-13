from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class CateringBase(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    event_date: str = Field(..., min_length=4, max_length=50)
    guest_count: int = Field(..., ge=1)
    event_type: str = Field(..., min_length=2, max_length=100)
    special_requests: Optional[str] = None


class CateringCreate(CateringBase):
    pass


class CateringStatusUpdate(BaseModel):
    status: str = Field(..., min_length=3, max_length=30)  # Pending, Contacted, Confirmed, Cancelled


class CateringResponse(CateringBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
