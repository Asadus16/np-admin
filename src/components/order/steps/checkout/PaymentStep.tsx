"use client";

import Link from "next/link";
import { CreditCard, Banknote, Coins, Loader2 } from "lucide-react";
import { PaymentStepProps } from "../../types";

export function PaymentStep({
  paymentMethods,
  paymentType,
  onPaymentTypeChange,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  pointsBalance,
  pointsToRedeem,
  pointsDiscount,
  onPointsPaymentSelect,
  onClearPoints,
  isFullyPaidWithPoints,
  pointsRemainingPayment,
  onPointsRemainingPaymentChange,
  couponCode,
  onCouponCodeChange,
  appliedCoupon,
  couponError,
  couponLoading,
  onApplyCoupon,
  onRemoveCoupon,
  notes,
  onNotesChange,
  formatCurrency,
  remainingAmount,
}: PaymentStepProps) {
  const showCardSelection = paymentType === "card" ||
    (paymentType === "points" && !isFullyPaidWithPoints && pointsRemainingPayment === "card");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => {
              onPaymentTypeChange("card");
              onClearPoints();
            }}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              paymentType === "card"
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900">Pay with Card</span>
            </div>
          </button>

          <button
            onClick={() => {
              onPaymentTypeChange("cash");
              onClearPoints();
            }}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              paymentType === "cash"
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900">Cash on Delivery</span>
            </div>
          </button>

          {pointsBalance && pointsBalance.available_points > 0 && (
            <button
              onClick={onPointsPaymentSelect}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                paymentType === "points"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Redeem Points</span>
                </div>
                <span className="text-sm text-gray-500">{pointsBalance.available_points.toLocaleString()} pts</span>
              </div>
            </button>
          )}
        </div>

        {/* Points remaining payment options */}
        {paymentType === "points" && !isFullyPaidWithPoints && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Your points cover <span className="font-medium">{formatCurrency(pointsDiscount)}</span>.
              Pay remaining <span className="font-medium">{formatCurrency(remainingAmount)}</span> with:
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPointsRemainingPaymentChange("card")}
                className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  pointsRemainingPayment === "card"
                    ? "border-gray-900 bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => onPointsRemainingPaymentChange("cash")}
                className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  pointsRemainingPayment === "cash"
                    ? "border-gray-900 bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Cash on Delivery
              </button>
            </div>
          </div>
        )}

        {showCardSelection && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Select a saved card</p>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-6 border border-gray-200 rounded-lg">
                <CreditCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 mb-3">No cards saved</p>
                <Link
                  href="/customer/settings/payments"
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  Add a card
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => onSelectPaymentMethod(pm.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPaymentMethod === pm.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} **** {pm.last4}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires {pm.expiry_month}/{pm.expiry_year}
                        </p>
                      </div>
                      {pm.is_default && (
                        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            placeholder="Enter coupon code"
            disabled={!!appliedCoupon}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
          />
          {appliedCoupon ? (
            <button
              onClick={onRemoveCoupon}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={onApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </button>
          )}
        </div>
        {couponError && <p className="text-sm text-red-600 mt-1">{couponError}</p>}
        {appliedCoupon && (
          <p className="text-sm text-green-600 mt-1">
            Coupon applied! You save {formatCurrency(appliedCoupon.discount)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any special instructions for the technician..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          rows={3}
        />
      </div>
    </div>
  );
}
