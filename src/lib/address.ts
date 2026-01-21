import { getAuthFromStorage, ApiException } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Address {
  id: string;
  user_id: string;
  label: 'Home' | 'Work' | 'Other';
  street_address: string;
  building: string | null;
  apartment: string | null;
  city: string;
  emirate: string;
  service_area_id?: string | null;
  service_area?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  label: 'Home' | 'Work' | 'Other';
  street_address: string;
  building?: string;
  apartment?: string;
  city: string;
  emirate: string;
  service_area_id?: string;
  latitude?: number | null;
  longitude?: number | null;
  is_primary?: boolean;
}

export interface AddressListResponse {
  status: string;
  data: Address[];
}

export interface AddressResponse {
  status: string;
  message?: string;
  data: Address;
}

export interface AddressDeleteResponse {
  status: string;
  message: string;
}

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

export async function getAddresses(): Promise<AddressListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<AddressListResponse>(response);
}

export async function getAddress(id: string): Promise<AddressResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<AddressResponse>(response);
}

export async function createAddress(data: AddressFormData): Promise<AddressResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AddressResponse>(response);
}

export async function updateAddress(id: string, data: Partial<AddressFormData>): Promise<AddressResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AddressResponse>(response);
}

export async function deleteAddress(id: string): Promise<AddressDeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<AddressDeleteResponse>(response);
}

export async function setAddressPrimary(id: string): Promise<AddressResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/addresses/${id}/primary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<AddressResponse>(response);
}
