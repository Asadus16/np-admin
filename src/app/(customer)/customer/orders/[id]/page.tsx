"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { getOrder, cancelOrder } from "@/lib/order";
import { Order } from "@/types/order";
import { useAppDispatch } from "@/store/hooks";
import { startOrGetConversation, sendMessage } from "@/store/slices/chatSlice";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import { canReviewOrder, createReview, getOrderReviews } from "@/lib/review";
import { ReviewType, Review } from "@/types/review";
import { RefundRequestModal } from "@/components/refund/RefundRequestModal";
import {
  OrderHeader,
  TechnicianTracker,
  OrderItemsList,
  OrderTimeline,
  OrderSidebar,
  VendorInfoCard,
  OrderNotes,
  RefundStatusCard,
  ReviewSection,
  CancelModal,
  buildTimeline,
  shouldShowTechnicianTracking,
  canCancelOnly as checkCanCancelOnly,
  canCancelAndRefund as checkCanCancelAndRefund,
  canRequestRefundOnly as checkCanRequestRefundOnly,
} from "@/components/order/details";

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

  // Review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewType, setCurrentReviewType] = useState<ReviewType | null>(null);
  const [availableReviewTypes, setAvailableReviewTypes] = useState<ReviewType[]>([]);
  const [existingReviews, setExistingReviews] = useState<Review[]>([]);
  const [hasCheckedReview, setHasCheckedReview] = useState(false);

  // Refund request state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [shouldCancelWithRefund, setShouldCancelWithRefund] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  // Check if user can review and load existing reviews when order is loaded
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!order || order.status !== "completed" || hasCheckedReview) return;

      try {
        const canReview = await canReviewOrder(orderId);
        setAvailableReviewTypes(canReview.available_types);

        const reviews = await getOrderReviews(orderId);
        setExistingReviews(reviews);

        const reviewShownKey = `review_shown_${orderId}`;
        if (canReview.available_types.length > 0 && !sessionStorage.getItem(reviewShownKey)) {
          sessionStorage.setItem(reviewShownKey, "true");
          setCurrentReviewType(canReview.available_types[0]);
          setShowReviewModal(true);
        }

        setHasCheckedReview(true);
      } catch (err) {
        console.error("Failed to check review status:", err);
      }
    };

    checkReviewStatus();
  }, [order, orderId, hasCheckedReview]);

  // Close conversation when order is completed
  useEffect(() => {
    const closeConversationOnCompletion = async () => {
      if (!order || order.status !== "completed" || !order.vendor?.user_id) return;

      const conversationClosedKey = `conversation_closed_${orderId}`;
      // Check if we've already closed the conversation for this order
      if (sessionStorage.getItem(conversationClosedKey)) return;

      try {
        // Get or start conversation with vendor
        const conversation = await dispatch(startOrGetConversation(order.vendor.user_id.toString())).unwrap();
        
        // Send closing message
        const closingMessage = `This conversation is now closed as order ${order.order_number} has been completed. Thank you for your business!`;
        
        await dispatch(sendMessage({
          conversationId: conversation.id,
          payload: { message: closingMessage }
        })).unwrap();

        // Mark conversation as closed for this order
        sessionStorage.setItem(conversationClosedKey, "true");
      } catch (err) {
        console.error("Failed to close conversation:", err);
      }
    };

    closeConversationOnCompletion();
  }, [order, orderId, dispatch]);

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
      loadOrder();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel order";
      setError(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const handleChatWithVendor = async () => {
    if (!order?.vendor?.user_id || !order) return;
    
    // Prevent chat if order is completed
    if (order.status === "completed") {
      return;
    }
    
    try {
      await dispatch(startOrGetConversation(order.vendor.user_id.toString())).unwrap();
      router.push("/customer/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const formatOrderDetailsForChat = (order: Order): string => {
    const items = order.items.map(item => 
      `• ${item.sub_service_name} (${item.service_name}) - ${formatCurrency(item.total_price)}${item.quantity > 1 ? ` x${item.quantity}` : ''}`
    ).join('\n');
    
    const addressParts = [
      order.address.street_address,
      order.address.building && `Building: ${order.address.building}`,
      order.address.apartment && `Apt: ${order.address.apartment}`,
      `${order.address.city}, ${order.address.emirate}`
    ].filter(Boolean).join(', ');
    
    let message = `Hello! I'd like to discuss my order:\n\n` +
           `📋 Order Number: ${order.order_number}\n` +
           `📅 Scheduled: ${formatDate(order.scheduled_date)} at ${order.scheduled_time}\n` +
           `📍 Address: ${addressParts}\n` +
           `💰 Total: ${formatCurrency(order.total)}\n` +
           `📦 Services:\n${items}\n` +
           `\nStatus: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`;
    
    if (order.notes) {
      message += `\n\nNote: ${order.notes}`;
    }
    
    return message;
  };

  const handleChatWithTechnician = async () => {
    if (!order?.technician?.id) return;
    try {
      await dispatch(startOrGetConversation(order.technician.id.toString())).unwrap();
      router.push("/customer/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const handleRefundSuccess = () => {
    setShowRefundModal(false);
    setShouldCancelWithRefund(false);
    loadOrder();
  };

  const openCancelAndRefundModal = () => {
    setShouldCancelWithRefund(true);
    setShowRefundModal(true);
  };

  const openRefundOnlyModal = () => {
    setShouldCancelWithRefund(false);
    setShowRefundModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!currentReviewType || !order) return;

    await createReview({
      order_id: orderId,
      type: currentReviewType,
      rating,
      comment: comment || undefined,
    });

    const canReview = await canReviewOrder(orderId);
    setAvailableReviewTypes(canReview.available_types);

    const reviews = await getOrderReviews(orderId);
    setExistingReviews(reviews);

    setShowReviewModal(false);
    setCurrentReviewType(null);
  };

  const openReviewModal = (type: ReviewType) => {
    setCurrentReviewType(type);
    setShowReviewModal(true);
  };

  const getRecipientName = (): string => {
    if (!order || !currentReviewType) return "";
    if (currentReviewType === "customer_to_vendor") {
      return order.vendor.name;
    }
    if (currentReviewType === "customer_to_technician" && order.technician) {
      return order.technician.name;
    }
    return "";
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

  const timeline = buildTimeline(order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <OrderHeader
        orderNumber={order.order_number}
        status={order.status}
        createdAt={order.created_at}
        backHref="/customer/orders"
      />

      {/* Technician Tracking Card */}
      {shouldShowTechnicianTracking(order) && order.technician && order.technician_status && (
        <TechnicianTracker
          technician={order.technician}
          technicianStatus={order.technician_status}
          onChatWithTechnician={handleChatWithTechnician}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <VendorInfoCard vendor={order.vendor} />

          {/* Services */}
          <OrderItemsList
            items={order.items}
            subtotal={order.subtotal}
            discountAmount={order.discount_amount}
            couponCode={order.coupon?.code}
            tax={order.tax}
            total={order.total}
          />

          {/* Timeline */}
          <OrderTimeline timeline={timeline} />

          {/* Notes */}
          <OrderNotes
            notes={order.notes}
            cancellationReason={order.cancellation_reason}
          />

          {/* Refund Status */}
          {order.refund_request && (
            <RefundStatusCard refundRequest={order.refund_request} />
          )}

          {/* Review Section */}
          {order.status === "completed" && (
            <ReviewSection
              existingReviews={existingReviews}
              availableReviewTypes={availableReviewTypes}
              onOpenReviewModal={openReviewModal}
            />
          )}
        </div>

        {/* Sidebar */}
        <OrderSidebar
          order={order}
          onChatWithVendor={handleChatWithVendor}
          onChatWithTechnician={handleChatWithTechnician}
          onCancelOrder={() => setShowCancelModal(true)}
          onCancelAndRefund={openCancelAndRefundModal}
          onRequestRefund={openRefundOnlyModal}
          canCancelOnly={checkCanCancelOnly(order)}
          canCancelAndRefund={checkCanCancelAndRefund(order)}
          canRequestRefundOnly={checkCanRequestRefundOnly(order)}
        />
      </div>

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        cancelling={cancelling}
        cancelReason={cancelReason}
        onReasonChange={setCancelReason}
      />

      {/* Review Modal */}
      {currentReviewType && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setCurrentReviewType(null);
          }}
          onSubmit={handleSubmitReview}
          type={currentReviewType}
          recipientName={getRecipientName()}
          orderNumber={order?.order_number}
        />
      )}

      {/* Refund Request Modal */}
      {order && (
        <RefundRequestModal
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setShouldCancelWithRefund(false);
          }}
          onSuccess={handleRefundSuccess}
          orderId={order.id}
          orderNumber={order.order_number}
          orderTotal={order.total}
          shouldCancelOrder={shouldCancelWithRefund}
        />
      )}
    </div>
  );
}
