import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
});

export const { setUser, setLoading, setError, logout, updateUser } = authSlice.actions;

export default authSlice.reducer; 