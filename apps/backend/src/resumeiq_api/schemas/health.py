from pydantic import BaseModel

from resumeiq_api.schemas.common import DependencyStatus


class HealthPayload(BaseModel):
    application: str
    environment: str
    status: str
    dependencies: list[DependencyStatus]


class HealthResponse(BaseModel):
    success: bool = True
    data: HealthPayload
