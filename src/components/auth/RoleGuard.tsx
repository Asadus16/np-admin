"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Role, hasRole, getPrimaryRole } from '@/types/auth';
import { getRedirectPath } from '@/lib/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackPath }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const userHasAllowedRole = () => {
    if (!user) return false;
    return allowedRoles.some((role) => hasRole(user, role));
  };

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user && !userHasAllowedRole()) {
      // Redirect to appropriate portal based on user's primary role
      const primaryRole = getPrimaryRole(user);
      const redirectPath = fallbackPath || getRedirectPath(primaryRole);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, fallbackPath, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Wrong role
  if (user && !userHasAllowedRole()) {
    return null;
  }

  return <>{children}</>;
}
