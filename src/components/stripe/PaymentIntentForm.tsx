"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

interface PaymentIntentFormProps {
  returnUrl: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function PaymentIntentForm({
  returnUrl,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}: PaymentIntentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleLoadError = (event: { elementType?: string; error?: { message?: string } }) => {
    const msg = event?.error?.message || "Payment form could not load.";
    setLoadError(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setIsSubmitting(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
          <p className="text-sm text-red-700 font-medium">Payment form error</p>
          <p className="text-sm text-red-600">{loadError}</p>
          {loadError.toLowerCase().includes("invalid api key") && (
            <div className="text-xs text-red-600 bg-red-100/80 rounded p-2 mt-2">
              <p className="font-medium mt-1">Fix: use the current publishable key from Stripe.</p>
              <ol className="list-decimal list-inside mt-1 space-y-0.5">
                <li>Stripe Dashboard → Developers → API keys (Test mode).</li>
                <li>Under Standard, copy the <strong>Publishable key</strong> (pk_test_…).</li>
                <li>In backend <code className="bg-red-200/60 px-0.5 rounded">.env</code>, set <code className="bg-red-200/60 px-0.5 rounded">STRIPE_KEY</code>= that value (same account as <code className="bg-red-200/60 px-0.5 rounded">STRIPE_SECRET</code>).</li>
                <li>Run <code className="bg-red-200/60 px-0.5 rounded">php artisan config:clear</code>, restart Laravel, then refresh and click Pay again.</li>
              </ol>
            </div>
          )}
        </div>
      )}
      <PaymentElement options={{ layout: "tabs" }} onLoadError={handleLoadError} />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Pay
        </button>
      </div>
    </form>
  );
}
