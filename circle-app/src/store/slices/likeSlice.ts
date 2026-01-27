// likeSlice.ts
// src/store/slices/likeSlice.ts
// this function is used to manage the state of the liked threads

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your state
interface LikeState {
  likedThreads: Record<number, boolean>; // Tells TS: "The keys are numbers, values are booleans"
}

const initialState: LikeState = {
  likedThreads: {},
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLikeRedux: (state, action: PayloadAction<{ threadId: number }>) => {
      const { threadId } = action.payload;
      // Now TS knows likedThreads[threadId] is valid
      state.likedThreads[threadId] = !state.likedThreads[threadId];
    },
    setInitialLikes: (state, action: PayloadAction<Record<number, boolean>>) => {
      state.likedThreads = action.payload;
    }
  }
});

export const { toggleLikeRedux, setInitialLikes } = likeSlice.actions;
export default likeSlice.reducer;