// Customer-facing order types

export interface OrderItem {
  id: string;
  sub_service_id: string;
  service_name: string;
  sub_service_name: string;
  unit_price: number;
  quantity: number;
  duration_minutes: number;
  total_price: number;
}

export interface OrderVendor {
  id: string;
  name: string;
  logo: string;
  user_id?: number; // Raw user ID for chat (primary vendor)
}

export interface OrderTechnician {
  id: number; // Raw ID for chat
  name: string;
  email: string;
  phone: string;
}

export interface OrderAddress {
  id: string;
  label: string;
  street_address: string;
  building: string | null;
  apartment: string | null;
  city: string;
  emirate: string;
}

export interface OrderPaymentMethod {
  id: string;
  brand: string;
  last4: string;
}

export interface OrderCoupon {
  id: string;
  code: string;
  discount: number;
}

export interface Order {
  id: string;
  order_number: string;
  vendor: OrderVendor;
  technician: OrderTechnician | null;
  address: OrderAddress;
  payment_method: OrderPaymentMethod | null;
  coupon: OrderCoupon | null;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_type: 'card' | 'cash' | 'wallet';
  subtotal: number;
  discount_amount: number;
  tax: number;
  total: number;
  scheduled_date: string;
  scheduled_time: string;
  notes: string | null;
  cancellation_reason: string | null;
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

// Vendor for customer listing
export interface CustomerVendor {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  category: {
    id: string;
    name: string;
    commission_rate?: string;
  } | null;
  service_areas: Array<{
    id: string;
    name: string;
  }>;
  services: CustomerVendorService[] | null;
  landline: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  is_favorite: boolean;
  rating: number;
  reviews_count: number;
  starting_price: number | null;
  response_time: string;
  available: boolean;
  vat?: {
    enabled: boolean;
    rate: number;
    tax_registration_number: string | null;
  };
}

export interface CustomerVendorService {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  sub_services: CustomerVendorSubService[];
}

export interface CustomerVendorSubService {
  id: string;
  name: string;
  price: number | string; // API returns as string, but we'll convert to number for calculations
  duration: number;
  images: string[];
}

// Form data for creating an order
export interface CreateOrderData {
  vendor_id: string;
  address_id: string;
  payment_method_id?: string;
  payment_type: 'card' | 'cash' | 'wallet';
  coupon_code?: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
  items: Array<{
    sub_service_id: string;
    quantity: number;
  }>;
}

// API Responses
export interface OrderListResponse {
  status: string;
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderResponse {
  status: string;
  data: Order;
}

export interface OrderCreateResponse {
  status: string;
  message: string;
  data: Order;
}

export interface OrderCancelResponse {
  status: string;
  message: string;
  data: Order;
}

export interface CouponValidateResponse {
  status: string;
  data: {
    code: string;
    discount: number;
    min_order: number;
  };
}

export interface CustomerVendorListResponse {
  data: CustomerVendor[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CustomerVendorResponse {
  data: CustomerVendor;
}

// Category for customer
export interface CustomerCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface CustomerCategoryListResponse {
  data: CustomerCategory[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
