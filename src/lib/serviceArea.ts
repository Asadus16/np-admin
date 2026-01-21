import {
  ServiceAreaListResponse,
  ServiceAreaResponse,
  ServiceAreaCreateResponse,
  ServiceAreaFormData,
} from '@/types/serviceArea';
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

export async function getServiceAreas(page: number = 1): Promise<ServiceAreaListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/service-areas?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ServiceAreaListResponse>(response);
}

export async function getServiceArea(id: string): Promise<ServiceAreaResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/service-areas/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ServiceAreaResponse>(response);
}

export async function createServiceArea(data: ServiceAreaFormData): Promise<ServiceAreaCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('name', data.name);

  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/admin/service-areas`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<ServiceAreaCreateResponse>(response);
}

export async function updateServiceArea(
  id: string,
  data: ServiceAreaFormData
): Promise<ServiceAreaCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('_method', 'PUT');

  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.description !== undefined) {
    formData.append('description', data.description || '');
  }
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/admin/service-areas/${id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<ServiceAreaCreateResponse>(response);
}

export async function deleteServiceArea(id: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/service-areas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

// Public API - no authentication required (for vendor signup)
export async function getPublicServiceAreas(page: number = 1): Promise<ServiceAreaListResponse> {
  const response = await fetch(`${API_URL}/public/service-areas?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return handleResponse<ServiceAreaListResponse>(response);
}
