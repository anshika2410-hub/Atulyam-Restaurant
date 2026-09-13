from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_admin
from app.crud.crud_order import (
    create_order,
    get_orders,
    get_order_by_id,
    get_order_by_number,
    update_order_status,
)
from app.core.deps import get_current_customer
from app.models.customer import Customer
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.models.admin import Admin
from app.models.order import Order
router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items or len(order_in.items) == 0:
        raise HTTPException(status_code=400, detail="Cannot place an empty order")
    return create_order(db, order_in)


@router.get("/track/{order_number}", response_model=OrderResponse)
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found with this tracking number")
    return order
@router.get(
    "/customer/my-orders",
    response_model=List[OrderResponse],
)
def get_my_orders(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    orders = (
        db.query(Order)
        .filter(
            Order.customer_email == current_customer.email
        )
        .order_by(Order.id.desc())
        .all()
    )

    return orders

@router.get("", response_model=List[OrderResponse])
def list_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    return get_orders(db, status=status, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return update_order_status(db, order, status_update)
@router.get(
    "/customer/my-orders/{order_id}",
    response_model=OrderResponse,
)
def get_my_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.customer_email == current_customer.email,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found.",
        )

    return order