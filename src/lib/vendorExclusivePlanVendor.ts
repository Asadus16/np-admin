import { VendorExclusivePlan } from '@/types/vendorExclusivePlan';
import { API_BASE_URL } from '@/config';

export interface VendorMyExclusivePlansResponse {
  data: VendorExclusivePlan[];
}

export interface VendorExclusivePlanResponse {
  data: VendorExclusivePlan;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export async function getMyExclusivePlans(token: string): Promise<VendorMyExclusivePlansResponse> {
  const response = await fetch(`${API_BASE_URL}/vendor/exclusive-plans`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch exclusive plans');
  }
  return data;
}

export async function getExclusivePlan(
  planId: string,
  token: string
): Promise<VendorExclusivePlanResponse> {
  const response = await fetch(`${API_BASE_URL}/vendor/exclusive-plans/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch plan');
  }
  return data;
}

export async function createExclusivePlanPaymentIntent(
  planId: string,
  token: string
): Promise<CreatePaymentIntentResponse> {
  const response = await fetch(
    `${API_BASE_URL}/vendor/exclusive-plans/${planId}/create-payment-intent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create payment');
  }
  return data;
}

export async function confirmExclusivePlanPayment(
  planId: string,
  token: string
): Promise<VendorExclusivePlanResponse> {
  const response = await fetch(
    `${API_BASE_URL}/vendor/exclusive-plans/${planId}/confirm-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to confirm payment');
  }
  return data;
}
