// Home.tsx
// src/pages/Home.tsx
// Page that displays the home page (Sidebar, Feed, Right Sidebar)

import { useState, useEffect } from "react";
import { getThreads, type Thread } from '@/services/thread-service';
import ThreadCard from '@/components/features/ThreadCard';
import { Loader2, AlertCircle } from "lucide-react";
import { io } from "socket.io-client";
import { CreatePostModal } from '@/components/features/CreatePostModal';
import { updateLikeCountRedux, setInitialLikes } from "@/store/slices/likeSlice";
import { useDispatch } from 'react-redux'


const socket = io("http://localhost:3000");

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch initial data
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await getThreads();
        const data = response || [];
        setThreads(data);

        // SYNC REDUX: Map threads to the format expected by your slice
        const initialLikesMap: Record<number, { likedByMe: boolean; likesCount: number }> = {};
        data.forEach((thread: Thread) => {
          initialLikesMap[thread.id] = {
            likedByMe: thread.isLiked,    // Backend field
            likesCount: thread.likes_count // Backend field
          };
        });
        dispatch(setInitialLikes(initialLikesMap));
      } catch (err) {
          console.error("Error fetching threads", err);
          setError("Could not load threads. Check your connection.");
        } finally {
          setLoading(false);
        }
      };
      fetchThreads();
  }, []); 
    
  // Effect 2: Real-time Socket Listeners -> New Thread
  useEffect(() => {
    const handleNewThread = (newThread: Thread) => {
      // Add the new thread to the top
      setThreads((prev) => [newThread, ...prev]);
    };

    socket.on("newThread", handleNewThread);

    // Cleanup: Remove listener when component unmounts
    return () => {
      socket.off("newThread", handleNewThread);
    };
  }, []);

  // Effect 3: Real-time Socket Listeners -> Update Like
  useEffect(() => {
    const handleUpdateLike = (data: { threadId: number; newLikeCount: number }) => {
      // Update local React state
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === data.threadId 
            ? { ...thread, likes_count: data.newLikeCount } 
            : thread
        )
      );
      // Update Redux state via WebSocket
      dispatch(updateLikeCountRedux({
        threadId: data.threadId, 
        newCount: data.newLikeCount 
      }));
    };

    socket.on("updateLike", handleUpdateLike);

    return () => {
      socket.off("updateLike", handleUpdateLike);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-[1300px] mx-auto flex">
        
        {/* Left Sidebar Removed because already used on Main layout */}
        {/* <aside className="w-[250px] fixed h-screen border-r border-zinc-800">
          <Sidebar />
        </aside> */}

        {/* Center Feed */}
        <main className="flex-1 border-zinc-800 min-h-screen">

          {/* Header */}
          <header className="p-4 border-b border-zinc-800 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold border-b border-zinc-800 p-4">Home</h1>
            {/* Thread Input Placeholder */}
            <div className="p-4 border-b border-zinc-800">
              <CreatePostModal onPostSuccess={() => window.location.reload()}>
                <p className="text-zinc-500">What is happening?!</p>
              </CreatePostModal>
            </div>
          </header>

          {/* Feed */}
          <div className="flex flex-col">
            {loading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#04A51E]" />
              </div>
            ) : error ? (
              /* --- ADDED ERROR DISPLAY --- */
              <div className="flex flex-col items-center justify-center p-10 text-zinc-500">
                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 text-[#04A51E] hover:underline cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : (
              threads.map((thread: Thread) => (
                <ThreadCard key={thread.id} {...thread} />
              ))
            )}
          </div>
        </main>

        {/* Right Panel Removed because already used in Main Layout*/}
        {/* <aside className="w-[350px] fixed right-[calc((100vw-1300px)/2)] h-screen p-4 overflow-y-auto hidden lg:block">
          <RightBar />
        </aside> */}
      </div>
    </div>
  );
}