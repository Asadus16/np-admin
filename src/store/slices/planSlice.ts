import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Plan,
  PlanFormData,
  PlanListResponse,
} from '@/types/plan';
import {
  getPlans as apiGetPlans,
  getPlan as apiGetPlan,
  createPlan as apiCreatePlan,
  updatePlan as apiUpdatePlan,
  deletePlan as apiDeletePlan,
} from '@/lib/plan';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface PlanState {
  plans: Plan[];
  currentPlan: Plan | null;
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

const initialState: PlanState = {
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

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plan/fetchAll',
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

export const fetchPlan = createAsyncThunk(
  'plan/fetchOne',
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

export const createPlan = createAsyncThunk(
  'plan/create',
  async (data: PlanFormData, { rejectWithValue }) => {
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

export const updatePlan = createAsyncThunk(
  'plan/update',
  async ({ id, data }: { id: string; data: PlanFormData }, { rejectWithValue }) => {
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

export const deletePlan = createAsyncThunk(
  'plan/delete',
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

const planSlice = createSlice({
  name: 'plan',
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
    // Fetch all
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<PlanListResponse>) => {
        state.isLoading = false;
        state.plans = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          perPage: action.payload.meta.per_page,
          total: action.payload.meta.total,
        };
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch one
    builder
      .addCase(fetchPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Create
    builder
      .addCase(createPlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.isSubmitting = false;
        state.plans.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Update
    builder
      .addCase(updatePlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.isSubmitting = false;
        state.currentPlan = action.payload;
        const index = state.plans.findIndex((plan) => plan.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Delete
    builder
      .addCase(deletePlan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.plans = state.plans.filter((plan) => plan.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, clearCurrentPlan, setCurrentPage } = planSlice.actions;
export default planSlice.reducer;
