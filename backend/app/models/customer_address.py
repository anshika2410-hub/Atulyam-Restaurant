from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
)

from app.db.database import Base


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    label = Column(
        String(30),
        nullable=False,
        default="Home"
    )

    house_number = Column(
        String(100),
        nullable=True
    )

    full_address = Column(
        Text,
        nullable=False
    )

    city = Column(
        String(100),
        nullable=False
    )

    pincode = Column(
        String(10),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    landmark = Column(
        String(150),
        nullable=True
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    is_default = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )