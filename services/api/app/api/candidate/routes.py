from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_candidate_service, get_db_session
from app.modules.candidate.schemas import (
    CandidateAvailabilityUpdate,
    CandidateProfileCreate,
    CandidateProfileRead,
    CandidateProfileUpdate,
)

router = APIRouter()


@router.get("/health")
def candidate_health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/profiles", response_model=CandidateProfileRead, status_code=status.HTTP_201_CREATED)
def create_candidate_profile(
    payload: CandidateProfileCreate,
    session: Session = Depends(get_db_session),
) -> CandidateProfileRead:
    service = get_candidate_service(session)
    return service.create_profile(payload)


@router.get("/profiles/{candidate_id}", response_model=CandidateProfileRead)
def get_candidate_profile(
    candidate_id: str,
    session: Session = Depends(get_db_session),
) -> CandidateProfileRead:
    service = get_candidate_service(session)
    profile = service.get_profile(candidate_id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return profile


@router.get("/profiles/by-auth/{auth_user_id}", response_model=CandidateProfileRead)
def get_candidate_profile_by_auth_user_id(
    auth_user_id: str,
    session: Session = Depends(get_db_session),
) -> CandidateProfileRead:
    print('[get_candidate_profile_by_auth_user_id] auth_user_id, profile', auth_user_id)
    service = get_candidate_service(session)
    profile = service.get_profile_by_auth_user_id(auth_user_id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return profile


@router.put("/profiles/{candidate_id}", response_model=CandidateProfileRead)
def update_candidate_profile(
    candidate_id: str,
    payload: CandidateProfileUpdate,
    session: Session = Depends(get_db_session),
) -> CandidateProfileRead:
    service = get_candidate_service(session)
    profile = service.update_profile(candidate_id, payload)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return profile


@router.put("/profiles/{candidate_id}/availability", response_model=CandidateProfileRead)
def update_candidate_availability(
    candidate_id: str,
    payload: CandidateAvailabilityUpdate,
    session: Session = Depends(get_db_session),
) -> CandidateProfileRead:
    service = get_candidate_service(session)
    profile = service.update_availability(candidate_id, payload)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return profile
