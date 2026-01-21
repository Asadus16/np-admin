import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  DashboardAnalytics,
  DashboardStats,
  RevenueData,
  ApplicationData,
  CategoryDistribution,
  RecentVendor,
  RecentTransaction,
  getDashboardAnalytics as apiGetDashboardAnalytics,
} from '@/lib/analytics';
import { ApiException } from '@/lib/api';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface AnalyticsState {
  stats: DashboardStats | null;
  revenueData: RevenueData[];
  applicationData: ApplicationData[];
  categoryDistribution: CategoryDistribution[];
  recentVendors: RecentVendor[];
  recentTransactions: RecentTransaction[];
  selectedPeriod: '7d' | '30d' | '90d';
  isLoading: boolean;
  error: SerializedApiError | null;
}

const initialState: AnalyticsState = {
  stats: null,
  revenueData: [],
  applicationData: [],
  categoryDistribution: [],
  recentVendors: [],
  recentTransactions: [],
  selectedPeriod: '7d',
  isLoading: false,
  error: null,
};

// Async thunk to fetch all dashboard analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  'analytics/fetchDashboard',
  async (
    { period, token }: { period: string; token?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiGetDashboardAnalytics(period, token);
      return response.data;
    } catch (error) {
      if (error instanceof ApiException) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          errors: error.errors,
        } as SerializedApiError);
      }
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message } as SerializedApiError);
      }
      return rejectWithValue({
        message: 'Failed to fetch dashboard analytics',
      } as SerializedApiError);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPeriod: (state, action: PayloadAction<'7d' | '30d' | '90d'>) => {
      state.selectedPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardAnalytics.fulfilled,
        (state, action: PayloadAction<DashboardAnalytics>) => {
          state.isLoading = false;
          state.stats = action.payload.stats;
          state.revenueData = action.payload.revenue_data;
          state.applicationData = action.payload.application_data;
          state.categoryDistribution = action.payload.category_distribution;
          state.recentVendors = action.payload.recent_vendors;
          state.recentTransactions = action.payload.recent_transactions;
        }
      )
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, setSelectedPeriod } = analyticsSlice.actions;
export default analyticsSlice.reducer;
