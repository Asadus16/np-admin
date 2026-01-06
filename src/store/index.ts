import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceAreaReducer from './slices/serviceAreaSlice';
import categoryReducer from './slices/categorySlice';
import companyReducer from './slices/companySlice';
import analyticsReducer from './slices/analyticsSlice';
import planReducer from './slices/planSlice';
import technicianAssignmentReducer from './slices/technicianAssignmentSlice';
import technicianJobReducer from './slices/technicianJobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceArea: serviceAreaReducer,
    category: categoryReducer,
    company: companyReducer,
    analytics: analyticsReducer,
    plan: planReducer,
    technicianAssignment: technicianAssignmentReducer,
    technicianJob: technicianJobReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
