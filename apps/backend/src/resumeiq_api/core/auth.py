from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass
from typing import Any

import httpx
import jwt
from fastapi import Cookie, Depends, Header, HTTPException, status
from jwt import InvalidTokenError

from resumeiq_api.core.config import Settings, get_settings


@dataclass(slots=True)
class AuthenticatedSession:
    user_id: str
    session_id: str | None
    issuer: str | None
    authorized_party: str | None
    claims: dict[str, Any]


class ClerkJWTVerifier:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._jwks: dict[str, Any] | None = None
        self._expires_at = 0.0
        self._lock = asyncio.Lock()

    async def verify_token(self, token: str) -> AuthenticatedSession:
        if not self._settings.clerk_jwks_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Clerk JWKS URL is not configured.",
            )

        headers = jwt.get_unverified_header(token)
        key = await self._get_signing_key(headers.get("kid"))

        decode_kwargs: dict[str, Any] = {
            "algorithms": ["RS256"],
            "issuer": self._settings.clerk_issuer,
            "options": {"require": ["exp", "iat", "sub"]},
        }

        if self._settings.clerk_audience:
            decode_kwargs["audience"] = self._settings.clerk_audience
        else:
            decode_kwargs["options"]["verify_aud"] = False

        try:
            claims = jwt.decode(token, key=key, **decode_kwargs)
        except InvalidTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            ) from exc

        return AuthenticatedSession(
            user_id=claims["sub"],
            session_id=claims.get("sid"),
            issuer=claims.get("iss"),
            authorized_party=claims.get("azp"),
            claims=claims,
        )

    async def _get_signing_key(self, key_id: str | None) -> Any:
        jwks = await self._get_jwks()
        for jwk in jwks.get("keys", []):
            if key_id is None or jwk.get("kid") == key_id:
                return jwt.algorithms.RSAAlgorithm.from_jwk(jwk)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to resolve token signing key.",
        )

    async def _get_jwks(self) -> dict[str, Any]:
        if self._jwks and time.time() < self._expires_at:
            return self._jwks

        async with self._lock:
            if self._jwks and time.time() < self._expires_at:
                return self._jwks

            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(self._settings.clerk_jwks_url)
                response.raise_for_status()
                self._jwks = response.json()
                self._expires_at = time.time() + 60 * 15

        return self._jwks


_verifier_cache: ClerkJWTVerifier | None = None


def get_clerk_verifier(
    settings: Settings = Depends(get_settings),
) -> ClerkJWTVerifier:
    global _verifier_cache
    if _verifier_cache is None or _verifier_cache._settings != settings:
        _verifier_cache = ClerkJWTVerifier(settings)
    return _verifier_cache


async def get_current_session(
    authorization: str | None = Header(default=None),
    session_cookie: str | None = Cookie(default=None, alias="__session"),
    verifier: ClerkJWTVerifier = Depends(get_clerk_verifier),
) -> AuthenticatedSession:
    token: str | None = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
    elif session_cookie:
        token = session_cookie

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
        )

    return await verifier.verify_token(token)
