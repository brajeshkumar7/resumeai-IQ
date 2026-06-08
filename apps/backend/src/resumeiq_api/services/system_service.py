import asyncio

import httpx
from redis.asyncio import Redis

from resumeiq_api.ai.policies import TRUTHFUL_OPTIMIZATION_GUARDRAILS
from resumeiq_api.core.config import get_settings
from resumeiq_api.db.session import check_database_connection
from resumeiq_api.schemas.common import DependencyStatus
from resumeiq_api.schemas.health import HealthPayload, HealthResponse
from resumeiq_api.schemas.system import ApplicationMeta, SystemMetaPayload, SystemMetaResponse


class SystemService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def get_liveness(self) -> HealthResponse:
        return HealthResponse(
            data=HealthPayload(
                application=self.settings.app_name,
                environment=self.settings.environment,
                status="healthy",
                dependencies=[],
            )
        )

    async def get_readiness(self) -> HealthResponse:
        dependencies = await self._collect_dependency_statuses()
        status_value = "healthy" if all(
            dependency.status in {"healthy", "not_configured"} for dependency in dependencies
        ) else "unhealthy"

        return HealthResponse(
            data=HealthPayload(
                application=self.settings.app_name,
                environment=self.settings.environment,
                status=status_value,
                dependencies=dependencies,
            )
        )

    async def get_system_meta(self) -> SystemMetaResponse:
        return SystemMetaResponse(
            data=SystemMetaPayload(
                application=ApplicationMeta(
                    name=self.settings.app_name,
                    environment=self.settings.environment,
                    version=self.settings.app_version,
                ),
                capabilities=[
                    "resume parsing foundation",
                    "job description analysis foundation",
                    "semantic matching foundation",
                    "ats optimization guardrails",
                    "recruiter feedback foundation",
                ],
                guardrails=TRUTHFUL_OPTIMIZATION_GUARDRAILS,
                dependencies=await self._collect_dependency_statuses(),
            )
        )

    async def _collect_dependency_statuses(self) -> list[DependencyStatus]:
        checks = await asyncio.gather(
            self._check_postgres(),
            self._check_redis(),
            self._check_qdrant(),
        )
        return list(checks)

    async def _check_postgres(self) -> DependencyStatus:
        if not self.settings.database_url:
            return DependencyStatus(
                name="postgresql",
                status="not_configured",
                message="Database URL is not configured.",
            )

        try:
            await check_database_connection()
            return DependencyStatus(
                name="postgresql",
                status="healthy",
                message="Database connection succeeded.",
            )
        except Exception as exc:
            return DependencyStatus(
                name="postgresql",
                status="unhealthy",
                message=f"Database connection failed: {exc}",
            )

    async def _check_redis(self) -> DependencyStatus:
        if not self.settings.redis_url:
            return DependencyStatus(
                name="redis",
                status="not_configured",
                message="Redis URL is not configured.",
            )

        client = Redis.from_url(self.settings.redis_url, decode_responses=True)
        try:
            await client.ping()
            return DependencyStatus(
                name="redis",
                status="healthy",
                message="Redis connection succeeded.",
            )
        except Exception as exc:
            return DependencyStatus(
                name="redis",
                status="unhealthy",
                message=f"Redis connection failed: {exc}",
            )
        finally:
            await client.aclose()

    async def _check_qdrant(self) -> DependencyStatus:
        if not self.settings.qdrant_url:
            return DependencyStatus(
                name="qdrant",
                status="not_configured",
                message="Qdrant URL is not configured.",
            )

        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"{self.settings.qdrant_url}/healthz")
                response.raise_for_status()
            return DependencyStatus(
                name="qdrant",
                status="healthy",
                message="Qdrant health check succeeded.",
            )
        except Exception as exc:
            return DependencyStatus(
                name="qdrant",
                status="unhealthy",
                message=f"Qdrant health check failed: {exc}",
            )
