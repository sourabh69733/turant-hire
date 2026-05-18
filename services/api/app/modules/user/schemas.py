from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


UserRole = Literal["candidate", "employer", "ops"]


class AppUserEnsureRequest(BaseModel):
    auth_user_id: str = Field(min_length=3, max_length=128)
    email: str = Field(min_length=5, max_length=255)
    role: UserRole


class AppUserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    auth_user_id: str
    email: str
    role: UserRole
    created_at: datetime
    updated_at: datetime
