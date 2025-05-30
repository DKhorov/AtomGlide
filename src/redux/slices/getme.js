import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser', 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/auth/me');
      return data;
    } catch (error) {
      // Handle different error responses
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch user');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    await axios.post('/auth/logout');
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Synchronous actions if needed
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.isAuthenticated = false;
      })
      
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Actions
export const { clearUser } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;