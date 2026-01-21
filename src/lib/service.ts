import {
  ServiceListResponse,
  ServiceResponse,
  ServiceCreateResponse,
  ServiceFormData,
  SubServiceListResponse,
  SubServiceResponse,
  SubServiceCreateResponse,
  SubServiceFormData,
  DeleteResponse,
} from '@/types/service';
import { getAuthFromStorage, ApiException } from './auth';

const API_URL = '/api';

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

// ==================== Service Endpoints ====================

/**
 * Get a paginated list of all services for the authenticated vendor's company
 */
export async function getServices(
  page: number = 1,
  perPage: number = 15
): Promise<ServiceListResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/services?page=${page}&per_page=${perPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<ServiceListResponse>(response);
}

/**
 * Get a single service by ID including all its sub-services
 */
export async function getService(serviceId: string): Promise<ServiceResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/services/${serviceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ServiceResponse>(response);
}

/**
 * Create a new service
 */
export async function createService(
  data: ServiceFormData
): Promise<ServiceCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('name', data.name);

  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('category_id', data.category_id);

  if (data.image) {
    formData.append('image', data.image);
  }

  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/vendor/services`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<ServiceCreateResponse>(response);
}

/**
 * Update an existing service
 */
export async function updateService(
  serviceId: string,
  data: Partial<ServiceFormData>
): Promise<ServiceCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('_method', 'PUT');

  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.description !== undefined) {
    formData.append('description', data.description || '');
  }
  if (data.category_id) {
    formData.append('category_id', data.category_id);
  }
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/vendor/services/${serviceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<ServiceCreateResponse>(response);
}

/**
 * Delete a service (this will also delete all associated sub-services)
 */
export async function deleteService(
  serviceId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/vendor/services/${serviceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<DeleteResponse>(response);
}

// ==================== Sub-Service Endpoints ====================

/**
 * Get all sub-services for a specific service
 */
export async function getSubServices(
  serviceId: string,
  page: number = 1,
  perPage: number = 15
): Promise<SubServiceListResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/services/${serviceId}/sub-services?page=${page}&per_page=${perPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<SubServiceListResponse>(response);
}

/**
 * Get a single sub-service by ID
 */
export async function getSubService(
  serviceId: string,
  subServiceId: string
): Promise<SubServiceResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/services/${serviceId}/sub-services/${subServiceId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<SubServiceResponse>(response);
}

/**
 * Create a new sub-service for a service
 */
export async function createSubService(
  serviceId: string,
  data: SubServiceFormData
): Promise<SubServiceCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  formData.append('duration', data.duration.toString());

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append('images[]', file);
    });
  }

  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(
    `${API_URL}/vendor/services/${serviceId}/sub-services`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return handleResponse<SubServiceCreateResponse>(response);
}

/**
 * Update an existing sub-service
 */
export async function updateSubService(
  serviceId: string,
  subServiceId: string,
  data: Partial<SubServiceFormData>
): Promise<SubServiceCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('_method', 'PUT');

  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.price !== undefined) {
    formData.append('price', data.price.toString());
  }
  if (data.duration !== undefined) {
    formData.append('duration', data.duration.toString());
  }

  if (data.replace_images !== undefined) {
    formData.append('replace_images', data.replace_images ? '1' : '0');
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append('images[]', file);
    });
  }

  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(
    `${API_URL}/vendor/services/${serviceId}/sub-services/${subServiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return handleResponse<SubServiceCreateResponse>(response);
}

/**
 * Delete a sub-service
 */
export async function deleteSubService(
  serviceId: string,
  subServiceId: string
): Promise<DeleteResponse> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/vendor/services/${serviceId}/sub-services/${subServiceId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return handleResponse<DeleteResponse>(response);
}

