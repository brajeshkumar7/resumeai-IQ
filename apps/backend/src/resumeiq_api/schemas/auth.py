from pydantic import BaseModel, ConfigDict, EmailStr, Field

from resumeiq_api.schemas.user import UserProfile


class SessionSyncRequest(BaseModel):
    email: EmailStr
    first_name: str | None = Field(default=None, max_length=120)
    last_name: str | None = Field(default=None, max_length=120)
    image_url: str | None = Field(default=None, max_length=2048)


class SessionPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    session_id: str | None
    issuer: str | None
    authorized_party: str | None
    profile: UserProfile | None


class SessionResponse(BaseModel):
    success: bool = True
    data: SessionPayload
