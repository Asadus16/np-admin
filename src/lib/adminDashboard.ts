import api from './api';

// Types for dashboard data
export interface DashboardStats {
  total_customers: number;
  total_vendors: number;
  total_orders: number;
  total_revenue: number;
  customer_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  vendor_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  order_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  revenue_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface ApplicationsChartData {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface CategoryDistributionData {
  name: string;
  value: number;
}

export interface RecentVendor {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  category: string;
}

export interface RecentTransaction {
  id: string;
  vendor: string;
  amount: number;
  type: string;
  date: string;
}

export interface QuickStats {
  pending_approvals: number;
  pending_refunds: number;
  payouts_due: number;
  open_disputes: number;
}

export interface PendingRefund {
  id: string;
  order_id: string;
  order_number: string;
  customer: string;
  vendor: string;
  amount: number;
  reason: string;
  reason_details: string | null;
  date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenue_chart: RevenueChartData[];
  applications_chart: ApplicationsChartData[];
  category_distribution: CategoryDistributionData[];
  recent_vendors: RecentVendor[];
  recent_transactions: RecentTransaction[];
  quick_stats: QuickStats;
  pending_refunds: PendingRefund[];
}

interface DashboardResponse {
  status: string;
  data: DashboardData;
}

interface StatsResponse {
  status: string;
  data: DashboardStats;
}

interface RevenueChartResponse {
  status: string;
  data: RevenueChartData[];
}

interface ApplicationsChartResponse {
  status: string;
  data: ApplicationsChartData[];
}

interface CategoryDistributionResponse {
  status: string;
  data: CategoryDistributionData[];
}

interface RecentVendorsResponse {
  status: string;
  data: RecentVendor[];
}

interface RecentTransactionsResponse {
  status: string;
  data: RecentTransaction[];
}

interface QuickStatsResponse {
  status: string;
  data: QuickStats;
}

interface PendingRefundsResponse {
  status: string;
  data: PendingRefund[];
}

/**
 * Get all dashboard data in a single request
 */
export async function getDashboardData(
  period: '7d' | '30d' | '90d' = '30d',
  token?: string
): Promise<DashboardResponse> {
  return api.get<DashboardResponse>(`/admin/dashboard?period=${period}`, token);
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(
  period: '7d' | '30d' | '90d' = '30d',
  token?: string
): Promise<StatsResponse> {
  return api.get<StatsResponse>(`/admin/dashboard/stats?period=${period}`, token);
}

/**
 * Get revenue chart data
 */
export async function getRevenueChart(
  months: number = 6,
  token?: string
): Promise<RevenueChartResponse> {
  return api.get<RevenueChartResponse>(`/admin/dashboard/revenue-chart?months=${months}`, token);
}

/**
 * Get applications chart data
 */
export async function getApplicationsChart(
  months: number = 6,
  token?: string
): Promise<ApplicationsChartResponse> {
  return api.get<ApplicationsChartResponse>(`/admin/dashboard/applications-chart?months=${months}`, token);
}

/**
 * Get category distribution data
 */
export async function getCategoryDistribution(
  token?: string
): Promise<CategoryDistributionResponse> {
  return api.get<CategoryDistributionResponse>('/admin/dashboard/category-distribution', token);
}

/**
 * Get recent vendors
 */
export async function getRecentVendors(
  token?: string
): Promise<RecentVendorsResponse> {
  return api.get<RecentVendorsResponse>('/admin/dashboard/recent-vendors', token);
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(
  token?: string
): Promise<RecentTransactionsResponse> {
  return api.get<RecentTransactionsResponse>('/admin/dashboard/recent-transactions', token);
}

/**
 * Get quick stats
 */
export async function getQuickStats(
  token?: string
): Promise<QuickStatsResponse> {
  return api.get<QuickStatsResponse>('/admin/dashboard/quick-stats', token);
}

/**
 * Get pending refunds for dashboard
 */
export async function getPendingRefunds(
  token?: string
): Promise<PendingRefundsResponse> {
  return api.get<PendingRefundsResponse>('/admin/dashboard/pending-refunds', token);
}
