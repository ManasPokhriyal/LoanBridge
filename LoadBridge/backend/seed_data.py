import sqlite3
from database import get_db_connection, init_db

def seed():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data
    cursor.execute("DELETE FROM payments")
    cursor.execute("DELETE FROM loans")
    cursor.execute("DELETE FROM loan_products")
    cursor.execute("DELETE FROM clients")
    cursor.execute("DELETE FROM faqs")

    # 1. Insert Clients
    clients = [
        ("C101", "Rahul Sharma", "rahul.sharma@example.com", "+91 9876543210", 760, 1200000.0, "Active"),
        ("C102", "Priya Patel", "priya.patel@example.com", "+91 9812345678", 810, 1800000.0, "Active"),
        ("C103", "Amit Kumar", "amit.kumar@example.com", "+91 9988776655", 680, 750000.0, "Active"),
        ("C104", "Sneha Verma", "sneha.verma@example.com", "+91 9765432109", 740, 950000.0, "Active")
    ]
    cursor.executemany(
        "INSERT INTO clients (client_id, name, email, phone, credit_score, annual_income, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        clients
    )

    # 2. Insert Loan Products
    products = [
        ("P_HOME", "Home Loan", 8.5, 12, 360, 500000.0, 10000000.0, "Minimum credit score 700, age 21-60, steady income."),
        ("P_PERS", "Personal Loan", 11.5, 6, 60, 50000.0, 1500000.0, "Minimum credit score 650, minimum monthly income Rs. 25,000."),
        ("P_AUTO", "Car / Auto Loan", 9.25, 12, 84, 100000.0, 5000000.0, "Minimum credit score 680, 20% down payment required."),
        ("P_EDU", "Education Loan", 7.9, 12, 180, 100000.0, 3000000.0, "Admission letter from recognized university, co-applicant required.")
    ]
    cursor.executemany(
        "INSERT INTO loan_products (product_id, product_name, interest_rate, min_tenure_months, max_tenure_months, min_amount, max_amount, eligibility_criteria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        products
    )

    # 3. Insert Active Loans
    loans = [
        ("L101", "C101", "P_HOME", 2500000.0, 8.5, 240, 21696.0, 2380000.0, "Active", "2026-08-10", "2024-01-10"),
        ("L102", "C101", "P_PERS", 300000.0, 11.5, 36, 9888.0, 145000.0, "Active", "2026-08-15", "2024-06-15"),
        ("L103", "C102", "P_AUTO", 800000.0, 9.25, 60, 16700.0, 620000.0, "Active", "2026-08-05", "2024-03-05"),
        ("L104", "C103", "P_PERS", 150000.0, 11.5, 24, 7026.0, 0.0, "Closed", "Completed", "2023-05-01")
    ]
    cursor.executemany(
        "INSERT INTO loans (loan_id, client_id, product_id, principal_amount, interest_rate, tenure_months, monthly_emi, outstanding_balance, status, next_due_date, start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        loans
    )

    # 4. Insert Payments History
    payments = [
        ("PAY1001", "L101", 21696.0, "2026-07-10", "Auto-Debit", "Completed"),
        ("PAY1002", "L101", 21696.0, "2026-06-10", "UPI", "Completed"),
        ("PAY1003", "L102", 9888.0, "2026-07-15", "Net Banking", "Completed"),
        ("PAY1004", "L103", 16700.0, "2026-07-05", "Auto-Debit", "Completed")
    ]
    cursor.executemany(
        "INSERT INTO payments (payment_id, loan_id, amount, payment_date, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)",
        payments
    )

    # 5. Insert FAQs
    faqs = [
        ("apply document documents submit application process steps how to apply", 
         "How do I apply for a loan and what documents are required?",
         "To apply for a loan on LoanBridge:\n1. Click 'Apply Now' on our portal.\n2. Select your desired Loan Product (Home, Personal, Auto, Education).\n3. Upload your ID proof (Aadhaar/PAN), 3 months salary slips, 6 months bank statements, and address proof.\n4. Our team will verify and disburse funds within 24-48 hours!",
         "General"),
        ("foreclosure prepay penalty prepayment pay early foreclose", 
         "Can I foreclose or prepay my loan early?",
         "Yes! LoanBridge supports hassle-free prepayment. Floating-rate Home Loans have **0% foreclosure charges**. Personal loans have a nominal 2% charge after completing 6 EMIs.",
         "Prepayment"),
        ("interest rate rates compare home personal car auto education product options",
         "What are the current interest rates offered by LoanBridge?",
         "Our competitive interest rates are:\n• 🏡 **Home Loan:** 8.5% p.a.\n• 🎓 **Education Loan:** 7.9% p.a.\n• 🚗 **Car/Auto Loan:** 9.25% p.a.\n• 💼 **Personal Loan:** 11.5% p.a.",
         "Products"),
        ("late fee penalty overdue grace period bounce charge missed emi",
         "What happens if I miss an EMI payment?",
         "A **3-day grace period** is automatically granted. Beyond 3 days, a penal charge of 2% per month on the overdue amount plus Rs. 450 bank NACH bounce charge applies.",
         "Payments"),
        ("contact support phone customer care helpline email office address timing hours",
         "How can I contact customer support or visit your office?",
         "📞 **Helpline:** 1800-123-5626 (Toll-Free, Mon-Sat 9 AM - 7 PM)\n📧 **Email:** support@loanbridge.com\n🏢 **Head Office:** LoanBridge Towers, Financial District, Tech City - 500032.",
         "Support"),
        ("cibil credit score required eligibility minimum range",
         "What CIBIL score is required for loan approval?",
         "A CIBIL credit score of **700+** is ideal for Home & Auto loans. For Personal loans, a minimum score of **650** is required. Scores above 750 get special discounted interest rates!",
         "Eligibility"),
        ("security safe portal data encryption privacy trust",
         "Is my personal data safe on LoanBridge?",
         "Yes, 100%! LoanBridge uses bank-grade **256-bit SSL encryption** and adheres strictly to RBI digital lending guidelines.",
         "Security"),
        ("emi calculator calculate formula monthly payment",
         "How is my EMI calculated?",
         "EMI is calculated using the formula: P × r × (1 + r)^n / ((1 + r)^n - 1). You can also ask our AI chatbot directly, e.g. *'Calculate EMI for 5 lakhs at 10% for 3 years'*!",
         "Calculator")
    ]
    cursor.executemany(
        "INSERT INTO faqs (keywords, question, answer, category) VALUES (?, ?, ?, ?)",
        faqs
    )

    conn.commit()
    conn.close()
    print("Database successfully populated with realistic Loan Management sample data!")

if __name__ == "__main__":
    seed()
