from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def ops_health() -> dict[str, str]:
    return {"status": "ok"}
