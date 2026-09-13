from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime

from app.db.database import Base


class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    image_url = Column(String(500), nullable=False)

    category = Column(
        String(50),
        nullable=False,
        default="Ambience",
        index=True
    )

    caption = Column(String(255), nullable=True)

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