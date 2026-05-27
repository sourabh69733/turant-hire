from pydantic import BaseModel, Field


class EmployerAgentMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class EmployerRequirementDraft(BaseModel):
    hiring_role: str | None = Field(default=None, max_length=120)
    role_specialization: str | None = Field(default=None, max_length=160)
    openings: str | None = Field(default=None, max_length=20)
    department: str | None = Field(default=None, max_length=120)
    work_mode: str | None = Field(default=None, max_length=80)
    location: str | None = Field(default=None, max_length=160)
    employment_type: str | None = Field(default=None, max_length=80)
    shift_timing: str | None = Field(default=None, max_length=160)
    joining_timeline: str | None = Field(default=None, max_length=120)
    compensation: str | None = Field(default=None, max_length=120)
    priority: str | None = Field(default=None, max_length=80)
    experience: str | None = Field(default=None, max_length=120)
    must_have_skills: str | None = Field(default=None, max_length=600)
    language_requirements: str | None = Field(default=None, max_length=240)
    communication_expectation: str | None = Field(default=None, max_length=240)
    education_requirement: str | None = Field(default=None, max_length=240)
    screening_questions: str | None = Field(default=None, max_length=1200)
    disqualifiers: str | None = Field(default=None, max_length=1200)
    ideal_candidate_notes: str | None = Field(default=None, max_length=1200)


class EmployerAgentChatRequest(BaseModel):
    messages: list[EmployerAgentMessage] = Field(min_length=1, max_length=30)
    current_draft: EmployerRequirementDraft = Field(default_factory=EmployerRequirementDraft)


class EmployerAgentChatResponse(BaseModel):
    assistant_message: str
    structured_requirement: EmployerRequirementDraft
    missing_fields: list[str] = Field(default_factory=list)
    ready_to_review: bool = False
    conversation_status: str = Field(default="needs_followup")
    intake_mode: str = Field(default="minimum")
    role_bucket: str = Field(default="medium")
    next_action: str = Field(default="ask_next_question")
    can_finalize_now: bool = False
    employer_finished: bool = False
