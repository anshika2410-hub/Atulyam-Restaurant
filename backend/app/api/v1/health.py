from datetime import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.db.database import check_db_connection

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    db_info = check_db_connection()
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": settings.PROJECT_NAME,
        "database": db_info,
        "version": "1.0.0"
    }
