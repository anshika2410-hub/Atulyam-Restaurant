from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime

from app.db.database import Base


class CateringMedia(Base):
    __tablename__ = "catering_media"

    id = Column(Integer, primary_key=True, index=True)

    occasion = Column(
        String(100),
        nullable=False,
        index=True
    )

    title = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    media_url = Column(
        String(500),
        nullable=False
    )

    media_type = Column(
        String(20),
        nullable=False
    )

    display_order = Column(
        Integer,
        default=0,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )