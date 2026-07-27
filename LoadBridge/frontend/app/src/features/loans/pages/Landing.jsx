import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CarFront,
  GraduationCap,
  Home,
  Landmark,
  LockKeyhole,
  Sparkles,
  Star,
  UsersRound,
  WalletCards,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../../shared/components/Button";
import EmiCalculator from "../components/EmiCalculator";
import LoanCard from "../components/LoanCard";
import { getLoanOffersApi } from "../services/loanService";

const loanProducts = [
  {
    title: "Personal Loan",
    icon: WalletCards,
    description: "Quick funds for personal needs",
  },
  {
    title: "Home Loan",
    icon: Home,
    description: "Finance your dream home",
  },
  {
    title: "Business Loan",
    icon: BriefcaseBusiness,
    description: "Grow your business confidently",
  },
  {
    title: "Education Loan",
    icon: GraduationCap,
    description: "Invest in higher education",
  },
  {
    title: "Vehicle Loan",
    icon: CarFront,
    description: "Drive home your next vehicle",
  },
  {
    title: "Loan Against Property",
    icon: Building2,
    description: "Unlock value from property",
  },
];

export default function LandingPage() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    getLoanOffersApi()
      .then((data) => setOffers(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-indigo-50/80 to-transparent" />

        <div className="page-shell relative grid gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
              <Sparkles size={15} />
              One place for your complete loan journey
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[58px] lg:leading-[1.08]">
              Compare loans. Apply smarter. Manage every EMI.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              LoanBridge helps you discover suitable loan offers, complete
              digital applications, track approvals, and manage repayments
              through one simple dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/loans">
                <Button className="px-6 py-3">
                  Explore loan offers
                  <ArrowRight size={17} />
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="secondary" className="px-6 py-3">
                  Check eligibility
                </Button>
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
              <TrustStat value="6+" label="Loan categories" />

              <TrustStat value="100%" label="Digital process" />

              <TrustStat value="24×7" label="Account access" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.13)] sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    LoanBridge recommendation
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                    Find your best match
                  </h2>
                </div>

                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Landmark />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {loanProducts
                  .slice(0, 4)
                  .map(({ title, icon: Icon }, index) => (
                    <Link
                      key={title}
                      to="/loans"
                      className={`rounded-2xl border p-4 transition hover:border-indigo-300 hover:bg-indigo-50 ${
                        index === 0
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          index === 0 ? "text-indigo-600" : "text-slate-500"
                        }
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        {title}
                      </p>
                    </Link>
                  ))}
              </div>
              <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Eligible amount
                    </p>

                    <p className="mt-1 text-3xl font-semibold">₹8,00,000</p>
                  </div>

                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Score 780
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Indicative EMI</span>

                  <span className="font-semibold">₹19,502/month</span>
                </div>
              </div>

              <Link to="/register">
                <Button className="mt-5 w-full py-3">
                  View personalised offers
                  <ArrowRight size={17} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Categories Section */}

      <section id="products" className="page-shell py-16">
        <div className="text-center">
          <p className="eyebrow">Explore products</p>

          <h2 className="section-title mt-2">Loans for every important goal</h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Choose a category and compare suitable offers without navigating
            through complicated banking pages.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loanProducts.map(({ title, icon: Icon, description }) => (
            <Link
              key={title}
              to="/loans"
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={22} />
              </span>

              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>

                <p className="mt-1 text-sm text-slate-500">{description}</p>

                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  Compare now
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Loan Offers */}

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="page-shell">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Recommended offers</p>

              <h2 className="section-title mt-2">
                Popular loans on LoanBridge
              </h2>
            </div>

            <Link
              to="/loans"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all offers →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <LoanCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}

      <section id="calculator" className="page-shell py-16">
        <div className="mb-7 text-center">
          <p className="eyebrow">Plan before you borrow</p>

          <h2 className="section-title mt-2">Calculate your EMI instantly</h2>
        </div>

        <EmiCalculator />
      </section>
      {/* Benefits Section */}

      <section id="benefits" className="bg-slate-900 py-16 text-white">
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
                Why LoanBridge
              </p>

              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                A clearer, more organised borrowing experience.
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                From discovering an offer to paying an EMI, each stage is
                available through one responsive and transparent interface.
              </p>

              <Link to="/register">
                <Button className="mt-7  text-slate-900">
                  Create free account
                  <ArrowRight size={17} />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  BadgeCheck,
                  "Compare transparently",
                  "Review rates, amount, tenure, eligibility, and fees.",
                ],
                [
                  Zap,
                  "Apply digitally",
                  "Submit details and one supporting document online.",
                ],
                [
                  UsersRound,
                  "Track every decision",
                  "Follow pending, approved, or rejected applications.",
                ],
                [
                  LockKeyhole,
                  "Manage repayments",
                  "View EMI schedules and complete mock payments.",
                ],
              ].map(([Icon, title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <Icon className="text-indigo-300" />

                  <h3 className="mt-4 font-semibold">{title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}

      <section className="page-shell py-16">
        <div className="grid gap-5 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={17} fill="currentColor" />
              ))}
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              Ready to simplify your loan journey?
            </h2>

            
          </div>

          <Link to="/register">
            <Button className="w-full px-6 py-3 sm:w-auto">
              Start with LoanBridge
              <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function TrustStat({ value, label }) {
  return (
    <div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
