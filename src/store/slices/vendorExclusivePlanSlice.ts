import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  VendorExclusivePlan,
  VendorExclusivePlanFormData,
  VendorExclusivePlanListResponse,
} from '@/types/vendorExclusivePlan';
import {
  getVendorExclusivePlans as apiGetPlans,
  getVendorExclusivePlan as apiGetPlan,
  createVendorExclusivePlan as apiCreatePlan,
  updateVendorExclusivePlan as apiUpdatePlan,
  deleteVendorExclusivePlan as apiDeletePlan,
} from '@/lib/vendorExclusivePlan';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface VendorExclusivePlanState {
  plans: VendorExclusivePlan[];
  currentPlan: VendorExclusivePlan | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: SerializedApiError | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

const initialState: VendorExclusivePlanState = {
  plans: [],
  currentPlan: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  },
};

export const fetchVendorExclusivePlans = createAsyncThunk(
  'vendorExclusivePlan/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiGetPlans(page);
      return response;
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
      return rejectWithValue({ message: 'Failed to fetch plans' } as SerializedApiError);
    }
  }
);

export const fetchVendorExclusivePlan = createAsyncThunk(
  'vendorExclusivePlan/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiGetPlan(id);
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
      return rejectWithValue({ message: 'Failed to fetch plan' } as SerializedApiError);
    }
  }
);

export const createVendorExclusivePlan = createAsyncThunk(
  'vendorExclusivePlan/create',
  async (data: VendorExclusivePlanFormData, { rejectWithValue }) => {
    try {
      const response = await apiCreatePlan(data);
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
      return rejectWithValue({ message: 'Failed to create plan' } as SerializedApiError);
    }
  }
);

export const updateVendorExclusivePlan = createAsyncThunk(
  'vendorExclusivePlan/update',
  async (
    { id, data }: { id: string; data: Partial<VendorExclusivePlanFormData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiUpdatePlan(id, data);
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
      return rejectWithValue({ message: 'Failed to update plan' } as SerializedApiError);
    }
  }
);

export const deleteVendorExclusivePlan = createAsyncThunk(
  'vendorExclusivePlan/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeletePlan(id);
      return id;
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
      return rejectWithValue({ message: 'Failed to delete plan' } as SerializedApiError);
    }
  }
);

const vendorExclusivePlanSlice = createSlice({
  name: 'vendorExclusivePlan',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorExclusivePlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVendorExclusivePlans.fulfilled,
        (state, action: PayloadAction<VendorExclusivePlanListResponse>) => {
          state.isLoading = false;
          state.plans = action.payload.data;
          state.pagination = {
            currentPage: action.payload.meta.current_page,
            lastPage: action.payload.meta.last_page,
            perPage: action.payload.meta.per_page,
            total: action.payload.meta.total,
          };
        }
      )
      .addCase(fetchVendorExclusivePlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(fetchVendorExclusivePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVendorExclusivePlan.fulfilled,
        (state, action: PayloadAction<VendorExclusivePlan>) => {
          state.isLoading = false;
          state.currentPlan = action.payload;
        }
      )
      .addCase(fetchVendorExclusivePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(createVendorExclusivePlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(
        createVendorExclusivePlan.fulfilled,
        (state, action: PayloadAction<VendorExclusivePlan>) => {
          state.isSubmitting = false;
          state.plans.unshift(action.payload);
          state.pagination.total += 1;
        }
      )
      .addCase(createVendorExclusivePlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(updateVendorExclusivePlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(
        updateVendorExclusivePlan.fulfilled,
        (state, action: PayloadAction<VendorExclusivePlan>) => {
          state.isSubmitting = false;
          state.currentPlan = action.payload;
          const index = state.plans.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.plans[index] = action.payload;
          }
        }
      )
      .addCase(updateVendorExclusivePlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(deleteVendorExclusivePlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteVendorExclusivePlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.plans = state.plans.filter((p) => p.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteVendorExclusivePlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, clearCurrentPlan, setCurrentPage } = vendorExclusivePlanSlice.actions;
export default vendorExclusivePlanSlice.reducer;
