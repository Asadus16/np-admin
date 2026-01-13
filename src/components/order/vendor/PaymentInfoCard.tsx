"use client";

import { CreditCard, Banknote, Wallet } from "lucide-react";
import { PaymentInfoCardProps } from "./types";

export function PaymentInfoCard({
  paymentType,
  paymentStatus,
  paymentMethod,
}: PaymentInfoCardProps) {
  const getPaymentIcon = () => {
    switch (paymentType) {
      case "card":
        return <CreditCard className="h-4 w-4 text-gray-400" />;
      case "cash":
        return <Banknote className="h-4 w-4 text-gray-400" />;
      case "wallet":
        return <Wallet className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getPaymentMethodDisplay = () => {
    if (paymentType === "card" && paymentMethod) {
      return `${paymentMethod.brand} •••• ${paymentMethod.last4}`;
    }
    if (paymentType === "cash") return "Cash on delivery";
    return "Wallet";
  };

  const getStatusBadge = () => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    const className = statusClasses[paymentStatus as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${className}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-medium text-gray-900">Payment</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Method</span>
          <div className="flex items-center gap-2">
            {getPaymentIcon()}
            <span className="text-sm font-medium text-gray-900">
              {getPaymentMethodDisplay()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
}
