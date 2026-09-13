from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CateringMediaBase(BaseModel):
    occasion: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    title: str = Field(
        ...,
        min_length=2,
        max_length=150
    )

    description: Optional[str] = None

    media_url: str = Field(
        ...,
        min_length=5,
        max_length=500
    )

    media_type: str = Field(
        ...,
        max_length=20
    )

    display_order: int = 0


class CateringMediaCreate(CateringMediaBase):
    pass


class CateringMediaUpdate(BaseModel):
    occasion: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100
    )

    title: Optional[str] = Field(
        None,
        min_length=2,
        max_length=150
    )

    description: Optional[str] = None

    media_url: Optional[str] = Field(
        None,
        min_length=5,
        max_length=500
    )

    media_type: Optional[str] = Field(
        None,
        max_length=20
    )

    display_order: Optional[int] = None


class CateringMediaResponse(CateringMediaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True