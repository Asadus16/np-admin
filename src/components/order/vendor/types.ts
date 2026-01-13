import { VendorOrder, VendorOrderNote } from "@/types/vendorOrder";

// Timeline item for vendor order
export interface VendorTimelineItem {
  id: string;
  event: string;
  time: string | null;
  completed: boolean;
}

// Props for VendorOrderHeader component
export interface VendorOrderHeaderProps {
  order: VendorOrder;
  actionLoading: boolean;
  onConfirm: () => void;
  onDecline: () => void;
  onStart: () => void;
  onComplete: () => void;
  onChatWithCustomer: () => void;
}

// Props for CustomerInfoCard component
export interface CustomerInfoCardProps {
  customer: VendorOrder["customer"];
  address: VendorOrder["address"];
}

// Props for ScheduleNotesCard component
export interface ScheduleNotesCardProps {
  scheduledDate: string;
  scheduledTime: string;
  totalDurationMinutes: number;
  notes?: string | null;
}

// Props for VendorOrderNotes component
export interface VendorOrderNotesProps {
  notes: VendorOrderNote[];
  onAddNote: () => void;
}

// Props for VendorOrderTimeline component
export interface VendorOrderTimelineProps {
  timeline: VendorTimelineItem[];
}

// Props for VendorOrderSummary component
export interface VendorOrderSummaryProps {
  items: VendorOrder["items"];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  tax: number;
  total: number;
}

// Props for PaymentInfoCard component
export interface PaymentInfoCardProps {
  paymentType: string;
  paymentStatus: string;
  paymentMethod?: {
    brand: string;
    last4: string;
  } | null;
}

// Props for QuickActionsCard component
export interface QuickActionsCardProps {
  customerPhone: string;
  onAddNote: () => void;
}

// Props for AddNoteModal component
export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  note: string;
  onNoteChange: (note: string) => void;
  isInternal: boolean;
  onInternalChange: (isInternal: boolean) => void;
  loading: boolean;
}

// Props for DeclineModal component
export interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  loading: boolean;
}
