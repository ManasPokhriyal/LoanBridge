import httpx
from app.config import SPRING_BOOT_API_URL


def check_database_connection() -> bool:
    """Utility to test if the Spring Boot backend REST API is reachable."""
    try:
        with httpx.Client(timeout=3.0) as client:
            response = client.get(SPRING_BOOT_API_URL)
            return response.status_code == 200
    except Exception:
        return False
