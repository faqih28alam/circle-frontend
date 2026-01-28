// index.ts
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import likeReducer from './slices/likeSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth : authReducer,
    likes: likeReducer, // This matches the 'likes' name in your slice
  },
  devTools: true,
});

// Types for your hooks (useful for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;