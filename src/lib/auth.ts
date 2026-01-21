import { User, Role, LoginCredentials, RegisterCredentials, AuthResponse, getPrimaryRole } from '@/types/auth';
import api, { ApiException } from './api';
import { API_BASE_URL } from '@/config';

const AUTH_STORAGE_KEY = 'np_admin_auth';
const TOKEN_STORAGE_KEY = 'np_admin_token';
const API_URL = API_BASE_URL;

// API Auth Functions
export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', credentials);
}

export async function apiRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  // If vendor registration with files, use FormData
  if (credentials.role === 'vendor') {
    return apiRegisterVendor(credentials);
  }
  // If customer registration with files, use FormData
  if (credentials.role === 'customer') {
    return apiRegisterCustomer(credentials);
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
  if (credentials.latitude) formData.append('latitude', credentials.latitude.toString());
  if (credentials.longitude) formData.append('longitude', credentials.longitude.toString());

  // Primary Contact
  if (credentials.contact_first_name) formData.append('contact_first_name', credentials.contact_first_name);
  if (credentials.contact_last_name) formData.append('contact_last_name', credentials.contact_last_name);
  if (credentials.designation) formData.append('designation', credentials.designation);
  if (credentials.contact_email) formData.append('contact_email', credentials.contact_email);
  if (credentials.phone) formData.append('phone', credentials.phone);
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

// Customer registration with FormData for file uploads
async function apiRegisterCustomer(credentials: RegisterCredentials): Promise<AuthResponse> {
  const formData = new FormData();

  // Basic auth fields
  formData.append('first_name', credentials.first_name);
  formData.append('last_name', credentials.last_name);
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);
  formData.append('password_confirmation', credentials.password_confirmation);

  // Firebase ID token for phone verification
  console.log("[DEBUG] apiRegisterCustomer - firebase_id_token:", credentials.firebase_id_token ? "Yes (length: " + credentials.firebase_id_token.length + ")" : "No");
  console.log("[DEBUG] apiRegisterCustomer - phone:", credentials.phone);
  if (credentials.firebase_id_token) formData.append('firebase_id_token', credentials.firebase_id_token);

  // Customer-specific fields
  if (credentials.phone) formData.append('phone', credentials.phone);
  if (credentials.nationality) formData.append('nationality', credentials.nationality);
  if (credentials.date_of_birth) formData.append('date_of_birth', credentials.date_of_birth);

  // Emirates ID (backend expects 'emirates_id' not 'emirates_id_number')
  if (credentials.emirates_id_number) formData.append('emirates_id', credentials.emirates_id_number);
  if (credentials.emirates_id_front) formData.append('emirates_id_front', credentials.emirates_id_front);
  if (credentials.emirates_id_back) formData.append('emirates_id_back', credentials.emirates_id_back);

  // Service Area
  if (credentials.service_area_id) formData.append('service_area_id', credentials.service_area_id);

  // Address (backend expects nested format: address.field_name)
  if (credentials.address_label) formData.append('address[label]', credentials.address_label);
  if (credentials.address_street) formData.append('address[street_address]', credentials.address_street);
  if (credentials.address_building) formData.append('address[building]', credentials.address_building);
  if (credentials.address_apartment) formData.append('address[apartment]', credentials.address_apartment);
  if (credentials.address_city) formData.append('address[city]', credentials.address_city);
  if (credentials.address_emirate) formData.append('address[emirate]', credentials.address_emirate);
  if (credentials.address_latitude) formData.append('address[latitude]', credentials.address_latitude.toString());
  if (credentials.address_longitude) formData.append('address[longitude]', credentials.address_longitude.toString());

  // Payment (backend expects nested format: payment.field_name)
  if (!credentials.skip_payment) {
    if (credentials.card_number) formData.append('payment[card_number]', credentials.card_number);
    if (credentials.card_expiry) formData.append('payment[expiry_date]', credentials.card_expiry);
    if (credentials.card_name) formData.append('payment[cardholder_name]', credentials.card_name);
    // Note: CVV is typically not stored/sent to backend for security
  }

  // Use the customer-specific endpoint
  const response = await fetch(`${API_URL}/customer/register`, {
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
      return '/technician';
    default:
      // Default to login if no role found
      return '/login';
  }
}

export function getRedirectPathForUser(user: User): string {
  const primaryRole = getPrimaryRole(user);
  return getRedirectPath(primaryRole);
}

export { ApiException };
