from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.database import Base


class Catering(Base):
    __tablename__ = "catering_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    event_date = Column(String(50), nullable=False)
    guest_count = Column(Integer, nullable=False)
    event_type = Column(String(100), nullable=False)
    special_requests = Column(Text, nullable=True)
    status = Column(String(30), default="Pending", nullable=False)  # Pending, Contacted, Confirmed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
