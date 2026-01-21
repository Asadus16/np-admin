import { getAuthFromStorage, ApiException } from './auth';
import {
  VendorOrderListResponse,
  VendorOrderResponse,
  VendorOrderStatsResponse,
  VendorOrderActionResponse,
  VendorOrderNoteResponse,
  VendorOrderNotesResponse,
} from '@/types/vendorOrder';

const API_URL = '/api';

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

/**
 * Get vendor orders with optional filters
 */
export async function getVendorOrders(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  sort?: 'latest' | 'oldest' | 'scheduled';
}): Promise<VendorOrderListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.sort) searchParams.append('sort', params.sort);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderListResponse>(response);
}

/**
 * Get vendor order statistics
 */
export async function getVendorOrderStats(): Promise<VendorOrderStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderStatsResponse>(response);
}

/**
 * Get a single vendor order by ID
 */
export async function getVendorOrder(orderId: string): Promise<VendorOrderResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderResponse>(response);
}

/**
 * Confirm (accept) an order
 */
export async function confirmOrder(orderId: string): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Decline an order
 */
export async function declineOrder(orderId: string, reason?: string): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/decline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Start work on an order
 */
export async function startOrder(orderId: string): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Complete an order
 */
export async function completeOrder(orderId: string): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Get order notes
 */
export async function getOrderNotes(orderId: string): Promise<VendorOrderNotesResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/notes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderNotesResponse>(response);
}

/**
 * Add a note to an order
 */
export async function addOrderNote(
  orderId: string,
  content: string,
  isInternal: boolean = true
): Promise<VendorOrderNoteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/orders/${orderId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content, is_internal: isInternal }),
  });

  return handleResponse<VendorOrderNoteResponse>(response);
}

/**
 * Helper function to format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper function to format date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Helper function to format time
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Helper function to get status display info
 */
export function getOrderStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    recurring: { label: 'Recurring', color: 'bg-cyan-100 text-cyan-800' },
  };

  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
}

/**
 * Helper function to get payment status display info
 */
export function getPaymentStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
  };

  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
}
