"use client";

import {
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  Gift,
  MessageSquare,
  User,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { OrderSidebarProps } from "./types";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getPaymentMethodDisplay,
  getPaymentStatusConfig,
  getAddressDisplay,
} from "./helpers/orderFormatters";

export function OrderSidebar({
  order,
  onChatWithVendor,
  onChatWithTechnician,
  onCancelOrder,
  onCancelAndRefund,
  onRequestRefund,
  canCancelOnly,
  canCancelAndRefund,
  canRequestRefundOnly,
}: OrderSidebarProps) {
  const paymentStatusConfig = getPaymentStatusConfig(order.payment_status);

  const getPaymentIcon = () => {
    if (order.payment_type === "cash") return <Banknote className="h-4 w-4 mr-2 text-gray-400" />;
    if (order.payment_type === "wallet") return <Wallet className="h-4 w-4 mr-2 text-gray-400" />;
    return <CreditCard className="h-4 w-4 mr-2 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Schedule Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          Schedule
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-900">{formatDate(order.scheduled_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="text-gray-900">{order.scheduled_time}</span>
          </div>
          {order.started_at && (
            <div className="flex justify-between">
              <span className="text-gray-500">Started At</span>
              <span className="text-gray-900">{formatDateTime(order.started_at)}</span>
            </div>
          )}
          {order.completed_at && (
            <div className="flex justify-between">
              <span className="text-gray-500">Completed At</span>
              <span className="text-gray-900">{formatDateTime(order.completed_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          Service Address
        </h3>
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">{order.address.label}</p>
          <p className="text-sm text-gray-600">{getAddressDisplay(order)}</p>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          {getPaymentIcon()}
          Payment
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Method</span>
            <span className="text-gray-900">{getPaymentMethodDisplay(order)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            {paymentStatusConfig && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${paymentStatusConfig.className}`}>
                {paymentStatusConfig.label}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="text-gray-900 font-medium">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Points Earned */}
      {order.status === "completed" && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Points Earned</p>
              <p className="text-lg font-semibold text-gray-700">+{Math.floor(order.total / 10)} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={onChatWithVendor}
          className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat with Vendor
        </button>
        {order.technician && (
          <button
            onClick={onChatWithTechnician}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <User className="h-4 w-4 mr-2" />
            Chat with Technician
          </button>
        )}
        {canCancelOnly && (
          <button
            onClick={onCancelOrder}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Order
          </button>
        )}
        {canCancelAndRefund && (
          <button
            onClick={onCancelAndRefund}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel and Refund
          </button>
        )}
        {canRequestRefundOnly && (
          <button
            onClick={onRequestRefund}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Request Refund
          </button>
        )}
        {order.status === "completed" && (
          <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Lodge Complaint
          </button>
        )}
      </div>
    </div>
  );
}
