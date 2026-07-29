import { getDb, saveDb } from "./mockData.js";
import { calculateEmi } from "../utils/emi.js";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const createResponse = (config, data, status = 200) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config,
});

const throwError = (message, status = 400) => {
  const error = new Error(message);
  error.response = {
    data: { message },
    status,
  };
  throw error;
};

const parseRequestBody = (data) => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
};

const removePassword = ({ password, ...user }) => user;

function getAuthenticatedUser(config, database) {
  const authorization = config.headers?.Authorization || config.headers?.authorization;
  if (!authorization?.startsWith("Bearer mock-jwt-")) return null;
  const id = Number(authorization.split("-").pop());
  return database.users.find((user) => user.id === id) || null;
}

function generateEmiSchedule(account) {
  const schedule = [];
  const startDate = new Date(account.disbursedAt);
  const total = Math.min(account.tenureMonths, 24);

  for (let i = 1; i <= total; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + i);
    const paid = i <= 2 && account.status !== "DEFAULTED";

    schedule.push({
      installmentNo: i,
      dueDate: dueDate.toISOString().slice(0, 10),
      principal: Math.round(account.monthlyEmi * 0.72),
      interest: Math.round(account.monthlyEmi * 0.28),
      amount: account.monthlyEmi,
      status: paid ? "PAID" : i === 3 ? "UPCOMING" : "PENDING",
    });
  }

  return schedule;
}

