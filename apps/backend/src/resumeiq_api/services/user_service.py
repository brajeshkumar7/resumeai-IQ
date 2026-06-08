from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from resumeiq_api.core.auth import AuthenticatedSession
from resumeiq_api.models.user import User
from resumeiq_api.schemas.auth import SessionSyncRequest
from resumeiq_api.schemas.user import UserProfileUpdateRequest


class UserService:
    async def sync_authenticated_user(
        self,
        db_session: AsyncSession,
        auth_session: AuthenticatedSession,
        payload: SessionSyncRequest,
    ) -> User:
        user = await self._get_user_by_clerk_id(db_session, auth_session.user_id)

        if user is None:
            user = User(
                clerk_user_id=auth_session.user_id,
                email=payload.email,
                first_name=payload.first_name,
                last_name=payload.last_name,
                image_url=payload.image_url,
                last_sign_in_at=datetime.now(UTC),
            )
            db_session.add(user)
        else:
            user.email = payload.email
            user.first_name = payload.first_name
            user.last_name = payload.last_name
            user.image_url = payload.image_url
            user.last_sign_in_at = datetime.now(UTC)

        await db_session.commit()
        await db_session.refresh(user)
        return user

    async def get_authenticated_user(
        self,
        db_session: AsyncSession,
        auth_session: AuthenticatedSession,
    ) -> User | None:
        return await self._get_user_by_clerk_id(db_session, auth_session.user_id)

    async def update_profile(
        self,
        db_session: AsyncSession,
        auth_session: AuthenticatedSession,
        payload: UserProfileUpdateRequest,
    ) -> User:
        user = await self._get_user_by_clerk_id(db_session, auth_session.user_id)
        if user is None:
            raise ValueError("User profile not found.")

        user.first_name = payload.first_name
        user.last_name = payload.last_name
        user.image_url = payload.image_url
        user.profile_metadata = payload.profile_metadata

        await db_session.commit()
        await db_session.refresh(user)
        return user

    async def _get_user_by_clerk_id(
        self,
        db_session: AsyncSession,
        clerk_user_id: str,
    ) -> User | None:
        result = await db_session.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        return result.scalar_one_or_none()
