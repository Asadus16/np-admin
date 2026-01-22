/**
 * Application constants
 */

// API Configuration
// Use NEXT_PUBLIC_API_URL directly for backend API calls
const getApiBaseUrl = (): string => {
  // Use NEXT_PUBLIC_API_URL if set, otherwise default to relative path
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback to relative path (for local development without env var)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Storage URL for images/files (direct access, not through API proxy)
export const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || '';

// App Configuration
export const APP_NAME = 'NP Admin';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'np_admin_token',
  AUTH_DATA: 'np_admin_auth',
  USER: 'np_admin_user',
  THEME: 'np_admin_theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  ADMIN_DASHBOARD: '/admin',
  VENDOR_DASHBOARD: '/vendor',
  CUSTOMER_DASHBOARD: '/customer',
  TECHNICIAN_DASHBOARD: '/technician',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date/Time Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';

// Currency
export const CURRENCY = 'AED';
export const CURRENCY_LOCALE = 'en-AE';
