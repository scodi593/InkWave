import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  post: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost(state, action) {
      state.post = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearPost(state) {
      state.post = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setPost, setLoading, setError, clearPost } = postSlice.actions;
export default postSlice.reducer; 