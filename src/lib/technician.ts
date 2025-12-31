import {
  TechnicianListResponse,
  TechnicianResponse,
  TechnicianInviteResponse,
  TechnicianUpdateResponse,
  DeleteResponse,
  TechnicianInviteRequest,
  TechnicianUpdateRequest,
} from '@/types/technician';
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

// ==================== Technician Endpoints ====================

/**
 * Get all technicians for the authenticated vendor's company
 */
export async function getTechnicians(): Promise<TechnicianListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/technicians`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianListResponse>(response);
}

/**
 * Get a single technician by ID
 */
export async function getTechnician(
  technicianId: string
): Promise<TechnicianResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<TechnicianResponse>(response);
}

/**
 * Invite a new technician
 */
export async function inviteTechnician(
  data: TechnicianInviteRequest
): Promise<TechnicianInviteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/technicians`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<TechnicianInviteResponse>(response);
}

/**
 * Update a technician
 */
export async function updateTechnician(
  technicianId: string,
  data: TechnicianUpdateRequest
): Promise<TechnicianUpdateResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}`,
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

  return handleResponse<TechnicianUpdateResponse>(response);
}

/**
 * Delete a technician
 */
export async function deleteTechnician(
  technicianId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}`,
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
