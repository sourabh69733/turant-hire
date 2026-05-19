from app.modules.candidate.repository import CandidateRepository
from app.modules.candidate.schemas import (
    CandidateAvailabilityUpdate,
    CandidateProfileCreate,
    CandidateProfileRead,
    CandidateProfileUpdate,
)


class CandidateConflictError(Exception):
    pass


class CandidateService:
    def __init__(self, repository: CandidateRepository):
        self.repository = repository

    def create_profile(self, payload: CandidateProfileCreate) -> CandidateProfileRead:
        existing_by_auth = self.repository.get_profile_by_auth_user_id(payload.auth_user_id)
        if existing_by_auth is not None:
            raise CandidateConflictError("Candidate profile already exists for this account.")

        existing_by_email = self.repository.get_profile_by_email(payload.email)
        if existing_by_email is not None:
            raise CandidateConflictError("This email is already linked to another candidate profile.")

        existing_by_phone = self.repository.get_profile_by_phone(payload.phone)
        if existing_by_phone is not None:
            raise CandidateConflictError("This phone number is already linked to another candidate profile.")

        profile = self.repository.create_profile(payload)
        return CandidateProfileRead.model_validate(profile)

    def get_profile(self, candidate_id: str) -> CandidateProfileRead | None:
        profile = self.repository.get_profile(candidate_id)
        if profile is None:
            return None
        return CandidateProfileRead.model_validate(profile)

    def get_profile_by_auth_user_id(self, auth_user_id: str) -> CandidateProfileRead | None:
        profile = self.repository.get_profile_by_auth_user_id(auth_user_id)
        if profile is None:
            return None
        return CandidateProfileRead.model_validate(profile)

    def update_profile(
        self,
        candidate_id: str,
        payload: CandidateProfileUpdate,
    ) -> CandidateProfileRead | None:
        profile = self.repository.update_profile(candidate_id, payload)
        if profile is None:
            return None
        return CandidateProfileRead.model_validate(profile)

    def update_availability(
        self,
        candidate_id: str,
        payload: CandidateAvailabilityUpdate,
    ) -> CandidateProfileRead | None:
        profile = self.repository.update_availability(candidate_id, payload)
        if profile is None:
            return None
        return CandidateProfileRead.model_validate(profile)
