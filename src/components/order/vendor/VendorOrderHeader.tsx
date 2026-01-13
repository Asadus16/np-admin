"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  FileCheck,
  CalendarClock,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { VendorOrderHeaderProps } from "./types";
import { isScheduledForLater } from "./helpers";

const statusBadges = {
  pending: { icon: Clock, label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { icon: FileCheck, label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  in_progress: { icon: Truck, label: "In Progress", className: "bg-purple-100 text-purple-800" },
  completed: { icon: CheckCircle, label: "Completed", className: "bg-green-100 text-green-800" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-red-100 text-red-800" },
};

export function VendorOrderHeader({
  order,
  actionLoading,
  onConfirm,
  onDecline,
  onStart,
  onComplete,
  onChatWithCustomer,
}: VendorOrderHeaderProps) {
  const statusConfig = statusBadges[order.status as keyof typeof statusBadges];
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="flex items-center gap-4">
      <Link href="/vendor/orders" className="p-2 hover:bg-gray-100 rounded-lg">
        <ArrowLeft className="h-5 w-5 text-gray-500" />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold text-gray-900">{order.order_number}</h1>
          {statusConfig && (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.className}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </span>
          )}
          {isScheduledForLater(order) && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
              <CalendarClock className="h-3 w-3 mr-1" />
              Scheduled
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {order.items.length > 0 ? order.items[0].service_name : "Service Order"}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {order.status === "pending" && (
          <>
            <button
              onClick={onConfirm}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Accept Order
            </button>
            <button
              onClick={onDecline}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              Decline
            </button>
          </>
        )}
        {order.status === "confirmed" && (
          <button
            onClick={onStart}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
          >
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Start Work
          </button>
        )}
        {order.status === "in_progress" && (
          <button
            onClick={onComplete}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center"
          >
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Complete Order
          </button>
        )}
        <button
          onClick={onChatWithCustomer}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat with Customer
        </button>
      </div>
    </div>
  );
}
