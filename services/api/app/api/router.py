from fastapi import APIRouter

from app.api.candidate.routes import router as candidate_router
from app.api.employer.routes import router as employer_router
from app.api.ops.routes import router as ops_router

api_router = APIRouter()
api_router.include_router(candidate_router, prefix="/candidate", tags=["candidate"])
api_router.include_router(employer_router, prefix="/employer", tags=["employer"])
api_router.include_router(ops_router, prefix="/ops", tags=["ops"])
