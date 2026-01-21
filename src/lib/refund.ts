import { getAuthFromStorage, ApiException } from './auth';
import {
  RefundReasonsResponse,
  RefundRequestListResponse,
  RefundRequestResponse,
  CreateRefundRequestData,
  BankDetailListResponse,
  BankDetailResponse,
  CreateBankDetailData,
  UpdateBankDetailData,
  MessageResponse,
  RefundStatus,
} from '@/types/refund';

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

// ==================
// Refund Requests
// ==================

/**
 * Get refund reason options
 */
export async function getRefundReasons(): Promise<RefundReasonsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/refund-requests/reasons`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RefundReasonsResponse>(response);
}

/**
 * Get customer's refund requests
 */
export async function getRefundRequests(params?: {
  page?: number;
  per_page?: number;
  status?: RefundStatus;
}): Promise<RefundRequestListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.status) searchParams.append('status', params.status);

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/refund-requests${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RefundRequestListResponse>(response);
}

/**
 * Get a single refund request
 */
export async function getRefundRequest(id: string): Promise<RefundRequestResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/refund-requests/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RefundRequestResponse>(response);
}

/**
 * Create a refund request for an order
 */
export async function createRefundRequest(
  orderId: string,
  data: CreateRefundRequestData
): Promise<RefundRequestResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/orders/${orderId}/refund-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<RefundRequestResponse>(response);
}

/**
 * Cancel a pending refund request
 */
export async function cancelRefundRequest(id: string): Promise<RefundRequestResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/refund-requests/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RefundRequestResponse>(response);
}

// ==================
// Bank Details
// ==================

/**
 * Get customer's bank details
 */
export async function getBankDetails(): Promise<BankDetailListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<BankDetailListResponse>(response);
}

/**
 * Add a new bank detail
 */
export async function addBankDetail(data: CreateBankDetailData): Promise<BankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<BankDetailResponse>(response);
}

/**
 * Get a single bank detail
 */
export async function getBankDetail(id: string): Promise<BankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<BankDetailResponse>(response);
}

/**
 * Update a bank detail
 */
export async function updateBankDetail(
  id: string,
  data: UpdateBankDetailData
): Promise<BankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<BankDetailResponse>(response);
}

/**
 * Delete a bank detail
 */
export async function deleteBankDetail(id: string): Promise<MessageResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<MessageResponse>(response);
}

/**
 * Set a bank detail as default
 */
export async function setDefaultBankDetail(id: string): Promise<BankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/bank-details/${id}/default`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<BankDetailResponse>(response);
}

// ==================
// Helper Functions
// ==================

/**
 * Get refund status display info
 */
export function getRefundStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    approved: { label: 'Approved', color: 'text-blue-600 bg-blue-100' },
    completed: { label: 'Completed', color: 'text-green-600 bg-green-100' },
    rejected: { label: 'Rejected', color: 'text-red-600 bg-red-100' },
    cancelled: { label: 'Cancelled', color: 'text-gray-600 bg-gray-100' },
  };

  return statusMap[status] || { label: status, color: 'text-gray-600 bg-gray-100' };
}
