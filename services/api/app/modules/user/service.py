from fastapi import HTTPException, status

from app.modules.user.repository import UserRepository
from app.modules.user.schemas import AppUserEnsureRequest, AppUserRead


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def ensure_user(self, payload: AppUserEnsureRequest) -> AppUserRead:
        existing_user = self.repository.get_by_auth_user_id(payload.auth_user_id)

        if existing_user is None:
            return AppUserRead.model_validate(self.repository.create_user(payload))

        if existing_user.role != payload.role:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"This account is already registered as {existing_user.role}.",
            )

        return AppUserRead.model_validate(existing_user)
