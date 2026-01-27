import { getAuthFromStorage, ApiException } from './auth';
import {
  CustomerVendorListResponse,
  CustomerVendorResponse,
  CustomerCategoryListResponse,
} from '@/types/order';

import { API_BASE_URL } from '@/config';

const API_URL = API_BASE_URL;

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
 * Get all categories for customer order flow (uses public endpoint)
 */
export async function getCustomerCategories(): Promise<CustomerCategoryListResponse> {
  const response = await fetch(`${API_URL}/public/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return handleResponse<CustomerCategoryListResponse>(response);
}

/**
 * Get vendors list with optional filters
 * Results are sorted by distance (nearest to farthest) by default
 */
export async function getCustomerVendors(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  sort?: 'distance' | 'newest' | 'name';
}): Promise<CustomerVendorListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.sort) searchParams.append('sort', params.sort);

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/vendors${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CustomerVendorListResponse>(response);
}

/**
 * Get a single vendor by ID with full details
 */
export async function getCustomerVendor(vendorId: string): Promise<CustomerVendorResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/vendors/${vendorId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CustomerVendorResponse>(response);
}

/**
 * Get customer's favorite vendors
 */
export async function getFavoriteVendors(params?: {
  page?: number;
  per_page?: number;
}): Promise<CustomerVendorListResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

  const queryString = searchParams.toString();
  const url = `${API_URL}/customer/vendors/favorites${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CustomerVendorListResponse>(response);
}

/**
 * Add vendor to favorites
 */
export async function addVendorToFavorites(vendorId: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/vendors/${vendorId}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Remove vendor from favorites
 */
export async function removeVendorFromFavorites(vendorId: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/customer/vendors/${vendorId}/favorite`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Helper function to format distance display
 */
export function formatDistance(distanceKm: number | null): string {
  if (distanceKm === null) return 'Distance unavailable';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Helper function to format price display
 */
export function formatPrice(price: number | null): string {
  if (price === null) return 'Price on request';
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get available time slots for a vendor on a specific date
 */
export interface AvailableTimeSlot {
  time: string;
  available_technicians: Array<{
    id: string;
    name: string;
  }>;
  available_count: number;
}

export interface AvailableTimeSlotsResponse {
  data: AvailableTimeSlot[];
}

export async function getAvailableTimeSlots(
  vendorId: string,
  date: string,
  serviceDuration: number
): Promise<AvailableTimeSlotsResponse> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  searchParams.append('date', date);
  searchParams.append('service_duration', serviceDuration.toString());

  const response = await fetch(
    `${API_URL}/customer/vendors/${vendorId}/available-time-slots?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<AvailableTimeSlotsResponse>(response);
}
