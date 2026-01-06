// Technician Types

export interface Role {
  id: number;
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  emirates_id: string | null;
  company: Company;
  roles: Role[];
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TechnicianListResponse {
  data: Technician[];
}

export interface TechnicianResponse {
  data: Technician;
}

export interface TechnicianInviteResponse {
  message: string;
  data: Technician;
}

export interface TechnicianUpdateResponse {
  message: string;
  data: Technician;
}

export interface DeleteResponse {
  message: string;
}

// Request types
export interface TechnicianInviteRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  invitation_message?: string;
}

export interface TechnicianUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Assignment Types
export interface TechnicianAvailability {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  active_jobs: number;
  is_available: boolean;
  working_hours: {
    start_time: string;
    end_time: string;
  } | null;
}

export interface TechnicianAvailabilityResponse {
  data: TechnicianAvailability[];
}

export interface WorkingHour {
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface WorkingHoursResponse {
  data: WorkingHour[];
}

export interface WorkingHoursRequest {
  working_hours: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[];
}

export interface UnavailableDay {
  id: string;
  date: string;
  reason: string | null;
}

export interface UnavailableDaysResponse {
  data: UnavailableDay[];
}

export interface UnavailableDayRequest {
  date: string;
  reason?: string;
}

export interface UnavailableDayResponse {
  message: string;
  data: UnavailableDay;
}

export interface TechnicianSchedule {
  orders: import('@/types/vendorOrder').VendorOrder[];
  unavailable_days: {
    date: string;
    reason: string | null;
  }[];
  working_hours: WorkingHour[];
}

export interface TechnicianScheduleResponse {
  data: TechnicianSchedule;
}
