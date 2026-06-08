from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from resumeiq_api.core.config import get_settings
from resumeiq_api.core.errors import register_exception_handlers
from resumeiq_api.core.logging import configure_logging, get_logger
from resumeiq_api.core.middleware import RequestLoggingMiddleware
from resumeiq_api.routers import api_router

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("resumeiq_api_starting", extra={"environment": settings.environment})
    yield
    logger.info("resumeiq_api_stopping", extra={"environment": settings.environment})


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

register_exception_handlers(app)
app.include_router(api_router)
