import { CalendarClock, CreditCard, FileCheck2, Gauge, IndianRupee, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Badge from '../../../shared/components/Badge';
import Button from '../../../shared/components/Button';
import Loader from '../../../shared/components/Loader';
import PaymentModal from '../../payments/components/PaymentModal';
import { formatCurrency, formatDate, statusTone } from '../../../shared/utils/formatters';
import { getCustomerDashboardApi } from '../services/customerService';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const loadDashboard = async () => {
    try {
      const data = await getCustomerDashboardApi();
      setDashboard(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading && !dashboard) return <Loader />;

  const activeLoan = dashboard?.activeLoan;

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-indigo-600">CUSTOMER OVERVIEW</p>
        <h1 className="section-title mt-2">Welcome, {dashboard?.user?.name}</h1>
        <p className="mt-2 text-slate-500">Here is your current financial snapshot.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Gauge} label="Credit score" value={dashboard?.user?.creditScore || '—'} detail="Excellent profile" />
        <Metric icon={FileCheck2} label="Applications" value={dashboard?.applicationCount || 0} detail={`${dashboard?.approvedCount || 0} approved`} />
        <Metric icon={IndianRupee} label="Outstanding" value={activeLoan ? formatCurrency(activeLoan.outstanding) : '—'} detail={activeLoan?.loanType || 'No active loan'} />
        <Metric icon={CalendarClock} label="Next due" value={activeLoan ? formatDate(activeLoan.nextDueDate) : '—'} detail={activeLoan ? formatCurrency(activeLoan.monthlyEmi) : 'No EMI due'} />
      </div>

      {activeLoan ? (
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600"><CreditCard /></span>
                <div>
                  <p className="text-sm text-slate-500">{activeLoan.bankName}</p>
                  <h2 className="text-xl font-semibold">{activeLoan.loanType}</h2>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
                <Info label="Principal" value={formatCurrency(activeLoan.principal)} />
                <Info label="Outstanding" value={formatCurrency(activeLoan.outstanding)} />
                <Info label="Interest" value={`${activeLoan.interestRate}%`} />
                <Info label="Status" value={<Badge tone={statusTone(activeLoan.status)}>{activeLoan.status}</Badge>} />
              </div>
            </div>
            <Button onClick={() => setShowPayment(true)}><IndianRupee size={17} />Pay EMI</Button>
          </div>

          <div className="mt-7 rounded-2xl bg-slate-50 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Repayment progress</span>
              <span>{Math.round((1 - activeLoan.outstanding / activeLoan.principal) * 100)}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${Math.max(4, (1 - activeLoan.outstanding / activeLoan.principal) * 100)}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 text-center">
          <TrendingUp className="mx-auto text-indigo-600" />
          <h2 className="mt-4 text-xl font-semibold">No active loan yet</h2>
          <p className="mt-2 text-slate-500">Explore the marketplace and submit your first application.</p>
        </div>
      )}

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} account={activeLoan} onPaymentSuccess={loadDashboard} />
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon size={20} className="text-indigo-600" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <div className="mt-1 text-slate-700">{value}</div>
    </div>
  );
}
