import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch all reservations
export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (status, { rejectWithValue }) => {
    try {
      const url = status ? `/reservations?status=${status}` : '/reservations';
      const response = await api.get(url);
      return response.data.reservations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations.');
    }
  }
);

// Create a new reservation
export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data.reservation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create reservation.');
    }
  }
);

// Update reservation status
export const updateReservationStatus = createAsyncThunk(
  'reservations/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reservations/${id}/status`, { status });
      return response.data.reservation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reservation status.');
    }
  }
);

const initialState = {
  reservations: [],
  status: 'idle',
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
        state.error = null;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.unshift(action.payload);
      })
      // Update Status
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const index = state.reservations.findIndex((res) => res._id === action.payload._id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      });
  },
});

export default reservationSlice.reducer;
