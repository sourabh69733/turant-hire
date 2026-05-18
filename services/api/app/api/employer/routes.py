from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session, get_requirement_service
from app.modules.requirement.schemas import RequirementCreate, RequirementRead

router = APIRouter()


@router.get("/health")
def employer_health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/requirements", response_model=RequirementRead, status_code=status.HTTP_201_CREATED)
def create_requirement(
    payload: RequirementCreate,
    session: Session = Depends(get_db_session),
) -> RequirementRead:
    service = get_requirement_service(session)
    return service.create_requirement(payload)


@router.get("/requirements", response_model=list[RequirementRead])
def list_requirements(
    employer_auth_user_id: str = Query(...),
    session: Session = Depends(get_db_session),
) -> list[RequirementRead]:
    service = get_requirement_service(session)
    return service.list_requirements(employer_auth_user_id)
