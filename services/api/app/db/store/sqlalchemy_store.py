from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.store.interfaces import DBStore


class SQLAlchemyStore(DBStore):
    def __init__(self, session: Session):
        self.session = session

    def get(self, model: type[Any], **filters: Any) -> Any | None:
        statement = select(model).filter_by(**filters)
        return self.session.execute(statement).scalar_one_or_none()

    def list(self, model: type[Any], **filters: Any) -> list[Any]:
        statement = select(model).filter_by(**filters)
        return list(self.session.execute(statement).scalars().all())

    def create(self, model: type[Any], data: dict[str, Any]) -> Any:
        instance = model(**data)
        self.session.add(instance)
        self.session.commit()
        self.session.refresh(instance)
        return instance

    def update(self, model: type[Any], filters: dict[str, Any], data: dict[str, Any]) -> Any | None:
        instance = self.get(model, **filters)
        if instance is None:
            return None

        for key, value in data.items():
            setattr(instance, key, value)

        self.session.add(instance)
        self.session.commit()
        self.session.refresh(instance)
        return instance
