// likeSlice.ts
// src/store/slices/likeSlice.ts
// this function is used to manage the state of the liked threads

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LikeData {
  likedByMe: boolean;
  likesCount: number;
}

interface LikeState {
  likedThreads: Record<number, LikeData>;
}

const initialState: LikeState = {
  likedThreads: {},
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // ACTION 1: For the local user clicking the Heart icon
    toggleLikeRedux: (state, action: PayloadAction<{ threadId: number }>) => {
      const { threadId } = action.payload;
      const thread = state.likedThreads[threadId];
      
      if (thread) {
        const isNowLiked = !thread.likedByMe;
        thread.likedByMe = isNowLiked;
        thread.likesCount = isNowLiked ? thread.likesCount + 1 : thread.likesCount - 1;
      }
    },

    // ACTION 2: For WebSocket updates (only updates count, doesn't change your "likedByMe")
    updateLikeCountRedux: (state, action: PayloadAction<{ threadId: number; newCount: number }>) => {
      const { threadId, newCount } = action.payload;
      if (state.likedThreads[threadId]) {
        state.likedThreads[threadId].likesCount = newCount;
      }
    },

    setInitialLikes: (state, action: PayloadAction<Record<number, LikeData>>) => {
      state.likedThreads = { ...state.likedThreads, ...action.payload };
    }
  }
});

export const { toggleLikeRedux, updateLikeCountRedux, setInitialLikes } = likeSlice.actions;
export default likeSlice.reducer;