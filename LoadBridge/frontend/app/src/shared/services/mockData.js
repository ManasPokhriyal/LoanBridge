const STORAGE_KEY = "loanbridge_mock_db";

const seedDatabase = {
  users: [
    {
      id: 1, name: "Aarav Sharma", email: "user@loanbridge.com", password: "User@123", role: "USER",
      phone: "9876543210", pan: "ABCDE1234F", aadhaar: "123456789012", address: "Pune, Maharashtra",
      employmentType: "SALARIED", annualIncome: 900000, creditScore: 780,
    },
    {
      id: 2, name: "LoanBridge Admin", email: "admin@loanbridge.com", password: "Admin@123", role: "ADMIN",
      phone: "9999999999", creditScore: null,
    },
  ],
  loanOffers: [
    { id: 101, bankName: "HDFC Bank", loanType: "Personal Loan", interestRate: 10.5, maxAmount: 2500000, tenureMonths: 60, creditRequirement: 700, processingFee: 1.5, icon: "Landmark", featured: true },
    { id: 102, bankName: "ICICI Bank", loanType: "Home Loan", interestRate: 8.45, maxAmount: 10000000, tenureMonths: 240, creditRequirement: 725, processingFee: 0.5, icon: "House" },
    { id: 103, bankName: "Axis Bank", loanType: "Education Loan", interestRate: 9.2, maxAmount: 5000000, tenureMonths: 120, creditRequirement: 680, processingFee: 1.0, icon: "GraduationCap" },
    { id: 104, bankName: "SBI", loanType: "Car Loan", interestRate: 8.9, maxAmount: 3000000, tenureMonths: 84, creditRequirement: 675, processingFee: 0.75, icon: "Car" },
    { id: 105, bankName: "Kotak Mahindra", loanType: "Business Loan", interestRate: 12.25, maxAmount: 5000000, tenureMonths: 72, creditRequirement: 720, processingFee: 2.0, icon: "BriefcaseBusiness" },
    { id: 106, bankName: "Bajaj Finserv", loanType: "Consumer Loan", interestRate: 13.0, maxAmount: 500000, tenureMonths: 36, creditRequirement: 650, processingFee: 2.25, icon: "ShoppingBag" },
  ],
  applications: [
    { id: 5001, userId: 1, offerId: 101, customerName: "Aarav Sharma", email: "user@loanbridge.com", pan: "ABCDE1234F", creditScore: 780, bankName: "HDFC Bank", loanType: "Personal Loan", amount: 600000, tenureMonths: 36, interestRate: 10.5, purpose: "Home renovation", status: "APPROVED", appliedAt: "2026-07-04T10:15:00.000Z", documentName: "income-proof.pdf" },
    { id: 5002, userId: 3, offerId: 102, customerName: "Meera Iyer", email: "meera@example.com", pan: "BCDEF2345G", creditScore: 742, bankName: "ICICI Bank", loanType: "Home Loan", amount: 4200000, tenureMonths: 180, interestRate: 8.45, purpose: "First home purchase", status: "PENDING", appliedAt: "2026-07-18T08:30:00.000Z", documentName: "salary-slip.pdf" },
    { id: 5003, userId: 4, offerId: 104, customerName: "Rohan Patil", email: "rohan@example.com", pan: "CDEFG3456H", creditScore: 688, bankName: "SBI", loanType: "Car Loan", amount: 950000, tenureMonths: 60, interestRate: 8.9, purpose: "New car purchase", status: "UNDER_REVIEW", appliedAt: "2026-07-20T12:00:00.000Z", documentName: "bank-statement.pdf" },
    { id: 5004, userId: 5, offerId: 105, customerName: "Neha Verma", email: "neha@example.com", pan: "DEFGH4567J", creditScore: 645, bankName: "Kotak Mahindra", loanType: "Business Loan", amount: 1800000, tenureMonths: 48, interestRate: 12.25, purpose: "Business expansion", status: "REJECTED", appliedAt: "2026-07-12T09:20:00.000Z", documentName: "gst-return.pdf" },
  ],
  loanAccounts: [
    { id: 7001, applicationId: 5001, userId: 1, bankName: "HDFC Bank", loanType: "Personal Loan", principal: 600000, outstanding: 514230, interestRate: 10.5, tenureMonths: 36, monthlyEmi: 19502, nextDueDate: "2026-08-05", status: "ACTIVE", disbursedAt: "2026-07-05" },
    { id: 7002, applicationId: 4998, userId: 6, bankName: "SBI", loanType: "Home Loan", principal: 3600000, outstanding: 3420000, interestRate: 8.5, tenureMonths: 180, monthlyEmi: 35455, nextDueDate: "2026-08-10", status: "ACTIVE", disbursedAt: "2026-01-10" },
    { id: 7003, applicationId: 4997, userId: 7, bankName: "Axis Bank", loanType: "Business Loan", principal: 1200000, outstanding: 1125000, interestRate: 12.0, tenureMonths: 48, monthlyEmi: 31601, nextDueDate: "2026-07-15", status: "DEFAULTED", disbursedAt: "2026-02-15" },
  ],
  payments: [],
};

function cloneDatabase(data) {
  return JSON.parse(JSON.stringify(data));
}

export function getDb() {
  const storedDatabase = localStorage.getItem(STORAGE_KEY);
  if (!storedDatabase) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
    return cloneDatabase(seedDatabase);
  }
  try {
    return JSON.parse(storedDatabase);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
    return cloneDatabase(seedDatabase);
  }
}

export function saveDb(database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
}

export function resetDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
  return cloneDatabase(seedDatabase);
}
