import { getAuthFromStorage, ApiException } from './auth';
import {
  VendorEarningsResponse,
  VendorPayoutListResponse,
  VendorPayoutResponse,
  VendorPayoutStatsResponse,
  CreateVendorPayoutData,
  ApprovePayoutData,
  MarkPayoutPaidData,
} from '@/types/vendorPayout';

import { API_BASE_URL } from '@/config';

const API_URL = API_BASE_URL;

async function getAuthToken(): Promise<string> {
  const auth = getAuthFromStorage();
  if (!auth?.token) {
    throw new ApiException('Not authenticated', 401);
  }
  return auth.token;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiException(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  return data as T;
}

// ==================== Vendor Payout Endpoints ====================

/**
 * Calculate available earnings for vendor
 */
export async function getVendorEarnings(orderIds?: number[]): Promise<VendorEarningsResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (orderIds && orderIds.length > 0) {
    searchParams.append('order_ids', JSON.stringify(orderIds));
  }

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/payouts/earnings${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorEarningsResponse>(response);
}

/**
 * Get vendor payout statistics
 */
export async function getVendorPayoutStats(): Promise<VendorPayoutStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/payouts/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutStatsResponse>(response);
}

/**
 * Get vendor payout requests with optional filters
 */
export async function getVendorPayouts(params?: {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'processing' | 'paid' | 'cancelled';
  sort?: 'latest' | 'oldest';
}): Promise<VendorPayoutListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.sort) searchParams.append('sort', params.sort);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/payouts${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutListResponse>(response);
}

/**
 * Get a single payout request by ID
 */
export async function getVendorPayout(payoutId: string): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/payouts/${payoutId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutResponse>(response);
}

/**
 * Create a payout request
 */
export async function createVendorPayout(
  data: CreateVendorPayoutData
): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/payouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorPayoutResponse>(response);
}

/**
 * Cancel a payout request
 */
export async function cancelVendorPayout(
  payoutId: string,
  notes?: string
): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/payouts/${payoutId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  });

  return handleResponse<VendorPayoutResponse>(response);
}

// ==================== Admin Payout Endpoints ====================

/**
 * Get all payout requests (admin)
 */
export async function getAdminPayouts(params?: {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'processing' | 'paid' | 'cancelled';
  company_id?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
}): Promise<VendorPayoutListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.company_id) searchParams.append('company_id', params.company_id);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.sort) searchParams.append('sort', params.sort);

  const queryString = searchParams.toString();
  const url = `${API_URL}/admin/payouts${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutListResponse>(response);
}

/**
 * Get admin payout statistics
 */
export async function getAdminPayoutStats(): Promise<VendorPayoutStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/payouts/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutStatsResponse>(response);
}

/**
 * Get a single payout request by ID (admin)
 */
export async function getAdminPayout(payoutId: string): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/payouts/${payoutId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorPayoutResponse>(response);
}

/**
 * Approve a payout request (admin)
 */
export async function approvePayout(
  payoutId: string,
  data: ApprovePayoutData
): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/payouts/${payoutId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorPayoutResponse>(response);
}

/**
 * Mark payout as paid (admin)
 */
export async function markPayoutPaid(
  payoutId: string,
  data: MarkPayoutPaidData
): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/payouts/${payoutId}/mark-paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorPayoutResponse>(response);
}

/**
 * Cancel a payout request (admin)
 */
export async function cancelAdminPayout(
  payoutId: string,
  notes?: string
): Promise<VendorPayoutResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/payouts/${payoutId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  });

  return handleResponse<VendorPayoutResponse>(response);
}

// ==================== Helper Functions ====================

/**
 * Format currency
 */
export function formatCurrency(value: number, currency: string = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Get payout status display info
 */
export function getPayoutStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  };

  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
}

/**
 * Format date
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
