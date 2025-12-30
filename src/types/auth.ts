export type Role = 'super_admin' | 'vendor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  // Vendor-specific fields
  vendorId?: string;
  vendorName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: Role;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
