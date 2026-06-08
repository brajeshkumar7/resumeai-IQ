from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from resumeiq_api.core.auth import AuthenticatedSession, get_current_session
from resumeiq_api.db.session import get_db_session
from resumeiq_api.schemas.auth import SessionPayload, SessionResponse, SessionSyncRequest
from resumeiq_api.services.user_service import UserService

router = APIRouter()


@router.get(
    "/session",
    response_model=SessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate current session",
)
async def get_session(
    auth_session: AuthenticatedSession = Depends(get_current_session),
    db_session: AsyncSession = Depends(get_db_session),
) -> SessionResponse:
    user = await UserService().get_authenticated_user(db_session, auth_session)

    return SessionResponse(
        data=SessionPayload(
            user_id=auth_session.user_id,
            session_id=auth_session.session_id,
            issuer=auth_session.issuer,
            authorized_party=auth_session.authorized_party,
            profile=user,
        )
    )


@router.post(
    "/session",
    response_model=SessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Sync authenticated user session",
)
async def sync_session(
    payload: SessionSyncRequest,
    auth_session: AuthenticatedSession = Depends(get_current_session),
    db_session: AsyncSession = Depends(get_db_session),
) -> SessionResponse:
    user = await UserService().sync_authenticated_user(db_session, auth_session, payload)
    return SessionResponse(
        data=SessionPayload(
            user_id=auth_session.user_id,
            session_id=auth_session.session_id,
            issuer=auth_session.issuer,
            authorized_party=auth_session.authorized_party,
            profile=user,
        )
    )
