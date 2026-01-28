// ThreadDetail.tsx
// src/pages/ThreadDetail.tsx
// display the main post and the full list of replies under it

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import ThreadCard from "@/components/features/ThreadCard";
import { ReplyModal } from "@/components/features/ReplyModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setInitialLikes } from "@/store/slices/likeSlice";
// import axios from "axios";

export default function ThreadDetail() {

  const dispatch = useAppDispatch(); // Disptach is for updating redux state
  const user = useAppSelector((state) => state.auth.user); //useAppSelector is for accessing redux state
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Request 1: Get Thread Detail
      const threadRes = await api.get(`/thread/${id}`);
      const threadData = threadRes.data.data;
      setThread(threadData);
      dispatch(
        setInitialLikes({
          [threadData.id]: {
            likedByMe: threadData.isLiked,    
            likesCount: threadData.likes_count 
          },
          
        })
      );
      // Request 2: Get Replies
      const repliesRes = await api.get(`/thread/${id}/replies`);
      setReplies(repliesRes.data.data.replies);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading) return <div className="p-4 text-zinc-500 text-center">Loading...</div>;
  if (!thread) return <div className="p-4 text-zinc-500 text-center">Thread not found.</div>;

  return (
    <div className="min-h-screen border-x border-zinc-800 bg-black">
      {/* Header with Back Button */}
      <div className="p-4 flex items-center gap-6 border-b border-zinc-800 sticky top-0 bg-black/80 backdrop-blur-md z-10 text-white">
        <button onClick={() => navigate('/home')} className="hover:bg-zinc-800 p-2 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Status</h1>
      </div>

      {/* The Main Thread */}
      <ThreadCard {...thread} onLikeToggle={fetchData} />

      {/* Reply Input Trigger */}
      <div className="p-4 border-b border-zinc-800">
        <ReplyModal threadId={Number(id)} onSuccess={fetchData}>
           <div className="flex items-center gap-3 cursor-pointer">
              {/* Dynamic User Profile Picture */}
              <Avatar className="">
                <AvatarImage 
                src={`${import.meta.env.VITE_URL_AVATAR}/${user?.photo_profile}`} />
                <AvatarFallback>{user?.full_name?.[0] || '?'}</AvatarFallback>
              </Avatar>

              <span className="text-zinc-500">Type your reply!</span>
           </div>
        </ReplyModal>
      </div>

      {/* List of Replies */}
      <div className="flex flex-col">
        {replies.map((reply) => (
          <div key={reply.id} className="p-4 border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                {reply.author?.photo_profile && (
                  <img src={`${import.meta.env.VITE_URL_AVATAR}/${reply.author.photo_profile}`} alt="avatar" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{reply.author?.full_name}</span>
                  <span className="text-zinc-500 text-xs">@{reply.author?.username}</span>
                </div>
                <p className="mt-1 text-sm text-zinc-200">{reply.content}</p>
                {reply.image && (
                   <img 
                    src={`${import.meta.env.VITE_URL_AVATAR}/${reply.image}`} 
                    className="mt-3 rounded-xl border border-zinc-800 max-h-80 object-cover" 
                   />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}