from pydantic import BaseModel

from resumeiq_api.schemas.common import DependencyStatus


class ApplicationMeta(BaseModel):
    name: str
    environment: str
    version: str


class SystemMetaPayload(BaseModel):
    application: ApplicationMeta
    capabilities: list[str]
    guardrails: list[str]
    dependencies: list[DependencyStatus]


class SystemMetaResponse(BaseModel):
    success: bool = True
    data: SystemMetaPayload
