// index.ts
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import likeReducer from './slices/likeSlice';

export const store = configureStore({
  reducer: {
    likes: likeReducer, // This matches the 'likes' name in your slice
  },
});

// Types for your hooks (useful for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;