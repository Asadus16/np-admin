import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getJobs as apiGetJobs,
  getJob as apiGetJob,
  getJobStats as apiGetJobStats,
  acknowledgeJob as apiAcknowledgeJob,
  declineJob as apiDeclineJob,
  markOnTheWay as apiMarkOnTheWay,
  markArrived as apiMarkArrived,
  startJob as apiStartJob,
  completeJob as apiCompleteJob,
  addJobNote as apiAddJobNote,
  uploadEvidence as apiUploadEvidence,
  deleteEvidence as apiDeleteEvidence,
  getSchedule as apiGetSchedule,
  getWorkingHours as apiGetWorkingHours,
  getUnavailableDays as apiGetUnavailableDays,
  requestDayOff as apiRequestDayOff,
  cancelDayOff as apiCancelDayOff,
  getAvailability as apiGetAvailability,
  toggleAvailability as apiToggleAvailability,
  getHistoryStats as apiGetHistoryStats,
} from '@/lib/technicianJob';
import {
  TechnicianJob,
  TechnicianJobStats,
  TechnicianHistoryStats,
  TechnicianSchedule,
  TechnicianWorkingHour,
  TechnicianUnavailableDay,
  TechnicianJobNote,
  TechnicianJobEvidence,
} from '@/types/technicianJob';
import { ApiException } from '@/lib/auth';

interface SerializedApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface TechnicianJobState {
  jobs: TechnicianJob[];
  currentJob: TechnicianJob | null;
  stats: TechnicianJobStats | null;
  historyStats: TechnicianHistoryStats | null;
  historyJobs: TechnicianJob[];
  schedule: TechnicianSchedule | null;
  workingHours: TechnicianWorkingHour[];
  unavailableDays: TechnicianUnavailableDay[];
  isAvailable: boolean;
  filter: {
    status: string;
    date: string;
  };
  isLoading: boolean;
  isSubmitting: boolean;
  error: SerializedApiError | null;
}

const initialState: TechnicianJobState = {
  jobs: [],
  currentJob: null,
  stats: null,
  historyStats: null,
  historyJobs: [],
  schedule: null,
  workingHours: [],
  unavailableDays: [],
  isAvailable: true,
  filter: {
    status: 'active',
    date: '',
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'technicianJob/fetchJobs',
  async (params: { status?: string; date?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await apiGetJobs(params);
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
      return rejectWithValue({ message: 'Failed to fetch jobs' } as SerializedApiError);
    }
  }
);

export const fetchJob = createAsyncThunk(
  'technicianJob/fetchJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiGetJob(jobId);
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
      return rejectWithValue({ message: 'Failed to fetch job' } as SerializedApiError);
    }
  }
);

export const fetchJobStats = createAsyncThunk(
  'technicianJob/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetJobStats();
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
      return rejectWithValue({ message: 'Failed to fetch stats' } as SerializedApiError);
    }
  }
);

export const fetchHistoryStats = createAsyncThunk(
  'technicianJob/fetchHistoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetHistoryStats();
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
      return rejectWithValue({ message: 'Failed to fetch history stats' } as SerializedApiError);
    }
  }
);

export const fetchHistoryJobs = createAsyncThunk(
  'technicianJob/fetchHistoryJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetJobs({ status: 'completed' });
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
      return rejectWithValue({ message: 'Failed to fetch history' } as SerializedApiError);
    }
  }
);

export const acknowledgeJob = createAsyncThunk(
  'technicianJob/acknowledge',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiAcknowledgeJob(jobId);
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
      return rejectWithValue({ message: 'Failed to acknowledge job' } as SerializedApiError);
    }
  }
);

export const declineJob = createAsyncThunk(
  'technicianJob/decline',
  async ({ jobId, reason }: { jobId: string; reason: string }, { rejectWithValue }) => {
    try {
      await apiDeclineJob(jobId, reason);
      return jobId;
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
      return rejectWithValue({ message: 'Failed to decline job' } as SerializedApiError);
    }
  }
);

export const markOnTheWay = createAsyncThunk(
  'technicianJob/onTheWay',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiMarkOnTheWay(jobId);
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
      return rejectWithValue({ message: 'Failed to update status' } as SerializedApiError);
    }
  }
);

export const markArrived = createAsyncThunk(
  'technicianJob/arrived',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiMarkArrived(jobId);
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
      return rejectWithValue({ message: 'Failed to update status' } as SerializedApiError);
    }
  }
);

