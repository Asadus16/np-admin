"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import {
  getVendorOrder,
  confirmOrder,
  declineOrder,
  startOrder,
  completeOrder,
  addOrderNote,
} from "@/lib/vendorOrder";
import { VendorOrder } from "@/types/vendorOrder";
import { useAppDispatch } from "@/store/hooks";
import { startOrGetConversation } from "@/store/slices/chatSlice";
import {
  VendorOrderHeader,
  CustomerInfoCard,
  ScheduleNotesCard,
  VendorOrderNotes,
  VendorOrderTimeline,
  VendorOrderSummary,
  PaymentInfoCard,
  QuickActionsCard,
  AddNoteModal,
  DeclineModal,
  CancellationReasonCard,
  buildVendorTimeline,
} from "@/components/order/vendor";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  const handleChatWithCustomer = async () => {
    if (!order?.customer?.user_id) return;
    try {
      await dispatch(startOrGetConversation(order.customer.user_id.toString())).unwrap();
      router.push("/vendor/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNewNote("");
  };

  const closeDeclineModal = () => {
    setShowDeclineModal(false);
    setDeclineReason("");
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

  const timeline = buildVendorTimeline(order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <VendorOrderHeader
        order={order}
        actionLoading={actionLoading}
        onConfirm={handleConfirm}
        onDecline={() => setShowDeclineModal(true)}
        onStart={handleStart}
        onComplete={handleComplete}
        onChatWithCustomer={handleChatWithCustomer}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <CustomerInfoCard customer={order.customer} address={order.address} />

          {/* Schedule & Notes */}
          <ScheduleNotesCard
            scheduledDate={order.scheduled_date}
            scheduledTime={order.scheduled_time}
            totalDurationMinutes={order.total_duration_minutes}
            notes={order.notes}
          />

          {/* Internal Notes */}
          <VendorOrderNotes
            notes={order.order_notes || []}
            onAddNote={() => setShowNoteModal(true)}
          />

          {/* Timeline */}
          <VendorOrderTimeline timeline={timeline} />

          {/* Cancellation Reason */}
          {order.status === "cancelled" && order.cancellation_reason && (
            <CancellationReasonCard reason={order.cancellation_reason} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <VendorOrderSummary
            items={order.items}
            subtotal={order.subtotal}
            discountAmount={order.discount_amount}
            couponCode={order.coupon?.code}
            tax={order.tax}
            total={order.total}
          />

          {/* Payment Information */}
          <PaymentInfoCard
            paymentType={order.payment_type}
            paymentStatus={order.payment_status}
            paymentMethod={order.payment_method}
          />

          {/* Quick Actions */}
          {order.status !== "completed" && order.status !== "cancelled" && (
            <QuickActionsCard
              customerPhone={order.customer.phone}
              onAddNote={() => setShowNoteModal(true)}
            />
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={showNoteModal}
        onClose={closeNoteModal}
        onSubmit={handleAddNote}
        note={newNote}
        onNoteChange={setNewNote}
        isInternal={noteIsInternal}
        onInternalChange={setNoteIsInternal}
        loading={noteLoading}
      />

      {/* Decline Modal */}
      <DeclineModal
        isOpen={showDeclineModal}
        onClose={closeDeclineModal}
        onConfirm={handleDecline}
        reason={declineReason}
        onReasonChange={setDeclineReason}
        loading={actionLoading}
      />
    </div>
  );
}
