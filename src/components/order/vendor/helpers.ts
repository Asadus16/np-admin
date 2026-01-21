import { VendorOrder } from "@/types/vendorOrder";
import { VendorTimelineItem } from "./types";

// Build timeline from vendor order data
export function buildVendorTimeline(order: VendorOrder): VendorTimelineItem[] {
  const timeline: VendorTimelineItem[] = [
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
}

// Check if order is scheduled for a future date
export function isScheduledForLater(order: VendorOrder): boolean {
  if (!order.scheduled_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduledDate = new Date(order.scheduled_date);
  scheduledDate.setHours(0, 0, 0, 0);
  return scheduledDate > today;
}

// Format date/time for display
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