export const startJob = createAsyncThunk(
  'technicianJob/start',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiStartJob(jobId);
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
      return rejectWithValue({ message: 'Failed to start job' } as SerializedApiError);
    }
  }
);

export const completeJob = createAsyncThunk(
  'technicianJob/complete',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiCompleteJob(jobId);
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
      return rejectWithValue({ message: 'Failed to complete job' } as SerializedApiError);
    }
  }
);

export const addNote = createAsyncThunk(
  'technicianJob/addNote',
  async ({ jobId, content, isInternal }: { jobId: string; content: string; isInternal?: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiAddJobNote(jobId, content, isInternal);
      return { jobId, note: response.data };
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
      return rejectWithValue({ message: 'Failed to add note' } as SerializedApiError);
    }
  }
);

export const uploadEvidence = createAsyncThunk(
  'technicianJob/uploadEvidence',
  async (
    { jobId, file, type, caption }: { jobId: string; file: File; type: 'before' | 'after' | 'other'; caption?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiUploadEvidence(jobId, file, type, caption);
      return { jobId, evidence: response.data };
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
      return rejectWithValue({ message: 'Failed to upload evidence' } as SerializedApiError);
    }
  }
);

export const deleteEvidence = createAsyncThunk(
  'technicianJob/deleteEvidence',
  async ({ jobId, evidenceId }: { jobId: string; evidenceId: string }, { rejectWithValue }) => {
    try {
      await apiDeleteEvidence(jobId, evidenceId);
      return { jobId, evidenceId };
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
      return rejectWithValue({ message: 'Failed to delete evidence' } as SerializedApiError);
    }
  }
);

export const fetchSchedule = createAsyncThunk(
  'technicianJob/fetchSchedule',
  async (params: { from?: string; to?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await apiGetSchedule(params);
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
      return rejectWithValue({ message: 'Failed to fetch schedule' } as SerializedApiError);
    }
  }
);

export const fetchWorkingHours = createAsyncThunk(
  'technicianJob/fetchWorkingHours',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetWorkingHours();
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
      return rejectWithValue({ message: 'Failed to fetch working hours' } as SerializedApiError);
    }
  }
);

export const fetchUnavailableDays = createAsyncThunk(
  'technicianJob/fetchUnavailableDays',
  async (params: { from?: string; to?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await apiGetUnavailableDays(params);
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
      return rejectWithValue({ message: 'Failed to fetch unavailable days' } as SerializedApiError);
    }
  }
);

export const requestDayOff = createAsyncThunk(
  'technicianJob/requestDayOff',
  async (data: { date: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequestDayOff(data);
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
      return rejectWithValue({ message: 'Failed to request day off' } as SerializedApiError);
    }
  }
);

export const cancelDayOff = createAsyncThunk(
  'technicianJob/cancelDayOff',
  async (dayOffId: string, { rejectWithValue }) => {
    try {
      await apiCancelDayOff(dayOffId);
      return dayOffId;
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
      return rejectWithValue({ message: 'Failed to cancel day off' } as SerializedApiError);
    }
  }
);

export const fetchAvailability = createAsyncThunk(
  'technicianJob/fetchAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetAvailability();
      return response.data.is_available;
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
      return rejectWithValue({ message: 'Failed to fetch availability' } as SerializedApiError);
    }
  }
);

export const toggleAvailability = createAsyncThunk(
  'technicianJob/toggleAvailability',
  async (isAvailable: boolean, { rejectWithValue }) => {
    try {
      const response = await apiToggleAvailability(isAvailable);
      return response.data.is_available;
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
      return rejectWithValue({ message: 'Failed to toggle availability' } as SerializedApiError);
    }
  }
);

