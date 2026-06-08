from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="RESUMEIQ_",
        extra="ignore",
    )

    app_name: str = "ResumeIQ API"
    app_version: str = "0.1.0"
    environment: str = "development"
    api_version: str = "v1"
    log_level: str = "INFO"
    database_url: str = "postgresql+asyncpg://resumeiq:resumeiq@localhost:5432/resumeiq"
    database_pool_size: int = 10
    database_max_overflow: int = 20
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    allowed_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    openrouter_api_key: str | None = None
    aws_region: str | None = None
    aws_s3_bucket: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
