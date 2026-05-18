from app.db.models.user import User
from app.db.store.interfaces import DBStore
from app.modules.user.schemas import AppUserEnsureRequest


class UserRepository:
    def __init__(self, store: DBStore):
        self.store = store

    def get_by_auth_user_id(self, auth_user_id: str) -> User | None:
        return self.store.get(User, auth_user_id=auth_user_id)

    def create_user(self, payload: AppUserEnsureRequest) -> User:
        return self.store.create(User, data=payload.model_dump())
