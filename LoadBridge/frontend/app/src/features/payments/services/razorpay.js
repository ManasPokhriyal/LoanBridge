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
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure(new Error("Razorpay checkout script could not be loaded."));
    return;
  }

  const razorpayOrderId = order.orderId || order.id;
  const keyId = order.key || import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Convert Rupees to Paise for Razorpay Checkout JS API (1 INR = 100 Paise)
  const amountInPaise = Math.round(Number(order.amount) * 100);

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency: order.currency || "INR",
    name: "LoanBridge",
    description: "Monthly EMI Payment",
    order_id: razorpayOrderId,
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
  };

  const checkout = new window.Razorpay(options);
  checkout.open();
}
