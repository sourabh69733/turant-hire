from app.db.models.requirement import Requirement
from app.db.store.interfaces import DBStore
from app.modules.requirement.schemas import RequirementCreate


class RequirementRepository:
    def __init__(self, store: DBStore):
        self.store = store

    def create_requirement(self, payload: RequirementCreate) -> Requirement:
        return self.store.create(Requirement, data=payload.model_dump())

    def list_by_employer_auth_user_id(self, employer_auth_user_id: str) -> list[Requirement]:
        return self.store.list(Requirement, employer_auth_user_id=employer_auth_user_id)
