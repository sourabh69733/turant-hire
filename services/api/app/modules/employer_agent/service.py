import json
from collections.abc import Iterable

from fastapi import HTTPException, status
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from app.core.config import get_settings
from app.modules.employer_agent.schemas import (
    EmployerAgentChatRequest,
    EmployerAgentChatResponse,
    EmployerRequirementDraft,
)

ROLE_BUCKET_KEYWORDS = {
    "simple": (
        "waiter",
        "server",
        "cashier",
        "cleaner",
        "housekeeping",
        "runner",
        "helper",
        "steward",
        "busser",
    ),
    "medium": (
        "receptionist",
        "front desk",
        "delivery",
        "kitchen helper",
        "counter staff",
        "customer support",
        "office assistant",
    ),
    "detailed": (
        "cook",
        "chef",
        "barista",
        "supervisor",
        "manager",
        "specialist",
        "baker",
        "tandoor",
        "commis",
    ),
}

ROLE_BUCKET_FIELD_RULES = {
    "simple": {
        "critical": (
            "hiring_role",
            "location",
            "joining_timeline",
            "compensation",
            "shift_timing",
        ),
        "helpful": (
            "openings",
            "experience",
            "language_requirements",
            "must_have_skills",
        ),
    },
    "medium": {
        "critical": (
            "hiring_role",
            "location",
            "joining_timeline",
            "compensation",
            "shift_timing",
            "experience",
        ),
        "helpful": (
            "openings",
            "language_requirements",
            "must_have_skills",
            "communication_expectation",
        ),
    },
    "detailed": {
        "critical": (
            "hiring_role",
            "role_specialization",
            "location",
            "joining_timeline",
            "compensation",
            "shift_timing",
            "experience",
        ),
        "helpful": (
            "openings",
            "must_have_skills",
            "language_requirements",
            "communication_expectation",
            "ideal_candidate_notes",
        ),
    },
}

DONE_PHRASES = (
    "done",
    "finish",
    "finished",
    "that is all",
    "that's all",
    "thats all",
    "enough for now",
    "continue later",
    "save it",
    "save for later",
    "i am done",
    "i'm done",
    "all info shared",
    "all information shared",
    "bas itna hi",
    "bas itna",
    "ho gaya",
    "itna hi",
    "aur nahi",
)

