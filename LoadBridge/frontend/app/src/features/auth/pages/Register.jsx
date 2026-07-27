import { useEffect, useState } from 'react';
import { FileUp, UserPlus, BadgeCheck, SearchCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useToast } from '../../../shared/components/Toast';
import { registerUser, verifyPan } from '../slices/authSlice';

const REGISTER_FIELDS = [
  { name: 'name', label: 'Full name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'phone', label: 'Phone number', type: 'tel' },
  { name: 'aadhaar', label: 'Aadhaar number', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'annualIncome', label: 'Annual income', type: 'number' },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  pan: '',
  aadhaar: '',
  address: '',
  employmentType: 'SALARIED',
  annualIncome: '',
  documentName: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, loading, error, panResult } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;
    toast('Registration completed successfully.', 'success');
    navigate('/dashboard', { replace: true });
  }, [user, navigate, toast]);

  const updateField = (field, value) => {
    setForm((previousForm) => ({ ...previousForm, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!panResult?.verified) {
      toast('Verify PAN before registration.', 'error');
      return;
    }

    if (!form.documentName) {
      toast('Upload one supporting document.', 'error');
      return;
    }

    dispatch(
      registerUser({
        ...form,
        creditScore: panResult.creditScore,
        name: form.name || panResult.name,
      })
    );
  };

  return (
    <section className="page-shell py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-10"
      >
        <div className="mb-8">
          <div className="inline-flex rounded-2xl bg-indigo-500/10 p-3 text-indigo-600">
            <UserPlus />
          </div>

          <h1 className="mt-4 text-3xl font-semibold">
            Create your LoanBridge account
          </h1>

          <p className="mt-2 text-slate-500">
            Verify PAN, enter personal details, and upload one supporting document.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-4 font-medium text-slate-900">
            Step 1 · PAN verification
          </h2>

          <PanVerification
            pan={form.pan}
            setPan={(value) => updateField('pan', value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {REGISTER_FIELDS.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              value={form[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              required
            />
          ))}

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              Employment type
            </span>
            <select
              value={form.employmentType}
              onChange={(event) => updateField('employmentType', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3"
            >
              <option>SALARIED</option>
              <option>SELF_EMPLOYED</option>
              <option>BUSINESS</option>
              <option>STUDENT</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              Supporting document (any type)
            </span>
            <span className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-slate-500 hover:border-indigo-500">
              <FileUp size={18} />
              {form.documentName || 'Choose file'}
              <input
                className="hidden"
                type="file"
                onChange={(event) => updateField('documentName', event.target.files?.[0]?.name || '')}
              />
            </span>
          </label>
        </div>

        {error && (
          <p className="mt-5 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          className="mt-8 w-full sm:w-auto"
        >
          Create account
        </Button>

        <p className="mt-5 text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}

function PanVerification({ pan, setPan }) {
  const dispatch = useDispatch();
  const { panResult, panLoading } = useSelector((state) => state.auth);

  const handleVerifyPan = () => {
    dispatch(verifyPan(pan));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="PAN number"
            value={pan}
            onChange={(event) => setPan(event.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>
        <Button className="mt-7" onClick={handleVerifyPan} loading={panLoading}>
          <SearchCheck size={17} />
          Verify
        </Button>
      </div>
      {panResult?.verified && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <BadgeCheck className="mt-0.5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-700">
              PAN verified successfully
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {panResult.name} · Credit score {panResult.creditScore}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
