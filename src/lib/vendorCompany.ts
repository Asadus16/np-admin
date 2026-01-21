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

export interface CompanyHourSlot {
  id: string;
  start_time: string;
  end_time: string;
}

export interface CompanyHour {
  id: string;
  day: string;
  is_available: boolean;
  slots: CompanyHourSlot[];
}

export interface VendorCompany {
  id: string;
  name: string;
  email: string;
  trade_license_number: string;
  description: string;
  landline: string;
  website: string;
  latitude: number | null;
  longitude: number | null;
  establishment: string;
  company_hours: CompanyHour[];
  created_at: string;
  updated_at: string;
}

export interface VendorCompanyResponse {
  data: VendorCompany;
}

/**
 * Get the authenticated vendor's company with hours
 */
export async function getVendorCompany(): Promise<VendorCompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/my-company`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<VendorCompanyResponse>(response);
}

/**
 * Calculate calendar hours range from company hours
 */
export function getCalendarHoursFromCompanyHours(companyHours: CompanyHour[]): { startHour: number; endHour: number } {
  let earliestHour = 8; // Default to 8 AM
  let latestHour = 22; // Default to 10 PM

  if (companyHours && companyHours.length > 0) {
    companyHours.forEach(day => {
      if (day.is_available && day.slots && day.slots.length > 0) {
        day.slots.forEach(slot => {
          // Parse start time (format: "HH:MM:SS")
          const startHour = parseInt(slot.start_time.split(':')[0]);
          // Parse end time and round up
          const endHour = Math.ceil(parseFloat(slot.end_time.split(':')[0]));

          if (startHour < earliestHour) earliestHour = startHour;
          if (endHour > latestHour) latestHour = endHour;
        });
      }
    });
  }

  return { startHour: earliestHour, endHour: latestHour };
}
