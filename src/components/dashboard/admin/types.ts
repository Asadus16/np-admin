import { LucideIcon } from "lucide-react";
import {
  RevenueChartData,
  ApplicationsChartData,
  CategoryDistributionData,
  RecentVendor,
  RecentTransaction,
  PendingRefund,
  QuickStats,
} from "@/lib/adminDashboard";

export interface StatCardData {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  href: string;
}

export interface StatsCardsProps {
  stats: StatCardData[];
}

export interface RevenueChartProps {
  data: RevenueChartData[];
}

export interface ApplicationsChartProps {
  data: ApplicationsChartData[];
}

export interface CategoryPieChartProps {
  data: CategoryDistributionData[];
}

export interface RecentVendorsTableProps {
  vendors: RecentVendor[];
}

export interface RecentTransactionsTableProps {
  transactions: RecentTransaction[];
  formatCurrency: (value: number) => string;
}

export interface QuickStatsCardsProps {
  stats: QuickStats;
}

export interface RefundRequestsTableProps {
  refunds: PendingRefund[];
  formatCurrency: (value: number) => string;
}

export interface PeriodSelectorProps {
  selectedPeriod: "7d" | "30d" | "90d";
  onPeriodChange: (period: "7d" | "30d" | "90d") => void;
}
