import {
  CategoryListResponse,
  CategoryResponse,
  CategoryCreateResponse,
  CategoryFormData,
} from '@/types/category';
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

export async function getCategories(page: number = 1): Promise<CategoryListResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/categories?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CategoryListResponse>(response);
}

export async function getCategory(id: string): Promise<CategoryResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<CategoryResponse>(response);
}

export async function createCategory(data: CategoryFormData): Promise<CategoryCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('name', data.name);

  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<CategoryCreateResponse>(response);
}

export async function updateCategory(
  id: string,
  data: CategoryFormData
): Promise<CategoryCreateResponse> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('_method', 'PUT');

  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.description !== undefined) {
    formData.append('description', data.description || '');
  }
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status ? '1' : '0');
  }

  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<CategoryCreateResponse>(response);
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

// Public API - no authentication required (for vendor signup)
export async function getPublicCategories(page: number = 1): Promise<CategoryListResponse> {
  const response = await fetch(`${API_URL}/public/categories?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return handleResponse<CategoryListResponse>(response);
}
