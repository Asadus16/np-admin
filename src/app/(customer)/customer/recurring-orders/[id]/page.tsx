"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  RefreshCw,
  Calendar,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  XCircle,
  CheckCircle,
  CreditCard,
  Banknote,
  Wallet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  getRecurringOrder,
  getRecurringOrderHistory,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
  formatFrequency,
  getStatusColor,
  formatDate,
  formatTime,
  formatCurrency,
} from "@/lib/recurringOrder";
import { RecurringOrder } from "@/types/recurringOrder";

interface GeneratedOrder {
  id: string;
  order_number: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  total: number;
}

export default function RecurringOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const recurringOrderId = params.id as string;

  const [recurringOrder, setRecurringOrder] = useState<RecurringOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<GeneratedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadRecurringOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecurringOrder(recurringOrderId);
      setRecurringOrder(response.data);
    } catch (err) {
      setError("Failed to load recurring order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [recurringOrderId]);

  const loadOrderHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await getRecurringOrderHistory(recurringOrderId, {
        page: historyPage,
        per_page: 5,
      });
      setOrderHistory(response.data as GeneratedOrder[]);
      setHistoryTotalPages(response.meta.last_page);
    } catch (err) {
      console.error("Failed to load order history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [recurringOrderId, historyPage]);

  useEffect(() => {
    loadRecurringOrder();
  }, [loadRecurringOrder]);

  useEffect(() => {
    if (recurringOrder) {
      loadOrderHistory();
    }
  }, [recurringOrder, loadOrderHistory]);

  const handlePause = async () => {
    if (!recurringOrder) return;
    setActionLoading(true);
    try {
      await pauseRecurringOrder(recurringOrder.id);
      loadRecurringOrder();
    } catch (err) {
      console.error("Failed to pause recurring order:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!recurringOrder) return;
    setActionLoading(true);
    try {
      await resumeRecurringOrder(recurringOrder.id);
      loadRecurringOrder();
    } catch (err) {
      console.error("Failed to resume recurring order:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!recurringOrder) return;
    if (!confirm("Are you sure you want to cancel this recurring order? This action cannot be undone.")) {
      return;
    }
    setActionLoading(true);
    try {
      await cancelRecurringOrder(recurringOrder.id);
      loadRecurringOrder();
    } catch (err) {
      console.error("Failed to cancel recurring order:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status);
    const icons: Record<string, React.ReactNode> = {
      active: <Play className="h-4 w-4 mr-1.5" />,
      paused: <Pause className="h-4 w-4 mr-1.5" />,
      cancelled: <XCircle className="h-4 w-4 mr-1.5" />,
      completed: <CheckCircle className="h-4 w-4 mr-1.5" />,
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getOrderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-purple-100 text-purple-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
      </span>
    );
  };

  const getPaymentMethodDisplay = () => {
    if (!recurringOrder) return "-";
    if (recurringOrder.payment_type === "cash") return "Cash on Delivery";
    if (recurringOrder.payment_type === "wallet") return "Wallet";
    if (recurringOrder.payment_method) {
      return `${recurringOrder.payment_method.brand.charAt(0).toUpperCase() + recurringOrder.payment_method.brand.slice(1)} **** ${recurringOrder.payment_method.last4}`;
    }
    return "Card";
  };

  const getPaymentIcon = () => {
    if (!recurringOrder) return <CreditCard className="h-4 w-4 mr-2 text-gray-400" />;
    if (recurringOrder.payment_type === "cash") return <Banknote className="h-4 w-4 mr-2 text-gray-400" />;
    if (recurringOrder.payment_type === "wallet") return <Wallet className="h-4 w-4 mr-2 text-gray-400" />;
    return <CreditCard className="h-4 w-4 mr-2 text-gray-400" />;
  };

  const getAddressDisplay = () => {
    if (!recurringOrder?.address) return "";
    const { address } = recurringOrder;
    const parts = [address.street_address];
    if (address.building) parts.push(address.building);
    if (address.apartment) parts.push(`Apt ${address.apartment}`);
    parts.push(address.city);
    parts.push(address.emirate);
    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !recurringOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/customer/recurring-orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Recurring Order Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error || "Recurring order not found"}</p>
          <button
            onClick={loadRecurringOrder}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customer/recurring-orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Recurring Order</h1>
            {getStatusBadge(recurringOrder.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created on {formatDate(recurringOrder.created_at)}
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {recurringOrder.status === "paused" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <Pause className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">This recurring order is paused</p>
            <p className="text-sm text-yellow-700">No new orders will be generated until you resume it.</p>
          </div>
          <button
            onClick={handleResume}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-lg hover:bg-yellow-200 disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resume"}
          </button>
        </div>
      )}

      {recurringOrder.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">This recurring order has been cancelled</p>
            <p className="text-sm text-red-700">
              Cancelled on {recurringOrder.cancelled_at ? formatDate(recurringOrder.cancelled_at) : "N/A"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {recurringOrder.vendor?.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{recurringOrder.vendor?.name}</p>
                <p className="text-sm text-gray-500">Vendor</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Services</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recurringOrder.items?.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.sub_service_name}</p>
                    <p className="text-xs text-gray-500">
                      {item.service_name} - {item.duration_minutes} min
                      {item.quantity > 1 && ` - Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(item.total_price)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(recurringOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (5%)</span>
                <span className="text-gray-900">{formatCurrency(recurringOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total per Order</span>
                <span className="text-gray-900">{formatCurrency(recurringOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Generated Orders</h2>
              <span className="text-sm text-gray-500">{recurringOrder.orders_generated} total</span>
            </div>
            {historyLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders generated yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Orders will be generated automatically based on your schedule
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {orderHistory.map((order) => (
                    <Link
                      key={order.id}
                      href={`/customer/orders/${order.id}`}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.scheduled_date)} at {order.scheduled_time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
                {historyTotalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Page {historyPage} of {historyTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        disabled={historyPage === 1}
                        className={`p-2 rounded-lg ${
                          historyPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                        disabled={historyPage === historyTotalPages}
                        className={`p-2 rounded-lg ${
                          historyPage === historyTotalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Notes */}
          {recurringOrder.notes && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700">{recurringOrder.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
              Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <RefreshCw className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">{formatFrequency(recurringOrder)}</p>
                  <p className="text-xs text-emerald-600">Recurring Frequency</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date</span>
                  <span className="text-gray-900">{formatDate(recurringOrder.start_date)}</span>
                </div>
                {recurringOrder.end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Date</span>
                    <span className="text-gray-900">{formatDate(recurringOrder.end_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-gray-900">{formatTime(recurringOrder.scheduled_time)}</span>
                </div>
                {recurringOrder.status === "active" && recurringOrder.next_scheduled_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Order</span>
                    <span className="text-gray-900 font-medium">{formatDate(recurringOrder.next_scheduled_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              Service Address
            </h3>
            {recurringOrder.address && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{recurringOrder.address.label}</p>
                <p className="text-sm text-gray-600">{getAddressDisplay()}</p>
              </div>
            )}
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
                <span className="text-gray-900">{getPaymentMethodDisplay()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount per Order</span>
                <span className="text-gray-900 font-medium">{formatCurrency(recurringOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Statistics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Orders Generated</span>
                <span className="text-gray-900 font-medium">{recurringOrder.orders_generated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Spent</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(recurringOrder.total * recurringOrder.orders_generated)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration per Order</span>
                <span className="text-gray-900">{recurringOrder.total_duration_minutes} min</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {recurringOrder.status === "active" && (
              <>
                <button
                  onClick={handlePause}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-700 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  Pause Recurring
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Recurring
                </button>
              </>
            )}
            {recurringOrder.status === "paused" && (
              <>
                <button
                  onClick={handleResume}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Resume Recurring
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Recurring
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
