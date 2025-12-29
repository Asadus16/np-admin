"use client";

import { StoreProvider } from '@/store/provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <StoreProvider>{children}</StoreProvider>;
}
