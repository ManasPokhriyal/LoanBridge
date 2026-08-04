import re
import sqlite3
from database import get_db_connection

class LoanChatbotEngine:
    def __init__(self):
        pass

    def extract_entities(self, text):
        """Extracts Client ID, Loan ID, or Loan Type from prompt."""
        text_upper = text.upper()
        
        # Match pattern C101, C102, C-101, etc.
        client_match = re.search(r'\bC-?(\d{3})\b', text_upper)
        client_id = f"C{client_match.group(1)}" if client_match else None

        # Match pattern L101, L102, L-101, etc.
        loan_match = re.search(r'\bL-?(\d{3})\b', text_upper)
        loan_id = f"L{loan_match.group(1)}" if loan_match else None

        # Match loan product type
        loan_type = None
        if "HOME" in text_upper or "HOUSE" in text_upper:
            loan_type = "P_HOME"
        elif "PERSONAL" in text_upper:
            loan_type = "P_PERS"
        elif "CAR" in text_upper or "AUTO" in text_upper or "VEHICLE" in text_upper:
            loan_type = "P_AUTO"
        elif "EDUCATION" in text_upper or "STUDENT" in text_upper:
            loan_type = "P_EDU"

        return client_id, loan_id, loan_type

    def process_query(self, query: str, context_client_id: str = None) -> dict:
        """
        Processes user query, queries the SQLite database, and returns formatted bot response.
        """
        query_clean = query.strip()
        query_lower = query_clean.lower()

        client_id, loan_id, loan_type = self.extract_entities(query_clean)

        # Fallback to context client_id if available and not specified in query
        if not client_id and context_client_id:
            client_id = context_client_id

        # If no client ID provided in query or context, set a default sample client C101 for friendly demo
        default_client_used = False
        if not client_id and not loan_id:
            # Check if query is specific to a personal account status
            if any(k in query_lower for k in ["my loan", "my emi", "my balance", "my status", "due date", "how much i owe", "my account"]):
                client_id = "C101"
                default_client_used = True

        conn = get_db_connection()
        cursor = conn.cursor()

        # -------------------------------------------------------------
        # Dynamic EMI Calculator Intent
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["calculate emi", "emi calculate", "calculate my emi", "emi kitna hoga", "kitni emi aayegi"]):
            # Extract numbers from query
            numbers = re.findall(r'\b\d+(?:,\d+)*(?:\.\d+)?\b', query_clean)
            clean_nums = [float(n.replace(',', '')) for n in numbers]
            
            if len(clean_nums) >= 2:
                principal = clean_nums[0]
                rate = clean_nums[1]
                years = clean_nums[2] if len(clean_nums) >= 3 else 1
                
                # Monthly interest rate & total months
                r = (rate / 12) / 100
                n = int(years * 12) if years <= 30 else int(years) # if passed in months
                
                if r > 0 and n > 0:
                    emi = principal * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)
                    total_payable = emi * n
                    total_interest = total_payable - principal
                    
                    msg = (f"🧮 **Loan EMI Calculation Result:**\n\n"
                           f"• **Loan Principal:** ₹{principal:,.2f}\n"
                           f"• **Annual Interest Rate:** {rate}%\n"
                           f"• **Tenure:** {n} months ({n/12:.1f} years)\n"
                           f"----------------------------------------\n"
                           f"💳 **Estimated Monthly EMI:** ₹{emi:,.2f}\n"
                           f"💰 **Total Interest Payable:** ₹{total_interest:,.2f}\n"
                           f"🏷️ **Total Amount Payable:** ₹{total_payable:,.2f}")
                    return {
                        "response": msg,
                        "intent": "EMI_CALCULATOR",
                        "suggested_prompts": ["What documents are required?", "How to apply for loan?", "Check interest rates"]
                    }

        # -------------------------------------------------------------
        # Intent 1: Loan Status Check (Specific Loan or Client Loans)
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["status", "state", "active or closed", "mera status", "loan status", "check status"]):
            if loan_id:
                cursor.execute("""
                    SELECT l.loan_id, l.principal_amount, l.outstanding_balance, l.status, l.monthly_emi, p.product_name, c.name
                    FROM loans l
                    JOIN loan_products p ON l.product_id = p.product_id
                    JOIN clients c ON l.client_id = c.client_id
                    WHERE l.loan_id = ?
                """, (loan_id,))
                row = cursor.fetchone()
                conn.close()
                if row:
                    msg = (f"📋 **Loan Status for {row['loan_id']}** ({row['product_name']}):\n"
                           f"• **Borrower:** {row['name']}\n"
                           f"• **Status:** {row['status']}\n"
                           f"• **Principal Amount:** ₹{row['principal_amount']:,.2f}\n"
                           f"• **Outstanding Balance:** ₹{row['outstanding_balance']:,.2f}\n"
                           f"• **Monthly EMI:** ₹{row['monthly_emi']:,.2f}")
                    return {
                        "response": msg,
                        "intent": "LOAN_STATUS",
                        "data": dict(row),
                        "suggested_prompts": ["When is my next EMI due?", "Show payment history", "What are interest rates?"]
                    }
                else:
                    return {
                        "response": f"⚠️ Sorry, no loan record found for Loan ID **{loan_id}** in our database.",
                        "intent": "LOAN_NOT_FOUND",
                        "suggested_prompts": ["Check status of L101", "Show loan options", "Help"]
                    }

            if client_id:
                cursor.execute("""
                    SELECT l.loan_id, l.principal_amount, l.outstanding_balance, l.status, l.monthly_emi, p.product_name, c.name
                    FROM loans l
                    JOIN loan_products p ON l.product_id = p.product_id
                    JOIN clients c ON l.client_id = c.client_id
                    WHERE l.client_id = ?
                """, (client_id,))
                rows = cursor.fetchall()
                conn.close()
                if rows:
                    borrower = rows[0]['name']
                    notice = f" *(showing records for Client **{client_id}**)*" if default_client_used else ""
                    lines = [f"👤 **Loan Summary for {borrower} ({client_id})**{notice}:\n"]
                    for r in rows:
                        lines.append(f"• **Loan {r['loan_id']}** ({r['product_name']}): Status = **{r['status']}**, Balance = ₹{r['outstanding_balance']:,.2f}, EMI = ₹{r['monthly_emi']:,.2f}")
                    return {
                        "response": "\n".join(lines),
                        "intent": "CLIENT_LOANS",
                        "suggested_prompts": [f"When is EMI due for {rows[0]['loan_id']}?", "Show payment history", "How to apply for new loan?"]
                    }
                else:
                    return {
                        "response": f"⚠️ No loan records found for Client ID **{client_id}**.",
                        "intent": "NO_CLIENT_LOANS",
                        "suggested_prompts": ["What loan products do you offer?", "How to apply for a loan?"]
                    }

        # -------------------------------------------------------------
        # Intent 2: Next EMI Due Date & Monthly Amount
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["emi", "due date", "next payment", "due", "when do i pay", "emi kab", "kab bharna", "due kab hai"]):
            target_id = loan_id or client_id or "C101"
            if loan_id:
                cursor.execute("""
                    SELECT l.loan_id, l.monthly_emi, l.next_due_date, l.status, p.product_name
                    FROM loans l JOIN loan_products p ON l.product_id = p.product_id
                    WHERE l.loan_id = ?
                """, (loan_id,))
            else:
                cursor.execute("""
                    SELECT l.loan_id, l.monthly_emi, l.next_due_date, l.status, p.product_name
                    FROM loans l JOIN loan_products p ON l.product_id = p.product_id
                    WHERE l.client_id = ? AND l.status = 'Active'
                """, (target_id,))
            rows = cursor.fetchall()
            conn.close()
            if rows:
                lines = ["📅 **Upcoming EMI Due Dates:**\n"]
                for r in rows:
                    lines.append(f"• **{r['loan_id']} ({r['product_name']}):** Monthly EMI of **₹{r['monthly_emi']:,.2f}** due on **{r['next_due_date']}** (Status: {r['status']})")
                return {
                    "response": "\n".join(lines),
                    "intent": "EMI_DUE",
                    "suggested_prompts": ["What is my outstanding balance?", "Show payment history", "What happens if I miss EMI?"]
                }

        # -------------------------------------------------------------
        # Intent 3: Outstanding Balance / Remaining Amount
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["balance", "outstanding", "remaining", "how much i owe", "principal left", "kitna bacha", "kitna dena"]):
            target_id = loan_id or client_id or "C101"
            if loan_id:
                cursor.execute("SELECT loan_id, principal_amount, outstanding_balance, status FROM loans WHERE loan_id = ?", (loan_id,))
            else:
                cursor.execute("SELECT loan_id, principal_amount, outstanding_balance, status FROM loans WHERE client_id = ?", (target_id,))
            rows = cursor.fetchall()
            conn.close()
            if rows:
                lines = ["💰 **Outstanding Balance Summary:**\n"]
                total_bal = 0
                for r in rows:
                    lines.append(f"• **Loan {r['loan_id']}:** Remaining Balance = **₹{r['outstanding_balance']:,.2f}** / Original Principal = ₹{r['principal_amount']:,.2f}")
                    total_bal += r['outstanding_balance']
                lines.append(f"\n**Total Outstanding Debt:** ₹{total_bal:,.2f}")
                return {
                    "response": "\n".join(lines),
                    "intent": "BALANCE_CHECK",
                    "suggested_prompts": ["When is my next EMI due?", "Can I foreclose my loan early?", "Payment options"]
                }

        # -------------------------------------------------------------
        # Intent 4: Payment History
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["payment history", "past payments", "paid", "transactions", "receipt", "purani payment", "statement"]):
            target_loan = loan_id or "L101"
            cursor.execute("""
                SELECT payment_id, loan_id, amount, payment_date, payment_method, status
                FROM payments
                WHERE loan_id = ? OR loan_id IN (SELECT loan_id FROM loans WHERE client_id = ?)
                ORDER BY payment_date DESC
            """, (target_loan, client_id or "C101"))
            rows = cursor.fetchall()
            conn.close()
            if rows:
                lines = [f"💳 **Recent Payment Transactions:**\n"]
                for r in rows:
                    lines.append(f"• **Ref #{r['payment_id']}**: Paid **₹{r['amount']:,.2f}** on **{r['payment_date']}** via {r['payment_method']} (Status: {r['status']})")
                return {
                    "response": "\n".join(lines),
                    "intent": "PAYMENT_HISTORY",
                    "suggested_prompts": ["What is my loan status?", "When is next EMI due?", "Contact support"]
                }
            else:
                return {
                    "response": f"ℹ️ No payment history found for target loan/client.",
                    "intent": "NO_PAYMENTS",
                    "suggested_prompts": ["When is my EMI due?", "How to make a payment?"]
                }

        # -------------------------------------------------------------
        # Intent 5: Interest Rates & Loan Products Inquiry
        # -------------------------------------------------------------
        if any(k in query_lower for k in ["interest rate", "rate", "interest", "product", "loan options", "types of loan", "schemes", "byaj", "kitna percent"]):
            if loan_type:
                cursor.execute("SELECT * FROM loan_products WHERE product_id = ?", (loan_type,))
            else:
                cursor.execute("SELECT * FROM loan_products")
            rows = cursor.fetchall()
            conn.close()
            if rows:
                lines = ["🏦 **Loan Products & Interest Rates:**\n"]
                for r in rows:
                    lines.append(f"🔹 **{r['product_name']} ({r['product_id']})**\n"
                                 f"   • **Interest Rate:** {r['interest_rate']}% p.a.\n"
                                 f"   • **Tenure Range:** {r['min_tenure_months']} to {r['max_tenure_months']} months\n"
                                 f"   • **Amount Range:** ₹{r['min_amount']:,.0f} - ₹{r['max_amount']:,.0f}\n"
                                 f"   • **Eligibility:** {r['eligibility_criteria']}\n")
                return {
                    "response": "\n".join(lines),
                    "intent": "LOAN_PRODUCTS",
                    "suggested_prompts": ["What documents are required?", "How do I apply?", "Check my loan status"]
                }

        # -------------------------------------------------------------
        # Intent 6: FAQs (Documents, Eligibility, Foreclosure, Support)
        # -------------------------------------------------------------
        cursor.execute("SELECT keywords, question, answer FROM faqs")
        faqs = cursor.fetchall()
        conn.close()

        best_match = None
        highest_score = 0
        for faq in faqs:
            keywords = faq['keywords'].split()
            matches = sum(1 for kw in keywords if kw in query_lower)
            if matches > highest_score:
                highest_score = matches
                best_match = faq

        if best_match and highest_score >= 1:
            return {
                "response": f"❓ **{best_match['question']}**\n\n{best_match['answer']}",
                "intent": "FAQ_ANSWER",
                "suggested_prompts": ["What are current interest rates?", "Check my loan status C101", "Contact support"]
            }

        # -------------------------------------------------------------
        # Intent 7: Default Greeting & Helpful Instructions
        # -------------------------------------------------------------
        default_reply = (
            "👋 **Hello! Welcome to LoanBridge Intelligent Assistant.**\n\n"
            "I can help answer any questions about our website and loan services! Here are some things you can ask me:\n\n"
            "1️⃣ **Loan Status:** *'What is the status of loan L101?'* or *'Check status for C101'*\n"
            "2️⃣ **EMI Due Dates:** *'When is my next EMI due?'*\n"
            "3️⃣ **Outstanding Balance:** *'What is my remaining balance for L101?'*\n"
            "4️⃣ **Payment History:** *'Show my recent payment transactions'*\n"
            "5️⃣ **Interest Rates:** *'What are the interest rates for Home Loan?'*\n"
            "6️⃣ **Calculate EMI:** *'Calculate EMI for 500000 at 10% for 3 years'*\n"
            "7️⃣ **General FAQ:** *'What documents are needed to apply for a loan?'*"
        )
        return {
            "response": default_reply,
            "intent": "GENERAL_HELP",
            "suggested_prompts": ["What is my loan status?", "What are the interest rates?", "Calculate EMI 500000 10 3", "Required documents"]
        }

if __name__ == "__main__":
    bot = LoanChatbotEngine()
    print("Testing bot response for 'What is the status of loan L101?':")
    res = bot.process_query("What is the status of loan L101?")
    print(res["response"])
