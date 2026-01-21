import { getAuthFromStorage, ApiException } from './auth';

const API_URL = '/api';

export interface PaymentMethod {
  id: string;
  provider: string;
  brand: string;
  last4: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodListResponse {
  status: string;
  data: PaymentMethod[];
}

export interface PaymentMethodResponse {
  status: string;
  message?: string;
  data: PaymentMethod;
}

export interface SetupIntentResponse {
  status: string;
  data: {
    client_secret: string;
  };
}

export interface PaymentMethodDeleteResponse {
  status: string;
  message: string;
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

export async function getPaymentMethods(): Promise<PaymentMethodListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/payment-methods`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PaymentMethodListResponse>(response);
}

export async function createSetupIntent(): Promise<SetupIntentResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/payment-methods/setup-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<SetupIntentResponse>(response);
}

export async function attachPaymentMethod(paymentMethodId: string): Promise<PaymentMethodResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ payment_method_id: paymentMethodId }),
  });

  return handleResponse<PaymentMethodResponse>(response);
}

export async function setDefaultPaymentMethod(id: string): Promise<PaymentMethodResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/payment-methods/${id}/default`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PaymentMethodResponse>(response);
}

export async function deletePaymentMethod(id: string): Promise<PaymentMethodDeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/payment-methods/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<PaymentMethodDeleteResponse>(response);
}

// Helper function to get card brand icon/display name
export function getCardBrandDisplay(brand: string): { name: string; color: string } {
  const brands: Record<string, { name: string; color: string }> = {
    visa: { name: 'Visa', color: 'text-blue-600' },
    mastercard: { name: 'Mastercard', color: 'text-orange-600' },
    amex: { name: 'American Express', color: 'text-blue-500' },
    discover: { name: 'Discover', color: 'text-orange-500' },
    diners: { name: 'Diners Club', color: 'text-gray-600' },
    jcb: { name: 'JCB', color: 'text-green-600' },
    unionpay: { name: 'UnionPay', color: 'text-red-600' },
  };

  return brands[brand.toLowerCase()] || { name: brand, color: 'text-gray-600' };
}
