from fastapi import APIRouter, status


router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def start_analysis() -> dict[str, str]:
    return {"detail": "Code analysis is not implemented in Phase 1."}


@router.get("/{analysis_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def get_analysis(analysis_id: int) -> dict[str, str | int]:
    return {"analysis_id": analysis_id, "detail": "Analysis lookup is not implemented in Phase 1."}
