import { User, Role, LoginCredentials } from '@/types/auth';

const AUTH_STORAGE_KEY = 'np_admin_auth';

// Mock users for development
const mockUsers: Record<string, User> = {
  'admin@noproblem.com': {
    id: '1',
    email: 'admin@noproblem.com',
    name: 'Admin User',
    role: 'super_admin',
  },
  'vendor@noproblem.com': {
    id: '2',
    email: 'vendor@noproblem.com',
    name: 'John Smith',
    role: 'vendor',
    vendorId: 'v-001',
    vendorName: "Mike's Plumbing",
  },
};

export async function mockLogin(credentials: LoginCredentials): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // For mock auth, we create/return a user based on the role selected
  const mockUser: User = {
    id: credentials.role === 'super_admin' ? '1' : '2',
    email: credentials.email,
    name: credentials.role === 'super_admin' ? 'Admin User' : 'Vendor User',
    role: credentials.role,
    ...(credentials.role === 'vendor' && {
      vendorId: 'v-001',
      vendorName: "Mike's Plumbing",
    }),
  };

  // Check if we have a predefined mock user
  if (mockUsers[credentials.email]) {
    return mockUsers[credentials.email];
  }

  return mockUser;
}

export function saveAuthToStorage(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getAuthFromStorage(): User | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
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
  }
}

export function getRedirectPath(role: Role): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'vendor':
      return '/vendor';
    default:
      return '/login';
  }
}
