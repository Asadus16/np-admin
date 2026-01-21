import {
  PointsSettingsResponse,
  PointsSettingsUpdateData,
  PointsBalanceResponse,
  PointsHistoryResponse,
  RedemptionCalculationResponse,
} from '@/types/points';
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

// ==================== Points Settings Endpoints ====================

/**
 * Get points settings
 */
export async function getPointsSettings(): Promise<PointsSettingsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/points/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PointsSettingsResponse>(response);
}

/**
 * Update points settings
 */
export async function updatePointsSettings(
  data: PointsSettingsUpdateData
): Promise<PointsSettingsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/points/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<PointsSettingsResponse>(response);
}

// ==================== Customer Points Endpoints ====================

/**
 * Get customer points balance
 */
export async function getCustomerPointsBalance(): Promise<PointsBalanceResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/points/balance`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PointsBalanceResponse>(response);
}

/**
 * Get customer points history
 */
export async function getCustomerPointsHistory(params?: {
  type?: 'earned' | 'redeemed' | 'adjusted';
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}): Promise<PointsHistoryResponse> {
  const token = await getAuthToken();

  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append('type', params.type);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const response = await fetch(`${API_URL}/customer/points/history?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PointsHistoryResponse>(response);
}

/**
 * Calculate redemption discount
 */
export async function calculateRedemptionDiscount(
  pointsToRedeem: number,
  orderTotal: number
): Promise<RedemptionCalculationResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/points/calculate-redemption`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      points_to_redeem: pointsToRedeem,
      order_total: orderTotal,
    }),
  });

  return handleResponse<RedemptionCalculationResponse>(response);
}
