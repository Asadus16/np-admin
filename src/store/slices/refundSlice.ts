import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDisputeStats } from '@/lib/adminDispute';

interface RefundState {
  pendingCount: number;
  loading: boolean;
}

const initialState: RefundState = {
  pendingCount: 0,
  loading: false,
};

// Fetch pending refund count from dispute stats
export const fetchPendingRefundCount = createAsyncThunk(
  'refund/fetchPendingCount',
  async (token: string) => {
    const response = await getDisputeStats(token);
    return response.data.pending;
  }
);

const refundSlice = createSlice({
  name: 'refund',
  initialState,
  reducers: {
    // For socket updates - increment when new refund request comes in
    incrementPendingCount: (state) => {
      state.pendingCount += 1;
    },
    // For socket updates - decrement when refund is processed
    decrementPendingCount: (state) => {
      if (state.pendingCount > 0) {
        state.pendingCount -= 1;
      }
    },
    // Direct update from socket
    setPendingCount: (state, action: PayloadAction<number>) => {
      state.pendingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRefundCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRefundCount.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCount = action.payload;
      })
      .addCase(fetchPendingRefundCount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { incrementPendingCount, decrementPendingCount, setPendingCount } = refundSlice.actions;
export default refundSlice.reducer;
