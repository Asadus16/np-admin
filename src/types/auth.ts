export type Role = 'admin' | 'vendor' | 'user' | 'technician';

export interface UserRole {
  id: number;
  name: Role;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  // Vendor-specific fields
  vendorId?: string;
  vendorName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: Role;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

// Helper to check if user has a specific role
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}

// Helper to get primary role (first role)
export function getPrimaryRole(user: User | null): Role | null {
  if (!user || user.roles.length === 0) return null;
  return user.roles[0].name;
}
