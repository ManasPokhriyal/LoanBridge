import json
import httpx
from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import GROQ_API_KEY, GROQ_MODEL, GROQ_TEMPERATURE, GROQ_MAX_TOKENS, SPRING_BOOT_API_URL
from app.prompts import SYSTEM_PROMPT
from app.tools import query_database


def _create_llm():
    """Initializes ChatGroq for native tool calling compatibility."""
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY environment variable is not configured.")
    return ChatGroq(
        model=GROQ_MODEL,
        api_key=GROQ_API_KEY,
        temperature=GROQ_TEMPERATURE,
        max_tokens=GROQ_MAX_TOKENS,
    )


def _build_agent():
    """Creates the LangChain v1 Agent with the database tool and system prompt."""
    llm = _create_llm()
    return create_agent(
        model=llm,
        tools=[query_database],
        system_prompt=SYSTEM_PROMPT,
    )


# Module-level agent instance
_agent_instance = None


def get_agent():
    """Lazy-initializes and returns the singleton agent instance."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = _build_agent()
    return _agent_instance


def fetch_backend_offers_fallback():
    """Direct fallback to fetch loan offers from backend."""
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(SPRING_BOOT_API_URL)
            res.raise_for_status()
            return res.json()
    except Exception as e:
        return {"error": str(e)}


def process_user_question(question: str) -> str:
    """
    Main entry point for processing user questions via the LangChain v1 Agent.
    """
    agent = get_agent()

    try:
        result = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": question,
                    }
                ]
            }
        )
        final_message = result["messages"][-1].content
        return final_message
    except Exception as error:
        error_str = str(error)
        
        # Fallback handling: If Groq emitted text-based <function=query_database ...> tag
        if "<function=query_database" in error_str or "query_database" in error_str:
            offers_data = fetch_backend_offers_fallback()
            llm = _create_llm()
            formatting_prompt = f"""
            User question: "{question}"
            Available loan records:
            {json.dumps(offers_data, default=str)}
            
            Answer the user's question directly in clean, professional natural language.
            NEVER mention technical terms like "API", "Spring Boot", "JSON", or "database".
            """
            response = llm.invoke([
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=formatting_prompt)
            ])
            return response.content
            
        raise error
