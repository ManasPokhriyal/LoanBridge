import { Landmark, LockKeyhole, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Loan Offers", path: "/loans" },
  { label: "Customer Login", path: "/login" },
  { label: "Create Account", path: "/register" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Landmark size={18} />
            </span>
            <span className="text-lg font-bold text-slate-900">
              Loan<span className="text-indigo-600">Bridge</span>
            </span>
          </div>
          
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Quick links</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path} className="block hover:text-indigo-600">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Support</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p className="flex items-center gap-2">
              <Phone size={15} />
              1800-000-2026
            </p>
            <p className="flex items-center gap-2">
              <Mail size={15} />
              support@loanbridge.demo
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        </div>
      </div>
    </footer>
  );
}
