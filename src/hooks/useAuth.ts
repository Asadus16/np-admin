"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  updateUser as updateUserAction,
  sendPhoneOTP as sendPhoneOTPAction,
  verifyPhoneOTP as verifyPhoneOTPAction,
} from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials, User, getPrimaryRole, hasRole, Role } from '@/types/auth';
import { ConfirmationResult } from '@/lib/firebase';

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

  const sendPhoneOTP = useCallback(
    async (phoneNumber: string): Promise<{ confirmationResult: ConfirmationResult; phoneNumber: string }> => {
      const result = await dispatch(sendPhoneOTPAction(phoneNumber)).unwrap();
      return result;
    },
    [dispatch]
  );

  const verifyPhoneOTP = useCallback(
    async (confirmationResult: ConfirmationResult, code: string, phoneNumber: string): Promise<User> => {
      const result = await dispatch(verifyPhoneOTPAction({ confirmationResult, code, phoneNumber })).unwrap();
      return result.user;
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
    sendPhoneOTP,
    verifyPhoneOTP,
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
