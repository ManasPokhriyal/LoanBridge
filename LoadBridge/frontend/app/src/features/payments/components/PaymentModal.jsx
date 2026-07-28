import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import { useToast } from "../../../shared/components/Toast";
import { openRazorpayCheckout } from "../services/razorpay";
import { formatCurrency } from "../../../shared/utils/formatters";
import { createOrderApi, verifyPaymentApi } from "../services/paymentService";

export default function PaymentModal({ open, onClose, account, onPaymentSuccess }) {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  if (!account) {
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      const paymentOrder = await createOrderApi({
        amount: account.monthlyEmi,
        loanAccountId: account.id,
      });

      openRazorpayCheckout({
        order: paymentOrder,
        user,
        onFailure: (error) => {
          toast(error.message, "error");
        },
        onSuccess: async (result) => {
          try {
            await verifyPaymentApi({
              ...result,
              loanAccountId: account.id,
              amount: account.monthlyEmi,
              method: paymentMethod,
            });

            toast("EMI payment completed successfully.", "success");
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }
            onClose();
          } catch (error) {
            toast(error.message || "Payment verification failed.", "error");
          }
        },
      });
    } catch (error) {
      toast(error.message || "Could not create payment order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pay monthly EMI"
      maxWidth="max-w-lg"
    >
      <div className="rounded-2xl bg-indigo-500/10 p-5 text-center">
        <p className="text-sm text-indigo-700">Amount payable</p>
        <p className="mt-1 text-3xl font-semibold">
          {formatCurrency(account.monthlyEmi)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Loan account #{account.id}
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium">Choose payment method</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["UPI", Smartphone],
            ["CARD", CreditCard],
            ["NET_BANKING", Landmark],
          ].map(([methodName, Icon]) => (
            <button
              type="button"
              key={methodName}
              onClick={() => setPaymentMethod(methodName)}
              className={`rounded-xl border p-4 text-center text-xs transition ${
                paymentMethod === methodName
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-700"
                  : "border-slate-300 text-slate-500 hover:border-slate-600"
              }`}
            >
              <Icon className="mx-auto mb-2" size={20} />
              {methodName.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handlePayment} loading={loading} className="mt-6 w-full">
        Pay securely
      </Button>
    </Modal>
  );
}
