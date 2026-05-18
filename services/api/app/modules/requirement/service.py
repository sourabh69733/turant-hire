from app.modules.requirement.repository import RequirementRepository
from app.modules.requirement.schemas import RequirementCreate, RequirementRead


class RequirementService:
    def __init__(self, repository: RequirementRepository):
        self.repository = repository

    def create_requirement(self, payload: RequirementCreate) -> RequirementRead:
        requirement = self.repository.create_requirement(payload)
        return RequirementRead.model_validate(requirement)

    def list_requirements(self, employer_auth_user_id: str) -> list[RequirementRead]:
        requirements = self.repository.list_by_employer_auth_user_id(employer_auth_user_id)
        return [RequirementRead.model_validate(requirement) for requirement in requirements]
