import { useEffect, useRef, useState } from 'react';
import { FileUp, UserPlus, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useToast } from '../../../shared/components/Toast';
import { registerInit, registerConfirm, closeOtpModal, clearAuthError } from '../slices/authSlice';

// List of standard registration form fields
const FORM_FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'John Doe' },
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'john@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '9876543210' },
  { name: 'pan', label: 'PAN card number', type: 'text', placeholder: 'ABCDE1234F' },
  { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street, City' },
  { name: 'annualIncome', label: 'Annual income (₹)', type: 'number', placeholder: '500000' },
];

// Initial empty form state
const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  pan: '',
  address: '',
  annualIncome: '',
  employmentType: 'SALARIED',
  documentName: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get auth state from Redux store
  const { user, loading, error, otpModalOpen } = useSelector((state) => state.auth);

  // If user registration is complete and logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      toast('Registration completed successfully! Welcome to LoanBridge.', 'success');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, toast]);

  // Show toast notification if error occurs
  useEffect(() => {
    if (error) {
      toast(error, 'error');
    }
  }, [error, toast]);

  // Helper method to update form input fields
  const updateField = (field, value) => {
    setForm((previousForm) => ({ ...previousForm, [field]: value }));
  };

  // Step 1: Submit Form to Backend (Triggers PAN Verification & OTP Dispatch)
  const handleSubmitForm = (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    // Validate PAN format (5 uppercase letters, 4 digits, 1 uppercase letter)
    const panClean = form.pan.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panClean)) {
      toast('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).', 'error');
      return;
    }

    if (!form.documentName) {
      toast('Please upload a supporting document.', 'error');
      return;
    }

    // Call backend endpoint /api/auth/register-init (Port 8080)
    dispatch(registerInit({ ...form, pan: panClean }));
  };

  return (
    <section className="page-shell py-12">
      <form
        onSubmit={handleSubmitForm}
        className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-10"
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex rounded-2xl bg-indigo-500/10 p-3 text-indigo-600">
            <UserPlus size={28} />
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Create your LoanBridge Account
          </h1>

          <p className="mt-2 text-slate-500">
            Fill in your registration details below. Clicking <strong>Register</strong> will verify your PAN card and send a 4-digit OTP to your email.
          </p>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {FORM_FIELDS.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={(event) =>
                updateField(
                  field.name,
                  field.name === 'pan' ? event.target.value.toUpperCase() : event.target.value
                )
              }
              maxLength={field.name === 'pan' ? 10 : undefined}
              required
            />
          ))}

          {/* Employment Type Dropdown */}
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              Employment Type
            </span>
            <select
              value={form.employmentType}
              onChange={(event) => updateField('employmentType', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="SALARIED">SALARIED</option>
              <option value="SELF_EMPLOYED">SELF_EMPLOYED</option>
              <option value="BUSINESS">BUSINESS</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </label>

          {/* Supporting Document Upload */}
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">
              Supporting Document (Salary Slip / ID Proof)
            </span>
            <span className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-slate-600 hover:border-indigo-500 hover:bg-indigo-50/50">
              <FileUp size={20} className="text-indigo-600" />
              <span className="flex-1 font-medium">
                {form.documentName ? form.documentName : 'Click to select supporting document'}
              </span>
              {form.documentName && <CheckCircle2 size={18} className="text-emerald-600" />}
              <input
                className="hidden"
                type="file"
                onChange={(event) => updateField('documentName', event.target.files?.[0]?.name || '')}
              />
            </span>
          </label>
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="mt-6 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          className="mt-8 w-full py-3.5 text-base sm:w-auto"
        >
          Register & Send OTP
        </Button>

        {/* Login Link */}
        <p className="mt-6 text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>

      {/* Step 2: OTP Verification Modal Popup */}
      {otpModalOpen && (
        <OtpModal
          email={form.email}
          form={form}
          loading={loading}
        />
      )}
    </section>
  );
}

// Modal Component for 4-Digit OTP Verification
function OtpModal({ email, form, loading }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Focus first digit box when modal opens
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Handle digit input & auto-focus to next box
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace key to move focus to previous box
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Submit OTP to complete registration
  const handleVerifyOtp = (event) => {
    event.preventDefault();
    const enteredOtp = digits.join('');
    if (enteredOtp.length < 4) {
      toast('Please enter the full 4-digit OTP.', 'error');
      return;
    }

    // Call backend endpoint /api/auth/register-confirm (Port 8080)
    dispatch(
      registerConfirm({
        ...form,
        email: email,
        otp: enteredOtp,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600">
              <KeyRound size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Email OTP Verification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                PAN Verified successfully!
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(closeOtpModal())}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
          <p className="text-sm text-slate-600">
            A 4-digit OTP has been sent to <strong className="text-slate-900">{email}</strong>. Please enter it below to complete registration:
          </p>

          {/* 4 Digit Input Boxes */}
          <div className="flex justify-center gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-14 w-14 rounded-2xl border border-slate-300 bg-slate-50 text-center text-2xl font-bold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 text-base"
            >
              Verify OTP & Complete Registration
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-slate-500"
              onClick={() => dispatch(registerInit(form))}
            >
              Didn't receive code? Resend OTP
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
