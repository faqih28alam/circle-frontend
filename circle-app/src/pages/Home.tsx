// Home.tsx
// src/pages/Home.tsx
// Page that displays the home page (Sidebar, Feed, Right Sidebar)

import { useState, useEffect } from "react";
import { getThreads, type Thread } from '@/services/thread-service';
import ThreadCard from '@/components/features/ThreadCard';
import Sidebar from '../components/layout/Sidebar';
import RightBar from '../components/layout/RightBar';
import { Loader2, AlertCircle } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch initial data
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        // setError(null);
        const response = await getThreads();
        setThreads(response || []);}
        catch (err) {
          console.error("Error fetching threads", err);
          setError("Could not load threads. Check your connection.");
        } finally {
          setLoading(false);
        }
      };
      fetchThreads();
  }, []); 
    
  // Effect 2: Real-time Socket Listeners
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

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-[1300px] mx-auto flex">
        
        {/* Left Sidebar */}
        <aside className="w-[250px] fixed h-screen border-r border-zinc-800">
          <Sidebar />
        </aside>

        {/* Center Feed */}
        <main className="flex-1 ml-[250px] mr-[350px] border-r border-zinc-800 min-h-screen">
          <header className="p-4 border-b border-zinc-800 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold">Home</h1>
          </header>

          {/* Thread Input Placeholder */}
          <div className="p-4 border-b border-zinc-800">
            <p className="text-zinc-500">What is happening?!</p>
          </div>

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

        {/* Right Panel */}
        <aside className="w-[350px] fixed right-[calc((100vw-1300px)/2)] h-screen p-4 overflow-y-auto hidden lg:block">
          <RightBar />
        </aside>
      </div>
    </div>
  );
}