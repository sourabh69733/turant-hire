from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.store.sqlalchemy_store import SQLAlchemyStore
from app.modules.candidate.repository import CandidateRepository
from app.modules.candidate.service import CandidateService
from app.modules.requirement.repository import RequirementRepository
from app.modules.requirement.service import RequirementService
from app.modules.user.repository import UserRepository
from app.modules.user.service import UserService


def get_db_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_candidate_service(session: Session) -> CandidateService:
    store = SQLAlchemyStore(session)
    repository = CandidateRepository(store)
    return CandidateService(repository)


def get_user_service(session: Session) -> UserService:
    store = SQLAlchemyStore(session)
    repository = UserRepository(store)
    return UserService(repository)


def get_requirement_service(session: Session) -> RequirementService:
    store = SQLAlchemyStore(session)
    repository = RequirementRepository(store)
    return RequirementService(repository)
