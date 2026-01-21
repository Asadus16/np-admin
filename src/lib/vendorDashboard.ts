import api from './api';

// Types for vendor dashboard data
export interface VendorDashboardStats {
  total_earnings: number;
  earnings_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  active_orders: number;
  orders_change: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  team_members: number;
  average_rating: number;
  review_count: number;
}

export interface UpcomingJob {
  id: string;
  service: string;
  customer: string;
  date: string;
  time: string;
  status: string;
  technician: string;
}

export interface TeamMember {
  id: string;
  name: string;
  status: 'working' | 'available' | 'scheduled' | 'break' | 'off';
  current_job: string | null;
  next_available: string | null;
}

export interface TopCustomer {
  id: string;
  name: string;
  orders: number;
  spent: number;
  avatar: string;
}

export interface RecentReview {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface VendorDashboardData {
  stats: VendorDashboardStats;
  upcoming_jobs: UpcomingJob[];
  team_schedule: TeamMember[];
  top_customers: TopCustomer[];
  recent_reviews: RecentReview[];
}

interface VendorDashboardResponse {
  status: string;
  data: VendorDashboardData;
}

interface StatsResponse {
  status: string;
  data: VendorDashboardStats;
}

interface UpcomingJobsResponse {
  status: string;
  data: UpcomingJob[];
}

interface TeamScheduleResponse {
  status: string;
  data: TeamMember[];
}

interface TopCustomersResponse {
  status: string;
  data: TopCustomer[];
}

interface RecentReviewsResponse {
  status: string;
  data: RecentReview[];
}

/**
 * Get all vendor dashboard data in a single request
 */
export async function getVendorDashboardData(
  period: '7d' | '30d' | '90d' = '30d',
  token?: string
): Promise<VendorDashboardResponse> {
  return api.get<VendorDashboardResponse>(`/vendor/dashboard?period=${period}`, token);
}

/**
 * Get vendor dashboard statistics
 */
export async function getVendorDashboardStats(
  period: '7d' | '30d' | '90d' = '30d',
  token?: string
): Promise<StatsResponse> {
  return api.get<StatsResponse>(`/vendor/dashboard/stats?period=${period}`, token);
}

/**
 * Get upcoming jobs
 */
export async function getUpcomingJobs(
  token?: string
): Promise<UpcomingJobsResponse> {
  return api.get<UpcomingJobsResponse>('/vendor/dashboard/upcoming-jobs', token);
}

/**
 * Get team schedule
 */
export async function getTeamSchedule(
  token?: string
): Promise<TeamScheduleResponse> {
  return api.get<TeamScheduleResponse>('/vendor/dashboard/team-schedule', token);
}

/**
 * Get top customers
 */
export async function getTopCustomers(
  token?: string
): Promise<TopCustomersResponse> {
  return api.get<TopCustomersResponse>('/vendor/dashboard/top-customers', token);
}

/**
 * Get recent reviews
 */
export async function getRecentReviews(
  token?: string
): Promise<RecentReviewsResponse> {
  return api.get<RecentReviewsResponse>('/vendor/dashboard/recent-reviews', token);
}
