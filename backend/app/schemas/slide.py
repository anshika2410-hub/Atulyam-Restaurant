from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class HomeSlideBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    subtitle: Optional[str] = Field(None, max_length=255)
    cta_text: str = Field(default="Explore Menu", max_length=50)
    cta_link: str = Field(default="/menu", max_length=100)
    image_url: str = Field(..., min_length=5, max_length=500)
    display_order: int = 0
    is_active: bool = True


class HomeSlideCreate(HomeSlideBase):
    pass


class HomeSlideUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    subtitle: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class HomeSlideResponse(HomeSlideBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
