import { getAuthFromStorage, ApiException } from './auth';
import {
  VendorBankDetailResponse,
  VendorBankDetail,
  CreateVendorBankDetailData,
  UpdateVendorBankDetailData,
} from '@/types/vendorBankDetail';

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

// ==================== Vendor Bank Detail Endpoints ====================

/**
 * Get bank details for vendor's company
 */
export async function getVendorBankDetail(): Promise<VendorBankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/bank-details`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorBankDetailResponse>(response);
}

/**
 * Create or update bank details for vendor's company
 */
export async function createOrUpdateVendorBankDetail(
  data: CreateVendorBankDetailData
): Promise<VendorBankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/bank-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorBankDetailResponse>(response);
}

/**
 * Update bank details for vendor's company
 */
export async function updateVendorBankDetail(
  data: UpdateVendorBankDetailData
): Promise<VendorBankDetailResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/bank-details`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorBankDetailResponse>(response);
}

/**
 * Delete bank details for vendor's company
 */
export async function deleteVendorBankDetail(): Promise<{ status: string; message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/bank-details`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ status: string; message: string }>(response);
}

/**
 * Format IBAN for display (mask middle part)
 */
export function formatIBAN(iban: string): string {
  if (!iban || iban.length < 8) return iban;
  const start = iban.substring(0, 4);
  const end = iban.substring(iban.length - 4);
  const middle = '*'.repeat(Math.max(0, iban.length - 8));
  return `${start}${middle}${end}`;
}
