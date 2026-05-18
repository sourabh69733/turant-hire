from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CandidateProfileBase(BaseModel):
    auth_user_id: str = Field(min_length=3, max_length=128)
    email: str = Field(min_length=5, max_length=255)
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=24)
    primary_role: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=120)
    expected_pay: str = Field(min_length=1, max_length=64)
    availability: str = Field(min_length=2, max_length=120)
    is_ready_now: bool = False
    profile_summary: str = Field(default="", max_length=2000)


class CandidateProfileCreate(CandidateProfileBase):
    pass


class CandidateProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    primary_role: str | None = Field(default=None, min_length=2, max_length=120)
    location: str | None = Field(default=None, min_length=2, max_length=120)
    expected_pay: str | None = Field(default=None, min_length=1, max_length=64)
    availability: str | None = Field(default=None, min_length=2, max_length=120)
    is_ready_now: bool | None = None
    profile_summary: str | None = Field(default=None, max_length=2000)


class CandidateAvailabilityUpdate(BaseModel):
    availability: str = Field(min_length=2, max_length=120)
    is_ready_now: bool


class CandidateProfileRead(CandidateProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
