from fastapi import APIRouter, HTTPException, status
from app.agent_service import process_user_question
from app.database import check_database_connection
from app.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint to verify database and microservice status."""
    db_status = "UP" if check_database_connection() else "DOWN"
    return {
        "status": "UP" if db_status == "UP" else "DEGRADED",
        "service": "loan-management-ai-microservice",
        "database": db_status,
    }


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
@router.post("/api/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Main AI chat endpoint called directly by the API Gateway.
    Accepts a question about loans, banks, or loan offers and returns a natural language response.
    """
    try:
        answer = process_user_question(question=request.question)
        return ChatResponse(answer=answer)
    except RuntimeError as err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(err),
        ) from err
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"The AI assistant encountered an error processing your request: {str(err)}",
        ) from err
