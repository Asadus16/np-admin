import {
  PointsBalanceResponse,
  PointsHistoryResponse,
  PointsCalculationResponse,
  RedemptionCalculationResponse,
  RedeemPointsResponse,
  CancelRedemptionResponse,
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

// ==================== Customer Points Endpoints ====================

/**
 * Get customer points balance
 */
export async function getPointsBalance(): Promise<PointsBalanceResponse> {
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
export async function getPointsHistory(params: {
  page?: number;
  per_page?: number;
  type?: string;
  from_date?: string;
  to_date?: string;
} = {}): Promise<PointsHistoryResponse> {
  const token = await getAuthToken();

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.type) queryParams.append('type', params.type);
  if (params.from_date) queryParams.append('from_date', params.from_date);
  if (params.to_date) queryParams.append('to_date', params.to_date);

  const response = await fetch(
    `${API_URL}/customer/points/history?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<PointsHistoryResponse>(response);
}

/**
 * Calculate points for an order
 */
export async function calculateOrderPoints(
  orderId: number
): Promise<PointsCalculationResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/customer/orders/${orderId}/points/calculate`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<PointsCalculationResponse>(response);
}

/**
 * Calculate redemption discount
 */
export async function calculateRedemption(
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

/**
 * Redeem points for an order
 */
export async function redeemPoints(
  orderId: number,
  pointsToRedeem: number
): Promise<RedeemPointsResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/customer/orders/${orderId}/points/redeem`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        points_to_redeem: pointsToRedeem,
      }),
    }
  );

  return handleResponse<RedeemPointsResponse>(response);
}

/**
 * Cancel points redemption
 */
export async function cancelPointsRedemption(
  orderId: number
): Promise<CancelRedemptionResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/customer/orders/${orderId}/points/cancel-redemption`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<CancelRedemptionResponse>(response);
}
