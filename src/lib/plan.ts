import {
  PlanListResponse,
  PlanResponse,
  PlanCreateResponse,
  PlanUpdateResponse,
  PlanDeleteResponse,
  PlanFormData,
} from '@/types/plan';
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

export async function getPlans(page: number = 1): Promise<PlanListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/plans?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PlanListResponse>(response);
}

export async function getPlan(id: string): Promise<PlanResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/plans/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PlanResponse>(response);
}

export async function createPlan(data: PlanFormData): Promise<PlanCreateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<PlanCreateResponse>(response);
}

export async function updatePlan(
  id: string,
  data: PlanFormData
): Promise<PlanUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/plans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<PlanUpdateResponse>(response);
}

export async function deletePlan(id: string): Promise<PlanDeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/plans/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PlanDeleteResponse>(response);
}
