from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RequirementCreate(BaseModel):
    employer_auth_user_id: str = Field(min_length=3, max_length=128)
    employer_email: str = Field(min_length=5, max_length=255)
    company_name: str = Field(min_length=2, max_length=160)
    hiring_role: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=120)
    urgency: str = Field(min_length=2, max_length=80)
    compensation: str = Field(min_length=1, max_length=80)
    openings: int = Field(ge=1, le=500)
    notes: str = Field(default="", max_length=2000)


class RequirementRead(RequirementCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    created_at: datetime
    updated_at: datetime
