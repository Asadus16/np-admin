// Vendor payout types

export interface VendorPayoutCompany {
  id: string;
  name: string;
  email: string;
}

export interface VendorPayoutUser {
  id: string;
  name: string;
  email: string;
}

export interface VendorPayoutOrderDetail {
  order_id: number;
  order_number: string;
  order_total: number;
  commission_rate: number;
  commission_amount: number;
  vendor_earnings: number;
  completed_at: string | null;
}

export interface VendorPayout {
  id: string;
  payout_number: string;
  status: 'pending' | 'processing' | 'paid' | 'cancelled';
  requested_amount: number;
  approved_amount: number | null;
  request_notes: string | null;
  admin_notes: string | null;
  payment_reference: string | null;
  payment_notes: string | null;
  order_ids: number[] | null;
  company?: VendorPayoutCompany;
  requested_by?: VendorPayoutUser;
  processed_by?: VendorPayoutUser | null;
  processed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorEarnings {
  total_earnings: number;
  total_orders: number;
  orders: VendorPayoutOrderDetail[];
  currency: string;
}

export interface VendorPayoutStats {
  available_earnings: number;
  total_requested: number;
  total_paid: number;
  pending_amount: number;
  processing_amount: number;
  currency: string;
  payout_counts: {
    pending: number;
    processing: number;
    paid: number;
    cancelled: number;
  };
}

export interface AdminPayoutStats {
  total_requested: number;
  total_paid: number;
  pending_amount: number;
  processing_amount: number;
  currency: string;
  payout_counts: {
    pending: number;
    processing: number;
    paid: number;
    cancelled: number;
  };
}

// API Responses
export interface VendorEarningsResponse {
  status: string;
  data: VendorEarnings;
  message: string;
}

export interface VendorPayoutListResponse {
  status: string;
  data: VendorPayout[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface VendorPayoutResponse {
  status: string;
  data: VendorPayout;
  message: string;
}

export interface VendorPayoutStatsResponse {
  status: string;
  data: VendorPayoutStats;
  message: string;
}

export interface AdminPayoutStatsResponse {
  status: string;
  data: AdminPayoutStats;
  message: string;
}

export interface CreateVendorPayoutData {
  requested_amount?: number;
  request_notes?: string;
  order_ids?: number[];
}

export interface ApprovePayoutData {
  approved_amount?: number;
  admin_notes?: string;
}

export interface MarkPayoutPaidData {
  payment_reference: string;
  payment_notes?: string;
}
