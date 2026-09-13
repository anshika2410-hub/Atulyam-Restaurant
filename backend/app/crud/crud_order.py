import random
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.crud.crud_offer import validate_offer_code


def generate_order_number() -> str:
    now_str = datetime.utcnow().strftime("%Y%m%d")
    rand_suffix = f"{random.randint(1000, 9999)}"
    return f"ATL-{now_str}-{rand_suffix}"


def create_order(db: Session, order_in: OrderCreate) -> Order:
    # 1. Calculate raw subtotal from items
    subtotal = 0.0
    for item in order_in.items:
        subtotal += round(item.unit_price * item.quantity, 2)

    # 2. Check and apply coupon discount if provided
    discount_amount = 0.0
    if order_in.coupon_code:
        val = validate_offer_code(db, order_in.coupon_code, subtotal)
        if val.valid:
            discount_amount = round((subtotal * val.discount_percentage) / 100.0, 2)

    # 3. Calculate 5% GST tax on taxable subtotal
    taxable_amount = max(0.0, subtotal - discount_amount)
    tax_amount = round(taxable_amount * 0.05, 2)
    total_amount = round(taxable_amount + tax_amount, 2)

    # 4. Generate unique order number
    order_num = generate_order_number()
    while db.query(Order).filter(Order.order_number == order_num).first():
        order_num = generate_order_number()

    # 5. Create Order header
    order = Order(
        order_number=order_num,
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        delivery_address=order_in.delivery_address,
        delivery_latitude=order_in.delivery_latitude,
        delivery_longitude=order_in.delivery_longitude,
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total_amount=total_amount,
        status="Pending",
        payment_status="Unpaid",
        payment_method=order_in.payment_method or "Cash on Delivery",
        notes=order_in.notes
    )
    db.add(order)
    db.flush()  # assign order.id

    # 6. Create OrderItems
    for item in order_in.items:
        item_subtotal = round(item.unit_price * item.quantity, 2)
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item.menu_item_id,
            item_name=item.item_name,
            unit_price=item.unit_price,
            quantity=item.quantity,
            subtotal=item_subtotal
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)
    return order


def get_orders(
    db: Session,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Order]:
    query = db.query(Order)
    if status and status.lower() != "all":
        query = query.filter(Order.status.ilike(status))
    return query.order_by(Order.id.desc()).offset(skip).limit(limit).all()


def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()


def get_order_by_number(db: Session, order_number: str) -> Optional[Order]:
    return db.query(Order).filter(Order.order_number == order_number.strip().upper()).first()


def update_order_status(db: Session, order: Order, update_in: OrderStatusUpdate) -> Order:
    if update_in.status:
        order.status = update_in.status
    if update_in.payment_status:
        order.payment_status = update_in.payment_status
    db.commit()
    db.refresh(order)
    return order