export default async function mockAdapter(config) {
  await wait();
  const db = getDb();
  const method = (config.method || "get").toLowerCase();
  const url = (config.url || "").replace(/^https?:\/\/[^/]+\/api/, "").split("?")[0];
  const body = parseRequestBody(config.data);
  const currentUser = getAuthenticatedUser(config, db);

  if (method === "post" && url === "/auth/login") {
    const user = db.users.find(u => u.email.toLowerCase() === body.email?.toLowerCase() && u.password === body.password);
    if (!user) return throwError("Invalid email or password", 401);
    return createResponse(config, { token: `mock-jwt-${user.id}`, user: removePassword(user) });
  }

  if (method === "post" && url === "/auth/register") {
    const exists = db.users.some((u) => u.email === body.email);
    if (exists) return throwError("Email already exists", 409);
    const user = { id: Date.now(), ...body, role: "USER", creditScore: body.creditScore || 735 };
    db.users.push(user);
    saveDb(db);
    return createResponse(config, { token: `mock-jwt-${user.id}`, user: removePassword(user) }, 201);
  }

  if (method === "post" && url === "/pan/verify") {
    const pan = String(body.pan || "").toUpperCase().trim();
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panPattern.test(pan)) return throwError("Enter a valid PAN format. Example: ABCDE1234F", 400);
    const existingUser = db.users.find((user) => user.pan === pan);
    return createResponse(config, { verified: true, name: existingUser?.name || "Verified Applicant", creditScore: existingUser?.creditScore || 735, pan });
  }

  if (method === "get" && url === "/auth/me") {
    if (!currentUser) return throwError("Session expired", 401);
    return createResponse(config, removePassword(currentUser));
  }

  if (method === "get" && url === "/loan-offers") {
    return createResponse(config, db.loanOffers);
  }

  if (method === "get" && /^\/loan-offers\/\d+$/.test(url)) {
    const id = Number(url.split("/").pop());
    const offer = db.loanOffers.find((x) => x.id === id);
    if (!offer) return throwError("Loan offer not found", 404);
    return createResponse(config, offer);
  }

  if (method === "post" && url === "/applications") {
    if (!currentUser) return throwError("Login required", 401);
    const offer = db.loanOffers.find((x) => x.id === Number(body.offerId));
    if (!offer) return throwError("Offer not found", 404);
    const application = {
      id: Date.now(), userId: currentUser.id, offerId: offer.id,
      customerName: currentUser.name, email: currentUser.email,
      bankName: offer.bankName, loanType: offer.loanType,
      amount: Number(body.amount), tenureMonths: Number(body.tenureMonths),
      interestRate: offer.interestRate, purpose: body.purpose,
      status: "PENDING", appliedAt: new Date().toISOString(),
    };
    db.applications.unshift(application);
    saveDb(db);
    return createResponse(config, application, 201);
  }

  if (method === "get" && url === "/customer/dashboard") {
    if (!currentUser) return throwError("Login required", 401);
    const loan = db.loanAccounts.find((x) => x.userId === currentUser.id);
    const applications = db.applications.filter((x) => x.userId === currentUser.id);
    return createResponse(config, { user: removePassword(currentUser), activeLoan: loan || null, applicationCount: applications.length });
  }

  if (method === "get" && /^\/applications\/user\/\d+$/.test(url)) {
    if (!currentUser) return throwError("Login required", 401);
    const id = Number(url.split("/").pop());
    return createResponse(config, db.applications.filter((a) => a.userId === id));
  }

  if (method === "get" && /^\/loan-accounts\/\d+\/emi-schedule$/.test(url)) {
    const id = Number(url.split("/")[2]);
    const account = db.loanAccounts.find((x) => x.id === id);
    if (!account) return throwError("Loan account not found", 404);
    return createResponse(config, generateEmiSchedule(account));
  }

  if (method === "get" && url === "/loan-accounts/user") {
    if (!currentUser) return throwError("Login required", 401);
    return createResponse(config, db.loanAccounts.filter((x) => x.userId === currentUser.id));
  }

  if (method === "get" && url === "/admin/dashboard") {
    if (!currentUser || currentUser.role !== "ADMIN") return throwError("Admin access required", 403);
    return createResponse(config, {
      totalApplications: db.applications.length,
      pendingReview: db.applications.filter((a) => a.status === "PENDING").length,
      approvedLoans: db.applications.filter((a) => a.status === "APPROVED").length,
      activeLoans: db.loanAccounts.filter((a) => a.status === "ACTIVE").length,
      defaultedLoans: db.loanAccounts.filter((a) => a.status === "DEFAULTED").length,
      totalDisbursedAmount: db.loanAccounts.reduce((sum, a) => sum + a.principal, 0),
    });
  }

  if (method === "get" && url === "/applications/admin/all") {
    if (!currentUser || currentUser.role !== "ADMIN") return throwError("Admin access required", 403);
    return createResponse(config, db.applications);
  }

  if (method === "get" && url === "/loan-accounts/admin/all") {
    if (!currentUser || currentUser.role !== "ADMIN") return throwError("Admin access required", 403);
    return createResponse(config, db.loanAccounts);
  }

  // APPROVE APPLICATION
  if (method === 'put' && /^\/applications\/admin\/\d+\/approve$/.test(url)) {
    if (!currentUser || currentUser.role !== 'ADMIN') return throwError('Admin access required', 403);
    const id = Number(url.split('/')[3]);
    const app = db.applications.find(a => a.id === id);
    if (!app) return throwError('Application not found', 404);
    app.status = 'APPROVED';
    
    // Create loan account
    const emi = calculateEmi(app.amount, app.interestRate, app.tenureMonths);
    const account = {
      id: Date.now(), applicationId: app.id, userId: app.userId,
      bankName: app.bankName, loanType: app.loanType,
      principal: app.amount, outstanding: app.amount,
      interestRate: app.interestRate, tenureMonths: app.tenureMonths,
      monthlyEmi: emi.monthlyEmi, nextDueDate: new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
      status: 'ACTIVE', disbursedAt: new Date().toISOString().slice(0,10),
    };
    db.loanAccounts.push(account);
    saveDb(db);
    return createResponse(config, app);
  }

  // REJECT APPLICATION
  if (method === 'put' && /^\/applications\/admin\/\d+\/reject$/.test(url)) {
    if (!currentUser || currentUser.role !== 'ADMIN') return throwError('Admin access required', 403);
    const id = Number(url.split('/')[3]);
    const app = db.applications.find(a => a.id === id);
    if (!app) return throwError('Application not found', 404);
    app.status = 'REJECTED';
    saveDb(db);
    return createResponse(config, app);
  }

  if (method === "post" && url === "/payments/create-order") {
    if (!currentUser) return throwError("Login required", 401);
    return createResponse(config, { id: `order_demo_${Date.now()}`, amount: Number(body.amount) * 100, currency: "INR" }, 201);
  }

  if (method === "post" && url === "/payments/verify") {
    if (!currentUser) return throwError("Login required", 401);
    const account = db.loanAccounts.find((loan) => loan.id === Number(body.loanAccountId));
    if (!account) return throwError("Loan account not found", 404);
    account.outstanding = Math.max(0, account.outstanding - Number(body.amount));
    
    const nextDate = new Date(account.nextDueDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    account.nextDueDate = nextDate.toISOString().slice(0, 10);
    
    const payment = {
      id: `pay_demo_${Date.now()}`, userId: currentUser.id,
      loanAccountId: account.id, amount: Number(body.amount),
      status: "PAID", method: body.method || "UPI", paidAt: new Date().toISOString(),
    };
    db.payments.unshift(payment);
    saveDb(db);
    return createResponse(config, { verified: true, paymentId: payment.id, payment, account });
  }

  return throwError(`Mock endpoint not implemented: ${method.toUpperCase()} ${url}`, 404);
}
