import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, verifyPanApi, meApi } from '../services/authService';

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

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerApi(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPan = createAsyncThunk(
  'auth/verifyPan',
  async (pan, { rejectWithValue }) => {
    try {
      const response = await verifyPanApi(pan);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

const storedUser = JSON.parse(sessionStorage.getItem('loanbridge_user') || 'null');

const initialState = {
  user: storedUser,
  token: sessionStorage.getItem('loanbridge_token'),
  loading: false,
  error: null,
  panResult: null,
  panLoading: false,
  restored: false,
};

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
    logout(state) {
      state.user = null;
      state.token = null;
      state.panResult = null;
      sessionStorage.removeItem('loanbridge_token');
      sessionStorage.removeItem('loanbridge_user');
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearPanResult(state) {
      state.panResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        saveAuthData(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPan.pending, (state) => {
        state.panLoading = true;
        state.error = null;
        state.panResult = null;
      })
      .addCase(verifyPan.fulfilled, (state, action) => {
        state.panLoading = false;
        state.panResult = action.payload;
      })
      .addCase(verifyPan.rejected, (state, action) => {
        state.panLoading = false;
        state.error = action.payload;
      })
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

export const { logout, clearAuthError, clearPanResult } = authSlice.actions;
export default authSlice.reducer;
