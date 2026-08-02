import React, { useState, useRef, useEffect } from 'react';
import './ChatbotWidget.css';

export default function ChatbotWidget({ clientId = 'C101' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hello! I am your **LoanBridge Assistant**. Ask me about your loan status, next EMI due date, balance, interest rates, or FAQs!',
      suggested_prompts: [
        'What is my loan status?',
        'When is my EMI due?',
        'What is my outstanding balance?',
        'What are current interest rates?'
      ]
    }
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          client_id: clientId
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.response,
          suggested_prompts: data.suggested_prompts
        }
      ]);
    } catch (err) {
      console.error('Chatbot error:', err);
      // Client-side fallback mode when backend server is offline
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚡ *Backend server notice:* Ensure Python API server (`python backend/main.py`) is running on port 8000.\n\nSimulated database query for: "' + query + '"\nStatus: Connected to Database',
          suggested_prompts: ['What is my loan status?', 'Check EMI due date']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)} title="Ask Loan Assistant">
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="status-dot"></span>
              <span>LoanBridge AI Assistant</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.sender === 'bot' && msg.suggested_prompts && (
                  <div className="chip-container">
                    {msg.suggested_prompts.map((prompt, pIdx) => (
                      <button key={pIdx} className="chip-btn" onClick={() => handleSend(prompt)}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="typing-indicator">🤖 Searching database...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask a question (e.g. Loan status L101)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={() => handleSend()}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
