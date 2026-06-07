import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch all menu items
export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async (category, { rejectWithValue }) => {
    try {
      const url = category ? `/items?category=${category}` : '/items';
      const response = await api.get(url);
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items.');
    }
  }
);

// Create a new menu item
export const createItem = createAsyncThunk(
  'items/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/items', formData);
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create item.');
    }
  }
);

// Update a menu item
export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/items/${id}`, formData);
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item.');
    }
  }
);

// Delete a menu item
export const deleteItem = createAsyncThunk(
  'items/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      return id; // Return the deleted item's ID so we can remove it from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item.');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Add new item to the top
      })
      // Update
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default itemSlice.reducer;
