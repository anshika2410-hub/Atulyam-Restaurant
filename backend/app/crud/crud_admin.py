from typing import Optional
from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.core.security import verify_password, get_password_hash


def get_admin_by_username(db: Session, username: str) -> Optional[Admin]:
    return db.query(Admin).filter(Admin.username == username).first()


def get_admin_by_email(db: Session, email: str) -> Optional[Admin]:
    return db.query(Admin).filter(Admin.email == email).first()


def authenticate_admin(db: Session, username: str, password: str) -> Optional[Admin]:
    admin = get_admin_by_username(db, username)
    if not admin:
        # Also allow email login
        admin = get_admin_by_email(db, username)
    if not admin or not admin.is_active:
        return None
    if not verify_password(password, admin.hashed_password):
        return None
    return admin


def create_admin(
    db: Session,
    username: str,
    email: str,
    password: str,
    role: str = "admin"
) -> Admin:
    hashed = get_password_hash(password)
    admin = Admin(
        username=username,
        email=email,
        hashed_password=hashed,
        role=role,
        is_active=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
