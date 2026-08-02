import { useEffect, useState } from 'react';
import Badge from '../../../shared/components/Badge';
import Loader from '../../../shared/components/Loader';
import Table from '../../../shared/components/Table';
import EmptyState from '../../../shared/components/EmptyState';
import { formatCurrency, formatDate, statusTone } from '../../../shared/utils/formatters';
import { getUserLoanAccountsApi, getEmiScheduleApi } from '../../customer/services/customerService';
import apiClient from '../../../shared/services/api';

export default function EmiSchedule() {
  const [loanAccounts, setLoanAccounts] = useState([]);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState('');

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const userRes = await apiClient.get('/auth/me');
      const user = userRes.data;
      if (user && user.id) {
        const data = await getUserLoanAccountsApi(user.id);
        const accList = data ? (Array.isArray(data) ? data : [data]) : [];
        setLoanAccounts(accList);
        if (accList.length > 0 && !accountId) {
          const selectedId = String(accList[0].loanAccountId || accList[0].id);
          setAccountId(selectedId);
        }
      }
    } catch (e) {
      console.error("Failed to load loan accounts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountId) {
      setLoading(true);
      getEmiScheduleApi(accountId)
        .then(schedule => {
          setEmiSchedule(Array.isArray(schedule) ? schedule : []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load EMI schedule:", err);
          setLoading(false);
        });
    }
  }, [accountId]);

  const columns = [
    { key: 'installmentNo', label: '#' },
    { key: 'dueDate', label: 'Due date', render: (row) => formatDate(row.dueDate) },
    { key: 'emiAmount', label: 'EMI amount', render: (row) => formatCurrency(row.emiAmount || row.totalAmountDue || 0) },
    { key: 'amountPaid', label: 'Amount paid', render: (row) => formatCurrency(row.amountPaid || 0) },
    { key: 'totalAmountDue', label: 'Remaining due', render: (row) => formatCurrency(Math.max(0, (row.totalAmountDue || row.emiAmount || 0) - (row.amountPaid || 0))) },
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
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            {loanAccounts.map((account) => {
              const accNum = account.loanAccountId || account.id;
              return (
                <option key={accNum} value={accNum}>
                  {account.bankName || 'Loan Account'} · #{accNum}
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div className="mt-7">
        {loading ? (
          <Loader />
        ) : loanAccounts.length > 0 && emiSchedule.length > 0 ? (
          <Table columns={columns} data={emiSchedule} />
        ) : (
          <EmptyState title="No EMI schedule found" description="An EMI schedule will appear here once your loan is active." />
        )}
      </div>
    </div>
  );
}
