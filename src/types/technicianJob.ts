// Technician Job Types

export type TechnicianStatus =
  | 'pending'
  | 'assigned'
  | 'acknowledged'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface TechnicianJobCustomer {
  id: string;
  user_id: number; // Raw user ID for chat
  name: string;
  email: string;
  phone: string;
}

export interface TechnicianJobAddress {
  id: string;
  label: string;
  street_address: string;
  building: string | null;
  apartment: string | null;
  city: string;
  emirate: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TechnicianJobItem {
  id: string;
  sub_service_id: string;
  service_name: string;
  sub_service_name: string;
  unit_price: number;
  quantity: number;
  duration_minutes: number;
  total_price: number;
}

export interface TechnicianJobCompany {
  id: string;
  name: string;
  phone: string | null;
}

export interface TechnicianJobNote {
  id: string;
  content: string;
  is_internal: boolean;
  author: {
    id: string;
    name: string;
  };
  created_at: string;
}

export interface TechnicianJobEvidence {
  id: string;
  type: 'before' | 'after' | 'other';
  url: string;
  file_name: string;
  caption: string | null;
  created_at: string;
}

export interface TechnicianJob {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  technician_status: TechnicianStatus;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_type: 'card' | 'cash' | 'wallet';
  subtotal: number;
  discount_amount: number;
  tax: number;
  total: number;
  scheduled_date: string;
  scheduled_time: string;
  total_duration_minutes: number;
  notes: string | null;
  customer: TechnicianJobCustomer;
  address: TechnicianJobAddress;
  items: TechnicianJobItem[];
  company?: TechnicianJobCompany;
  order_notes?: TechnicianJobNote[];
  evidence?: TechnicianJobEvidence[];
  assigned_at: string | null;
  acknowledged_at: string | null;
  on_the_way_at: string | null;
  arrived_at: string | null;
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TechnicianJobStats {
  today_jobs: number;
  pending_acknowledge: number;
  in_progress: number;
  completed_today: number;
  completed_this_week: number;
  completed_this_month: number;
}

export interface TechnicianHistoryStats {
  total_jobs: number;
  this_month_jobs: number;
  total_earnings: number;
}

export interface TechnicianWorkingHour {
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface TechnicianUnavailableDay {
  id: string;
  date: string;
  reason: string | null;
}

export interface TechnicianSchedule {
  orders: TechnicianJob[];
  unavailable_days: TechnicianUnavailableDay[];
  working_hours: TechnicianWorkingHour[];
}

// API Responses
export interface TechnicianJobsResponse {
  data: TechnicianJob[];
}

export interface TechnicianJobResponse {
  data: TechnicianJob;
}

export interface TechnicianJobActionResponse {
  message: string;
  data: TechnicianJob;
}

export interface TechnicianJobStatsResponse {
  data: TechnicianJobStats;
}

export interface TechnicianHistoryStatsResponse {
  status: string;
  data: TechnicianHistoryStats;
}

export interface TechnicianScheduleResponse {
  data: TechnicianSchedule;
}

export interface TechnicianWorkingHoursResponse {
  data: TechnicianWorkingHour[];
}

export interface TechnicianUnavailableDaysResponse {
  data: TechnicianUnavailableDay[];
}

export interface TechnicianNoteResponse {
  message: string;
  data: TechnicianJobNote;
}

export interface TechnicianEvidenceResponse {
  message: string;
  data: TechnicianJobEvidence;
}

export interface TechnicianDayOffRequest {
  date: string;
  reason?: string;
}

export interface TechnicianDayOffResponse {
  message: string;
  data: TechnicianUnavailableDay;
}
