from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from resumeiq_api.core.auth import AuthenticatedSession, get_current_session
from resumeiq_api.db.session import get_db_session
from resumeiq_api.schemas.user import UserProfileResponse, UserProfileUpdateRequest
from resumeiq_api.services.user_service import UserService

router = APIRouter()


@router.get(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_current_user_profile(
    auth_session: AuthenticatedSession = Depends(get_current_session),
    db_session: AsyncSession = Depends(get_db_session),
) -> UserProfileResponse:
    user = await UserService().get_authenticated_user(db_session, auth_session)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    return UserProfileResponse(data=user)


@router.patch(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
)
async def update_current_user_profile(
    payload: UserProfileUpdateRequest,
    auth_session: AuthenticatedSession = Depends(get_current_session),
    db_session: AsyncSession = Depends(get_db_session),
) -> UserProfileResponse:
    try:
        user = await UserService().update_profile(db_session, auth_session, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return UserProfileResponse(data=user)
