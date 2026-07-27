import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import Input from "../../../shared/components/Input";
import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";
import LoanCard from "../components/LoanCard";
import { getLoanOffersApi } from "../services/loanService";

export default function LoanMarketplace() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getLoanOffersApi().then(data => { setOffers(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const searchableText = `${offer.bankName} ${offer.loanType}`.toLowerCase();
      return searchableText.includes(searchQuery.toLowerCase());
    });
  }, [offers, searchQuery]);

  return (
    <section className="page-shell py-10 sm:py-12">
      {/* Header Section */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-8 sm:px-9">
        <p className="eyebrow">
          Compare & choose
        </p>

        <h1 className="section-title mt-2">
          Find the right loan offer
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Compare transparent demo offers from leading lenders by
          interest rate, amount, tenure, and eligibility.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            label="Search offers"
            aria-label="Search offers"
            placeholder="Search bank or loan type"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <SlidersHorizontal size={17} />
          {filteredOffers.length} offers found
        </div>
      </div>

      {/* Loan Offers Result */}
      {loading ? (
        <Loader label="Finding the best offers..." />
      ) : filteredOffers.length ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer) => (
            <LoanCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No matching offers"
            description="Try another bank name or loan category."
          />
        </div>
      )}
    </section>
  );
}
