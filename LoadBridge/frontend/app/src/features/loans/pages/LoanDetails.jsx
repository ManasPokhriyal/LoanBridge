import { useEffect, useState } from "react";
import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Loader from "../../../shared/components/Loader";
import { formatCurrency } from "../../../shared/utils/formatters";
import EmiCalculator from "../components/EmiCalculator";
import { getLoanOfferApi } from "../services/loanService";

export default function LoanDetails() {
  const { id } = useParams();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoanOfferApi(id).then(data => { setSelectedOffer(data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading || !selectedOffer) {
    return <Loader />;
  }

  return (
    <section className="page-shell py-12">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr]">

        {/* Loan Information Card */}
        <div className="glass rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <Badge tone="info">
              {selectedOffer.bankName}
            </Badge>

            <span className="text-sm text-slate-500">
              Offer #{selectedOffer.id}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold">
            {selectedOffer.loanType}
          </h1>

          <p className="mt-3 text-slate-500">
            Flexible financing with transparent pricing and a
            digital application journey.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Info
              label="Interest rate"
              value={`${selectedOffer.interestRate}% p.a.`}
            />

            <Info
              label="Maximum amount"
              value={formatCurrency(selectedOffer.maxAmount)}
            />

            <Info
              label="Maximum tenure"
              value={`${selectedOffer.tenureMonths} months`}
            />

            <Info
              label="Minimum credit score"
              value={selectedOffer.creditRequirement}
            />

            <Info
              label="Processing fee"
              value={`${selectedOffer.processingFee}%`}
            />
          </div>

          <div className="mt-7 space-y-3">
            {[
              "Instant digital application",
              "No hidden charges in demo flow",
              "Secure document metadata handling",
            ].map((feature) => (
              <p
                key={feature}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />
                {feature}
              </p>
            ))}
          </div>

          <Link to={`/loans/${selectedOffer.id}/apply`}>
            <Button className="mt-8 w-full sm:w-auto">
              <FileText size={17} />
              Apply now
            </Button>
          </Link>
        </div>
        
       
      </div>

      {/* EMI Calculator */}
      <div className="mt-8">
        <EmiCalculator
          defaultRate={selectedOffer.interestRate}
          defaultAmount={
            Math.min(
              500000,
              selectedOffer.maxAmount
            )
          }
          defaultTenure={
            Math.min(
              36,
              selectedOffer.tenureMonths
            )
          }
        />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}
