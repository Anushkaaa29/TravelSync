import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    setLogout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    setLoadingComplete: state => {
      state.isLoading = false;
    },
  },
});

export const { setLogin, setLogout, setLoadingComplete } = authSlice.actions;
export default authSlice.reducer;
