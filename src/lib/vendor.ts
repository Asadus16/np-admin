import { getAuthFromStorage, ApiException } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

export interface VendorOnboardingData {
  // Company Profile
  company_name: string;
  trade_license_number: string;
  description?: string;
  business_landline?: string;
  website?: string;
  establishment_date?: string;

  // Primary Contact
  contact_first_name: string;
  contact_last_name: string;
  designation?: string;
  contact_email: string;
  mobile_number: string;
  emirates_id?: string;

  // Services
  category_ids: string[];

  // Service Areas
  service_area_ids: string[];

  // Legal & Bank
  trade_license_file?: File;
  vat_certificate_file?: File;
  bank_name: string;
  account_holder_name: string;
  iban: string;
  swift_code?: string;
  trn?: string;
}

export interface VendorOnboardingResponse {
  success: boolean;
  message: string;
  data?: {
    vendor_id: string;
    status: string;
  };
}

export async function submitVendorOnboarding(
  data: VendorOnboardingData
): Promise<VendorOnboardingResponse> {
  const token = await getAuthToken();

  const formData = new FormData();

  // Company Profile
  formData.append('company_name', data.company_name);
  formData.append('trade_license_number', data.trade_license_number);
  if (data.description) formData.append('description', data.description);
  if (data.business_landline) formData.append('business_landline', data.business_landline);
  if (data.website) formData.append('website', data.website);
  if (data.establishment_date) formData.append('establishment_date', data.establishment_date);

  // Primary Contact
  formData.append('contact_first_name', data.contact_first_name);
  formData.append('contact_last_name', data.contact_last_name);
  if (data.designation) formData.append('designation', data.designation);
  formData.append('contact_email', data.contact_email);
  formData.append('mobile_number', data.mobile_number);
  if (data.emirates_id) formData.append('emirates_id', data.emirates_id);

  // Services (array of category IDs)
  data.category_ids.forEach((id) => {
    formData.append('category_ids[]', id);
  });

  // Service Areas (array of service area IDs)
  data.service_area_ids.forEach((id) => {
    formData.append('service_area_ids[]', id);
  });

  // Legal & Bank
  if (data.trade_license_file) {
    formData.append('trade_license_file', data.trade_license_file);
  }
  if (data.vat_certificate_file) {
    formData.append('vat_certificate_file', data.vat_certificate_file);
  }
  formData.append('bank_name', data.bank_name);
  formData.append('account_holder_name', data.account_holder_name);
  formData.append('iban', data.iban);
  if (data.swift_code) formData.append('swift_code', data.swift_code);
  if (data.trn) formData.append('trn', data.trn);

  const response = await fetch(`${API_URL}/vendor/onboarding`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<VendorOnboardingResponse>(response);
}
