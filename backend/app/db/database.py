import logging

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


logger = logging.getLogger("atulyam.db")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

active_engine_type = "mysql"
engine = None
SessionLocal = None


def init_db_engine():
    global engine, SessionLocal, active_engine_type

    # =========================================================
    # ATTEMPT MYSQL CONNECTION
    # =========================================================

    mysql_url = settings.DATABASE_URL

    try:
        test_engine = create_engine(
            mysql_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False,
        )

        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        logger.info(
            "Successfully connected to MySQL database: %s",
            mysql_url.split("@")[-1],
        )

        engine = test_engine
        active_engine_type = "mysql"

    except Exception as exc:

        # =====================================================
        # SQLITE DEVELOPMENT FALLBACK
        # =====================================================

        if settings.SQLITE_DEV_FALLBACK:

            sqlite_url = "sqlite:///./atulyam.db"

            logger.warning(
                "Could not connect to MySQL (%s). "
                "Falling back to SQLite development database (%s).",
                str(exc),
                sqlite_url,
            )

            engine = create_engine(
                sqlite_url,
                connect_args={
                    "check_same_thread": False
                },
                echo=False,
            )

            active_engine_type = "sqlite"

        else:
            logger.error(
                "MySQL connection failed and fallback disabled: %s",
                exc,
            )
            raise

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    return engine


# =========================================================
# ADMIN PASSWORD RESET MIGRATION
# =========================================================

def ensure_admin_reset_columns():
    """
    Adds password-reset columns to the existing admins table.

    This is useful because SQLAlchemy create_all()
    does NOT automatically modify an existing table.
    """

    try:
        inspector = inspect(engine)

        # -----------------------------------------------------
        # Check whether admins table exists
        # -----------------------------------------------------

        if "admins" not in inspector.get_table_names():
            logger.warning(
                "Admins table does not exist yet. "
                "Password reset migration skipped."
            )
            return

        columns = {
            column["name"]
            for column in inspector.get_columns("admins")
        }

        # -----------------------------------------------------
        # reset_token_hash
        # -----------------------------------------------------

        if "reset_token_hash" not in columns:

            logger.info(
                "Adding reset_token_hash column to admins table."
            )

            with engine.begin() as conn:

                conn.execute(
                    text(
                        "ALTER TABLE admins "
                        "ADD COLUMN reset_token_hash VARCHAR(255)"
                    )
                )

        # -----------------------------------------------------
        # reset_token_expires_at
        # -----------------------------------------------------

        # Refresh inspector after first ALTER
        inspector = inspect(engine)

        columns = {
            column["name"]
            for column in inspector.get_columns("admins")
        }

        if "reset_token_expires_at" not in columns:

            logger.info(
                "Adding reset_token_expires_at column to admins table."
            )

            with engine.begin() as conn:

                if active_engine_type == "sqlite":

                    conn.execute(
                        text(
                            "ALTER TABLE admins "
                            "ADD COLUMN reset_token_expires_at DATETIME"
                        )
                    )

                else:

                    conn.execute(
                        text(
                            "ALTER TABLE admins "
                            "ADD COLUMN reset_token_expires_at DATETIME NULL"
                        )
                    )

        logger.info(
            "Admin password reset migration checked successfully."
        )

    except Exception as exc:

        logger.warning(
            "Admin password reset migration warning: %s",
            exc,
        )


# =========================================================
# INITIALIZE DATABASE
# =========================================================

init_db_engine()

# IMPORTANT:
# Run migration AFTER engine initialization.
ensure_admin_reset_columns()


# =========================================================
# DATABASE SESSION
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================================
# DATABASE CONNECTION CHECK
# =========================================================

def check_db_connection():

    try:

        with engine.connect() as conn:

            result = conn.execute(
                text("SELECT 1")
            ).scalar()

            return {
                "status": (
                    "connected"
                    if result == 1
                    else "degraded"
                ),
                "engine": active_engine_type,
                "url": str(engine.url),
            }

    except Exception as exc:

        return {
            "status": "disconnected",
            "engine": active_engine_type,
            "error": str(exc),
        }