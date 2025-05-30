import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

// Асинхронные действия
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const { data } = await axios.get('/posts');
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
});

export const fetchFollowingPosts = createAsyncThunk(
  'posts/fetchFollowingPosts',
  async (_, { getState }) => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      
      const { data } = await axios.get('/posts/following', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке постов подписок:', err);
      throw err;
    }
  }
);

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  try {
    const { data } = await axios.get('/tags');
    
    // Обработка тегов с бэкенда
    const uniqueTags = new Set();
    
    if (Array.isArray(data)) {
      data.forEach(post => {
        (post.tags || '').split(',').forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag) uniqueTags.add(trimmedTag);
        });
      });
    }
    
    return Array.from(uniqueTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
});

// Начальное состояние
const initialState = {
  posts: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  followingPosts: {
    items: [],
    status: 'idle',
    error: null
  },
  tags: {
    items: [],
    status: 'idle',
    error: null
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка основных постов
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.status = 'succeeded';
        state.posts.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.status = 'failed';
        state.posts.error = action.error.message;
      })

      // Обработка постов подписок
      .addCase(fetchFollowingPosts.pending, (state) => {
        state.followingPosts.status = 'loading';
        state.followingPosts.error = null;
      })
      .addCase(fetchFollowingPosts.fulfilled, (state, action) => {
        state.followingPosts.status = 'succeeded';
        state.followingPosts.items = action.payload;
      })
      .addCase(fetchFollowingPosts.rejected, (state, action) => {
        state.followingPosts.status = 'failed';
        state.followingPosts.error = action.error.message;
      })

      // Обработка тегов
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.status = 'succeeded';
        state.tags.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tags.status = 'failed';
        state.tags.error = action.error.message;
      });
  },
});

export const postsReducer = postsSlice.reducer;