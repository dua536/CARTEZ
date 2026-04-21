import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService, getApiErrorMessage } from '../../api';
import { clearStoredAuth, readStoredAuth, saveStoredAuth } from '../../utils/authStorage';

const storedAuth = readStoredAuth();

const initialState = {
  token: storedAuth?.token || null,
  user: storedAuth?.user || null,
  isAuthenticated: storedAuth?.isAuthenticated || false,
  status: 'idle',
  error: null,
};

const normalizeAuthPayload = (responseData) => {
  const authData = responseData?.data || responseData || {};

  return {
    token: authData.token || null,
    user: authData.user || null,
  };
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      return normalizeAuthPayload(response.data);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(payload);
      return normalizeAuthPayload(response.data);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      clearStoredAuth();
    },
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = Boolean(action.payload.token);
        state.error = null;
        saveStoredAuth(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
          state.error = action.payload || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = Boolean(action.payload.token);
        state.error = null;
        saveStoredAuth(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
          state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
