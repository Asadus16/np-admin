import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ServiceArea,
  ServiceAreaFormData,
  ServiceAreaListResponse,
} from '@/types/serviceArea';
import {
  getServiceAreas as apiGetServiceAreas,
  getServiceArea as apiGetServiceArea,
  createServiceArea as apiCreateServiceArea,
  updateServiceArea as apiUpdateServiceArea,
  deleteServiceArea as apiDeleteServiceArea,
} from '@/lib/serviceArea';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface ServiceAreaState {
  serviceAreas: ServiceArea[];
  currentServiceArea: ServiceArea | null;
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

const initialState: ServiceAreaState = {
  serviceAreas: [],
  currentServiceArea: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  },
};

// Async thunks
export const fetchServiceAreas = createAsyncThunk(
  'serviceArea/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiGetServiceAreas(page);
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
      return rejectWithValue({ message: 'Failed to fetch service areas' } as SerializedApiError);
    }
  }
);

export const fetchServiceArea = createAsyncThunk(
  'serviceArea/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiGetServiceArea(id);
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
      return rejectWithValue({ message: 'Failed to fetch service area' } as SerializedApiError);
    }
  }
);

export const createServiceArea = createAsyncThunk(
  'serviceArea/create',
  async (data: ServiceAreaFormData, { rejectWithValue }) => {
    try {
      const response = await apiCreateServiceArea(data);
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
      return rejectWithValue({ message: 'Failed to create service area' } as SerializedApiError);
    }
  }
);

export const updateServiceArea = createAsyncThunk(
  'serviceArea/update',
  async ({ id, data }: { id: string; data: ServiceAreaFormData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateServiceArea(id, data);
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
      return rejectWithValue({ message: 'Failed to update service area' } as SerializedApiError);
    }
  }
);

export const deleteServiceArea = createAsyncThunk(
  'serviceArea/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteServiceArea(id);
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
      return rejectWithValue({ message: 'Failed to delete service area' } as SerializedApiError);
    }
  }
);

const serviceAreaSlice = createSlice({
  name: 'serviceArea',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentServiceArea: (state) => {
      state.currentServiceArea = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchServiceAreas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceAreas.fulfilled, (state, action: PayloadAction<ServiceAreaListResponse>) => {
        state.isLoading = false;
        state.serviceAreas = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          perPage: action.payload.meta.per_page,
          total: action.payload.meta.total,
        };
      })
      .addCase(fetchServiceAreas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch one
    builder
      .addCase(fetchServiceArea.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceArea.fulfilled, (state, action: PayloadAction<ServiceArea>) => {
        state.isLoading = false;
        state.currentServiceArea = action.payload;
      })
      .addCase(fetchServiceArea.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Create
    builder
      .addCase(createServiceArea.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createServiceArea.fulfilled, (state, action: PayloadAction<ServiceArea>) => {
        state.isSubmitting = false;
        state.serviceAreas.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createServiceArea.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Update
    builder
      .addCase(updateServiceArea.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateServiceArea.fulfilled, (state, action: PayloadAction<ServiceArea>) => {
        state.isSubmitting = false;
        state.currentServiceArea = action.payload;
        const index = state.serviceAreas.findIndex((sa) => sa.id === action.payload.id);
        if (index !== -1) {
          state.serviceAreas[index] = action.payload;
        }
      })
      .addCase(updateServiceArea.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Delete
    builder
      .addCase(deleteServiceArea.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteServiceArea.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.serviceAreas = state.serviceAreas.filter((sa) => sa.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteServiceArea.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, clearCurrentServiceArea, setCurrentPage } = serviceAreaSlice.actions;
export default serviceAreaSlice.reducer;
