"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  Clock,
  Pause,
  Play,
  XCircle,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  getRecurringOrder,
  getRecurringOrderHistory,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
  formatFrequency,
  formatDate,
  formatTime,
  formatCurrency,
} from "@/lib/recurringOrder";
import { RecurringOrder, RecurringOrderStatus } from "@/types/recurringOrder";

interface OrderHistoryItem {
  id: string;
  order_number?: string;
  scheduled_date: string;
  total: number;
  status: string;
  created_at: string;
}

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [subscription, setSubscription] = useState<RecurringOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [subscriptionResponse, historyResponse] = await Promise.all([
        getRecurringOrder(id),
        getRecurringOrderHistory(id, { per_page: 10 }),
      ]);

      setSubscription(subscriptionResponse.data);
      setOrderHistory(historyResponse.data as OrderHistoryItem[]);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setError("Failed to load subscription details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handlePause = async () => {
    if (!subscription) return;

    try {
      setActionLoading("pause");
      await pauseRecurringOrder(subscription.id);
      fetchData();
    } catch (err) {
      console.error("Failed to pause subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async () => {
    if (!subscription) return;

    try {
      setActionLoading("resume");
      await resumeRecurringOrder(subscription.id);
      fetchData();
    } catch (err) {
      console.error("Failed to resume subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;

    try {
      setActionLoading("cancel");
      await cancelRecurringOrder(subscription.id);
      setShowCancelDialog(false);
      fetchData();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: RecurringOrderStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Play className="h-4 w-4 mr-1.5" />
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Pause className="h-4 w-4 mr-1.5" />
            Paused
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1.5" />
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getVendorInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getDayOfWeekName = (dayNumber: number | null) => {
    if (dayNumber === null) return null;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm mb-4">{error || "Subscription not found"}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.push("/customer/subscriptions")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const serviceName =
    subscription.items && subscription.items.length > 0
      ? subscription.items[0].service_name
      : "Recurring Service";

  const serviceDescription =
    subscription.items && subscription.items.length > 0
      ? `${subscription.items.length} service${subscription.items.length > 1 ? "s" : ""} included`
      : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customer/subscriptions"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{serviceName}</h1>
            {getStatusBadge(subscription.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">ID: {subscription.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {subscription.vendor ? getVendorInitials(subscription.vendor.name) : "??"}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {subscription.vendor?.name || "Unknown Vendor"}
                </p>
                <p className="text-sm text-gray-500">{serviceDescription}</p>
              </div>
            </div>
          </div>

          {/* Services Included */}
          {subscription.items && subscription.items.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Services Included</h2>
              <div className="space-y-3">
                {subscription.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.sub_service_name}</p>
                      <p className="text-xs text-gray-500">{item.service_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.total_price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} • {item.duration_minutes} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="text-sm font-medium text-gray-900">{formatFrequency(subscription)}</p>
                </div>
              </div>
              {subscription.frequency_day_of_week !== null && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Day</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getDayOfWeekName(subscription.frequency_day_of_week)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(subscription.scheduled_time)}
                  </p>
                </div>
              </div>
              {subscription.status === "active" && subscription.next_scheduled_date && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Service</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(subscription.next_scheduled_date)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Order History</h2>
              <p className="text-sm text-gray-500">{subscription.orders_generated} orders generated</p>
            </div>
            {orderHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No orders generated yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orderHistory.map((order) => (
                  <Link
                    key={order.id}
                    href={`/customer/orders/${order.id}`}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.order_number || order.id}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getOrderStatusBadge(order.status)}
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-3xl font-semibold text-gray-900">
                {formatCurrency(subscription.total)}
              </p>
              <p className="text-sm text-gray-500">per {subscription.frequency_type} service</p>
              {subscription.tax > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Includes {formatCurrency(subscription.tax)} tax
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          {subscription.address && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                Service Address
              </h3>
              <div className="text-sm text-gray-600">
                {subscription.address.label && (
                  <p className="font-medium text-gray-900 mb-1">{subscription.address.label}</p>
                )}
                <p>{subscription.address.street_address}</p>
                {subscription.address.apartment && <p>{subscription.address.apartment}</p>}
                <p>
                  {subscription.address.city}
                  {subscription.address.emirate && `, ${subscription.address.emirate}`}
                </p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
              Payment Method
            </h3>
            {subscription.payment_method ? (
              <p className="text-sm text-gray-600">
                {subscription.payment_method.brand} •••• {subscription.payment_method.last4}
              </p>
            ) : (
              <p className="text-sm text-gray-600 capitalize">{subscription.payment_type}</p>
            )}
          </div>

          {/* Actions */}
          {subscription.status !== "cancelled" && subscription.status !== "completed" && (
            <div className="space-y-2">
              {subscription.status === "active" ? (
                <button
                  onClick={handlePause}
                  disabled={actionLoading !== null}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
                >
                  {actionLoading === "pause" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  Pause Subscription
                </button>
              ) : subscription.status === "paused" ? (
                <button
                  onClick={handleResume}
                  disabled={actionLoading !== null}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
                >
                  {actionLoading === "resume" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Resume Subscription
                </button>
              ) : null}
              <button
                onClick={() => setShowCancelDialog(true)}
                disabled={actionLoading !== null}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Subscription
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
            <p>Started on {formatDate(subscription.start_date)}</p>
            {subscription.end_date && <p>Ends on {formatDate(subscription.end_date)}</p>}
            {subscription.paused_at && <p>Paused on {formatDate(subscription.paused_at)}</p>}
            {subscription.cancelled_at && <p>Cancelled on {formatDate(subscription.cancelled_at)}</p>}
          </div>

          {/* Notes */}
          {subscription.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{subscription.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this subscription? This action cannot be undone and you
              will no longer receive scheduled services.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={actionLoading !== null}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading !== null}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === "cancel" ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Cancel Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
