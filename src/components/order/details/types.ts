import { Order } from "@/types/order";
import { Review, ReviewType } from "@/types/review";
import { LucideIcon } from "lucide-react";

// Timeline item for order activity
export interface TimelineItem {
  status: string;
  time: string;
  completed: boolean;
}

// Technician status configuration
export interface TechnicianStatusInfo {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  step: number;
}

// Props for OrderHeader component
export interface OrderHeaderProps {
  orderNumber: string;
  status: string;
  createdAt: string;
  backHref: string;
}

// Props for TechnicianTracker component
export interface TechnicianTrackerProps {
  technician: NonNullable<Order["technician"]>;
  technicianStatus: string;
  onChatWithTechnician: () => void;
}

// Props for OrderItemsList component
export interface OrderItemsListProps {
  items: Order["items"];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  tax: number;
  total: number;
}

// Props for OrderTimeline component
export interface OrderTimelineProps {
  timeline: TimelineItem[];
}

// Props for OrderSidebar component
export interface OrderSidebarProps {
  order: Order;
  onChatWithVendor: () => void;
  onChatWithTechnician: () => void;
  onCancelOrder: () => void;
  onCancelAndRefund: () => void;
  onRequestRefund: () => void;
  canCancelOnly: boolean;
  canCancelAndRefund: boolean;
  canRequestRefundOnly: boolean;
}

// Props for OrderNotes component
export interface OrderNotesProps {
  notes?: string | null;
  cancellationReason?: string | null;
}

// Props for RefundStatusCard component
export interface RefundStatusCardProps {
  refundRequest: NonNullable<Order["refund_request"]>;
}

// Props for ReviewSection component
export interface ReviewSectionProps {
  existingReviews: Review[];
  availableReviewTypes: ReviewType[];
  onOpenReviewModal: (type: ReviewType) => void;
}

// Props for CancelModal component
export interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancelling: boolean;
  cancelReason: string;
  onReasonChange: (reason: string) => void;
}

// Props for VendorInfoCard component
export interface VendorInfoCardProps {
  vendor: Order["vendor"];
}
