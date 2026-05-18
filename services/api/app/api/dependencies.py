from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.store.sqlalchemy_store import SQLAlchemyStore
from app.modules.candidate.repository import CandidateRepository
from app.modules.candidate.service import CandidateService


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
