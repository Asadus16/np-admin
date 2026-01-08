import {
  PointsSettingsResponse,
  PointsSettingsUpdateData,
} from '@/types/points';
import { getAuthFromStorage, ApiException } from './auth';

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
