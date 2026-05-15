import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Client {
  id: string;
  phone: string;
  name?: string;
  telegramId?: string;
}

interface ClientAuthState {
  client: Client | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ClientAuthState = {
  client: JSON.parse(localStorage.getItem('client') || 'null'),
  token: localStorage.getItem('client_token'),
  isAuthenticated: !!localStorage.getItem('client_token'),
  loading: false,
  error: null,
};

const clientAuthSlice = createSlice({
  name: 'clientAuth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ client: Client; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.client = action.payload.client;
      state.token = action.payload.token;
      localStorage.setItem('client', JSON.stringify(action.payload.client));
      localStorage.setItem('client_token', action.payload.token);
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.client = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('client');
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_auth');
    },
    clearError: (state) => {
      state.error = null;
    },
    setClient: (state, action: PayloadAction<Client>) => {
      state.client = action.payload;
      localStorage.setItem('client', JSON.stringify(action.payload));
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, clearError, setClient } = clientAuthSlice.actions;
export default clientAuthSlice.reducer;
