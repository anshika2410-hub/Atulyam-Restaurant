from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class GalleryBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    image_url: str = Field(..., min_length=5, max_length=500)
    category: str = Field(default="Ambience", max_length=50)
    caption: Optional[str] = Field(None, max_length=255)
    display_order: int = 0


class GalleryCreate(GalleryBase):
    pass


class GalleryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    image_url: Optional[str] = Field(None, min_length=5, max_length=500)
    category: Optional[str] = Field(None, max_length=50)
    caption: Optional[str] = None
    display_order: Optional[int] = None


class GalleryResponse(GalleryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
