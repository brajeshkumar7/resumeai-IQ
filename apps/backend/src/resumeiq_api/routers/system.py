from fastapi import APIRouter, status

from resumeiq_api.schemas.system import SystemMetaResponse
from resumeiq_api.services.system_service import SystemService

router = APIRouter()


@router.get(
    "/meta",
    response_model=SystemMetaResponse,
    status_code=status.HTTP_200_OK,
    summary="System metadata",
)
async def get_system_meta() -> SystemMetaResponse:
    return await SystemService().get_system_meta()
