import { useEffect, useState } from 'react';
import { FileCheck2, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Loader from '../../../shared/components/Loader';
import { useToast } from '../../../shared/components/Toast';
import { getLoanOfferApi, applyLoanApi } from '../services/loanService';

export default function ApplyLoan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    amount: '',
    tenureMonths: '36',
    purpose: '',
    documentName: '',
  });

  useEffect(() => {
    getLoanOfferApi(id).then(data => { setSelectedOffer(data); setLoading(false); });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.documentName) {
      toast('Upload one supporting document.', 'error');
      return;
    }

    setApplyLoading(true);
    try {
      await applyLoanApi({ ...form, offerId: selectedOffer.id });
      toast('Loan application submitted.', 'success');
      navigate('/applications');
    } catch (err) {
      setError(err.message);
    }
    setApplyLoading(false);
  };

  if (loading || !selectedOffer) {
    return <Loader />;
  }

  return (
    <section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-sm font-medium text-indigo-600">
            {selectedOffer.bankName}
          </p>

          <h1 className="section-title mt-2">
            Apply for {selectedOffer.loanType}
          </h1>

          <p className="mt-2 text-slate-500">
            Complete this demo application. No real credit enquiry will be generated.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Requested amount"
              type="number"
              min="10000"
              max={selectedOffer.maxAmount}
              value={form.amount}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  amount: e.target.value,
                }))
              }
              required
            />

            <Input
              label="Tenure (months)"
              type="number"
              min="6"
              max={selectedOffer.tenureMonths}
              value={form.tenureMonths}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  tenureMonths: e.target.value,
                }))
              }
              required
            />

            <label className="sm:col-span-2 block space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                Loan purpose
              </span>

              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 outline-none focus:border-indigo-500"
                value={form.purpose}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    purpose: e.target.value,
                  }))
                }
                required
              />
            </label>

            <label className="sm:col-span-2 block space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                Supporting document
              </span>

              <span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-slate-500 hover:border-indigo-500">
                <Upload size={18} />
                {form.documentName || 'Upload any document type'}

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      documentName: e.target.files?.[0]?.name || '',
                    }))
                  }
                />
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={applyLoading}
            >
              <FileCheck2 size={17} />
              Submit application
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
