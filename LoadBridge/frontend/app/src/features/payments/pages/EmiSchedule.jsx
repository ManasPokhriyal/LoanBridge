import { useEffect, useState } from 'react';
import Badge from '../../../shared/components/Badge';
import Loader from '../../../shared/components/Loader';
import Table from '../../../shared/components/Table';
import EmptyState from '../../../shared/components/EmptyState';
import { formatCurrency, formatDate, statusTone } from '../../../shared/utils/formatters';
import { getUserLoanAccountsApi, getEmiScheduleApi } from '../../customer/services/customerService';

export default function EmiSchedule() {
  const [loanAccounts, setLoanAccounts] = useState([]);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState('');

  useEffect(() => {
    getUserLoanAccountsApi()
      .then(data => { setLoanAccounts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loanAccounts.length && !accountId) {
      setAccountId(String(loanAccounts[0].id));
    }
  }, [loanAccounts, accountId]);

  useEffect(() => {
    if (accountId) {
      setLoading(true);
      getEmiScheduleApi(accountId)
        .then(data => { setEmiSchedule(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [accountId]);

  const columns = [
    { key: 'installmentNo', label: '#' },
    { key: 'dueDate', label: 'Due date', render: (row) => formatDate(row.dueDate) },
    { key: 'principal', label: 'Principal', render: (row) => formatCurrency(row.principal) },
    { key: 'interest', label: 'Interest', render: (row) => formatCurrency(row.interest) },
    { key: 'amount', label: 'EMI', render: (row) => formatCurrency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => (<Badge tone={statusTone(row.status)}>{row.status}</Badge>) },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">REPAYMENT PLAN</p>
          <h1 className="section-title mt-2">EMI schedule</h1>
          <p className="mt-2 text-slate-500">Review upcoming installments and payment status.</p>
        </div>

        {loanAccounts.length > 0 && (
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
          >
            {loanAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.loanType} · #{account.id}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-7">
        {loading ? (
          <Loader />
        ) : loanAccounts.length ? (
          <Table columns={columns} data={emiSchedule} />
        ) : (
          <EmptyState title="No EMI schedule" description="An EMI schedule appears after a loan is approved and disbursed." />
        )}
      </div>
    </div>
  );
}
