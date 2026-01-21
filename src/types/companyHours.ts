// Company Hours Types

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export interface CompanyHourSlot {
  id?: string;
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
}

export interface CompanyHour {
  id: string;
  day: DayOfWeek;
  is_available: boolean;
  slots: CompanyHourSlot[];
  created_at: string;
  updated_at: string;
}

export interface CompanyHoursListResponse {
  data: CompanyHour[];
}

export interface CompanyHourResponse {
  data: CompanyHour;
}

export interface CompanyHoursCreateResponse {
  message: string;
  data: CompanyHour[];
}

export interface CompanyHourUpdateResponse {
  message: string;
  data: CompanyHour;
}

export interface DeleteResponse {
  message: string;
}

// Request types
export interface CompanyHourSlotInput {
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
}

export interface CompanyHourInput {
  day: DayOfWeek;
  is_available?: boolean;
  slots?: CompanyHourSlotInput[];
}

export interface CompanyHoursBulkRequest {
  hours: CompanyHourInput[];
}

export interface CompanyHourUpdateRequest {
  is_available?: boolean;
  slots?: CompanyHourSlotInput[];
}
