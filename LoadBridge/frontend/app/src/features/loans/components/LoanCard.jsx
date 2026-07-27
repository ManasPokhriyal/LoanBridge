import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  Clock3,
  Gauge,
} from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import { formatCurrency } from "../../../shared/utils/formatters";

export default function LoanCard({ offer }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Building2 size={21} />
        </div>
        {offer.featured && <Badge tone="info">Popular choice</Badge>}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {offer.loanType}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{offer.bankName}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Gauge size={14} />
            Interest
          </span>
          <p className="mt-1 font-semibold text-slate-900">
            {offer.interestRate}% p.a.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock3 size={14} />
            Tenure
          </span>
          <p className="mt-1 font-semibold text-slate-900">
            Up to {offer.tenureMonths} mo
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
        <BadgeIndianRupee size={16} className="text-indigo-600" />
        <span>Up to {formatCurrency(offer.maxAmount)}</span>
      </div>

      <Link to={`/loans/${offer.id}`} className="mt-5 block">
        <Button
          variant="secondary"
          className="w-full group-hover:border-indigo-300 group-hover:bg-indigo-50"
        >
          View offer
          <ArrowRight size={16} />
        </Button>
      </Link>
    </article>
  );
}
