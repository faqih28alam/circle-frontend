// src/services/thread-service.ts

import { api } from "./api";


// 1. Define the shape of your data for better IntelliSense
export interface Thread {
  id: number;
  content: string;
  image?: string;
  isLiked: boolean;
  likes_count: number;
  likes: number;
  reply: number;
  user: {
    name: string;
    username: string;
    profile_picture?: string;
  };
  createdAt: string;
}

/**
 * Fetches the list of threads from the backend.
 * API requirements: GET {host}/api/v1/thread?limit=25
 */
export type ThreadResponse = Thread[];

export const getThreads = async (limit: number = 25): Promise<ThreadResponse> => {
  try {
    const response = await api.get(`/threads?limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};