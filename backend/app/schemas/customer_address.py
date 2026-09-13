from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class CustomerAddressCreate(BaseModel):
    label: str = Field(default="Home", max_length=30)

    house_number: Optional[str] = Field(
        default=None,
        max_length=100
    )

    full_address: str = Field(
        ...,
        min_length=5
    )

    city: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    pincode: str = Field(
        ...,
        min_length=6,
        max_length=6
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=10
    )

    landmark: Optional[str] = Field(
        default=None,
        max_length=150
    )

    latitude: float
    longitude: float

    is_default: bool = False

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        if not value.isdigit():
            raise ValueError("Phone number must contain digits only.")

        if len(value) != 10:
            raise ValueError("Phone number must be exactly 10 digits.")

        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value):
        if not value.isdigit():
            raise ValueError("Pincode must contain digits only.")

        if len(value) != 6:
            raise ValueError("Pincode must be exactly 6 digits.")

        return value

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, value):
        if not -90 <= value <= 90:
            raise ValueError("Invalid latitude.")

        return value

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, value):
        if not -180 <= value <= 180:
            raise ValueError("Invalid longitude.")

        return value


class CustomerAddressUpdate(BaseModel):
    label: Optional[str] = Field(
        default=None,
        max_length=30
    )

    house_number: Optional[str] = Field(
        default=None,
        max_length=100
    )

    full_address: Optional[str] = Field(
        default=None,
        min_length=5
    )

    city: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    pincode: Optional[str] = Field(
        default=None,
        min_length=6,
        max_length=6
    )

    phone: Optional[str] = Field(
        default=None,
        min_length=10,
        max_length=10
    )

    landmark: Optional[str] = Field(
        default=None,
        max_length=150
    )

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    is_default: Optional[bool] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        if value is None:
            return value

        if not value.isdigit():
            raise ValueError("Phone number must contain digits only.")

        if len(value) != 10:
            raise ValueError("Phone number must be exactly 10 digits.")

        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value):
        if value is None:
            return value

        if not value.isdigit():
            raise ValueError("Pincode must contain digits only.")

        if len(value) != 6:
            raise ValueError("Pincode must be exactly 6 digits.")

        return value

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, value):
        if value is None:
            return value

        if not -90 <= value <= 90:
            raise ValueError("Invalid latitude.")

        return value

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, value):
        if value is None:
            return value

        if not -180 <= value <= 180:
            raise ValueError("Invalid longitude.")

        return value


class CustomerAddressResponse(BaseModel):
    id: int
    customer_id: int

    label: str
    house_number: Optional[str] = None
    full_address: str

    city: str
    pincode: str
    phone: str
    landmark: Optional[str] = None

    latitude: float
    longitude: float

    is_default: bool

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True