EMPTY_ASSISTANT_MESSAGE = "Tell me a little more about the role you need to hire for."


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

        employer_finished = self._did_employer_finish(payload)
        prompt = self._build_user_prompt(payload, employer_finished=employer_finished)

        try:
            response = self.client.invoke(
                [
                    SystemMessage(content=self._system_prompt()),
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

        draft = self._normalize_draft(parsed.get("structured_requirement") or {})
        role_bucket = self._infer_role_bucket(draft)
        critical_missing = self._get_missing_fields(draft, role_bucket, field_kind="critical")
        helpful_missing = self._get_missing_fields(draft, role_bucket, field_kind="helpful")
        can_finalize_now = not critical_missing
        ready_to_review = can_finalize_now

        conversation_status = self._determine_conversation_status(
            employer_finished=employer_finished,
            can_finalize_now=can_finalize_now,
            helpful_missing=helpful_missing,
        )
        intake_mode = self._determine_intake_mode(
            role_bucket=role_bucket,
            can_finalize_now=can_finalize_now,
            helpful_missing=helpful_missing,
        )
        next_action = self._determine_next_action(
            employer_finished=employer_finished,
            can_finalize_now=can_finalize_now,
        )
        assistant_message = self._resolve_assistant_message(
            parsed_assistant_message=parsed.get("assistant_message"),
            draft=draft,
            role_bucket=role_bucket,
            critical_missing=critical_missing,
            helpful_missing=helpful_missing,
            employer_finished=employer_finished,
            can_finalize_now=can_finalize_now,
        )

        normalized = {
            "assistant_message": assistant_message,
            "structured_requirement": draft,
            "missing_fields": critical_missing,
            "ready_to_review": ready_to_review,
            "conversation_status": conversation_status,
            "intake_mode": intake_mode,
            "role_bucket": role_bucket,
            "next_action": next_action,
            "can_finalize_now": can_finalize_now,
            "employer_finished": employer_finished,
        }
        return EmployerAgentChatResponse.model_validate(normalized)

    def _system_prompt(self) -> str:
        return (
            "You are the TurantHire Employer Agent. Talk like a calm, practical hiring specialist. "
            "Your job is to understand an employer's hiring need and turn natural, messy conversation into a structured hiring draft. "
            "Always respond as valid JSON only. "
            "Return an object with exactly these keys: assistant_message, structured_requirement. "
            "assistant_message must sound human, concise, and practical. Ask at most two focused follow-up questions. "
            "Do not ask repetitive, low-value, or overlapping questions. "
            "Different roles need different depth: simple roles like waiter or cashier need very few questions; specialized roles like cook need a little more detail. "
            "If the employer indicates they are done, do not ask more questions. Summarize and stop. "
            "structured_requirement must be an object with these keys: hiring_role, role_specialization, openings, department, work_mode, location, employment_type, shift_timing, joining_timeline, compensation, priority, experience, must_have_skills, language_requirements, communication_expectation, education_requirement, screening_questions, disqualifiers, ideal_candidate_notes. "
            "Use strings for all values. Leave unknown values as empty strings. "
            "Normalize must_have_skills as a comma-separated string. "
            "Normalize screening_questions and disqualifiers as newline-separated strings. "
            "If the employer gives approximate information, preserve it in concise business language."
        )

    def _build_user_prompt(self, payload: EmployerAgentChatRequest, *, employer_finished: bool) -> str:
        conversation = "\n".join(
            f"{message.role.upper()}: {message.content.strip()}" for message in payload.messages
        )
        draft = json.dumps(payload.current_draft.model_dump(), ensure_ascii=True)
        role_bucket = self._infer_role_bucket(payload.current_draft)
        critical_fields = ", ".join(ROLE_BUCKET_FIELD_RULES[role_bucket]["critical"])
        helpful_fields = ", ".join(ROLE_BUCKET_FIELD_RULES[role_bucket]["helpful"])
        employer_finished_text = "true" if employer_finished else "false"

        return (
            "Current structured requirement draft:\n"
            f"{draft}\n\n"
            "Conversation so far:\n"
            f"{conversation}\n\n"
            f"Employer finished explicitly: {employer_finished_text}\n"
            f"Current role bucket guess: {role_bucket}\n"
            f"Critical fields for this bucket: {critical_fields}\n"
            f"Helpful fields for this bucket: {helpful_fields}\n\n"
            "Update the structured draft using the conversation. "
            "Prefer a minimum useful brief over a long questionnaire. "
            "If the role is simple and the draft already contains enough information to start matching, do not ask more than one short optional question. "
            "If the employer appears done, summarize and stop without asking another question."
        )

    def _normalize_draft(self, value: dict) -> EmployerRequirementDraft:
        raw = {}
        for field_name in EmployerRequirementDraft.model_fields:
            next_value = value.get(field_name, "")
            raw[field_name] = self._string_or_empty(next_value)
        return EmployerRequirementDraft.model_validate(raw)

    def _did_employer_finish(self, payload: EmployerAgentChatRequest) -> bool:
        last_user_message = ""
        for message in reversed(payload.messages):
            if message.role == "user":
                last_user_message = message.content.strip().lower()
                break

        if not last_user_message:
            return False

        return any(phrase in last_user_message for phrase in DONE_PHRASES)

    def _infer_role_bucket(self, draft: EmployerRequirementDraft) -> str:
        search_text = " ".join(
            filter(
                None,
                [
                    draft.hiring_role or "",
                    draft.role_specialization or "",
                    draft.department or "",
                    draft.ideal_candidate_notes or "",
                ],
            )
        ).lower()
        if not search_text:
            return "medium"

        for bucket, keywords in ROLE_BUCKET_KEYWORDS.items():
            if any(keyword in search_text for keyword in keywords):
                return bucket
        return "medium"

    def _get_missing_fields(
        self,
        draft: EmployerRequirementDraft,
        role_bucket: str,
        *,
        field_kind: str,
    ) -> list[str]:
        field_names = ROLE_BUCKET_FIELD_RULES[role_bucket][field_kind]
        missing = []
        for field_name in field_names:
            if not self._has_value(getattr(draft, field_name, "")):
                missing.append(field_name)
        return missing

    def _determine_conversation_status(
        self,
        *,
        employer_finished: bool,
        can_finalize_now: bool,
        helpful_missing: list[str],
    ) -> str:
        if employer_finished:
            return "finalized_by_employer"
        if can_finalize_now and helpful_missing:
            return "captured_minimum"
        if can_finalize_now:
            return "ready_for_matching"
        return "needs_followup"

    def _determine_intake_mode(
        self,
        *,
        role_bucket: str,
        can_finalize_now: bool,
        helpful_missing: list[str],
    ) -> str:
        if not can_finalize_now:
            return "minimum"
        if role_bucket == "simple":
            return "minimum"
        if helpful_missing:
            return "matchable"
        return "detailed"

    def _determine_next_action(self, *, employer_finished: bool, can_finalize_now: bool) -> str:
        if employer_finished:
            return "finalize_partial_draft"
        if can_finalize_now:
            return "show_editable_preview"
        return "ask_next_question"

    def _resolve_assistant_message(
        self,
        *,
        parsed_assistant_message: str | None,
        draft: EmployerRequirementDraft,
        role_bucket: str,
        critical_missing: list[str],
        helpful_missing: list[str],
        employer_finished: bool,
        can_finalize_now: bool,
    ) -> str:
        cleaned_message = self._string_or_empty(parsed_assistant_message)
        if employer_finished:
            return (
                "I have captured the details shared so far and stopped here as requested. "
                "You can review and edit the draft before finalizing."
            )
        if can_finalize_now:
            role_name = draft.hiring_role or "the role"
            if role_bucket == "simple":
                return (
                    f"I have enough to prepare a usable draft for {role_name}. "
                    "You can review and finalize it now, or continue later if you want to add more detail."
                )
            if helpful_missing:
                return (
                    f"I have enough to prepare a matchable draft for {role_name}. "
                    "You can review it now, or answer one or two more details later to improve matching."
                )
            return (
                cleaned_message
                or f"I have enough detail to prepare the draft for {role_name}. You can review and finalize it now."
            )
        if cleaned_message:
            return cleaned_message
        if critical_missing:
            readable = self._humanize_fields(critical_missing[:2])
            return f"I can prepare this quickly. I just need {readable}."
        return EMPTY_ASSISTANT_MESSAGE

    def _humanize_fields(self, field_names: Iterable[str]) -> str:
        labels = [field_name.replace("_", " ") for field_name in field_names]
        if not labels:
            return "a little more information"
        if len(labels) == 1:
            return labels[0]
        return f"{labels[0]} and {labels[1]}"

    def _has_value(self, value: str | None) -> bool:
        return bool(self._string_or_empty(value))

    def _string_or_empty(self, value: object) -> str:
        if value is None:
            return ""
        return str(value).strip()
