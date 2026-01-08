"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  AlertTriangle,
  RefreshCw,
  Gift,
  Phone,
  FileText,
  Truck,
  User,
  Calendar,
  Loader2,
  AlertCircle,
  XCircle,
  FileCheck,
  CreditCard,
  Banknote,
  Wallet,
} from "lucide-react";
import { getOrder, cancelOrder } from "@/lib/order";
import { Order } from "@/types/order";
import { useAppDispatch } from "@/store/hooks";
import { startOrGetConversation } from "@/store/slices/chatSlice";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      setError("Failed to load order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id, cancelReason || undefined);
      setShowCancelModal(false);
      loadOrder(); // Reload order to show updated status
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel order";
      setError(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const handleChatWithVendor = async () => {
    if (!order?.vendor?.user_id) return;
    try {
      // Start or get conversation with primary vendor
      await dispatch(startOrGetConversation(order.vendor.user_id.toString())).unwrap();
      // Navigate to messages page
      router.push("/customer/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const handleChatWithTechnician = async () => {
    if (!order?.technician?.id) return;
    try {
      // Start or get conversation with technician
      await dispatch(startOrGetConversation(order.technician.id.toString())).unwrap();
      // Navigate to messages page
      router.push("/customer/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Truck className="h-4 w-4 mr-1.5" />
            In Progress
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <FileCheck className="h-4 w-4 mr-1.5" />
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-1.5" />
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodDisplay = () => {
    if (!order) return "-";
    if (order.payment_type === "cash") return "Cash on Delivery";
    if (order.payment_type === "wallet") return "Wallet";
    if (order.payment_method) {
      return `${order.payment_method.brand.charAt(0).toUpperCase() + order.payment_method.brand.slice(1)} •••• ${order.payment_method.last4}`;
    }
    return "Card";
  };

  const getPaymentIcon = () => {
    if (!order) return <CreditCard className="h-4 w-4 mr-2 text-gray-400" />;
    if (order.payment_type === "cash") return <Banknote className="h-4 w-4 mr-2 text-gray-400" />;
    if (order.payment_type === "wallet") return <Wallet className="h-4 w-4 mr-2 text-gray-400" />;
    return <CreditCard className="h-4 w-4 mr-2 text-gray-400" />;
  };

  const getAddressDisplay = () => {
    if (!order) return "";
    const { address } = order;
    const parts = [address.street_address];
    if (address.building) parts.push(address.building);
    if (address.apartment) parts.push(`Apt ${address.apartment}`);
    parts.push(address.city);
    parts.push(address.emirate);
    return parts.join(", ");
  };

  const buildTimeline = () => {
    if (!order) return [];
    const timeline = [];

    timeline.push({
      status: "Order Placed",
      time: formatDateTime(order.created_at),
      completed: true,
    });

    if (order.confirmed_at) {
      timeline.push({
        status: "Order Confirmed",
        time: formatDateTime(order.confirmed_at),
        completed: true,
      });
    } else if (order.status !== "pending" && order.status !== "cancelled") {
      timeline.push({
        status: "Order Confirmed",
        time: "-",
        completed: false,
      });
    }

    if (order.started_at) {
      timeline.push({
        status: "Service Started",
        time: formatDateTime(order.started_at),
        completed: true,
      });
    } else if (order.status === "in_progress" || order.status === "completed") {
      timeline.push({
        status: "Service Started",
        time: order.status === "in_progress" ? "In progress..." : "-",
        completed: order.status === "in_progress",
      });
    }

    if (order.completed_at) {
      timeline.push({
        status: "Service Completed",
        time: formatDateTime(order.completed_at),
        completed: true,
      });
    } else if (order.status !== "cancelled" && order.status !== "pending") {
      timeline.push({
        status: "Service Completed",
        time: "-",
        completed: false,
      });
    }

    if (order.cancelled_at) {
      timeline.push({
        status: "Order Cancelled",
        time: formatDateTime(order.cancelled_at),
        completed: true,
      });
    }

    return timeline;
  };

  const canCancel = () => {
    if (!order) return false;
    return order.status === "pending" || order.status === "confirmed";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/customer/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Order Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error || "Order not found"}</p>
          <button
            onClick={loadOrder}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const timeline = buildTimeline();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customer/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{order.order_number}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDateTime(order.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">{order.vendor.logo}</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{order.vendor.name}</p>
                  <p className="text-sm text-gray-500">Vendor</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Services</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
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
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Discount {order.coupon && `(${order.coupon.code})`}
                  </span>
                  <span className="text-green-600">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (5%)</span>
                <span className="text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Activity Timeline</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === "Order Cancelled"
                          ? "bg-red-500"
                          : item.completed
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`} />
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${
                          item.completed ? "bg-green-200" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        item.status === "Order Cancelled"
                          ? "text-red-600"
                          : item.completed
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}>
                        {item.status}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.notes || order.cancellation_reason) && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-4 space-y-4">
                {order.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Your Note</p>
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                )}
                {order.cancellation_reason && (
                  <div>
                    <p className="text-xs font-medium text-red-500 mb-1">Cancellation Reason</p>
                    <p className="text-sm text-gray-700">{order.cancellation_reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Section */}
          {order.status === "completed" && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Leave a Review</h2>
              </div>
              {showReviewForm ? (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= reviewRating
                                ? "text-amber-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Comment</p>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                      Submit Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
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
              <p className="text-sm text-gray-600">{getAddressDisplay()}</p>
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
                <span className="text-gray-900">{getPaymentMethodDisplay()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                {getPaymentStatusBadge(order.payment_status)}
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
              onClick={handleChatWithVendor}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Vendor
            </button>
            {order.technician && (
              <button
                onClick={handleChatWithTechnician}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <User className="h-4 w-4 mr-2" />
                Chat with Technician
              </button>
            )}
            {canCancel() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </button>
            )}
            {order.status === "completed" && (
              <>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Request Refund
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Lodge Complaint
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center"
              >
                {cancelling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
