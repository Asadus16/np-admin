import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceAreaReducer from './slices/serviceAreaSlice';
import categoryReducer from './slices/categorySlice';
import companyReducer from './slices/companySlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceArea: serviceAreaReducer,
    category: categoryReducer,
    company: companyReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
