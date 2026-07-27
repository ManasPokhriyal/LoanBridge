import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useToast } from '../../../shared/components/Toast';
import { loginUser } from '../slices/authSlice';

export default function Login() {
  const [form, setForm] = useState({
    email: 'user@loanbridge.com',
    password: 'User@123',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      toast('Welcome back to LoanBridge.', 'success');

      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', {
        replace: true,
      });
    }
  }, [user, navigate, toast]);

  const submit = (event) => {
    event.preventDefault();

    dispatch(loginUser(form));
  };

  const useDemo = (role) => {
    if (role === 'ADMIN') {
      setForm({
        email: 'admin@loanbridge.com',
        password: 'Admin@123',
      });
    } else {
      setForm({
        email: 'user@loanbridge.com',
        password: 'User@123',
      });
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] lg:grid-cols-[.9fr_1.1fr]">

        {/* Left Information Section */}
        <div className="relative hidden overflow-hidden bg-slate-900 p-10 text-white lg:block">
          
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            
            <div>
              {/* Icon */}
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-indigo-300">
                <ShieldCheck />
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Your complete loan journey, in one dashboard.
              </h1>

              {/* Description */}
              <p className="mt-4 leading-7 text-slate-300">
                Compare loan offers, apply digitally, track your application,
                and manage your loan repayments through one simple platform.
              </p>

              {/* Application Features */}
              <div className="mt-8 space-y-3">
                
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />
                  Compare loan offers from multiple banks
                </p>

                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />
                  Apply for loans and track application status
                </p>

                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />
                  Manage loan accounts, EMIs, and repayments
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* Login Form Section */}
        <form
          onSubmit={submit}
          className="p-7 sm:p-10 lg:p-12"
        >

          {/* Login Header */}
          <div className="mb-7">
            
            <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <KeyRound />
            </div>

            <h2 className="text-3xl font-semibold text-slate-900">
              Welcome back
            </h2>

          </div>

          {/* Login Fields */}
          <div className="space-y-4">

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
              required
            />

            {/* Error Message */}
            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3"
            >
              Sign in
              <ArrowRight size={17} />
            </Button>

          </div>

          {/* Account Type Selection */}
<div className="my-6 flex items-center gap-3 text-xs font-medium text-slate-400">
  <span className="h-px flex-1 bg-slate-200" />
  SELECT ACCOUNT TYPE
  <span className="h-px flex-1 bg-slate-200" />
</div>
          <div className="grid gap-3 sm:grid-cols-2">

            <Button
              type="button"
              variant="secondary"
              onClick={() => useDemo('USER')}
            >
              Use Customer
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => useDemo('ADMIN')}
            >
              Use Admin
            </Button>

          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New to LoanBridge?{' '}

            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create account
            </Link>
          </p>

        </form>
      </div>
    </section>
  );
}
