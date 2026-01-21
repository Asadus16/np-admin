import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPointsBalance,
  getPointsHistory,
  calculateRedemption,
  redeemPoints,
} from '@/lib/customerPoints';
import type {
  PointsBalance,
  PointsHistoryResponse,
  RedemptionCalculationResponse,
  RedeemPointsResponse,
} from '@/types/points';

interface PointsState {
  balance: PointsBalance | null;
  history: PointsHistoryResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PointsState = {
  balance: null,
  history: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPointsBalance = createAsyncThunk(
  'points/fetchBalance',
  async () => {
    const response = await getPointsBalance();
    return response.data;
  }
);

export const fetchPointsHistory = createAsyncThunk(
  'points/fetchHistory',
  async (params: { page?: number; type?: string; fromDate?: string; toDate?: string } = {}) => {
    const response = await getPointsHistory({
      page: params.page,
      type: params.type,
      from_date: params.fromDate,
      to_date: params.toDate,
    });
    return response;
  }
);

export const calculatePointsRedemption = createAsyncThunk(
  'points/calculateRedemption',
  async ({ pointsToRedeem, orderTotal }: { pointsToRedeem: number; orderTotal: number }) => {
    const response = await calculateRedemption(pointsToRedeem, orderTotal);
    return response.data;
  }
);

export const redeemPointsForOrder = createAsyncThunk(
  'points/redeem',
  async ({ orderId, pointsToRedeem }: { orderId: number; pointsToRedeem: number }) => {
    const response = await redeemPoints(orderId, pointsToRedeem);
    return response.data;
  }
);

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch balance
    builder
      .addCase(fetchPointsBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchPointsBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch balance';
      });

    // Fetch history
    builder
      .addCase(fetchPointsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPointsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch history';
      });

    // Redeem points
    builder
      .addCase(redeemPointsForOrder.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.points = action.payload.new_balance;
          state.balance.available_points = action.payload.new_balance;
          state.balance.lifetime_redeemed += action.payload.points_redeemed;
        }
      });
  },
});

export const { clearError, updateBalance } = pointsSlice.actions;
export default pointsSlice.reducer;
