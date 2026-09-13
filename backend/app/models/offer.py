from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from app.db.database import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    code = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    description = Column(Text, nullable=True)

    discount_percentage = Column(
        Integer,
        default=10,
        nullable=False,
    )

    min_order_amount = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    valid_from = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    valid_until = Column(
        DateTime,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    banner_url = Column(
        String(500),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )