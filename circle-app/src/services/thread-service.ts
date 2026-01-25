// src/services/thread-service.ts
import api from '@/lib/api';

// 1. Define the shape of your data for better IntelliSense
export interface Thread {
  id: number;
  content: string;
  image?: string;
  isLiked: boolean;
  likes: number;
  reply: number;
  user: {
    name: string;
    username: string;
    profile_picture?: string;
  };
  createdAt: string;
}

interface ThreadResponse {
  data: {
    threads: Thread[];
  };
  message: string;
}

/**
 * Fetches the list of threads from the backend.
 * API requirements: GET {host}/api/v1/thread?limit=25
 */
export const getThreads = async (limit: number = 25): Promise<ThreadResponse> => {
  try {
    const response = await api.get(`/v1/thread?limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};