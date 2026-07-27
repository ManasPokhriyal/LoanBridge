import { useEffect, useMemo, useState } from "react";
import Badge from "../../../shared/components/Badge";
import Loader from "../../../shared/components/Loader";
import Table from "../../../shared/components/Table";
import { formatCurrency, formatDate, statusTone } from "../../../shared/utils/formatters";
import { getAdminLoanAccountsApi } from "../services/adminService";

export default function AdminLoanAccounts() {
  const [loanAccounts, setLoanAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getAdminLoanAccountsApi()
      .then(data => { setLoanAccounts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredAccounts = useMemo(() => {
    if (filter === "ALL") return loanAccounts;
    return loanAccounts.filter((account) => account.status === filter);
  }, [loanAccounts, filter]);

  const columns = [
    { key: "id", label: "Account", render: (account) => `#${account.id}` },
    { key: "loanType", label: "Loan", render: (account) => (<div><p className="font-medium text-slate-900">{account.loanType}</p><p className="text-xs text-slate-500">{account.bankName}</p></div>) },
    { key: "principal", label: "Principal", render: (account) => formatCurrency(account.principal) },
    { key: "outstanding", label: "Outstanding", render: (account) => formatCurrency(account.outstanding) },
    { key: "monthlyEmi", label: "EMI", render: (account) => formatCurrency(account.monthlyEmi) },
    { key: "nextDueDate", label: "Next due", render: (account) => formatDate(account.nextDueDate) },
    { key: "status", label: "Status", render: (account) => (<Badge tone={statusTone(account.status)}>{account.status}</Badge>) }
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">LOAN SERVICING</p>
          <h1 className="section-title mt-2">Loan accounts</h1>
          <p className="mt-2 text-slate-500">Manage active and defaulted loan accounts.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm">
          <option>ALL</option>
          <option>ACTIVE</option>
          <option>DEFAULTED</option>
        </select>
      </div>

      <div className="mt-7">
        {loading ? <Loader /> : <Table columns={columns} data={filteredAccounts} />}
      </div>
    </div>
  );
}
