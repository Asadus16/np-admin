import { User, Role, LoginCredentials, RegisterCredentials, AuthResponse, getPrimaryRole } from '@/types/auth';
import { api, ApiException } from './api';

const AUTH_STORAGE_KEY = 'np_admin_auth';
const TOKEN_STORAGE_KEY = 'np_admin_token';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API Auth Functions
export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', credentials);
}

export async function apiRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  // If vendor registration with files, use FormData
  if (credentials.role === 'vendor') {
    return apiRegisterVendor(credentials);
  }
  return api.post<AuthResponse>('/auth/register', credentials);
}

// Vendor registration with FormData for file uploads
async function apiRegisterVendor(credentials: RegisterCredentials): Promise<AuthResponse> {
  const formData = new FormData();

  // Basic auth fields
  formData.append('first_name', credentials.first_name);
  formData.append('last_name', credentials.last_name);
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);
  formData.append('password_confirmation', credentials.password_confirmation);
  formData.append('role', 'vendor');

  // Company profile
  if (credentials.company_name) formData.append('company_name', credentials.company_name);
  if (credentials.company_email) formData.append('company_email', credentials.company_email);
  if (credentials.trade_license_number) formData.append('trade_license_number', credentials.trade_license_number);
  if (credentials.company_description) formData.append('company_description', credentials.company_description);
  if (credentials.landline) formData.append('landline', credentials.landline);
  if (credentials.website) formData.append('website', credentials.website);
  if (credentials.establishment) formData.append('establishment', credentials.establishment);

  // Primary Contact
  if (credentials.contact_first_name) formData.append('contact_first_name', credentials.contact_first_name);
  if (credentials.contact_last_name) formData.append('contact_last_name', credentials.contact_last_name);
  if (credentials.designation) formData.append('designation', credentials.designation);
  if (credentials.contact_email) formData.append('contact_email', credentials.contact_email);
  if (credentials.mobile_number) formData.append('mobile_number', credentials.mobile_number);
  if (credentials.emirates_id) formData.append('emirates_id', credentials.emirates_id);

  // Services - single category_id
  if (credentials.category_id) formData.append('category_id', credentials.category_id);

  // Service Areas (array)
  if (credentials.service_area_ids) {
    credentials.service_area_ids.forEach((id) => formData.append('service_area_ids[]', id));
  }

  // Services (array of objects with sub_services)
  if (credentials.services && credentials.services.length > 0) {
    formData.append('services', JSON.stringify(credentials.services));
  }

  // Legal & Bank
  if (credentials.trade_license_document) formData.append('trade_license_document', credentials.trade_license_document);
  if (credentials.vat_certificate) formData.append('vat_certificate', credentials.vat_certificate);
  if (credentials.bank_name) formData.append('bank_name', credentials.bank_name);
  if (credentials.account_holder_name) formData.append('account_holder_name', credentials.account_holder_name);
  if (credentials.iban) formData.append('iban', credentials.iban);
  if (credentials.swift_code) formData.append('swift_code', credentials.swift_code);
  if (credentials.trn) formData.append('trn', credentials.trn);

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiException(
      data.message || 'Registration failed',
      response.status,
      data.errors
    );
  }

  return data as AuthResponse;
}

export async function apiLogout(token: string): Promise<void> {
  await api.post<{ message: string }>('/auth/logout', {}, token);
}

export async function apiGetMe(token: string): Promise<{ user: User }> {
  return api.get<{ user: User }>('/auth/me', token);
}

// Phone authentication - exchange Firebase ID token for backend token
export async function apiLoginWithPhone(firebaseIdToken: string, phoneNumber: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login/phone', {
    firebase_id_token: firebaseIdToken,
    phone: phoneNumber,
  });
}

// Storage Functions
export function saveAuthToStorage(user: User, token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function getAuthFromStorage(): { user: User; token: string } | null {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedUser && storedToken) {
      try {
        return {
          user: JSON.parse(storedUser) as User,
          token: storedToken,
        };
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearAuthFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getRedirectPath(role: Role | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'vendor':
      return '/vendor';
    case 'customer':
      return '/customer';
    case 'technician':
      return '/vendor'; // Technicians use vendor portal
    default:
      // Default to vendor if no role found (instead of login to prevent loop)
      return '/vendor';
  }
}

export function getRedirectPathForUser(user: User): string {
  const primaryRole = getPrimaryRole(user);
  return getRedirectPath(primaryRole);
}

export { ApiException };
