import sys
import io

# Force UTF-8 stdout encoding for Windows console compatibility
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from database import init_db
from seed_data import seed
from chatbot_engine import LoanChatbotEngine

def main():
    print("=" * 60)
    print("  LOANBRIDGE PYTHON CHATBOT - DATABASE INTERACTIVE DEMO  ")
    print("=" * 60)

    # Ensure database is initialized and seeded
    init_db()
    seed()

    engine = LoanChatbotEngine()

    test_queries = [
        "What is the status of loan L101?",
        "When is my next EMI due for C101?",
        "What is my outstanding balance for L102?",
        "What are the current interest rates for home loan?",
        "Show my payment history",
        "What documents do I need to submit to apply?",
        "Can I foreclose my loan early?"
    ]

    print("\n--- Running Automated Database Query Test Suite ---\n")
    for q in test_queries:
        print(f"👤 USER: {q}")
        result = engine.process_query(q)
        print(f"🤖 BOT [{result['intent']}]:")
        print(result["response"])
        print("-" * 50)

if __name__ == "__main__":
    main()
