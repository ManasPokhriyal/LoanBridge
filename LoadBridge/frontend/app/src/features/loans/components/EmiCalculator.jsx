import { useMemo, useState } from 'react';
import { Calculator, IndianRupee, Percent, CalendarDays } from 'lucide-react';
import Input from '../../../shared/components/Input';
import { formatCurrency } from '../../../shared/utils/formatters';
import { calculateEmi } from '../../../shared/utils/emi';

export default function EmiCalculator({
  defaultRate = 10.5,
  defaultAmount = 500000,
  defaultTenure = 36,
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  const result = useMemo(() => {
    return calculateEmi(amount, rate, tenure);
  }, [amount, rate, tenure]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-white">
            <Calculator size={21}/>
          </span>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              EMI Calculator
            </h3>
            <p className="text-sm text-slate-500">
              Plan your monthly repayment before applying.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Loan amount"
            type="number"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            min="10000"
          />
          <Input
            label="Interest rate (% p.a.)"
            type="number"
            step="0.05"
            value={rate}
            onChange={(e)=>setRate(e.target.value)}
          />
          <Input
            label="Tenure (months)"
            type="number"
            value={tenure}
            onChange={(e)=>setTenure(e.target.value)}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Result
            icon={IndianRupee}
            label="Monthly EMI"
            value={formatCurrency(result.monthlyEmi)}
            primary
          />
          <Result
            icon={Percent}
            label="Total interest"
            value={formatCurrency(result.totalInterest)}
          />
          <Result
            icon={CalendarDays}
            label="Total repayment"
            value={formatCurrency(result.totalRepayment)}
          />
        </div>
      </div>
    </div>
  );
}

function Result({ icon: Icon, label, value, primary }) {
  return (
    <div className={`rounded-2xl border p-4 ${primary ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className={`mb-3 grid h-8 w-8 place-items-center rounded-lg ${primary ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>
        <Icon size={16}/>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${primary ? 'text-indigo-700' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}
