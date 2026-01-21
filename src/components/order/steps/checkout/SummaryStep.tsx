"use client";

import { SummaryStepProps } from "../../types";

export function SummaryStep({
  vendorDetails,
  selectedItems,
  selectedAddress,
  orderType,
  selectedDate,
  selectedTime,
  recurringFrequency,
  paymentType,
  selectedPaymentMethod,
  pointsToRedeem,
  pointsDiscount,
  isFullyPaidWithPoints,
  pointsRemainingPayment,
  appliedCoupon,
  notes,
  subtotal,
  tax,
  total,
  vatSettings,
  formatCurrency,
}: SummaryStepProps) {
  const getPaymentDescription = () => {
    if (paymentType === "points") {
      if (isFullyPaidWithPoints) {
        return "Fully Paid with Points";
      }
      const remainingMethod = pointsRemainingPayment === "card" && selectedPaymentMethod
        ? `${selectedPaymentMethod.brand.charAt(0).toUpperCase() + selectedPaymentMethod.brand.slice(1)} **** ${selectedPaymentMethod.last4}`
        : "Cash on Delivery";
      return `${pointsToRedeem.toLocaleString()} Points + ${remainingMethod}`;
    }
    if (paymentType === "card" && selectedPaymentMethod) {
      return `${selectedPaymentMethod.brand.charAt(0).toUpperCase() + selectedPaymentMethod.brand.slice(1)} **** ${selectedPaymentMethod.last4}`;
    }
    return "Cash on Delivery";
  };

  const getScheduleDescription = () => {
    if (orderType === "now") {
      return "As soon as possible";
    }
    if (orderType === "recurring") {
      return `${selectedDate} at ${selectedTime} (${recurringFrequency})`;
    }
    return `${selectedDate} at ${selectedTime}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Vendor</p>
          <p className="font-medium text-gray-900">{vendorDetails?.name}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">Services</p>
          {selectedItems.map((item) => (
            <div key={item.subService.id} className="flex justify-between text-sm py-1">
              <span>
                {item.subService.name}
                {item.quantity > 1 && <span className="text-gray-500"> x{item.quantity}</span>}
              </span>
              <span className="font-medium">
                {formatCurrency(
                  (typeof item.subService.price === 'string'
                    ? parseFloat(item.subService.price)
                    : item.subService.price) * item.quantity
                )}
              </span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Address</p>
          <p className="text-sm text-gray-900">
            {selectedAddress?.street_address}, {selectedAddress?.city}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Schedule</p>
          <p className="text-sm text-gray-900">{getScheduleDescription()}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Payment</p>
          <p className="text-sm text-gray-900">{getPaymentDescription()}</p>
        </div>

        {notes && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-900">{notes}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-{formatCurrency(appliedCoupon.discount)}</span>
            </div>
          )}
          {vatSettings && vatSettings.vat_enabled && tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT ({vatSettings.vat_rate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          {pointsToRedeem > 0 && (
            <div className="flex justify-between text-sm text-amber-600">
              <span>Points Redeemed ({pointsToRedeem.toLocaleString()} pts)</span>
              <span>-{formatCurrency(pointsDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
            <span>Total to Pay</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
