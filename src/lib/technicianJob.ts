import {
  TechnicianJobsResponse,
  TechnicianJobResponse,
  TechnicianJobActionResponse,
  TechnicianJobStatsResponse,
  TechnicianHistoryStatsResponse,
  TechnicianScheduleResponse,
  TechnicianWorkingHoursResponse,
  TechnicianUnavailableDaysResponse,
  TechnicianNoteResponse,
  TechnicianEvidenceResponse,
  TechnicianDayOffRequest,
  TechnicianDayOffResponse,
} from '@/types/technicianJob';
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

// ==================== Job Endpoints ====================

/**
 * Get all jobs assigned to the technician
 */
export async function getJobs(params?: {
  status?: string;
  date?: string;
}): Promise<TechnicianJobsResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.date) searchParams.append('date', params.date);

  const queryString = searchParams.toString();
  const url = `${API_URL}/technician/jobs${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobsResponse>(response);
}

/**
 * Get job stats for dashboard
 */
export async function getJobStats(): Promise<TechnicianJobStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobStatsResponse>(response);
}

/**
 * Get job history stats
 */
export async function getHistoryStats(): Promise<TechnicianHistoryStatsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/history/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianHistoryStatsResponse>(response);
}

/**
 * Get a specific job
 */
export async function getJob(jobId: string): Promise<TechnicianJobResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobResponse>(response);
}

/**
 * Acknowledge/accept a job
 */
export async function acknowledgeJob(jobId: string): Promise<TechnicianJobActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/acknowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobActionResponse>(response);
}

/**
 * Decline/reject a job
 */
export async function declineJob(jobId: string, reason: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/decline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Mark as on the way
 */
export async function markOnTheWay(jobId: string): Promise<TechnicianJobActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/on-the-way`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobActionResponse>(response);
}

/**
 * Mark as arrived
 */
export async function markArrived(jobId: string): Promise<TechnicianJobActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/arrived`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobActionResponse>(response);
}

/**
 * Start a job
 */
export async function startJob(jobId: string): Promise<TechnicianJobActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobActionResponse>(response);
}

/**
 * Complete a job
 */
export async function completeJob(jobId: string): Promise<TechnicianJobActionResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianJobActionResponse>(response);
}

/**
 * Add a note to a job
 */
export async function addJobNote(
  jobId: string,
  content: string,
  isInternal: boolean = false
): Promise<TechnicianNoteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content, is_internal: isInternal }),
  });

  return handleResponse<TechnicianNoteResponse>(response);
}

/**
 * Upload evidence photo
 */
export async function uploadEvidence(
  jobId: string,
  file: File,
  type: 'before' | 'after' | 'other',
  caption?: string
): Promise<TechnicianEvidenceResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (caption) formData.append('caption', caption);

  const response = await fetch(`${API_URL}/technician/jobs/${jobId}/evidence`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<TechnicianEvidenceResponse>(response);
}

/**
 * Delete evidence photo
 */
export async function deleteEvidence(
  jobId: string,
  evidenceId: string
): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/technician/jobs/${jobId}/evidence/${evidenceId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<{ message: string }>(response);
}

// ==================== Scheduling Endpoints ====================

/**
 * Get technician's schedule
 */
export async function getSchedule(params?: {
  from?: string;
  to?: string;
}): Promise<TechnicianScheduleResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append('from', params.from);
  if (params?.to) searchParams.append('to', params.to);

  const queryString = searchParams.toString();
  const url = `${API_URL}/technician/scheduling${queryString ? `?${queryString}` : ''}`;

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

/**
 * Get working hours
 */
export async function getWorkingHours(): Promise<TechnicianWorkingHoursResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/scheduling/working-hours`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianWorkingHoursResponse>(response);
}

/**
 * Get unavailable days
 */
export async function getUnavailableDays(params?: {
  from?: string;
  to?: string;
}): Promise<TechnicianUnavailableDaysResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append('from', params.from);
  if (params?.to) searchParams.append('to', params.to);

  const queryString = searchParams.toString();
  const url = `${API_URL}/technician/scheduling/unavailable-days${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<TechnicianUnavailableDaysResponse>(response);
}

/**
 * Request a day off
 */
export async function requestDayOff(
  data: TechnicianDayOffRequest
): Promise<TechnicianDayOffResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/scheduling/day-off`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<TechnicianDayOffResponse>(response);
}

/**
 * Cancel a day off request
 */
export async function cancelDayOff(dayOffId: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/scheduling/day-off/${dayOffId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

// ==================== Availability Endpoints ====================

/**
 * Get technician availability status
 */
export async function getAvailability(): Promise<{ status: string; data: { is_available: boolean } }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/availability`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ status: string; data: { is_available: boolean } }>(response);
}

/**
 * Toggle technician availability status
 */
export async function toggleAvailability(isAvailable: boolean): Promise<{ status: string; message: string; data: { is_available: boolean } }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/technician/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ is_available: isAvailable }),
  });

  return handleResponse<{ status: string; message: string; data: { is_available: boolean } }>(response);
}
