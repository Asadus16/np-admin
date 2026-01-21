// Vendor-facing order types

export interface VendorOrderCustomer {
  id: string;
  user_id: number; // Raw user ID for chat
  name: string;
  email: string;
  phone: string;
}

export interface VendorOrderAddress {
  id: string;
  label: string;
  street_address: string;
  building: string | null;
  apartment: string | null;
  city: string;
  emirate: string;
  latitude: number | null;
  longitude: number | null;
}

export interface VendorOrderItem {
  id: string;
  sub_service_id: string;
  service_name: string;
  sub_service_name: string;
  unit_price: number;
  quantity: number;
  duration_minutes: number;
  total_price: number;
}

export interface VendorOrderPaymentMethod {
  brand: string;
  last4: string;
}

export interface VendorOrderCoupon {
  code: string;
  discount: number;
}

export interface VendorOrderTechnician {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface VendorOrderNote {
  id: string;
  content: string;
  is_internal: boolean;
  author: {
    id: string;
    name: string;
  };
  created_at: string;
}

export interface VendorOrder {
  id: string;
  order_number: string;
  recurring_order_id?: string | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'recurring';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_type: 'card' | 'cash' | 'wallet';
  subtotal: number;
  discount_amount: number;
  tax: number;
  total: number;
  scheduled_date: string;
  scheduled_time: string;
  total_duration_minutes: number;
  notes: string | null;
  cancellation_reason: string | null;
  customer: VendorOrderCustomer;
  address: VendorOrderAddress;
  payment_method: VendorOrderPaymentMethod | null;
  coupon: VendorOrderCoupon | null;
  items: VendorOrderItem[];
  order_notes?: VendorOrderNote[];
  technician?: VendorOrderTechnician | null;
  assigned_at: string | null;
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorOrderStats {
  total: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  recurring: number;
}

// API Responses
export interface VendorOrderListResponse {
  status: string;
  data: VendorOrder[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface VendorOrdersResponse {
  data: VendorOrder[];
}

export interface VendorOrderResponse {
  status: string;
  data: VendorOrder;
}

export interface VendorOrderStatsResponse {
  status: string;
  data: VendorOrderStats;
}

export interface VendorOrderNoteResponse {
  status: string;
  message: string;
  data: VendorOrderNote;
}

export interface VendorOrderNotesResponse {
  status: string;
  data: VendorOrderNote[];
}

export interface VendorOrderActionResponse {
  status: string;
  message: string;
  data: VendorOrder;
}
