from fastapi import APIRouter, status

from resumeiq_api.schemas.health import HealthResponse
from resumeiq_api.services.system_service import SystemService

router = APIRouter()


@router.get(
    "/live",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Liveness check",
)
async def get_liveness() -> HealthResponse:
    return await SystemService().get_liveness()


@router.get(
    "/ready",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Readiness check",
)
async def get_readiness() -> HealthResponse:
    return await SystemService().get_readiness()
