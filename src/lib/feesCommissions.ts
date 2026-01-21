import {
  FeesCommissionsSettingsResponse,
  FeesCommissionsSettingsUpdateData,
  CategoryCommissionOverrideListResponse,
  CategoryCommissionOverrideResponse,
  CategoryCommissionOverrideCreateData,
  CategoryCommissionOverrideUpdateData,
  CategoryCommissionOverrideDeleteResponse,
  TaxSettings,
} from '@/types/feesCommissions';
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

// ==================== Fees & Commissions Settings Endpoints ====================

/**
 * Get fees and commissions settings
 */
export async function getFeesCommissionsSettings(): Promise<FeesCommissionsSettingsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/settings/fees-commissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<FeesCommissionsSettingsResponse>(response);
}

/**
 * Update fees and commissions settings
 */
export async function updateFeesCommissionsSettings(
  data: FeesCommissionsSettingsUpdateData
): Promise<FeesCommissionsSettingsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/settings/fees-commissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<FeesCommissionsSettingsResponse>(response);
}

// ==================== Category Commission Overrides Endpoints ====================

/**
 * Get category commission overrides with pagination
 */
export async function getCategoryCommissionOverrides(
  page: number = 1,
  perPage: number = 50,
  categoryId?: string
): Promise<CategoryCommissionOverrideListResponse> {
  const token = await getAuthToken();

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (categoryId) {
    params.append('category_id', categoryId);
  }

  const response = await fetch(
    `${API_URL}/admin/settings/fees-commissions/category-overrides?${params}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<CategoryCommissionOverrideListResponse>(response);
}

/**
 * Create or update a category commission override
 * If an override already exists for the category, it will be updated
 */
export async function createOrUpdateCategoryCommissionOverride(
  data: CategoryCommissionOverrideCreateData
): Promise<CategoryCommissionOverrideResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/admin/settings/fees-commissions/category-overrides`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<CategoryCommissionOverrideResponse>(response);
}

/**
 * Update an existing category commission override
 */
export async function updateCategoryCommissionOverride(
  id: string,
  data: CategoryCommissionOverrideUpdateData
): Promise<CategoryCommissionOverrideResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/admin/settings/fees-commissions/category-overrides/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<CategoryCommissionOverrideResponse>(response);
}

/**
 * Delete a category commission override
 */
export async function deleteCategoryCommissionOverride(
  id: string
): Promise<CategoryCommissionOverrideDeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/admin/settings/fees-commissions/category-overrides/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<CategoryCommissionOverrideDeleteResponse>(response);
}

// ==================== Customer Tax Settings Endpoint ====================

/**
 * Get tax settings for customers (public/customer-facing endpoint)
 */
export async function getCustomerTaxSettings(): Promise<{ status: string; data: TaxSettings }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/settings/tax`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ status: string; data: TaxSettings }>(response);
}

// ==================== Commission Calculation Helper ====================

/**
 * Calculate commission for an order
 * @param orderTotal - Total order amount
 * @param commissionRate - Commission rate (0-100)
 * @param minimumCommission - Minimum commission amount
 * @returns Calculated commission
 */
export function calculateCommission(
  orderTotal: number,
  commissionRate: number,
  minimumCommission: number
): number {
  const calculatedCommission = (orderTotal * commissionRate) / 100;
  return Math.max(calculatedCommission, minimumCommission);
}
