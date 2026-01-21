import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiLoginWithPhone,
  apiGetMe,
  saveAuthToStorage,
  getAuthFromStorage,
  clearAuthFromStorage,
  ApiException,
} from '@/lib/auth';
import { sendOTP, verifyOTP, clearRecaptchaVerifier, ConfirmationResult } from '@/lib/firebase';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials);
      saveAuthToStorage(response.user, response.token);
      return { user: response.user, token: response.token };
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
      return rejectWithValue({ message: 'Login failed' } as SerializedApiError);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await apiRegister(credentials);
      saveAuthToStorage(response.user, response.token);
      return { user: response.user, token: response.token };
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
      return rejectWithValue({ message: 'Registration failed' } as SerializedApiError);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (state.auth.token) {
        await apiLogout(state.auth.token);
      }
      clearAuthFromStorage();
      return null;
    } catch {
      // Still clear local state even if API call fails
      clearAuthFromStorage();
      return null;
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const stored = getAuthFromStorage();
    if (stored) {
      return { user: stored.user, token: stored.token };
    }
    return null;
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.token) {
        return rejectWithValue({ message: 'Not authenticated' } as SerializedApiError);
      }
      const response = await apiGetMe(state.auth.token);
      saveAuthToStorage(response.user, state.auth.token);
      return { user: response.user };
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
      return rejectWithValue({ message: 'Failed to refresh user' } as SerializedApiError);
    }
  }
);

// Phone authentication thunks
export const sendPhoneOTP = createAsyncThunk(
  'auth/sendPhoneOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const confirmationResult = await sendOTP(phoneNumber);
      return { confirmationResult, phoneNumber };
    } catch (error) {
      clearRecaptchaVerifier();
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message } as SerializedApiError);
      }
      return rejectWithValue({ message: 'Failed to send OTP' } as SerializedApiError);
    }
  }
);

export const verifyPhoneOTP = createAsyncThunk(
  'auth/verifyPhoneOTP',
  async (
    { confirmationResult, code, phoneNumber }: { confirmationResult: ConfirmationResult; code: string; phoneNumber: string },
    { rejectWithValue }
  ) => {
    try {
      // Verify OTP with Firebase
      const userCredential = await verifyOTP(confirmationResult, code);
      const firebaseIdToken = await userCredential.user.getIdToken();
      
      // Exchange Firebase token for backend token
      const response = await apiLoginWithPhone(firebaseIdToken, phoneNumber);
      saveAuthToStorage(response.user, response.token);
      clearRecaptchaVerifier();
      
      return { user: response.user, token: response.token };
    } catch (error) {
      clearRecaptchaVerifier();
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
      return rejectWithValue({ message: 'OTP verification failed' } as SerializedApiError);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (state.token) {
          saveAuthToStorage(state.user, state.token);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Initialize
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
      });

    // Refresh User
    builder
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });

    // Send Phone OTP
    builder
      .addCase(sendPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as SerializedApiError)?.message || 'Failed to send OTP';
      });

    // Verify Phone OTP
    builder
      .addCase(verifyPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as SerializedApiError)?.message || 'OTP verification failed';
      });
  },
});

export const { updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