const technicianJobSlice = createSlice({
  name: 'technicianJob',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action: PayloadAction<{ status?: string; date?: string }>) => {
      if (action.payload.status !== undefined) {
        state.filter.status = action.payload.status;
      }
      if (action.payload.date !== undefined) {
        state.filter.date = action.payload.date;
      }
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<TechnicianJob[]>) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch single job
    builder
      .addCase(fetchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJob.fulfilled, (state, action: PayloadAction<TechnicianJob>) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch stats
    builder
      .addCase(fetchJobStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobStats.fulfilled, (state, action: PayloadAction<TechnicianJobStats>) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(fetchHistoryStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoryStats.fulfilled, (state, action: PayloadAction<TechnicianHistoryStats>) => {
        state.isLoading = false;
        state.historyStats = action.payload;
      })
      .addCase(fetchHistoryStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(fetchHistoryJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoryJobs.fulfilled, (state, action: PayloadAction<TechnicianJob[]>) => {
        state.isLoading = false;
        state.historyJobs = action.payload;
      })
      .addCase(fetchHistoryJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Job action handlers (acknowledge, on the way, arrived, start, complete)
    const handleJobAction = (state: TechnicianJobState, action: PayloadAction<TechnicianJob>) => {
      state.isSubmitting = false;
      state.currentJob = action.payload;
      // Update in jobs list
      const index = state.jobs.findIndex((j) => j.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    };

    builder
      .addCase(acknowledgeJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(acknowledgeJob.fulfilled, handleJobAction)
      .addCase(acknowledgeJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(markOnTheWay.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(markOnTheWay.fulfilled, handleJobAction)
      .addCase(markOnTheWay.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(markArrived.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(markArrived.fulfilled, handleJobAction)
      .addCase(markArrived.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(startJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(startJob.fulfilled, handleJobAction)
      .addCase(startJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    builder
      .addCase(completeJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(completeJob.fulfilled, (state, action: PayloadAction<TechnicianJob>) => {
        state.isSubmitting = false;
        state.currentJob = action.payload;
        // Remove from active jobs list
        state.jobs = state.jobs.filter((j) => j.id !== action.payload.id);
      })
      .addCase(completeJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Add note
    builder
      .addCase(addNote.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<{ jobId: string; note: TechnicianJobNote }>) => {
        state.isSubmitting = false;
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.order_notes = [action.payload.note, ...(state.currentJob.order_notes || [])];
        }
      })
      .addCase(addNote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Upload evidence
    builder
      .addCase(uploadEvidence.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(uploadEvidence.fulfilled, (state, action: PayloadAction<{ jobId: string; evidence: TechnicianJobEvidence }>) => {
        state.isSubmitting = false;
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.evidence = [...(state.currentJob.evidence || []), action.payload.evidence];
        }
      })
      .addCase(uploadEvidence.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Delete evidence
    builder
      .addCase(deleteEvidence.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteEvidence.fulfilled, (state, action: PayloadAction<{ jobId: string; evidenceId: string }>) => {
        state.isSubmitting = false;
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.evidence = (state.currentJob.evidence || []).filter(
            (e) => e.id !== action.payload.evidenceId
          );
        }
      })
      .addCase(deleteEvidence.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch schedule
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action: PayloadAction<TechnicianSchedule>) => {
        state.isLoading = false;
        state.schedule = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch working hours
    builder
      .addCase(fetchWorkingHours.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkingHours.fulfilled, (state, action: PayloadAction<TechnicianWorkingHour[]>) => {
        state.isLoading = false;
        state.workingHours = action.payload;
      })
      .addCase(fetchWorkingHours.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch unavailable days
    builder
      .addCase(fetchUnavailableDays.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnavailableDays.fulfilled, (state, action: PayloadAction<TechnicianUnavailableDay[]>) => {
        state.isLoading = false;
        state.unavailableDays = action.payload;
      })
      .addCase(fetchUnavailableDays.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Request day off
    builder
      .addCase(requestDayOff.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(requestDayOff.fulfilled, (state, action: PayloadAction<TechnicianUnavailableDay>) => {
        state.isSubmitting = false;
        state.unavailableDays = [...state.unavailableDays, action.payload].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        if (state.schedule) {
          state.schedule.unavailable_days = [...state.schedule.unavailable_days, action.payload].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
      })
      .addCase(requestDayOff.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Cancel day off
    builder
      .addCase(cancelDayOff.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(cancelDayOff.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.unavailableDays = state.unavailableDays.filter((d) => d.id !== action.payload);
        if (state.schedule) {
          state.schedule.unavailable_days = state.schedule.unavailable_days.filter((d) => d.id !== action.payload);
        }
      })
      .addCase(cancelDayOff.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Decline job
    builder
      .addCase(declineJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(declineJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        // Remove from jobs list
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        if (state.currentJob?.id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(declineJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });

    // Fetch availability
    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoading = false;
        state.isAvailable = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as SerializedApiError;
      });

    // Toggle availability
    builder
      .addCase(toggleAvailability.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(toggleAvailability.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isSubmitting = false;
        state.isAvailable = action.payload;
      })
      .addCase(toggleAvailability.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as SerializedApiError;
      });
  },
});

export const { clearError, setFilter, clearCurrentJob } = technicianJobSlice.actions;
export default technicianJobSlice.reducer;
