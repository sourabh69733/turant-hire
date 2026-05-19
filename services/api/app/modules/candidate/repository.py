from app.db.models.candidate import CandidateProfile
from app.db.store.interfaces import DBStore
from app.modules.candidate.schemas import CandidateAvailabilityUpdate, CandidateProfileCreate, CandidateProfileUpdate


class CandidateRepository:
    def __init__(self, store: DBStore):
        self.store = store

    def get_profile(self, candidate_id: str) -> CandidateProfile | None:
        return self.store.get(CandidateProfile, id=candidate_id)

    def get_profile_by_auth_user_id(self, auth_user_id: str) -> CandidateProfile | None:
        return self.store.get(CandidateProfile, auth_user_id=auth_user_id)

    def get_profile_by_email(self, email: str) -> CandidateProfile | None:
        return self.store.get(CandidateProfile, email=email)

    def get_profile_by_phone(self, phone: str) -> CandidateProfile | None:
        return self.store.get(CandidateProfile, phone=phone)

    def create_profile(self, payload: CandidateProfileCreate) -> CandidateProfile:
        return self.store.create(CandidateProfile, data=payload.model_dump())

    def update_profile(self, candidate_id: str, payload: CandidateProfileUpdate) -> CandidateProfile | None:
        return self.store.update(
            CandidateProfile,
            filters={"id": candidate_id},
            data=payload.model_dump(exclude_unset=True),
        )

    def update_availability(
        self,
        candidate_id: str,
        payload: CandidateAvailabilityUpdate,
    ) -> CandidateProfile | None:
        return self.store.update(
            CandidateProfile,
            filters={"id": candidate_id},
            data=payload.model_dump(exclude_unset=True),
        )
