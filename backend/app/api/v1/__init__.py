from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.menu import router as menu_router
from app.api.v1.offers import router as offers_router
from app.api.v1.catering import router as catering_router
from app.api.v1.gallery import router as gallery_router
from app.api.v1.slides import router as slides_router
from app.api.v1.orders import router as orders_router
from app.api.v1.catering_media import router as catering_media_router
from app.api.v1.customer_auth import router as customer_auth_router
from app.api.v1.customer_addresses import router as customer_addresses_router

api_router = APIRouter()

# Include all sub-routers
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(categories_router)
api_router.include_router(menu_router)
api_router.include_router(offers_router)
api_router.include_router(catering_router)
api_router.include_router(gallery_router)
api_router.include_router(slides_router)
api_router.include_router(orders_router)
api_router.include_router(catering_media_router)
api_router.include_router(customer_auth_router)
api_router.include_router(customer_addresses_router)

__all__ = ["api_router"]
