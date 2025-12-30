import { User, Role, LoginCredentials, RegisterCredentials, AuthResponse, getPrimaryRole } from '@/types/auth';
import { api, ApiException } from './api';

const AUTH_STORAGE_KEY = 'np_admin_auth';
const TOKEN_STORAGE_KEY = 'np_admin_token';

// API Auth Functions
export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', credentials);
}

export async function apiRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', credentials);
}

export async function apiLogout(token: string): Promise<void> {
  await api.post<{ message: string }>('/auth/logout', {}, token);
}

export async function apiGetMe(token: string): Promise<{ user: User }> {
  return api.get<{ user: User }>('/auth/me', token);
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
    default:
      return '/login';
  }
}

export function getRedirectPathForUser(user: User): string {
  const primaryRole = getPrimaryRole(user);
  return getRedirectPath(primaryRole);
}

export { ApiException };
