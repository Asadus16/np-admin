"use client";

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect, useRef } from 'react';
import { initializeAuth } from './slices/authSlice';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(initializeAuth());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
