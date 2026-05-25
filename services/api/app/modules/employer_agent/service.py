import json

from fastapi import HTTPException, status
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from app.core.config import get_settings
from app.modules.employer_agent.schemas import (
    EmployerAgentChatRequest,
    EmployerAgentChatResponse,
    EmployerRequirementDraft,
)


class EmployerAgentService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.client = ChatGroq(
            model=self.settings.groq_model,
            api_key=self.settings.groq_api_key,
            streaming=False,
            temperature=0.2,
            max_tokens=900,
        )

    def chat(self, payload: EmployerAgentChatRequest) -> EmployerAgentChatResponse:
        if not self.settings.groq_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Employer agent is not configured yet.",
            )

        prompt = self._build_user_prompt(payload)

        try:
            response = self.client.invoke(
                [
                    SystemMessage(
                        content=(
                            "You are the TurantHire Employer Agent. Talk like a calm, practical hiring specialist. "
                            "Your job is to understand an employer's hiring need and keep extracting structured data. "
                            "Always respond as valid JSON only. "
                            "Return an object with exactly these keys: assistant_message, structured_requirement, missing_fields, ready_to_review. "
                            "assistant_message must sound human and concise, acknowledge what was understood, and ask at most two focused follow-up questions. "
                            "Do not ask repetitive or overlapping questions. "
                            "Merge related missing items into one natural question whenever possible. "
                            "For example, benefits, perks, candidate preferences, ideal candidate notes, and extra notes should usually be covered in a single combined follow-up. "
                            "Prefer one sharp consolidated question over multiple similar ones. "
                            "Do not ask for fields that are already reasonably captured in the conversation. "
                            "structured_requirement must be an object with these keys: "
                            "hiring_role, openings, department, work_mode, location, employment_type, joining_timeline, compensation, priority, "
                            "experience, must_have_skills, language_requirements, communication_expectation, education_requirement, "
                            "screening_questions, disqualifiers, ideal_candidate_notes. "
                            "Use strings for all values. Leave unknown values as empty strings. "
                            "missing_fields must be an array of field names still needed for a good hiring brief. "
                            "ready_to_review must be true only when role title, openings, location, employment type, joining_timeline, compensation, "
                            "experience, and must_have_skills are all clearly captured."
                        )
                    ),
                    HumanMessage(content=prompt),
                ],
                response_format={"type": "json_object"},
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Employer agent request failed: {exc}",
            ) from exc

        content = response.content
        if not content:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Employer agent returned an empty response.",
            )

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Employer agent returned invalid JSON.",
            ) from exc

        normalized = {
            "assistant_message": parsed.get("assistant_message", "").strip()
            or "Tell me a little more about the role you need to hire for.",
            "structured_requirement": EmployerRequirementDraft.model_validate(
                parsed.get("structured_requirement") or {}
            ),
            "missing_fields": [
                str(item)
                for item in (parsed.get("missing_fields") or [])
                if str(item).strip()
            ],
            "ready_to_review": bool(parsed.get("ready_to_review")),
        }
        return EmployerAgentChatResponse.model_validate(normalized)

    def _build_user_prompt(self, payload: EmployerAgentChatRequest) -> str:
        conversation = "\n".join(
            f"{message.role.upper()}: {message.content.strip()}" for message in payload.messages
        )
        draft = json.dumps(payload.current_draft.model_dump(), ensure_ascii=True)
        return (
            "Current structured requirement draft:\n"
            f"{draft}\n\n"
            "Conversation so far:\n"
            f"{conversation}\n\n"
            "Update the structured draft using the conversation. "
            "Normalize skills as a comma-separated string. "
            "Normalize screening questions and disqualifiers as newline-separated strings. "
            "If the employer gives approximate information, preserve it in concise business language."
        )
