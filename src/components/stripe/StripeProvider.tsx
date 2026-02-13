"use client";

import { ReactNode, useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { API_BASE_URL } from "@/config";

function sanitizeKey(raw: string): string {
  return raw.replace(/[\s\r\n'"`]/g, "").trim();
}

function isValidPublishableKey(key: string): boolean {
  return !!(key && (key.startsWith("pk_test_") || key.startsWith("pk_live_")));
}

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initStripe() {
      const envKey = sanitizeKey(process.env.NEXT_PUBLIC_STRIPE_KEY || "");
      try {
        const baseUrl = (API_BASE_URL || "").trim().replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/config/stripe`);
        const data = await res.json().catch(() => ({}));
        const backendKey = sanitizeKey(data.publishableKey || "");

        if (cancelled) return;

        const keyToUse = isValidPublishableKey(backendKey) ? backendKey : envKey;
        if (isValidPublishableKey(keyToUse)) {
          setStripePromise(loadStripe(keyToUse));
          setError(null);
        } else {
          setError(
            "Stripe publishable key not configured. Set STRIPE_KEY in backend .env (and optionally NEXT_PUBLIC_STRIPE_KEY in frontend .env), then restart both servers."
          );
        }
      } catch {
        if (cancelled) return;
        const fallback = isValidPublishableKey(envKey) ? envKey : "";
        if (fallback) {
          setStripePromise(loadStripe(fallback));
          setError(null);
        } else {
          setError(
            "Could not load Stripe config from backend. Ensure STRIPE_KEY is set in backend .env and the API is reachable, or set NEXT_PUBLIC_STRIPE_KEY in frontend .env."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initStripe();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasValidClientSecret =
    typeof clientSecret === "string" && clientSecret.trim().length > 0;
  const options = hasValidClientSecret
    ? {
        clientSecret: clientSecret!.trim(),
        appearance: {
          theme: "stripe" as const,
          variables: {
            colorPrimary: "#111827",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorDanger: "#dc2626",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "8px",
          },
        },
      }
    : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm text-gray-500">Loading payment form…</p>
      </div>
    );
  }

  if (error || !stripePromise) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Stripe not configured</p>
        <p className="mt-1">{error || "Missing publishable key."}</p>
      </div>
    );
  }

  if (clientSecret !== undefined && !hasValidClientSecret) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-medium">Payment session invalid</p>
        <p className="mt-1">Missing or invalid payment data. Please close and try Pay again.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
