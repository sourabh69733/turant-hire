from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session, get_user_service
from app.modules.user.schemas import AppUserEnsureRequest, AppUserRead

router = APIRouter()


@router.post("/ensure", response_model=AppUserRead, status_code=status.HTTP_201_CREATED)
def ensure_app_user(
    payload: AppUserEnsureRequest,
    session: Session = Depends(get_db_session),
) -> AppUserRead:
    service = get_user_service(session)
    user = service.ensure_user(payload)
    return user
