import {
  ChevronDown,
  Landmark,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { logout } from "../../features/auth/slices/authSlice";

const userLinks = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/loans", label: "Loan Offers" },
  { to: "/applications", label: "My Applications" },
  { to: "/emi-schedule", label: "EMI Schedule" },
];

const adminLinks = [
  { to: "/admin", label: "Admin Dashboard", end: true },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/loan-accounts", label: "Loan Accounts" },
];

const publicLinks = [
  { to: "/loans", label: "Loans" },
  { to: "/#products", label: "Explore Products", anchor: true },
  { to: "/#calculator", label: "EMI Calculator", anchor: true },
  { to: "/#benefits", label: "Why LoanBridge", anchor: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navigationLinks = user?.role === "ADMIN" ? adminLinks : user ? userLinks : publicLinks;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="page-shell flex h-[68px] items-center justify-between">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Landmark size={21} />
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Loan<span className="text-indigo-600">Bridge</span>
          </span>
        </Link>
        {!user && (
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            {navigationLinks.map((item) =>
              item.anchor ? (
                <a key={item.label} href={item.to.slice(1)} className="flex items-center gap-1 hover:text-indigo-600">
                  {item.label}
                  {item.label === "Loans" && <ChevronDown size={14} />}
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "text-indigo-600" : "hover:text-indigo-600")}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        )}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                {user.role === "ADMIN" ? <ShieldCheck size={17} className="text-indigo-600" /> : <UserRound size={17} className="text-indigo-600" />}
                <div className="text-xs leading-tight">
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-slate-500">{user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="hidden px-3 sm:inline-flex">
                <LogOut size={17} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((previous) => !previous)} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {user && (
        <div className="hidden border-t border-slate-100 bg-white lg:block">
          <nav className="page-shell flex h-12 items-center gap-8">
            {navigationLinks.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `relative flex h-full items-center text-sm font-semibold transition ${isActive ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="page-shell space-y-1 py-3">
            {navigationLinks.map((item) =>
              item.anchor ? (
                <a key={item.label} href={item.to.slice(1)} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"}`}>
                  {item.label}
                </NavLink>
              )
            )}
            {!user ? (
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <Link to="/login">
                  <Button variant="secondary" className="w-full">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            ) : (
              <Button variant="secondary" onClick={handleLogout} className="mt-2 w-full">
                <LogOut size={17} />
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
