from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
from database import init_db
from seed_data import seed
from chatbot_engine import LoanChatbotEngine

app = FastAPI(
    title="LoanBridge Chatbot API",
    description="Database-driven Chatbot API for Loan Management System",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and seed database on startup
@app.on_event("startup")
def startup_db_client():
    init_db()
    seed()

bot_engine = LoanChatbotEngine()

class ChatRequest(BaseModel):
    message: str
    client_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    intent: str
    suggested_prompts: Optional[list[str]] = None
    data: Optional[dict] = None

HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <title>LoanBridge Chatbot Test</title>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .card { width: 100%; max-width: 600px; background: #1e293b; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; height: 90vh; }
        .header { background: #2563eb; color: white; padding: 16px 20px; font-size: 18px; font-weight: bold; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .msg { padding: 12px 16px; border-radius: 12px; max-width: 80%; line-height: 1.5; white-space: pre-wrap; font-size: 14px; }
        .user { align-self: flex-end; background: #2563eb; color: white; }
        .bot { align-self: flex-start; background: #334155; color: #f8fafc; border: 1px solid #475569; }
        .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .chip { background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; }
        .chip:hover { background: #1d4ed8; }
        .input-area { padding: 16px; background: #0f172a; display: flex; gap: 10px; }
        input { flex: 1; padding: 12px; border-radius: 20px; border: 1px solid #475569; background: #1e293b; color: white; outline: none; }
        button.send { background: #2563eb; color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 18px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">🏦 LoanBridge AI Chatbot (Live DB Demo)</div>
        <div class="messages" id="msgs">
            <div class="msg bot">👋 Hello! Ask me about your loan status, next EMI due date, remaining balance, or interest rates!</div>
            <div class="chips">
                <button class="chip" onclick="send('What is the status of loan L101?')">Status of L101</button>
                <button class="chip" onclick="send('When is my EMI due?')">When is EMI due?</button>
                <button class="chip" onclick="send('What is my outstanding balance?')">My Balance</button>
                <button class="chip" onclick="send('What are interest rates for home loan?')">Home Loan Rates</button>
            </div>
        </div>
        <div class="input-area">
            <input type="text" id="inp" placeholder="Type a message..." onkeydown="if(event.key==='Enter') send()">
            <button class="send" onclick="send()">➤</button>
        </div>
    </div>
    <script>
        async function send(txt) {
            const input = document.getElementById('inp');
            const query = txt || input.value;
            if (!query.trim()) return;
            input.value = '';
            
            const msgs = document.getElementById('msgs');
            msgs.innerHTML += `<div class="msg user">${query}</div>`;
            msgs.scrollTop = msgs.scrollHeight;

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: query, client_id: 'C101' })
                });
                const data = await res.json();
                let chipHtml = '';
                if (data.suggested_prompts) {
                    chipHtml = '<div class="chips">' + data.suggested_prompts.map(p => `<button class="chip" onclick="send('${p}')">${p}</button>`).join('') + '</div>';
                }
                msgs.innerHTML += `<div class="msg bot">${data.response}</div>` + chipHtml;
                msgs.scrollTop = msgs.scrollHeight;
            } catch (e) {
                msgs.innerHTML += `<div class="msg bot">❌ Error connecting to chatbot server.</div>`;
            }
        }
    </script>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
def read_root():
    return HTML_PAGE

@app.get("/api/chat", response_class=HTMLResponse)
def get_chat_page():
    return HTML_PAGE

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    result = bot_engine.process_query(
        query=request.message,
        context_client_id=request.client_id
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
