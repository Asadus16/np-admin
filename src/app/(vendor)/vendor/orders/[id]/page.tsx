"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const StaticLeafletMap = dynamic(
  () => import("@/components/maps/StaticLeafletMap"),
  { ssr: false, loading: () => <div className="h-50 bg-gray-100 animate-pulse rounded-lg" /> }
);
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Package,
  CheckCircle,
  CreditCard,
  Wallet,
  StickyNote,
  Plus,
  AlertCircle,
  Loader2,
  XCircle,
  Truck,
  FileCheck,
  Banknote,
} from "lucide-react";
import {
  getVendorOrder,
  confirmOrder,
  declineOrder,
  startOrder,
  completeOrder,
  addOrderNote,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/lib/vendorOrder";
import { VendorOrder, VendorOrderNote } from "@/types/vendorOrder";

interface TimelineItem {
  id: string;
  event: string;
  time: string | null;
  completed: boolean;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<VendorOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteIsInternal, setNoteIsInternal] = useState(true);
  const [declineReason, setDeclineReason] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getVendorOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      setError("Failed to load order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      const response = await confirmOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    setActionLoading(true);
    try {
      await declineOrder(orderId, declineReason);
      setShowDeclineModal(false);
      router.push("/vendor/orders");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = async () => {
    setActionLoading(true);
    try {
      const response = await startOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const response = await completeOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setNoteLoading(true);
    try {
      await addOrderNote(orderId, newNote, noteIsInternal);
      setNewNote("");
      setShowNoteModal(false);
      loadOrder();
    } catch (err) {
      console.error(err);
    } finally {
      setNoteLoading(false);
    }
  };

  const buildTimeline = (): TimelineItem[] => {
    if (!order) return [];

    const timeline: TimelineItem[] = [
      {
        id: "created",
        event: "Order received",
        time: order.created_at,
        completed: true,
      },
    ];

    if (order.confirmed_at) {
      timeline.push({
        id: "confirmed",
        event: "Order confirmed",
        time: order.confirmed_at,
        completed: true,
      });
    } else if (order.status === "pending") {
      timeline.push({
        id: "confirmed",
        event: "Awaiting confirmation",
        time: null,
        completed: false,
      });
    }

    if (order.started_at) {
      timeline.push({
        id: "started",
        event: "Work started",
        time: order.started_at,
        completed: true,
      });
    } else if (order.status === "confirmed") {
      timeline.push({
        id: "started",
        event: "Ready to start",
        time: null,
        completed: false,
      });
    }

    if (order.completed_at) {
      timeline.push({
        id: "completed",
        event: "Order completed",
        time: order.completed_at,
        completed: true,
      });
    } else if (order.status === "in_progress") {
      timeline.push({
        id: "completed",
        event: "In progress",
        time: null,
        completed: false,
      });
    }

    if (order.cancelled_at) {
      timeline.push({
        id: "cancelled",
        event: "Order cancelled",
        time: order.cancelled_at,
        completed: true,
      });
    }

    return timeline;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            <FileCheck className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            <Truck className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPaymentIcon = () => {
    if (!order) return null;
    switch (order.payment_type) {
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor/orders" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Order Not Found</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error || "Order not found"}</p>
        </div>
      </div>
    );
  }

  const timeline = buildTimeline();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vendor/orders" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-900">{order.order_number}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {order.items.length > 0 ? order.items[0].service_name : "Service Order"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {order.status === "pending" && (
            <>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Accept Order
              </button>
              <button
                onClick={() => setShowDeclineModal(true)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                Decline
              </button>
            </>
          )}
          {order.status === "confirmed" && (
            <button
              onClick={handleStart}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Start Work
            </button>
          )}
          {order.status === "in_progress" && (
            <button
              onClick={handleComplete}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Complete Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    {order.customer.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    {order.customer.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.address.street_address}
                    {order.address.building && `, ${order.address.building}`}
                    {order.address.apartment && ` - ${order.address.apartment}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.address.city}, {order.address.emirate}
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            {order.address.latitude && order.address.longitude && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Location</p>
                <div className="h-50 rounded-lg overflow-hidden border border-gray-200">
                  <StaticLeafletMap
                    latitude={order.address.latitude}
                    longitude={order.address.longitude}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.latitude},${order.address.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Get directions
                </a>
              </div>
            )}
          </div>

          {/* Schedule & Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule & Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(order.scheduled_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(order.scheduled_time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.total_duration_minutes} mins
                  </p>
                </div>
              </div>
            </div>
            {order.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Customer Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Notes</h2>
              </div>
              <button
                onClick={() => setShowNoteModal(true)}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>
            <div className="space-y-3">
              {order.order_notes && order.order_notes.length > 0 ? (
                order.order_notes.map((note: VendorOrderNote) => (
                  <div
                    key={note.id}
                    className={`rounded-lg p-3 ${
                      note.is_internal
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          note.is_internal ? "text-yellow-700" : "text-blue-700"
                        }`}
                      >
                        {note.is_internal ? "Internal" : "Customer-facing"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="font-medium">{note.author.name}</span>
                      <span>•</span>
                      <span>{formatDateTime(note.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                      item.completed ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        item.completed ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {item.event}
                    </p>
                    {item.time && (
                      <p className="text-xs text-gray-500">{formatDateTime(item.time)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Reason */}
          {order.status === "cancelled" && order.cancellation_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-medium text-red-900">Cancellation Reason</h2>
              </div>
              <p className="text-sm text-red-700">{order.cancellation_reason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
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
                  <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Discount {order.coupon && `(${order.coupon.code})`}
                    </span>
                    <span className="text-green-600">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">VAT (5%)</span>
                  <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
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
                    {order.payment_type === "card" && order.payment_method
                      ? `${order.payment_method.brand} •••• ${order.payment_method.last4}`
                      : order.payment_type === "cash"
                      ? "Cash on delivery"
                      : "Wallet"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {order.status !== "completed" && order.status !== "cancelled" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a
                  href={`tel:${order.customer.phone}`}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left inline-flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </a>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left inline-flex items-center"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setNoteIsInternal(true)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border ${
                    noteIsInternal
                      ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Internal
                </button>
                <button
                  onClick={() => setNoteIsInternal(false)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border ${
                    !noteIsInternal
                      ? "bg-blue-50 border-blue-300 text-blue-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Customer-facing
                </button>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNewNote("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={noteLoading || !newNote.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
              >
                {noteLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Decline Order</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to decline this order? This action cannot be undone.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for declining..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Decline Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
