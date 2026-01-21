import {
  TechnicianListResponse,
  TechnicianResponse,
  TechnicianInviteResponse,
  TechnicianUpdateResponse,
  DeleteResponse,
  TechnicianInviteRequest,
  TechnicianUpdateRequest,
  TechnicianAvailabilityResponse,
  WorkingHoursResponse,
  WorkingHoursRequest,
  UnavailableDaysResponse,
  UnavailableDayRequest,
  UnavailableDayResponse,
  TechnicianScheduleResponse,
} from '@/types/technician';
import { VendorOrdersResponse, VendorOrderActionResponse } from '@/types/vendorOrder';
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

// ==================== Assignment Endpoints ====================

/**
 * Get technicians with availability info for a specific date
 */
export async function getTechniciansWithAvailability(
  date?: string
): Promise<TechnicianAvailabilityResponse> {
  const token = await getAuthToken();

  const params = new URLSearchParams();
  if (date) params.append('date', date);

  const queryString = params.toString();
  const url = `${API_URL}/vendor/assignments/technicians${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianAvailabilityResponse>(response);
}

/**
 * Get unassigned orders
 */
export async function getUnassignedOrders(): Promise<VendorOrdersResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/assignments/unassigned`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrdersResponse>(response);
}

/**
 * Get assigned orders with optional filters
 */
export async function getAssignedOrders(params?: {
  technician_id?: string;
  date?: string;
}): Promise<VendorOrdersResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.technician_id) searchParams.append('technician_id', params.technician_id);
  if (params?.date) searchParams.append('date', params.date);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/assignments/assigned${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrdersResponse>(response);
}

/**
 * Assign a technician to an order
 */
export async function assignTechnician(
  orderId: string,
  technicianId: string
): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/assignments/orders/${orderId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ technician_id: technicianId }),
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Auto-assign the closest available technician to an order
 */
export async function autoAssignTechnician(
  orderId: string
): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/assignments/orders/${orderId}/auto-assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

/**
 * Remove technician from an order
 */
export async function unassignTechnician(
  orderId: string
): Promise<VendorOrderActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/assignments/orders/${orderId}/unassign`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorOrderActionResponse>(response);
}

// ==================== Working Hours Endpoints ====================

/**
 * Get a technician's working hours
 */
export async function getWorkingHours(
  technicianId: string
): Promise<WorkingHoursResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}/working-hours`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<WorkingHoursResponse>(response);
}

/**
 * Set a technician's working hours
 */
export async function setWorkingHours(
  technicianId: string,
  data: WorkingHoursRequest
): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}/working-hours`,
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

  return handleResponse<{ message: string }>(response);
}

// ==================== Unavailable Days Endpoints ====================

/**
 * Get a technician's unavailable days
 */
export async function getUnavailableDays(
  technicianId: string,
  params?: { from?: string; to?: string }
): Promise<UnavailableDaysResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append('from', params.from);
  if (params?.to) searchParams.append('to', params.to);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/technicians/${technicianId}/unavailable-days${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<UnavailableDaysResponse>(response);
}

/**
 * Add an unavailable day for a technician
 */
export async function addUnavailableDay(
  technicianId: string,
  data: UnavailableDayRequest
): Promise<UnavailableDayResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}/unavailable-days`,
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

  return handleResponse<UnavailableDayResponse>(response);
}

/**
 * Remove an unavailable day for a technician
 */
export async function removeUnavailableDay(
  technicianId: string,
  unavailableDayId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/technicians/${technicianId}/unavailable-days/${unavailableDayId}`,
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

// ==================== Schedule Endpoint ====================

/**
 * Get a technician's schedule/calendar
 */
export async function getTechnicianSchedule(
  technicianId: string,
  params?: { from?: string; to?: string }
): Promise<TechnicianScheduleResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append('from', params.from);
  if (params?.to) searchParams.append('to', params.to);

  const queryString = searchParams.toString();
  const url = `${API_URL}/vendor/technicians/${technicianId}/schedule${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianScheduleResponse>(response);
}
