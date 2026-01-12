// Refund request types

export type RefundReason =
  | 'service_not_satisfactory'
  | 'technician_no_show'
  | 'wrong_service'
  | 'overcharged'
  | 'changed_mind'
  | 'other';

export type RefundStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface RefundReasonOption {
  value: RefundReason;
  label: string;
}

// Customer-facing refund request
export interface RefundRequest {
  id: string;
  order_id: string;
  order_number: string;
  reason: RefundReason;
  reason_label: string;
  reason_details: string | null;
  status: RefundStatus;
  order_total: number;
  approved_amount: number | null;
  refund_percentage: number | null;
  vendor_response: string | null;
  transfer_reference: string | null;
  transfer_notes: string | null;
  reviewed_at: string | null;
  transfer_completed_at: string | null;
  created_at: string;
  vendor: {
    id: string;
    name: string;
    logo: string;
  };
}

// Admin-facing refund request (dispute)
export interface AdminDispute {
  id: string;
  order_id: string;
  order_number: string;
  reason: RefundReason;
  reason_label: string;
  reason_details: string | null;
  status: RefundStatus;
  order_total: number;
  approved_amount: number | null;
  refund_percentage: number | null;
  vendor_response: string | null;
  transfer_reference: string | null;
  transfer_notes: string | null;
  reviewed_at: string | null;
  transfer_completed_at: string | null;
  created_at: string;
  updated_at: string;
  company: {
    id: string;
    name: string;
    email: string;
    phone: string;
    category: {
      id: string;
      name: string;
    } | null;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    bank_details?: {
      bank_name: string;
      account_holder_name: string;
      iban: string;
      swift_code: string | null;
    } | null;
  };
  order?: {
    id: string;
    order_number: string;
    status: string;
    payment_type: string;
    total: number;
    scheduled_date: string;
    scheduled_time: string;
    completed_at: string | null;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  };
  reviewer?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

// Bank detail for customer
export interface CustomerBankDetail {
  id: string;
  bank_name: string;
  account_holder_name: string;
  iban: string;
  iban_masked: string;
  swift_code: string | null;
  is_default: boolean;
  created_at: string;
}

// Dispute statistics (admin)
export interface DisputeStats {
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
  total: number;
  total_approved_amount: number;
  total_order_amount?: number;
  this_month?: number;
  this_week?: number;
}

// Dispute stats grouped by company
export interface CompanyDisputeStats {
  company: {
    id: string;
    name: string;
  } | null;
  total: number;
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
  total_approved_amount: number;
}

export interface CompanyDisputeStatsResponse {
  status: string;
  data: CompanyDisputeStats[];
}

// API request payloads
export interface CreateRefundRequestData {
  reason: RefundReason;
  reason_details?: string;
}

export interface ApproveDisputeData {
  refund_percentage: number;
  notes?: string;
}

export interface RejectDisputeData {
  reason: string;
}

export interface CompleteDisputeData {
  transfer_reference: string;
  notes?: string;
}

export interface CreateBankDetailData {
  bank_name: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  is_default?: boolean;
}

export interface UpdateBankDetailData {
  bank_name?: string;
  account_holder_name?: string;
  iban?: string;
  swift_code?: string;
}

// API Responses
export interface RefundReasonsResponse {
  status: string;
  data: RefundReasonOption[];
}

export interface RefundRequestListResponse {
  status: string;
  data: RefundRequest[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RefundRequestResponse {
  status: string;
  data: RefundRequest;
}

export interface AdminDisputeListResponse {
  status: string;
  data: AdminDispute[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdminDisputeResponse {
  status: string;
  data: AdminDispute;
}

export interface DisputeStatsResponse {
  status: string;
  data: DisputeStats;
}

export interface BankDetailListResponse {
  status: string;
  data: CustomerBankDetail[];
}

export interface BankDetailResponse {
  status: string;
  data: CustomerBankDetail;
  message?: string;
}

export interface MessageResponse {
  status: string;
  message: string;
}
