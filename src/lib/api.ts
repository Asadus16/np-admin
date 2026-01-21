import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/config';

/**
 * Create and configure axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor - Add auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      // Only add token if not already set (allows explicit token override)
      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle common errors and unwrap data
 */
axiosInstance.interceptors.response.use(
  (response) => response.data, // Unwrap to return data directly
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isPublicEndpoint = url.includes('/public/');

      if (!isPublicEndpoint && typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_DATA);
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to create config with token
 */
function createConfig(token?: string): AxiosRequestConfig | undefined {
  if (!token) return undefined;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

/**
 * API wrapper that returns data directly (not AxiosResponse)
 * Supports signature: (endpoint, data?, token?)
 */
const api = {
  get: <T>(url: string, token?: string): Promise<T> =>
    axiosInstance.get(url, createConfig(token)),

  post: <T>(url: string, data?: unknown, token?: string): Promise<T> =>
    axiosInstance.post(url, data, createConfig(token)),

  put: <T>(url: string, data?: unknown, token?: string): Promise<T> =>
    axiosInstance.put(url, data, createConfig(token)),

  patch: <T>(url: string, data?: unknown, token?: string): Promise<T> =>
    axiosInstance.patch(url, data, createConfig(token)),

  delete: <T>(url: string, token?: string): Promise<T> =>
    axiosInstance.delete(url, createConfig(token)),
};

export default api;

/**
 * Export the raw axios instance for cases where full response is needed
 */
export { axiosInstance };

/**
 * API Response wrapper type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * ApiException class for backwards compatibility
 */
export class ApiException extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}
