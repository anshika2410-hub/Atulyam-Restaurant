from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


# --- Order Item Schemas ---
class OrderItemCreate(BaseModel):
    menu_item_id: Optional[int] = None
    item_name: str = Field(..., min_length=1, max_length=150)
    unit_price: float = Field(..., gt=0)
    quantity: int = Field(default=1, ge=1)


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    menu_item_id: Optional[int] = None
    item_name: str
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


# --- Order Schemas ---
class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=8, max_length=20)
    delivery_address: str = Field(..., min_length=5)
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    coupon_code: Optional[str] = None
    payment_method: str = Field(default="Cash on Delivery", max_length=50)
    notes: Optional[str] = None
    items: List[OrderItemCreate] = Field(..., min_length=1)


class OrderStatusUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=30)  # Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
    payment_status: Optional[str] = Field(None, max_length=30)  # Unpaid, Paid


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    subtotal: float
    tax_amount: float
    discount_amount: float
    total_amount: float
    status: str
    payment_status: str
    payment_method: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
