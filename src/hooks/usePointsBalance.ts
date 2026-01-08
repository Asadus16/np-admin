"use client";

import { useState, useEffect } from 'react';
import { getPointsBalance } from '@/lib/customerPoints';
import type { PointsBalance } from '@/types/points';

export function usePointsBalance() {
  const [balance, setBalance] = useState<PointsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPointsBalance();
        setBalance(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load points balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPointsBalance();
      setBalance(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh points balance');
    } finally {
      setLoading(false);
    }
  };

  return { balance, loading, error, refresh };
}
