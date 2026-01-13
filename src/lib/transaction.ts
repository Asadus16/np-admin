import { getAuthFromStorage, ApiException } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function getAuthToken(): Promise<string> {
  const auth = getAuthFromStorage();
  if (!auth?.token) {
    throw new ApiException("Not authenticated", 401);
  }
  return auth.token;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new ApiException(
      "Server returned an invalid response",
      response.status
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiException(
      data.message || "An error occurred",
      response.status,
      data.errors
    );
  }

  return data as T;
}

// Types
export interface PayoutRun {
  id: string;
  run_number: string;
  payout_date: string;
  period_start: string;
  period_end: string;
  vendor_count: number;
  total_amount: number;
  total_fees: number;
  net_amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
  processed_at: string | null;
  notes: string | null;
  created_at: string;
  items?: PayoutRunItem[];
}

export interface PayoutRunItem {
  id: string;
  payout_run_id: string;
  vendor_id: number;
  gross_amount: number;
  commission_amount: number;
  adjustment_amount: number;
  net_amount: number;
  order_count: number;
  status: string;
  transaction_reference: string | null;
  paid_at: string | null;
  vendor: {
    id: number;
    first_name: string;
    last_name: string;
    company?: {
      name: string;
    };
  };
}

export interface PayoutRunStats {
  total_runs: number;
  total_paid: number;
  total_vendors_paid: number;
  average_per_run: number;
}

export interface VendorAdjustment {
  id: string;
  adjustment_number: string;
  vendor_id: number;
  order_id: number | null;
  type: "credit" | "debit";
  amount: number;
  reason: string;
  description: string | null;
  status: "pending" | "applied" | "reversed";
  payout_run_id: string | null;
  created_by: number;
  approved_by: number | null;
  applied_at: string | null;
  created_at: string;
  vendor: {
    id: number;
    first_name: string;
    last_name: string;
    company?: {
      name: string;
    };
  };
  order?: {
    id: number;
    order_number: string;
  };
  created_by_user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface AdjustmentStats {
  total_adjustments: number;
  total_credits: number;
  total_debits: number;
  net_adjustment: number;
}

export interface TransactionFee {
  id: string;
  transaction_number: string;
  order_id: number;
  vendor_id: number;
  fee_type: "platform_commission" | "payment_processing" | "service_fee" | "other";
  order_amount: number;
  fee_rate: number;
  fee_amount: number;
  description: string | null;
  payout_run_id: string | null;
  created_at: string;
  vendor: {
    id: number;
    first_name: string;
    last_name: string;
    company?: {
      name: string;
    };
  };
  order?: {
    id: number;
    order_number: string;
  };
}

export interface FeeStats {
  total_fees: number;
  platform_fees: number;
  processing_fees: number;
  total_transactions: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Payout Runs API
export async function getPayoutRuns(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<{ data: PayoutRun[]; meta: PaginationMeta; stats: PayoutRunStats }> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.from_date) searchParams.set("from_date", params.from_date);
  if (params?.to_date) searchParams.set("to_date", params.to_date);

  const queryString = searchParams.toString();
  const url = `${API_URL}/admin/transactions/payout-runs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ data: PayoutRun[]; meta: PaginationMeta; stats: PayoutRunStats }>(response);
}

export async function getPayoutRun(id: string): Promise<{ data: PayoutRun }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/transactions/payout-runs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ data: PayoutRun }>(response);
}

// Company type for filter dropdown
export interface Company {
  id: string;
  name: string;
}

// Get companies for filter dropdown
export async function getCompanies(): Promise<{ data: Company[] }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/transactions/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return handleResponse<{ data: Company[] }>(response);
}

// Adjustments API
export async function getAdjustments(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  type?: "credit" | "debit";
  status?: "pending" | "applied" | "reversed";
  company_id?: string;
  from_date?: string;
  to_date?: string;
}): Promise<{ data: VendorAdjustment[]; meta: PaginationMeta; stats: AdjustmentStats }> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.company_id) searchParams.set("company_id", params.company_id);
  if (params?.from_date) searchParams.set("from_date", params.from_date);
  if (params?.to_date) searchParams.set("to_date", params.to_date);

  const queryString = searchParams.toString();
  const url = `${API_URL}/admin/transactions/adjustments${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ data: VendorAdjustment[]; meta: PaginationMeta; stats: AdjustmentStats }>(response);
}

export async function createAdjustment(data: {
  vendor_id: string;
  order_id?: string;
  type: "credit" | "debit";
  amount: number;
  reason: string;
  description?: string;
}): Promise<{ message: string; data: VendorAdjustment }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/transactions/adjustments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string; data: VendorAdjustment }>(response);
}

export async function applyAdjustment(id: string): Promise<{ message: string; data: VendorAdjustment }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/transactions/adjustments/${id}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ message: string; data: VendorAdjustment }>(response);
}

export async function reverseAdjustment(id: string): Promise<{ message: string; data: VendorAdjustment }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/transactions/adjustments/${id}/reverse`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ message: string; data: VendorAdjustment }>(response);
}

// Fees API
export async function getTransactionFees(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  fee_type?: string;
  company_id?: string;
  from_date?: string;
  to_date?: string;
}): Promise<{ data: TransactionFee[]; meta: PaginationMeta; stats: FeeStats }> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.fee_type) searchParams.set("fee_type", params.fee_type);
  if (params?.company_id) searchParams.set("company_id", params.company_id);
  if (params?.from_date) searchParams.set("from_date", params.from_date);
  if (params?.to_date) searchParams.set("to_date", params.to_date);

  const queryString = searchParams.toString();
  const url = `${API_URL}/admin/transactions/fees${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ data: TransactionFee[]; meta: PaginationMeta; stats: FeeStats }>(response);
}

// Helper functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getFeeTypeLabel(feeType: string): string {
  const labels: Record<string, string> = {
    platform_commission: "Platform Commission",
    payment_processing: "Payment Processing",
    service_fee: "Service Fee",
    other: "Other",
  };
  return labels[feeType] || feeType;
}
