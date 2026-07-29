// EMI calculation helper
export function calculateEmi(amount, annualRate, tenureMonths) {
  const principal = Number(amount) || 0;
  const months = Number(tenureMonths) || 0;
  const monthlyRate = (Number(annualRate) || 0) / 12 / 100;

  if (!principal || !months) return { monthlyEmi: 0, totalInterest: 0, totalRepayment: 0 };

  const monthlyEmi = monthlyRate === 0
    ? principal / months
    : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

  const totalRepayment = monthlyEmi * months;

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalRepayment - principal),
    totalRepayment: Math.round(totalRepayment),
  };
}
