import json
import httpx
from langchain.tools import tool
from app.config import SPRING_BOOT_API_URL


@tool
def query_database(filter_description: str = "") -> str:
    """
    Performs inter-service REST communication with the Spring Boot Backend microservice.
    Fetches live bank loan offers, interest rates, credit score requirements, and tenure details.
    
    Args:
        filter_description (str): Optional description of what data is requested.
        
    Returns:
        str: JSON string containing loan offer records returned from Spring Boot.
    """
    try:
        # Perform HTTP GET request to Spring Boot REST endpoint
        with httpx.Client(timeout=10.0) as client:
            response = client.get(SPRING_BOOT_API_URL)
            response.raise_for_status()
            offers = response.json()
            
            if not offers:
                return json.dumps({"status": "no_data", "message": "No loan offers returned from Spring Boot backend."})
                
            return json.dumps({"status": "success", "data": offers}, default=str, ensure_ascii=False)
            
    except httpx.ConnectError:
        return json.dumps({
            "status": "error",
            "message": f"Could not connect to Spring Boot backend at {SPRING_BOOT_API_URL}. Please ensure Spring Boot server is running on port 8080."
        })
    except Exception as error:
        return json.dumps({"status": "error", "message": f"Inter-service REST call failed: {str(error)}"})
