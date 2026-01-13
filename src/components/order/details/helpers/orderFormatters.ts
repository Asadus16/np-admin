import { Order } from "@/types/order";
import { TimelineItem, TechnicianStatusInfo } from "../types";
import {
  CheckCircle,
  Clock,
  Truck,
  FileCheck,
  XCircle,
  User,
  Car,
  MapPinned,
  Wrench,
} from "lucide-react";

// Currency formatter
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Date formatter (date only)
export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Date and time formatter
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get status badge configuration
export function getStatusConfig(status: string): {
  icon: typeof CheckCircle;
  label: string;
  className: string;
} {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        label: "Completed",
        className: "bg-green-100 text-green-800",
      };
    case "in_progress":
      return {
        icon: Truck,
        label: "In Progress",
        className: "bg-blue-100 text-blue-800",
      };
    case "confirmed":
      return {
        icon: FileCheck,
        label: "Confirmed",
        className: "bg-purple-100 text-purple-800",
      };
    case "pending":
      return {
        icon: Clock,
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
      };
    case "cancelled":
      return {
        icon: XCircle,
        label: "Cancelled",
        className: "bg-red-100 text-red-800",
      };
    default:
      return {
        icon: Clock,
        label: status,
        className: "bg-gray-100 text-gray-800",
      };
  }
}

// Get payment status badge configuration
export function getPaymentStatusConfig(status: string): {
  label: string;
  className: string;
} | null {
  switch (status) {
    case "paid":
      return { label: "Paid", className: "bg-green-100 text-green-800" };
    case "pending":
      return { label: "Pending", className: "bg-yellow-100 text-yellow-800" };
    case "failed":
      return { label: "Failed", className: "bg-red-100 text-red-800" };
    case "refunded":
      return { label: "Refunded", className: "bg-gray-100 text-gray-800" };
    default:
      return null;
  }
}

// Get payment method display text
export function getPaymentMethodDisplay(order: Order): string {
  if (order.payment_type === "cash") return "Cash on Delivery";
  if (order.payment_type === "wallet") return "Wallet";
  if (order.payment_method) {
    const brand = order.payment_method.brand;
    return `${brand.charAt(0).toUpperCase() + brand.slice(1)} •••• ${order.payment_method.last4}`;
  }
  return "Card";
}

// Get formatted address display
export function getAddressDisplay(order: Order): string {
  const { address } = order;
  const parts = [address.street_address];
  if (address.building) parts.push(address.building);
  if (address.apartment) parts.push(`Apt ${address.apartment}`);
  parts.push(address.city);
  parts.push(address.emirate);
  return parts.join(", ");
}

// Build timeline from order data
export function buildTimeline(order: Order): TimelineItem[] {
  const timeline: TimelineItem[] = [];

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
}

// Technician status configuration map
const technicianStatusMap: Record<string, TechnicianStatusInfo> = {
  assigned: {
    label: "Technician Assigned",
    description: "Your technician has been assigned and will accept the job soon",
    icon: User,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconColor: "text-yellow-600",
    step: 1,
  },
  acknowledged: {
    label: "Job Accepted",
    description: "Your technician has accepted the job and will be on their way soon",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
    step: 2,
  },
  on_the_way: {
    label: "On The Way",
    description: "Your technician is on the way to your location",
    icon: Car,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    iconColor: "text-orange-600",
    step: 3,
  },
  arrived: {
    label: "Technician Arrived",
    description: "Your technician has arrived at your location",
    icon: MapPinned,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    iconColor: "text-purple-600",
    step: 4,
  },
  in_progress: {
    label: "Work In Progress",
    description: "Your technician is currently working on the job",
    icon: Wrench,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    iconColor: "text-indigo-600",
    step: 5,
  },
  completed: {
    label: "Job Completed",
    description: "The service has been completed successfully",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-600",
    step: 6,
  },
};

// Get technician status info
export function getTechnicianStatusInfo(status: string): TechnicianStatusInfo | null {
  return technicianStatusMap[status] || null;
}

// Check if technician tracking should be shown
export function shouldShowTechnicianTracking(order: Order): boolean {
  return (
    !!order.technician &&
    !!order.technician_status &&
    order.status !== "cancelled" &&
    order.status !== "completed"
  );
}

// Check if order can be cancelled without refund
export function canCancelOnly(order: Order): boolean {
  if (order.status === "pending") return true;
  if (order.status === "confirmed" && order.payment_type === "cash") return true;
  return false;
}

// Check if order can be cancelled with refund
export function canCancelAndRefund(order: Order): boolean {
  return (
    order.status === "confirmed" &&
    order.payment_type === "card" &&
    order.payment_status === "paid"
  );
}

// Check if order can only request refund (not cancel)
export function canRequestRefundOnly(order: Order): boolean {
  return (
    order.status === "in_progress" &&
    order.payment_type === "card" &&
    order.payment_status === "paid"
  );
}

// Get review type label
export function getReviewTypeLabel(type: string): string {
  switch (type) {
    case "customer_to_vendor":
      return "Rate Service";
    case "customer_to_technician":
      return "Rate Technician";
    default:
      return "Leave Review";
  }
}
