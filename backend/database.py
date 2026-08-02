import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "loan_management.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create Clients table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            client_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            credit_score INTEGER,
            annual_income REAL,
            status TEXT DEFAULT 'Active'
        )
    """)

    # Create Loan Products table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS loan_products (
            product_id TEXT PRIMARY KEY,
            product_name TEXT NOT NULL,
            interest_rate REAL NOT NULL,
            min_tenure_months INTEGER,
            max_tenure_months INTEGER,
            min_amount REAL,
            max_amount REAL,
            eligibility_criteria TEXT
        )
    """)

    # Create Loans table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS loans (
            loan_id TEXT PRIMARY KEY,
            client_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            principal_amount REAL NOT NULL,
            interest_rate REAL NOT NULL,
            tenure_months INTEGER NOT NULL,
            monthly_emi REAL NOT NULL,
            outstanding_balance REAL NOT NULL,
            status TEXT DEFAULT 'Active',
            next_due_date TEXT,
            start_date TEXT,
            FOREIGN KEY (client_id) REFERENCES clients (client_id),
            FOREIGN KEY (product_id) REFERENCES loan_products (product_id)
        )
    """)

    # Create Payments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            payment_id TEXT PRIMARY KEY,
            loan_id TEXT NOT NULL,
            amount REAL NOT NULL,
            payment_date TEXT NOT NULL,
            payment_method TEXT,
            status TEXT DEFAULT 'Completed',
            FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        )
    """)

    # Create FAQs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keywords TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            category TEXT
        )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
