import { OrderAddress, OrderItem, FrequencyType } from './order';

export type RecurringOrderStatus = 'active' | 'paused' | 'cancelled' | 'completed';

export interface RecurringOrderVendor {
  id: string;
  name: string;
  email: string;
}

export interface RecurringOrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface RecurringOrderPaymentMethod {
  id: string;
  brand: string;
  last4: string;
}

export interface RecurringOrderItem {
  id: string;
  sub_service_id: string;
  service_name: string;
  sub_service_name: string;
  unit_price: number;
  quantity: number;
  duration_minutes: number;
  total_price: number;
}

export interface RecurringOrder {
  id: string;
  status: RecurringOrderStatus;

  // Frequency
  frequency_type: FrequencyType;
  frequency_interval: number;
  frequency_day_of_week: number | null;
  frequency_day_of_month: number | null;
  frequency_label: string; // Human-readable, e.g., "Every Monday"

  // Scheduling
  start_date: string;
  end_date: string | null;
  next_scheduled_date: string;
  scheduled_time: string;

  // Pricing
  subtotal: number;
  tax: number;
  total: number;
  total_duration_minutes: number;

  // Payment
  payment_type: 'card' | 'cash' | 'wallet';

  // Notes
  notes: string | null;

  // Tracking
  orders_generated: number;
  first_order_id: string | null;
  last_order_id: string | null;

  // Related data
  vendor?: RecurringOrderVendor;
  customer?: RecurringOrderCustomer;
  address?: OrderAddress;
  payment_method?: RecurringOrderPaymentMethod | null;
  items?: RecurringOrderItem[];

  // Timestamps
  paused_at: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecurringOrderStats {
  active: number;
  paused: number;
  cancelled: number;
  completed: number;
  total: number;
}

// API Responses
export interface RecurringOrderListResponse {
  data: RecurringOrder[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RecurringOrderResponse {
  data: RecurringOrder;
}

export interface RecurringOrderStatsResponse {
  data: RecurringOrderStats;
}

export interface RecurringOrderActionResponse {
  message: string;
  data: RecurringOrder;
}
