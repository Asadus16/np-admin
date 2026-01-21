import api from './api';

// Types for analytics data
export interface DashboardStats {
  total_vendors: number;
  vendors_change: string;
  active_technicians: number;
  technicians_change: string;
  total_categories: number;
  categories_change: string;
  monthly_revenue: number;
  revenue_change: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface ApplicationData {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface RecentVendor {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  category: string;
}

export interface RecentTransaction {
  id: number;
  vendor: string;
  amount: string;
  type: 'Payout' | 'Fee';
  date: string;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  revenue_data: RevenueData[];
  application_data: ApplicationData[];
  category_distribution: CategoryDistribution[];
  recent_vendors: RecentVendor[];
  recent_transactions: RecentTransaction[];
}

export interface DashboardAnalyticsResponse {
  data: DashboardAnalytics;
  message?: string;
}

// Get dashboard analytics
export async function getDashboardAnalytics(
  period: string = '7d',
  token?: string
): Promise<DashboardAnalyticsResponse> {
  return api.get<DashboardAnalyticsResponse>(
    `/admin/dashboard/analytics?period=${period}`,
    token
  );
}

// Get dashboard stats only
export async function getDashboardStats(
  period: string = '7d',
  token?: string
): Promise<{ data: DashboardStats }> {
  return api.get<{ data: DashboardStats }>(
    `/admin/dashboard/stats?period=${period}`,
    token
  );
}

// Get revenue data
export async function getRevenueData(
  period: string = '7d',
  token?: string
): Promise<{ data: RevenueData[] }> {
  return api.get<{ data: RevenueData[] }>(
    `/admin/dashboard/revenue?period=${period}`,
    token
  );
}

// Get vendor application data
export async function getApplicationData(
  period: string = '7d',
  token?: string
): Promise<{ data: ApplicationData[] }> {
  return api.get<{ data: ApplicationData[] }>(
    `/admin/dashboard/applications?period=${period}`,
    token
  );
}

// Get category distribution
export async function getCategoryDistribution(
  token?: string
): Promise<{ data: CategoryDistribution[] }> {
  return api.get<{ data: CategoryDistribution[] }>(
    `/admin/dashboard/category-distribution`,
    token
  );
}

// Get recent vendors
export async function getRecentVendors(
  limit: number = 5,
  token?: string
): Promise<{ data: RecentVendor[] }> {
  return api.get<{ data: RecentVendor[] }>(
    `/admin/dashboard/recent-vendors?limit=${limit}`,
    token
  );
}

// Get recent transactions
export async function getRecentTransactions(
  limit: number = 5,
  token?: string
): Promise<{ data: RecentTransaction[] }> {
  return api.get<{ data: RecentTransaction[] }>(
    `/admin/dashboard/recent-transactions?limit=${limit}`,
    token
  );
}
