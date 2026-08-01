import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerInitApi, registerConfirmApi, meApi } from '../services/authService';

// 1. Thunk for User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Thunk for Registration Step 1 (PAN Check & Send OTP via Backend)
export const registerInit = createAsyncThunk(
  'auth/registerInit',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerInitApi(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Thunk for Registration Step 2 (Verify OTP & Complete User Registration)
export const registerConfirm = createAsyncThunk(
  'auth/registerConfirm',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerConfirmApi(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Thunk to restore active user session from token
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await meApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Load saved user data from sessionStorage if available
const storedUser = JSON.parse(sessionStorage.getItem('loanbridge_user') || 'null');

const initialState = {
  user: storedUser,
  token: sessionStorage.getItem('loanbridge_token'),
  loading: false,
  error: null,
  otpModalOpen: false, // Controls whether OTP popup is open
  registerSuccess: false,
  restored: false,
};

// Helper function to save JWT token and user info in browser session storage
const saveAuthData = (state, payload) => {
  state.token = payload.token;
  state.user = payload.user;
  sessionStorage.setItem('loanbridge_token', payload.token);
  sessionStorage.setItem('loanbridge_user', JSON.stringify(payload.user));
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action to clear stored session data
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpModalOpen = false;
      state.registerSuccess = false;
      sessionStorage.removeItem('loanbridge_token');
      sessionStorage.removeItem('loanbridge_user');
    },
    // Clear error message
    clearAuthError(state) {
      state.error = null;
    },
    // Close OTP Modal
    closeOtpModal(state) {
      state.otpModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login state handling
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        saveAuthData(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration Step 1 (Init)
      .addCase(registerInit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerInit.fulfilled, (state) => {
        state.loading = false;
        state.otpModalOpen = true; // Open OTP modal popup
      })
      .addCase(registerInit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration Step 2 (Confirm OTP)
      .addCase(registerConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerConfirm.fulfilled, (state, action) => {
        state.loading = false;
        state.otpModalOpen = false;
        state.registerSuccess = true;
        saveAuthData(state, action.payload);
      })
      .addCase(registerConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Session Restore
      .addCase(restoreSession.pending, (state) => {
        state.restored = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.restored = true;
        sessionStorage.setItem('loanbridge_user', JSON.stringify(action.payload));
      })
      .addCase(restoreSession.rejected, (state) => {
        state.restored = true;
        state.user = null;
        state.token = null;
        sessionStorage.removeItem('loanbridge_token');
        sessionStorage.removeItem('loanbridge_user');
      });
  },
});

export const { logout, clearAuthError, closeOtpModal } = authSlice.actions;
export default authSlice.reducer;

