import { api } from './api';

// Types for customer dashboard data
export interface CustomerDashboardStats {
  total_spent: number;
  spent_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  points_balance: number;
  lifetime_points_earned: number;
  recent_points_earned: number;
  active_orders: number;
  completed_orders: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  vendor: string;
  service: string;
  date: string;
  amount: number;
  status: string;
}

export interface TopVendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  orders: number;
}

export interface UpcomingService {
  id: string;
  vendor: string;
  service: string;
  date: string;
  time: string;
  type: 'scheduled' | 'subscription';
}

export interface CustomerDashboardData {
  stats: CustomerDashboardStats;
  recent_orders: RecentOrder[];
  top_vendors: TopVendor[];
  upcoming_services: UpcomingService[];
}

interface CustomerDashboardResponse {
  status: string;
  data: CustomerDashboardData;
}

interface StatsResponse {
  status: string;
  data: CustomerDashboardStats;
}

interface RecentOrdersResponse {
  status: string;
  data: RecentOrder[];
}

interface TopVendorsResponse {
  status: string;
  data: TopVendor[];
}

interface UpcomingServicesResponse {
  status: string;
  data: UpcomingService[];
}

/**
 * Get all customer dashboard data in a single request
 */
export async function getCustomerDashboardData(
  token?: string
): Promise<CustomerDashboardResponse> {
  return api.get<CustomerDashboardResponse>('/customer/dashboard', token);
}

/**
 * Get customer dashboard statistics
 */
export async function getCustomerDashboardStats(
  token?: string
): Promise<StatsResponse> {
  return api.get<StatsResponse>('/customer/dashboard/stats', token);
}

/**
 * Get recent orders for customer
 */
export async function getRecentOrders(
  token?: string
): Promise<RecentOrdersResponse> {
  return api.get<RecentOrdersResponse>('/customer/dashboard/recent-orders', token);
}

/**
 * Get top vendors for customer
 */
export async function getTopVendors(
  token?: string
): Promise<TopVendorsResponse> {
  return api.get<TopVendorsResponse>('/customer/dashboard/top-vendors', token);
}

/**
 * Get upcoming services for customer
 */
export async function getUpcomingServices(
  token?: string
): Promise<UpcomingServicesResponse> {
  return api.get<UpcomingServicesResponse>('/customer/dashboard/upcoming-services', token);
}
