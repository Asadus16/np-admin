"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  updateUser as updateUserAction,
} from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials, User, getPrimaryRole, hasRole, Role } from '@/types/auth';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      const result = await dispatch(loginAction(credentials)).unwrap();
      return result.user;
    },
    [dispatch]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<User> => {
      const result = await dispatch(registerAction(credentials)).unwrap();
      return result.user;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutAction());
  }, [dispatch]);

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      dispatch(updateUserAction(updates));
    },
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
}

export function useUser() {
  const { user } = useAppSelector((state) => state.auth);
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated;
}

export function useRole() {
  const { user } = useAppSelector((state) => state.auth);
  return getPrimaryRole(user);
}

export function useHasRole(role: Role) {
  const { user } = useAppSelector((state) => state.auth);
  return hasRole(user, role);
}
