from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routes import router

app = FastAPI(
    title="Loan Management System AI Microservice",
    description="Independent Python FastAPI AI microservice using LangChain v1 and MySQL for bank loan queries.",
    version="1.0.0",
)

# Add CORS Middleware for API Gateway & Frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
