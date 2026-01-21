import {
  CouponListResponse,
  CouponResponse,
  CouponCreateResponse,
  CouponUpdateResponse,
  DeleteResponse,
  CouponFormData,
} from '@/types/coupon';
import { getAuthFromStorage, ApiException } from './auth';

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

// ==================== Coupon Endpoints ====================

/**
 * Get all coupons (paginated)
 */
export async function getCoupons(page: number = 1): Promise<CouponListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CouponListResponse>(response);
}

/**
 * Get a single coupon by ID
 */
export async function getCoupon(couponId: string): Promise<CouponResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons/${couponId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CouponResponse>(response);
}

/**
 * Create a new coupon
 */
export async function createCoupon(
  data: CouponFormData
): Promise<CouponCreateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CouponCreateResponse>(response);
}

/**
 * Update a coupon (full update with PUT)
 */
export async function updateCoupon(
  couponId: string,
  data: CouponFormData
): Promise<CouponUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons/${couponId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CouponUpdateResponse>(response);
}

/**
 * Partially update a coupon (PATCH)
 */
export async function patchCoupon(
  couponId: string,
  data: Partial<CouponFormData>
): Promise<CouponUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons/${couponId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CouponUpdateResponse>(response);
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(
  couponId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/coupons/${couponId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<DeleteResponse>(response);
}
