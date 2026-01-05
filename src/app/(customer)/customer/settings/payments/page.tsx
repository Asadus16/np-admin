"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Loader2, AlertCircle, X, ShieldCheck, Wifi } from "lucide-react";
import {
  getPaymentMethods,
  createSetupIntent,
  attachPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  PaymentMethod,
} from "@/lib/paymentMethod";
import StripeProvider from "@/components/stripe/StripeProvider";
import CardForm from "@/components/stripe/CardForm";

// Card brand configurations with logos (all cards use gray gradient)
const cardBrandLogos: Record<string, string> = {
  visa: "VISA",
  mastercard: "mastercard",
  amex: "AMEX",
  discover: "DISCOVER",
  diners: "DINERS",
  jcb: "JCB",
  unionpay: "UnionPay",
};

function CreditCardDisplay({
  paymentMethod,
  onSetDefault,
  onRemove,
  isSubmitting,
}: {
  paymentMethod: PaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
  isSubmitting: boolean;
}) {
  const brandKey = paymentMethod.brand.toLowerCase();
  const logo = cardBrandLogos[brandKey] || paymentMethod.brand.toUpperCase();

  return (
    <div className="relative group">
      {/* Credit Card */}
      <div
        className="relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
      >
        {/* Card Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Card Content */}
        <div className="relative h-full flex flex-col justify-between text-white">
          {/* Top Row - Chip, Contactless, Default Badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* EMV Chip */}
              <div className="w-10 h-7 sm:w-12 sm:h-8 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                <div className="w-7 h-5 sm:w-8 sm:h-6 border border-yellow-700/30 rounded-sm grid grid-cols-3 gap-px p-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-yellow-600/40 rounded-sm" />
                  ))}
                </div>
              </div>
              {/* Contactless Icon */}
              <Wifi className="w-5 h-5 sm:w-6 sm:h-6 rotate-90 opacity-80" />
            </div>
            {/* Default Badge */}
            {paymentMethod.is_default && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Default
              </span>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <p className="text-lg sm:text-xl tracking-[0.2em] font-mono">
              •••• •••• •••• {paymentMethod.last4}
            </p>
          </div>

          {/* Bottom Row - Expiry and Brand */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] sm:text-xs uppercase opacity-70 mb-0.5">Valid Thru</p>
              <p className="text-sm sm:text-base font-mono tracking-wider">
                {paymentMethod.expiry_month}/{paymentMethod.expiry_year.slice(-2)}
              </p>
            </div>
            {/* Brand Logo */}
            <div className="text-right">
              {brandKey === "mastercard" ? (
                <div className="flex items-center gap-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-full opacity-90" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-500 rounded-full -ml-3 opacity-90" />
                </div>
              ) : (
                <span className="text-xl sm:text-2xl font-bold italic tracking-tight">
                  {logo}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Below Card */}
      <div className="flex items-center justify-end gap-2 mt-3">
        {!paymentMethod.is_default && (
          <button
            onClick={onSetDefault}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            Set Default
          </button>
        )}
        <button
          onClick={onRemove}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddCard = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await createSetupIntent();
      setClientSecret(response.data.client_secret);
      setShowAddCard(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize card setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardAdded = async (paymentMethodId: string) => {
    try {
      await attachPaymentMethod(paymentMethodId);
      await fetchPaymentMethods();
      setShowAddCard(false);
      setClientSecret(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAddCard = () => {
    setShowAddCard(false);
    setClientSecret(null);
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsSubmitting(true);
      await setDefaultPaymentMethod(id);
      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this card?")) return;

    try {
      setIsSubmitting(true);
      await deletePaymentMethod(id);
      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove card");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved payment methods</p>
        </div>
        <button
          onClick={handleOpenAddCard}
          disabled={isSubmitting || showAddCard}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting && !showAddCard ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Card
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Add Card Form with Stripe Elements */}
      {showAddCard && clientSecret && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Card</h2>
          <StripeProvider clientSecret={clientSecret}>
            <CardForm
              onSuccess={handleCardAdded}
              onCancel={handleCancelAddCard}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </StripeProvider>
        </div>
      )}

      {/* Payment Methods Grid */}
      {paymentMethods.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          {/* Empty State Card Preview */}
          <div className="relative w-64 aspect-[1.586/1] bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl mx-auto mb-6 shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="relative h-full flex flex-col justify-between p-4 text-white/50">
              <div className="w-10 h-7 bg-gray-200/30 rounded-md" />
              <p className="text-lg tracking-[0.2em] font-mono">•••• •••• •••• ••••</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase opacity-50">Valid Thru</p>
                  <p className="text-sm font-mono">MM/YY</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 mb-4">No payment methods saved</p>
          <button
            onClick={handleOpenAddCard}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paymentMethods.map((pm) => (
            <CreditCardDisplay
              key={pm.id}
              paymentMethod={pm}
              onSetDefault={() => handleSetDefault(pm.id)}
              onRemove={() => handleRemove(pm.id)}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Security Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Secure Payment Processing</p>
            <p className="text-xs text-gray-500 mt-1">
              Your payment information is securely processed by Stripe. We never store your full card number, CVV, or sensitive card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
