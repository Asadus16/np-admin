import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceAreaReducer from './slices/serviceAreaSlice';
import categoryReducer from './slices/categorySlice';
import companyReducer from './slices/companySlice';
import analyticsReducer from './slices/analyticsSlice';
import planReducer from './slices/planSlice';
import vendorExclusivePlanReducer from './slices/vendorExclusivePlanSlice';
import chatReducer from './slices/chatSlice';
import technicianAssignmentReducer from './slices/technicianAssignmentSlice';
import technicianJobReducer from './slices/technicianJobSlice';
import pointsReducer from './slices/pointsSlice';
import refundReducer from './slices/refundSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceArea: serviceAreaReducer,
    category: categoryReducer,
    company: companyReducer,
    analytics: analyticsReducer,
    plan: planReducer,
    vendorExclusivePlan: vendorExclusivePlanReducer,
    chat: chatReducer,
    technicianAssignment: technicianAssignmentReducer,
    technicianJob: technicianJobReducer,
    points: pointsReducer,
    refund: refundReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
