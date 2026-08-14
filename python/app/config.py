import os
from dotenv import load_dotenv

load_dotenv()

# Groq LLM Settings
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant").strip()
GROQ_TEMPERATURE: float = float(os.getenv("GROQ_TEMPERATURE", "0.0"))
GROQ_MAX_TOKENS: int = int(os.getenv("GROQ_MAX_TOKENS", "700"))

# Inter-Service Communication Settings (Spring Boot Backend REST API)
SPRING_BOOT_API_URL: str = os.getenv(
    "SPRING_BOOT_API_URL",
    "http://localhost:8080/api/loan-offers"
).strip()

# CORS Origins
CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:8080,http://localhost:3000,http://127.0.0.1:8080",
    ).split(",")
    if origin.strip()
]
