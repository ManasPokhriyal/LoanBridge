export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({ order, user, onSuccess, onFailure }) {
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    window.setTimeout(() => {
      onSuccess({
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_demo_${Date.now()}`,
        razorpay_signature: "mock-signature",
      });
    }, 800);
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure(new Error("Razorpay checkout could not be loaded."));
    return;
  }

  const checkout = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "LoanBridge",
    description: "EMI payment",
    order_id: order.id,
    prefill: {
      name: user?.name || "",
      email: user?.email || "",
      contact: user?.phone || "",
    },
    theme: {
      color: "#4F46E5",
    },
    handler: (response) => {
      onSuccess(response);
    },
    payment_failed: (response) => {
      onFailure(new Error(response.error?.description || "Payment failed."));
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error("Payment was cancelled."));
      },
    },
  });

  checkout.open();
}
