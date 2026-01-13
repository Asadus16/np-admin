"use client";

import { OrderItemsListProps } from "./types";
import { formatCurrency } from "./helpers/orderFormatters";

export function OrderItemsList({
  items,
  subtotal,
  discountAmount,
  couponCode,
  tax,
  total,
}: OrderItemsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Services</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.sub_service_name}</p>
              <p className="text-xs text-gray-500">
                {item.service_name} • {item.duration_minutes} min
                {item.quantity > 1 && ` • Qty: ${item.quantity}`}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(item.total_price)}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Discount {couponCode && `(${couponCode})`}
            </span>
            <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">VAT (5%)</span>
          <span className="text-gray-900">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
