from fastapi import APIRouter

from resumeiq_api.routers.health import router as health_router
from resumeiq_api.routers.system import router as system_router

api_router = APIRouter(prefix="/api")
api_router.include_router(health_router, prefix="/v1/health", tags=["health"])
api_router.include_router(system_router, prefix="/v1/system", tags=["system"])
