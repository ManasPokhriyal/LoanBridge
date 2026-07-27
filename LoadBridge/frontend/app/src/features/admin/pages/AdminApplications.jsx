import { Eye, CheckCircle2, FileText, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Loader from "../../../shared/components/Loader";
import Table from "../../../shared/components/Table";
import Modal from "../../../shared/components/Modal";
import { useToast } from "../../../shared/components/Toast";
import { formatCurrency, formatDate, statusTone } from "../../../shared/utils/formatters";
import { getAdminApplicationsApi, approveApplicationApi, rejectApplicationApi } from "../services/adminService";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    getAdminApplicationsApi()
      .then(data => { setApplications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredApplications = useMemo(() => {
    if (filter === "ALL") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  const columns = [
    { key: "customerName", label: "Applicant", render: (app) => (<div><p className="font-medium text-slate-900">{app.customerName}</p><p className="text-xs text-slate-500">Score {app.creditScore}</p></div>) },
    { key: "loanType", label: "Loan", render: (app) => (<div><p>{app.loanType}</p><p className="text-xs text-slate-500">{app.bankName}</p></div>) },
    { key: "amount", label: "Amount", render: (app) => formatCurrency(app.amount) },
    { key: "appliedAt", label: "Applied", render: (app) => formatDate(app.appliedAt) },
    { key: "status", label: "Status", render: (app) => (<Badge tone={statusTone(app.status)}>{app.status.replace("_", " ")}</Badge>) },
    { key: "action", label: "Action", render: (app) => (<Button variant="secondary" className="px-3 py-2" onClick={() => setSelectedApplication(app)}><Eye size={16}/>Review</Button>) }
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">CREDIT OPERATIONS</p>
          <h1 className="section-title mt-2">Application review</h1>
          <p className="mt-2 text-slate-500">Review applicant, PAN, credit, loan, and document details.</p>
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
        {loading ? <Loader /> : <Table columns={columns} data={filteredApplications} />}
      </div>

      <ApplicationReviewModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        setApplications={setApplications}
      />
    </div>
  );
}

function ApplicationReviewModal({ application, onClose, setApplications }) {
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  if (!application) return null;

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const updated = await approveApplicationApi(application.id);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
      toast("Application approved and loan account created.", "success");
      onClose();
    } catch (err) {
      toast(err.message || "Failed to approve application", "error");
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await rejectApplicationApi(application.id, reason);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
      toast("Application rejected.", "success");
      onClose();
    } catch (err) {
      toast(err.message || "Failed to reject application", "error");
    }
    setActionLoading(false);
  };

  return (
    <Modal open={Boolean(application)} onClose={onClose} title={`Review application #${application.id}`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Info label="Customer" value={application.customerName}/>
        <Info label="Email" value={application.email}/>
        <Info label="PAN" value={application.pan}/>
        <Info label="Credit score" value={application.creditScore}/>
        <Info label="Loan" value={`${application.loanType} · ${application.bankName}`}/>
        <Info label="Amount" value={formatCurrency(application.amount)}/>
        <Info label="Tenure" value={`${application.tenureMonths} months`}/>
        <Info label="Applied" value={formatDate(application.appliedAt)}/>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs uppercase text-slate-500">Purpose</p>
        <p className="mt-2 text-sm text-slate-700">{application.purpose}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
        <FileText size={18} className="text-indigo-600"/>
        {application.documentName}
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-slate-700">Rejection reason</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2"
          placeholder="Explain rejection reason"
        />
      </label>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="danger" loading={actionLoading} disabled={!reason.trim()} onClick={handleReject}>
          <XCircle size={17}/>Reject
        </Button>
        <Button loading={actionLoading} onClick={handleApprove}>
          <CheckCircle2 size={17}/>Approve
        </Button>
      </div>
    </Modal>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
