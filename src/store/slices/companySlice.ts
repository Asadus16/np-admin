import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Company,
  CompanyListResponse,
  CompanyUpdateData,
  getPendingCompanies as apiGetPendingCompanies,
  getApprovedCompanies as apiGetApprovedCompanies,
  getCompany as apiGetCompany,
  approveCompany as apiApproveCompany,
  rejectCompany as apiRejectCompany,
  updateCompanyAdmin as apiUpdateCompany,
  deleteCompany as apiDeleteCompany,
} from '@/lib/company';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface PaginationState {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

interface CompanyState {
  pendingCompanies: Company[];
  approvedCompanies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: SerializedApiError | null;
  pagination: PaginationState;
  approvedPagination: PaginationState;
}

const defaultPagination: PaginationState = {
  currentPage: 1,
  lastPage: 1,
  perPage: 15,
  total: 0,
};

const initialState: CompanyState = {
  pendingCompanies: [],
  approvedCompanies: [],
  currentCompany: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: { ...defaultPagination },
  approvedPagination: { ...defaultPagination },
};

// Async thunks
export const fetchPendingCompanies = createAsyncThunk(
  'company/fetchPending',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiGetPendingCompanies(page);
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
      return rejectWithValue({ message: 'Failed to fetch pending companies' } as SerializedApiError);
    }
  }
);

export const fetchApprovedCompanies = createAsyncThunk(
  'company/fetchApproved',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiGetApprovedCompanies(page);
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
      return rejectWithValue({ message: 'Failed to fetch approved companies' } as SerializedApiError);
    }
  }
);

export const fetchCompany = createAsyncThunk(
  'company/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiGetCompany(id);
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
      return rejectWithValue({ message: 'Failed to fetch company' } as SerializedApiError);
    }
  }
);

export const approveCompany = createAsyncThunk(
  'company/approve',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiApproveCompany(id);
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
      return rejectWithValue({ message: 'Failed to approve company' } as SerializedApiError);
    }
  }
);

export const rejectCompany = createAsyncThunk(
  'company/reject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiRejectCompany(id);
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
      return rejectWithValue({ message: 'Failed to reject company' } as SerializedApiError);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ id, data }: { id: string; data: CompanyUpdateData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateCompany(id, data);
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
      return rejectWithValue({ message: 'Failed to update company' } as SerializedApiError);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'company/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteCompany(id);
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
      return rejectWithValue({ message: 'Failed to delete company' } as SerializedApiError);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch pending companies
    builder
      .addCase(fetchPendingCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingCompanies.fulfilled, (state, action: PayloadAction<CompanyListResponse>) => {
        state.isLoading = false;
        state.pendingCompanies = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          perPage: action.payload.meta.per_page,
          total: action.payload.meta.total,
        };
      })
      .addCase(fetchPendingCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch approved companies
    builder
      .addCase(fetchApprovedCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApprovedCompanies.fulfilled, (state, action: PayloadAction<CompanyListResponse>) => {
        state.isLoading = false;
        state.approvedCompanies = action.payload.data;
        state.approvedPagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          perPage: action.payload.meta.per_page,
          total: action.payload.meta.total,
        };
      })
      .addCase(fetchApprovedCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch one company
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isLoading = false;
        state.currentCompany = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Approve company
    builder
      .addCase(approveCompany.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(approveCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isSubmitting = false;
        // Remove from pending list since it's now approved
        state.pendingCompanies = state.pendingCompanies.filter(
          (company) => company.id !== action.payload.id
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.currentCompany = action.payload;
      })
      .addCase(approveCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Reject company
    builder
      .addCase(rejectCompany.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(rejectCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isSubmitting = false;
        // Remove from pending list
        state.pendingCompanies = state.pendingCompanies.filter(
          (company) => company.id !== action.payload.id
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.currentCompany = action.payload;
      })
      .addCase(rejectCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Update company
    builder
      .addCase(updateCompany.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isSubmitting = false;
        state.currentCompany = action.payload;
        // Update in approved list if present
        const approvedIndex = state.approvedCompanies.findIndex(c => c.id === action.payload.id);
        if (approvedIndex !== -1) {
          state.approvedCompanies[approvedIndex] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Delete company
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        // Remove from approved list
        state.approvedCompanies = state.approvedCompanies.filter(c => c.id !== action.payload);
        state.approvedPagination.total = Math.max(0, state.approvedPagination.total - 1);
        // Remove from pending list
        state.pendingCompanies = state.pendingCompanies.filter(c => c.id !== action.payload);
        // Clear current company if it was deleted
        if (state.currentCompany?.id === action.payload) {
          state.currentCompany = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, clearCurrentCompany, setCurrentPage } = companySlice.actions;
export default companySlice.reducer;
