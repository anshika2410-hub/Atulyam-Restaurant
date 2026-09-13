from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import (
    create_access_token,
    generate_password_reset_token,
    hash_password_reset_token,
    get_password_hash,
)
from app.core.config import settings
from app.core.deps import get_current_admin
from app.crud.crud_admin import (
    authenticate_admin,
    get_admin_by_email,
)
from app.schemas.admin import (
    AdminLogin,
    AdminResponse,
    Token,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
)
from app.models.admin import Admin


router = APIRouter(
    prefix="/auth",
    tags=["Admin Authentication"]
)


# =========================================================
# LOGIN
# =========================================================

@router.post("/login", response_model=Token)
def login(
    login_data: AdminLogin,
    db: Session = Depends(get_db)
):
    admin = authenticate_admin(
        db,
        username=login_data.username,
        password=login_data.password
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=admin.username
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": admin
    }


# =========================================================
# CURRENT ADMIN
# =========================================================

@router.get(
    "/me",
    response_model=AdminResponse
)
def get_current_admin_info(
    current_admin: Admin = Depends(get_current_admin)
):
    return current_admin


# =========================================================
# FORGOT PASSWORD
# =========================================================

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    admin = get_admin_by_email(
        db,
        request.email
    )

    # ❌ Email not found
    if not admin:
        raise HTTPException(
            status_code=404,
            detail="No administrator account found with this email."
        )

    # ❌ Account inactive
    if not admin.is_active:
        raise HTTPException(
            status_code=403,
            detail="This administrator account is inactive."
        )

    # Generate secure token
    raw_token = generate_password_reset_token()
    token_hash = hash_password_reset_token(raw_token)

    expires_at = datetime.utcnow() + timedelta(
        minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES
    )

    admin.reset_token_hash = token_hash
    admin.reset_token_expires_at = expires_at

    db.commit()

    reset_url = (
        f"{settings.FRONTEND_URL}/admin/reset-password"
        f"?token={raw_token}"
    )

    # =====================================================
    # DEVELOPMENT MODE — PRINT RESET LINK
    # =====================================================

    if not settings.SMTP_HOST:
        print("\n" + "=" * 70)
        print("PASSWORD RESET LINK")
        print(reset_url)
        print("=" * 70 + "\n")

        return {
            "message": (
                "Password reset instructions have been generated. "
                "Check the backend terminal during development."
            )
        }

    # =====================================================
    # SEND EMAIL
    # =====================================================

    try:
        message = EmailMessage()

        message["Subject"] = "Atulyam Admin Password Reset"
        message["From"] = (
            settings.SMTP_FROM_EMAIL
            or settings.SMTP_USERNAME
        )
        message["To"] = admin.email

        message.set_content(
            f"""
Hello {admin.username},

We received a request to reset your Atulyam Admin Portal password.

Use the link below to create a new password:

{reset_url}

This link will expire in
{settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes.

If you did not request this password reset, you can safely ignore this email.

Regards,
Atulyam Restaurant
Admin Portal
"""
        )

        with smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT
        ) as server:

            if settings.SMTP_USE_TLS:
                server.starttls()

            server.login(
                settings.SMTP_USERNAME,
                settings.SMTP_PASSWORD
            )

            server.send_message(message)

    except Exception as exc:
        print("Password reset email error:", exc)

        admin.reset_token_hash = None
        admin.reset_token_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email."
        )

    return {
        "message": (
            "Password reset instructions have been sent "
            "to your email."
        )
    }

# =========================================================
# RESET PASSWORD
# =========================================================

@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    token_hash = hash_password_reset_token(
        request.token
    )

    admin = (
        db.query(Admin)
        .filter(
            Admin.reset_token_hash == token_hash
        )
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    if (
        not admin.reset_token_expires_at
        or admin.reset_token_expires_at < datetime.utcnow()
    ):
        admin.reset_token_hash = None
        admin.reset_token_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="This password reset link has expired."
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=403,
            detail="This administrator account is inactive."
        )

    # Update password
    admin.hashed_password = get_password_hash(
        request.new_password
    )

    # One-time token
    admin.reset_token_hash = None
    admin.reset_token_expires_at = None

    db.commit()

    return {
        "message": (
            "Your password has been reset successfully. "
            "You can now sign in."
        )
    }