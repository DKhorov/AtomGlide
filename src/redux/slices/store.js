import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchApps = createAsyncThunk('store/fetchApps', async () => {
  const { data } = await axios.get('/store/apps');
  return data;
});

export const fetchCategories = createAsyncThunk('store/fetchCategories', async () => {
  const { data } = await axios.get('/store/categories');
  return data;
});

const initialState = {
  apps: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  searchQuery: ''
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload;
      })
      .addCase(fetchApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedCategory, setSearchQuery } = storeSlice.actions;

export const storeReducer = storeSlice.reducer; 