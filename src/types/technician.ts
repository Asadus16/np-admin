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
