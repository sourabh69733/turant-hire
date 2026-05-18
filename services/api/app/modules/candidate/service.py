from app.modules.candidate.repository import CandidateRepository
from app.modules.candidate.schemas import (
    CandidateAvailabilityUpdate,
    CandidateProfileCreate,
    CandidateProfileRead,
    CandidateProfileUpdate,
)


class CandidateService:
    def __init__(self, repository: CandidateRepository):
        self.repository = repository

    def create_profile(self, payload: CandidateProfileCreate) -> CandidateProfileRead:
        profile = self.repository.create_profile(payload)
        return CandidateProfileRead.model_validate(profile)

    def get_profile(self, candidate_id: str) -> CandidateProfileRead | None:
        profile = self.repository.get_profile(candidate_id)
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
