import { getAuthFromStorage, ApiException } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface BankDetails {
  id: string;
  bank_name: string;
  account_holder_name: string;
  iban: string | null;
  swift_code: string | null;
  trn: string | null;
}

export interface SubService {
  id: string;
  name: string;
  price: string;
  duration: number;
  status: boolean;
}

export interface CompanyService {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  status: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  sub_services?: SubService[];
}

export interface Company {
  id: string;
  user_id?: number; // Raw user ID for chat (primary vendor)
  name: string;
  email: string | null;
  trade_license_number: string;
  description: string | null;
  landline: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  establishment: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  service_areas: Array<{
    id: string;
    name: string;
  }>;
  trade_license_document: string | null;
  vat_certificate: string | null;
  approved: boolean;
  bank_details: BankDetails | null;
  services?: CompanyService[];
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyResponse {
  data: Company;
}

export interface CompanyUpdateData {
  name?: string;
  email?: string;
  description?: string;
  landline?: string;
  website?: string;
  bank_name?: string;
  account_holder_name?: string;
  iban?: string;
  swift_code?: string;
  trn?: string;
}

export interface ServiceAreaWithStatus {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  selected: boolean;
}

export interface ServiceAreasResponse {
  data: ServiceAreaWithStatus[];
}

export interface UpdateServiceAreasData {
  service_area_ids: string[];
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

/**
 * Get the current vendor's company
 */
export async function getMyCompany(): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/my-company`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Update the current vendor's company
 */
export async function updateMyCompany(data: CompanyUpdateData): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/my-company`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Get all service areas with vendor's selection status
 */
export async function getVendorServiceAreas(): Promise<ServiceAreasResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/service-areas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ServiceAreasResponse>(response);
}

/**
 * Update the vendor's selected service areas
 */
export async function updateVendorServiceAreas(data: UpdateServiceAreasData): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/service-areas`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CompanyResponse>(response);
}

// ============================================
// Admin Company API Functions
// ============================================

export interface CompanyListResponse {
  data: Company[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Get all companies (admin)
 */
export async function getCompanies(page: number = 1): Promise<CompanyListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyListResponse>(response);
}

/**
 * Get pending companies awaiting approval (admin)
 */
export async function getPendingCompanies(page: number = 1): Promise<CompanyListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/pending?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyListResponse>(response);
}

/**
 * Get approved companies (admin)
 */
export async function getApprovedCompanies(page: number = 1): Promise<CompanyListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/approved?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyListResponse>(response);
}

/**
 * Get a single company by ID (admin)
 */
export async function getCompany(id: string): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Approve a company (admin)
 */
export async function approveCompany(id: string): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Reject a company (admin)
 */
export async function rejectCompany(id: string): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Update a company (admin)
 */
export async function updateCompanyAdmin(id: string, data: CompanyUpdateData): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CompanyResponse>(response);
}

/**
 * Delete a company (admin)
 */
export async function deleteCompany(id: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

export interface CreateCompanyData {
  name: string;
  email?: string;
  trade_license_number: string;
  description?: string;
  landline?: string;
  website?: string;
  establishment?: string;
  category_id?: string;
  service_area_ids?: string[];
  bank_name?: string;
  account_holder_name?: string;
  iban?: string;
  swift_code?: string;
  trn?: string;
  approved?: boolean;
}

/**
 * Create a company (admin)
 */
export async function createCompany(data: CreateCompanyData): Promise<CompanyResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CompanyResponse>(response);
}
