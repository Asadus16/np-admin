import {
  CompanyHoursListResponse,
  CompanyHourResponse,
  CompanyHoursCreateResponse,
  CompanyHourUpdateResponse,
  DeleteResponse,
  CompanyHoursBulkRequest,
  CompanyHourUpdateRequest,
} from '@/types/companyHours';
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

// ==================== Company Hours Endpoints ====================

/**
 * Get all company hours for the authenticated vendor's company
 */
export async function getCompanyHours(): Promise<CompanyHoursListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/company-hours`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyHoursListResponse>(response);
}

/**
 * Get a single company hour by ID
 */
export async function getCompanyHour(
  companyHourId: string
): Promise<CompanyHourResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/company-hours/${companyHourId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<CompanyHourResponse>(response);
}

/**
 * Create or update multiple company hours (bulk operation)
 */
export async function createOrUpdateCompanyHours(
  data: CompanyHoursBulkRequest
): Promise<CompanyHoursCreateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/company-hours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CompanyHoursCreateResponse>(response);
}

/**
 * Update a single company hour
 */
export async function updateCompanyHour(
  companyHourId: string,
  data: CompanyHourUpdateRequest
): Promise<CompanyHourUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/company-hours/${companyHourId}`,
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

  return handleResponse<CompanyHourUpdateResponse>(response);
}

/**
 * Delete a company hour
 */
export async function deleteCompanyHour(
  companyHourId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/company-hours/${companyHourId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<DeleteResponse>(response);
}
