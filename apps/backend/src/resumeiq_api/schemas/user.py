from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clerk_user_id: str
    email: EmailStr
    first_name: str | None
    last_name: str | None
    image_url: str | None
    profile_metadata: dict
    created_at: datetime
    updated_at: datetime


class UserProfileResponse(BaseModel):
    success: bool = True
    data: UserProfile


class UserProfileUpdateRequest(BaseModel):
    first_name: str | None = Field(default=None, max_length=120)
    last_name: str | None = Field(default=None, max_length=120)
    image_url: str | None = Field(default=None, max_length=2048)
    profile_metadata: dict = Field(default_factory=dict)
