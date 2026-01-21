import { getAuthFromStorage, ApiException } from './auth';
import {
  RecurringOrder,
  RecurringOrderListResponse,
  RecurringOrderResponse,
  RecurringOrderStatsResponse,
  RecurringOrderActionResponse,
} from '@/types/recurringOrder';

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

// ===========================
// Customer API functions
// ===========================

export async function getRecurringOrders(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<RecurringOrderListResponse> {
  const token = await getAuthToken();
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/recurring-orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderListResponse>(response);
}

export async function getRecurringOrder(id: string): Promise<RecurringOrderResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/recurring-orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderResponse>(response);
}

export async function getRecurringOrderStats(): Promise<RecurringOrderStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/recurring-orders/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderStatsResponse>(response);
}

export async function getRecurringOrderHistory(
  id: string,
  params?: { page?: number; per_page?: number }
): Promise<{ data: unknown[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }> {
  const token = await getAuthToken();
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/recurring-orders/${id}/orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ data: unknown[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }>(response);
}

export async function pauseRecurringOrder(id: string): Promise<RecurringOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/recurring-orders/${id}/pause`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderActionResponse>(response);
}

export async function resumeRecurringOrder(id: string): Promise<RecurringOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/recurring-orders/${id}/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderActionResponse>(response);
}

export async function cancelRecurringOrder(id: string): Promise<RecurringOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/recurring-orders/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderActionResponse>(response);
}

// ===========================
// Vendor API functions
// ===========================

export async function getVendorRecurringOrders(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<RecurringOrderListResponse> {
  const token = await getAuthToken();
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
  if (params?.status && params.status !== 'all') searchParams.set('status', params.status);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/recurring-orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderListResponse>(response);
}

export async function getVendorRecurringOrder(id: string): Promise<RecurringOrderResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/recurring-orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderResponse>(response);
}

export async function getVendorRecurringOrderStats(): Promise<RecurringOrderStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/recurring-orders/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<RecurringOrderStatsResponse>(response);
}

// ===========================
// Helper functions
// ===========================

export function formatFrequency(recurring: RecurringOrder): string {
  return recurring.frequency_label || formatFrequencyType(recurring.frequency_type, recurring.frequency_interval);
}

export function formatFrequencyType(type: string, interval: number = 1): string {
  switch (type) {
    case 'daily':
      return 'Every day';
    case 'weekly':
      return 'Every week';
    case 'biweekly':
      return 'Every 2 weeks';
    case 'monthly':
      return 'Every month';
    case 'custom':
      return interval === 1 ? 'Every day' : `Every ${interval} days`;
    default:
      return type;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  // Handle both "HH:mm" and "HH:mm:ss" formats
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-AE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
