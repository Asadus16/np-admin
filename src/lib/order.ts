import { getAuthFromStorage, ApiException } from './auth';
import {
  OrderListResponse,
  OrderResponse,
  OrderCreateResponse,
  OrderCancelResponse,
  CouponValidateResponse,
  CreateOrderData,
} from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
 * Get a list of customer orders with optional filters
 */
export async function getOrders(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  sort?: 'latest' | 'oldest';
}): Promise<OrderListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.sort) searchParams.append('sort', params.sort);

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<OrderListResponse>(response);
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<OrderResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<OrderResponse>(response);
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<OrderCreateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<OrderCreateResponse>(response);
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<OrderCancelResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  return handleResponse<OrderCancelResponse>(response);
}

/**
 * Validate a coupon code
 */
export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/orders/validate-coupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ code, subtotal }),
  });

  return handleResponse<CouponValidateResponse>(response);
}

/**
 * Helper function to get status display info
 */
export function getOrderStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-100' },
    in_progress: { label: 'In Progress', color: 'text-purple-600 bg-purple-100' },
    completed: { label: 'Completed', color: 'text-green-600 bg-green-100' },
    cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-100' },
  };

  return statusMap[status] || { label: status, color: 'text-gray-600 bg-gray-100' };
}

/**
 * Helper function to get payment status display info
 */
export function getPaymentStatusDisplay(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    paid: { label: 'Paid', color: 'text-green-600 bg-green-100' },
    failed: { label: 'Failed', color: 'text-red-600 bg-red-100' },
    refunded: { label: 'Refunded', color: 'text-gray-600 bg-gray-100' },
  };

  return statusMap[status] || { label: status, color: 'text-gray-600 bg-gray-100' };
}
