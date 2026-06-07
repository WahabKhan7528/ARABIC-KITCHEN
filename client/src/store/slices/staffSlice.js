import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchStaff = createAsyncThunk(
  'staff/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/staff');
      return response.data.staff; // Backend returns { count, staff }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff.');
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/create',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await api.post('/staff', staffData);
      return response.data.staff;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create staff.');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/staff/${id}`, data);
      return response.data.staff;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update staff.');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/staff/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete staff.');
    }
  }
);

const initialState = {
  staffList: [],
  status: 'idle',
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Staff
      .addCase(fetchStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staffList = action.payload;
        state.error = null;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create Staff
      .addCase(createStaff.fulfilled, (state, action) => {
        state.staffList.unshift(action.payload);
      })
      
      // Update Staff
      .addCase(updateStaff.fulfilled, (state, action) => {
        const index = state.staffList.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.staffList[index] = action.payload;
        }
      })
      
      // Delete Staff
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter((s) => s._id !== action.payload);
      });
  },
});

export default staffSlice.reducer;
