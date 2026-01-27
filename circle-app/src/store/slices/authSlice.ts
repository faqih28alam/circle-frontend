// authSlice.ts 
// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  photo_profile?: string;
  bio?: string;
  banner?: string;
  following: any[]; 
  followers: any[];
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ACTION: Store data profile to redux
    setUser: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // You must save the token in Redux for the hook to work!
    },
    // ACTION: Update data profile on redux
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;