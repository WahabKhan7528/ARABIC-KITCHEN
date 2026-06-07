import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // { message, token, user }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Network error occurred.');
    }
  }
);

// Async thunk for customer registration
export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register-customer', customerData);
      return response.data; // { message, user }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Registration failed.');
    }
  }
);

// Async thunk for logging out via HTTP-Only cookie API
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

// Initial state check - we only keep 'user' in localStorage for instant UI rendering.
// The actual secure session is the HTTP-Only cookie.
const userStr = localStorage.getItem('user');
let initialUser = null;
try {
  if (userStr) initialUser = JSON.parse(userStr);
} catch (e) {
  console.error('Error parsing user from localStorage', e);
}

const initialState = {
  user: initialUser,
  isAuthenticated: !!initialUser, // Optimistic auth state
  isLoading: false,
  error: null,
};

// ------------------------------------------------------------------
// Async Thunks
// ------------------------------------------------------------------

/**
 * Restore session from HTTP-Only cookie.
 * If successful, we update the user details. If it fails (401), we clear local user state.
 */
export const checkAuthSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data; // { user: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Session invalid'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        
        // Save non-sensitive metadata for UI persistence
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // registerCustomer cases
      .addCase(registerCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      // logoutUser cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear state anyway
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem('user');
      })
      // checkAuthSession cases
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(checkAuthSession.rejected, (state) => {
        // Cookie invalid/missing, wipe local optimistic state
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
