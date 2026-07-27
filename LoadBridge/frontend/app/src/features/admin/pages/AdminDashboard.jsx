import { Activity, AlertTriangle, BadgeIndianRupee, FileClock, FileCheck2, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "../../../shared/components/Loader";
import { formatCurrency } from "../../../shared/utils/formatters";
import { getAdminDashboardApi } from "../services/adminService";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardApi()
      .then(data => { setDashboard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading && !dashboard) return <Loader />;

  const dashboardCards = [
    { icon: FileClock, label: "Total applications", value: dashboard?.totalApplications },
    { icon: Activity, label: "Pending review", value: dashboard?.pendingReview },
    { icon: FileCheck2, label: "Approved loans", value: dashboard?.approvedLoans },
    { icon: Landmark, label: "Active loans", value: dashboard?.activeLoans },
    { icon: AlertTriangle, label: "Defaulted loans", value: dashboard?.defaultedLoans },
    { icon: BadgeIndianRupee, label: "Total disbursed", value: formatCurrency(dashboard?.totalDisbursedAmount) },
  ];

  const totalAccounts = (dashboard?.activeLoans || 0) + (dashboard?.defaultedLoans || 0);

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-indigo-600">ADMIN CONTROL CENTRE</p>
        <h1 className="section-title mt-2">Portfolio overview</h1>
        <p className="mt-2 text-slate-500">Monitor applications, disbursements, and portfolio health.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600"><Icon /></span>
              <span className="text-xs text-slate-500">Live data</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold">{value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Portfolio health</h2>
          <div className="mt-5 space-y-4">
            <ProgressBar label="Active accounts" value={dashboard?.activeLoans || 0} max={totalAccounts || 1} />
            <ProgressBar label="Defaulted accounts" value={dashboard?.defaultedLoans || 0} max={totalAccounts || 1} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Review queue</h2>
          <p className="mt-2 text-sm text-slate-500">{dashboard?.pendingReview || 0} applications are waiting for an admin decision.</p>
          <div className="mt-6 rounded-2xl bg-amber-500/10 p-5 text-amber-700">
            <p className="text-3xl font-semibold">{dashboard?.pendingReview || 0}</p>
            <p className="mt-1 text-sm">Pending or under review</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max }) {
  const percentage = Math.max(value ? 8 : 0, (value / max) * 100);
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
