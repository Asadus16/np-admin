import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceAreaReducer from './slices/serviceAreaSlice';
import categoryReducer from './slices/categorySlice';
import companyReducer from './slices/companySlice';
import analyticsReducer from './slices/analyticsSlice';
import planReducer from './slices/planSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import technicianAssignmentReducer from './slices/technicianAssignmentSlice';
import technicianJobReducer from './slices/technicianJobSlice';
import pointsReducer from './slices/pointsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceArea: serviceAreaReducer,
    category: categoryReducer,
    company: companyReducer,
    analytics: analyticsReducer,
    plan: planReducer,
    chat: chatReducer,
    notification: notificationReducer,
    technicianAssignment: technicianAssignmentReducer,
    technicianJob: technicianJobReducer,
    points: pointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
