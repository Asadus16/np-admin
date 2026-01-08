"use client";

import { useState, useEffect } from 'react';
import { getPointsHistory } from '@/lib/customerPoints';
import type { PointsHistoryResponse } from '@/types/points';

interface UsePointsHistoryParams {
  page?: number;
  perPage?: number;
  type?: string;
  fromDate?: string;
  toDate?: string;
}

export function usePointsHistory(params: UsePointsHistoryParams = {}) {
  const [history, setHistory] = useState<PointsHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPointsHistory({
          page: params.page || 1,
          per_page: params.perPage || 20,
          type: params.type,
          from_date: params.fromDate,
          to_date: params.toDate,
        });
        setHistory(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load points history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [params.page, params.perPage, params.type, params.fromDate, params.toDate]);

  return { history, loading, error };
}
