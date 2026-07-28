import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Badge from "../../../shared/components/Badge";
import Loader from "../../../shared/components/Loader";
import Table from "../../../shared/components/Table";
import { formatCurrency, formatDate, statusTone } from "../../../shared/utils/formatters";
import { getUserApplicationsApi } from "../../customer/services/customerService";

export default function Applications() {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (user?.id) {
      getUserApplicationsApi(user.id)
        .then(data => { setApplications(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user?.id]);

  const filteredApplications = useMemo(() => {
    if (filter === "ALL") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  const columns = [
    { key: "loanType", label: "Loan", render: (app) => (<div><p className="font-medium text-slate-900">{app.loanType}</p><p className="text-xs text-slate-500">{app.bankName}</p></div>) },
    { key: "amount", label: "Amount", render: (app) => formatCurrency(app.amount) },
    { key: "appliedAt", label: "Applied", render: (app) => formatDate(app.appliedAt) },
    { key: "tenureMonths", label: "Tenure", render: (app) => `${app.tenureMonths} months` },
    { key: "status", label: "Status", render: (app) => (<Badge tone={statusTone(app.status)}>{app.status.replace("_", " ")}</Badge>) }
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">YOUR REQUESTS</p>
          <h1 className="section-title mt-2">Loan applications</h1>
          <p className="mt-2 text-slate-500">Track every application from submission to final decision.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm">
          <option>ALL</option>
          <option>PENDING</option>
          <option>UNDER_REVIEW</option>
          <option>APPROVED</option>
          <option>REJECTED</option>
        </select>
      </div>

      <div className="mt-7">
        {loading ? <Loader /> : <Table columns={columns} data={filteredApplications} emptyMessage="No applications match this filter." />}
      </div>
    </div>
  );
}
