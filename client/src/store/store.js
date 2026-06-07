import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import reservationReducer from './slices/reservationSlice';
import staffReducer from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
    reservations: reservationReducer,
    staff: staffReducer,
  },
});

