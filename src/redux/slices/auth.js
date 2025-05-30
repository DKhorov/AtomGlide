import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('auth/login', params);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
});

export const fetchAuthMe = createAsyncThunk(
  'auth/fetchAuthMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/auth/me');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации');
    }
  }
);

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('auth/register', params);
  return data;
});

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при изменении пароля');
    }
  }
);

const initialState = {
  data: null,
  status: 'idle',
  error: null,
  passwordChangeStatus: 'idle',
  passwordChangeError: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      localStorage.removeItem('token');
    },
    resetPasswordChangeStatus: (state) => {
      state.passwordChangeStatus = 'idle';
      state.passwordChangeError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeStatus = 'loading';
        state.passwordChangeError = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.passwordChangeStatus = 'succeeded';
        state.data = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeStatus = 'failed';
        state.passwordChangeError = action.payload || action.error.message;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectPasswordChangeStatus = (state) => state.auth.passwordChangeStatus;
export const selectPasswordChangeError = (state) => state.auth.passwordChangeError;

export const authReducer = authSlice.reducer;
export const { logout, resetPasswordChangeStatus } = authSlice.actions;