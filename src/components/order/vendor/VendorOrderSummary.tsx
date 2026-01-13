"use client";

import { Package } from "lucide-react";
import { VendorOrderSummaryProps } from "./types";
import { formatCurrency } from "@/lib/vendorOrder";

export function VendorOrderSummary({
  items,
  subtotal,
  discountAmount,
  couponCode,
  tax,
  total,
}: VendorOrderSummaryProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">{item.sub_service_name}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x {formatCurrency(item.unit_price)}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(item.total_price)}
            </span>
          </div>
        ))}

        <div className="pt-3 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Discount {couponCode && `(${couponCode})`}
              </span>
              <span className="text-green-600">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">VAT (5%)</span>
            <span className="text-gray-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
