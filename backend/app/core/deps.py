from fastapi import Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.config import settings
from app.core.security import decode_access_token
from app.crud.crud_admin import get_admin_by_username
from app.models.admin import Admin
from app.models.customer import Customer


# =========================
# ADMIN AUTH
# =========================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_admin(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> Admin:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    username: str = payload.get("sub")

    if username is None:
        raise credentials_exception

    admin = get_admin_by_username(
        db,
        username=username
    )

    if admin is None or not admin.is_active:
        raise credentials_exception

    return admin


# =========================
# CUSTOMER AUTH
# =========================

customer_bearer = HTTPBearer()


def get_current_customer(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(
        customer_bearer
    ),
) -> Customer:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate customer credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    subject: str = payload.get("sub")

    if not subject or not subject.startswith("customer:"):
        raise credentials_exception

    try:
        customer_id = int(subject.split(":")[1])
    except (ValueError, IndexError):
        raise credentials_exception

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if customer is None or not customer.is_active:
        raise credentials_exception

    return customer