import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientAuthReducer from './slices/clientAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientAuth: clientAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
