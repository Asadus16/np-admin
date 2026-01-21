import api from './api';
import {
  AdminDisputeListResponse,
  AdminDisputeResponse,
  DisputeStatsResponse,
  CompanyDisputeStatsResponse,
  ApproveDisputeData,
  RejectDisputeData,
  CompleteDisputeData,
} from '@/types/refund';

interface ListDisputesParams {
  status?: string;
  company_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

/**
 * Build query string from params
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Get all disputes (admin)
 */
export async function getDisputes(
  params: ListDisputesParams = {},
  token?: string
): Promise<AdminDisputeListResponse> {
  const queryString = buildQueryString(params);
  return api.get<AdminDisputeListResponse>(`/admin/disputes${queryString}`, token);
}

/**
 * Get dispute by ID (admin)
 */
export async function getDispute(id: string, token?: string): Promise<AdminDisputeResponse> {
  return api.get<AdminDisputeResponse>(`/admin/disputes/${id}`, token);
}

/**
 * Get dispute statistics (admin)
 */
export async function getDisputeStats(token?: string): Promise<DisputeStatsResponse> {
  return api.get<DisputeStatsResponse>('/admin/disputes/stats', token);
}

/**
 * Get dispute statistics by company (admin)
 */
export async function getDisputeStatsByCompany(token?: string): Promise<CompanyDisputeStatsResponse> {
  return api.get<CompanyDisputeStatsResponse>('/admin/disputes/stats/by-company', token);
}

/**
 * Approve a dispute (admin)
 */
export async function approveDispute(
  id: string,
  data: ApproveDisputeData,
  token?: string
): Promise<AdminDisputeResponse> {
  return api.post<AdminDisputeResponse>(`/admin/disputes/${id}/approve`, data, token);
}

/**
 * Reject a dispute (admin)
 */
export async function rejectDispute(
  id: string,
  data: RejectDisputeData,
  token?: string
): Promise<AdminDisputeResponse> {
  return api.post<AdminDisputeResponse>(`/admin/disputes/${id}/reject`, data, token);
}

/**
 * Mark dispute as completed (admin)
 */
export async function completeDispute(
  id: string,
  data: CompleteDisputeData,
  token?: string
): Promise<AdminDisputeResponse> {
  return api.post<AdminDisputeResponse>(`/admin/disputes/${id}/complete`, data, token);
}
