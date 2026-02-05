import {
  VendorExclusivePlanListResponse,
  VendorExclusivePlanResponse,
  VendorExclusivePlanCreateResponse,
  VendorExclusivePlanUpdateResponse,
  VendorExclusivePlanDeleteResponse,
  VendorExclusivePlanFormData,
} from '@/types/vendorExclusivePlan';
import { getAuthFromStorage, ApiException } from './auth';
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

export async function getVendorExclusivePlans(page: number = 1): Promise<VendorExclusivePlanListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/vendor-exclusive-plans?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<VendorExclusivePlanListResponse>(response);
}

export async function getVendorExclusivePlan(id: string): Promise<VendorExclusivePlanResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/vendor-exclusive-plans/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<VendorExclusivePlanResponse>(response);
}

export async function createVendorExclusivePlan(
  data: VendorExclusivePlanFormData
): Promise<VendorExclusivePlanCreateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/vendor-exclusive-plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorExclusivePlanCreateResponse>(response);
}

export async function updateVendorExclusivePlan(
  id: string,
  data: Partial<VendorExclusivePlanFormData>
): Promise<VendorExclusivePlanUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/vendor-exclusive-plans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<VendorExclusivePlanUpdateResponse>(response);
}

export async function deleteVendorExclusivePlan(id: string): Promise<VendorExclusivePlanDeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/vendor-exclusive-plans/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<VendorExclusivePlanDeleteResponse>(response);
}
