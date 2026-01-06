import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getTechniciansWithAvailability as apiGetTechniciansWithAvailability,
  getUnassignedOrders as apiGetUnassignedOrders,
  getAssignedOrders as apiGetAssignedOrders,
  assignTechnician as apiAssignTechnician,
  autoAssignTechnician as apiAutoAssignTechnician,
  unassignTechnician as apiUnassignTechnician,
} from '@/lib/technician';
import { TechnicianAvailability } from '@/types/technician';
import { VendorOrder } from '@/types/vendorOrder';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface TechnicianAssignmentState {
  technicians: TechnicianAvailability[];
  unassignedOrders: VendorOrder[];
  assignedOrders: VendorOrder[];
  selectedTechnicianId: string | null;
  selectedDate: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: SerializedApiError | null;
}

const getInitialDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const initialState: TechnicianAssignmentState = {
  technicians: [],
  unassignedOrders: [],
  assignedOrders: [],
  selectedTechnicianId: null,
  selectedDate: getInitialDate(),
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async thunks
export const fetchTechniciansWithAvailability = createAsyncThunk(
  'technicianAssignment/fetchTechnicians',
  async (date: string | undefined, { rejectWithValue }) => {
    try {
      const response = await apiGetTechniciansWithAvailability(date);
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
      return rejectWithValue({ message: 'Failed to fetch technicians' } as SerializedApiError);
    }
  }
);

export const fetchUnassignedOrders = createAsyncThunk(
  'technicianAssignment/fetchUnassigned',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetUnassignedOrders();
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
      return rejectWithValue({ message: 'Failed to fetch unassigned orders' } as SerializedApiError);
    }
  }
);

export const fetchAssignedOrders = createAsyncThunk(
  'technicianAssignment/fetchAssigned',
  async (params: { technician_id?: string; date?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await apiGetAssignedOrders(params);
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
      return rejectWithValue({ message: 'Failed to fetch assigned orders' } as SerializedApiError);
    }
  }
);

export const assignTechnicianToOrder = createAsyncThunk(
  'technicianAssignment/assign',
  async ({ orderId, technicianId }: { orderId: string; technicianId: string }, { rejectWithValue }) => {
    try {
      const response = await apiAssignTechnician(orderId, technicianId);
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
      return rejectWithValue({ message: 'Failed to assign technician' } as SerializedApiError);
    }
  }
);

export const autoAssignTechnicianToOrder = createAsyncThunk(
  'technicianAssignment/autoAssign',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await apiAutoAssignTechnician(orderId);
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
      return rejectWithValue({ message: 'Failed to auto-assign technician' } as SerializedApiError);
    }
  }
);

export const unassignTechnicianFromOrder = createAsyncThunk(
  'technicianAssignment/unassign',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await apiUnassignTechnician(orderId);
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
      return rejectWithValue({ message: 'Failed to unassign technician' } as SerializedApiError);
    }
  }
);

const technicianAssignmentSlice = createSlice({
  name: 'technicianAssignment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTechnician: (state, action: PayloadAction<string | null>) => {
      state.selectedTechnicianId = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    clearSelection: (state) => {
      state.selectedTechnicianId = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch technicians with availability
    builder
      .addCase(fetchTechniciansWithAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTechniciansWithAvailability.fulfilled, (state, action: PayloadAction<TechnicianAvailability[]>) => {
        state.isLoading = false;
        state.technicians = action.payload;
      })
      .addCase(fetchTechniciansWithAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch unassigned orders
    builder
      .addCase(fetchUnassignedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedOrders.fulfilled, (state, action: PayloadAction<VendorOrder[]>) => {
        state.isLoading = false;
        state.unassignedOrders = action.payload;
      })
      .addCase(fetchUnassignedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch assigned orders
    builder
      .addCase(fetchAssignedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedOrders.fulfilled, (state, action: PayloadAction<VendorOrder[]>) => {
        state.isLoading = false;
        state.assignedOrders = action.payload;
      })
      .addCase(fetchAssignedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Assign technician
    builder
      .addCase(assignTechnicianToOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(assignTechnicianToOrder.fulfilled, (state, action: PayloadAction<VendorOrder>) => {
        state.isSubmitting = false;
        // Remove from unassigned list
        state.unassignedOrders = state.unassignedOrders.filter(
          (order) => order.id !== action.payload.id
        );
        // Add to assigned list
        state.assignedOrders = [action.payload, ...state.assignedOrders];
      })
      .addCase(assignTechnicianToOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Auto-assign technician
    builder
      .addCase(autoAssignTechnicianToOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(autoAssignTechnicianToOrder.fulfilled, (state, action: PayloadAction<VendorOrder>) => {
        state.isSubmitting = false;
        // Remove from unassigned list
        state.unassignedOrders = state.unassignedOrders.filter(
          (order) => order.id !== action.payload.id
        );
        // Add to assigned list
        state.assignedOrders = [action.payload, ...state.assignedOrders];
      })
      .addCase(autoAssignTechnicianToOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Unassign technician
    builder
      .addCase(unassignTechnicianFromOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(unassignTechnicianFromOrder.fulfilled, (state, action: PayloadAction<VendorOrder>) => {
        state.isSubmitting = false;
        // Remove from assigned list
        state.assignedOrders = state.assignedOrders.filter(
          (order) => order.id !== action.payload.id
        );
        // Add to unassigned list
        state.unassignedOrders = [action.payload, ...state.unassignedOrders];
      })
      .addCase(unassignTechnicianFromOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, setSelectedTechnician, setSelectedDate, clearSelection } = technicianAssignmentSlice.actions;
export default technicianAssignmentSlice.reducer;
