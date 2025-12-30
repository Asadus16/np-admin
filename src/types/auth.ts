export type Role = 'admin' | 'vendor' | 'user' | 'technician';

export interface UserRole {
  id: number;
  name: Role;
  guard_name?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string; // Legacy field, may not be present
  phone?: string | null;
  emirates_id?: string | null;
  // Support multiple formats from backend
  roles?: UserRole[] | string[];
  role?: Role; // Single role field (alternative format)
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  // Vendor-specific fields
  vendorId?: string;
  vendorName?: string;
}

// Helper to get user's full name
export function getUserFullName(user: User | null): string {
  if (!user) return 'User';
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.name || user.email || 'User';
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
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: Role;
  // Vendor-specific fields (required when role is 'vendor')
  // Company profile
  company_name?: string;
  company_email?: string;
  trade_license_number?: string;
  company_description?: string;
  landline?: string;
  website?: string;
  establishment?: string;
  // Services & Service Areas
  category_id?: string;
  service_area_ids?: string[];
  // Legal & Bank
  trade_license_document?: File;
  vat_certificate?: File;
  bank_name?: string;
  account_holder_name?: string;
  iban?: string;
  swift_code?: string;
  trn?: string;
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

  // Check single role field first
  if (user.role === role) return true;

  // Check roles array
  if (!user.roles || user.roles.length === 0) return false;

  return user.roles.some((r) => {
    // Handle both object format { id, name } and string format
    if (typeof r === 'string') return r === role;
    return r.name === role;
  });
}

// Helper to get primary role (first role)
export function getPrimaryRole(user: User | null): Role | null {
  if (!user) return null;

  // Check single role field first
  if (user.role) return user.role;

  // Check roles array
  if (!user.roles || user.roles.length === 0) return null;

  const firstRole = user.roles[0];
  // Handle both object format { id, name } and string format
  if (typeof firstRole === 'string') return firstRole as Role;
  return firstRole.name;
}
