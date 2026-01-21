import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Category,
  CategoryFormData,
  CategoryListResponse,
} from '@/types/category';
import {
  getCategories as apiGetCategories,
  getCategory as apiGetCategory,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from '@/lib/category';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
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

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
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
export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiGetCategories(page);
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
      return rejectWithValue({ message: 'Failed to fetch categories' } as SerializedApiError);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'category/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiGetCategory(id);
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
      return rejectWithValue({ message: 'Failed to fetch category' } as SerializedApiError);
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/create',
  async (data: CategoryFormData, { rejectWithValue }) => {
    try {
      const response = await apiCreateCategory(data);
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
      return rejectWithValue({ message: 'Failed to create category' } as SerializedApiError);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, data }: { id: string; data: CategoryFormData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateCategory(id, data);
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
      return rejectWithValue({ message: 'Failed to update category' } as SerializedApiError);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteCategory(id);
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
      return rejectWithValue({ message: 'Failed to delete category' } as SerializedApiError);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryListResponse>) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          perPage: action.payload.meta.per_page,
          total: action.payload.meta.total,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch one
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Create
    builder
      .addCase(createCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isSubmitting = false;
        state.categories.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Update
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isSubmitting = false;
        state.currentCategory = action.payload;
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Delete
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, clearCurrentCategory, setCurrentPage } = categorySlice.actions;
export default categorySlice.reducer;
