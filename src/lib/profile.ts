import { User } from '@/types/auth';
import { getAuthFromStorage, ApiException } from './auth';

const API_URL = '/api';

export interface ProfileResponse {
  status: string;
  data: User;
}

export interface ProfileUpdateResponse {
  status: string;
  message: string;
  data: User;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  emirates_id?: string;
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

export async function getProfile(): Promise<ProfileResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ProfileResponse>(response);
}

export async function updateProfile(data: ProfileUpdateData): Promise<ProfileUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<ProfileUpdateResponse>(response);
}

export async function uploadEmiratesId(
  frontImage?: File,
  backImage?: File
): Promise<ProfileUpdateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  if (frontImage) {
    formData.append('emirates_id_front', frontImage);
  }
  if (backImage) {
    formData.append('emirates_id_back', backImage);
  }

  const response = await fetch(`${API_URL}/customer/profile/emirates-id`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<ProfileUpdateResponse>(response);
}
