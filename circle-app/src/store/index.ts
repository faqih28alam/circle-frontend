// index.ts
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import likeReducer from './slices/likeSlice';
import authReducer from './slices/authSlice'; 

export const store = configureStore({
  reducer: {
    likes: likeReducer, 
    auth: authReducer, 
  },
});

// Types for your hooks (useful for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;