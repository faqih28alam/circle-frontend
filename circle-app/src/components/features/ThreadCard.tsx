// ThreadCard.tsx
// src/components/ThreadCard.tsx
// Component that displays a thread

import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/services/api";
import { useState, useEffect } from "react";
import { ReplyModal } from './ReplyModal';
import { useNavigate } from "react-router-dom";

const ThreadCard = (props: any) => {
  const navigate = useNavigate();                                     // Initialize navigation
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likeCount, setLikeCount] = useState(props.likes_count || 0);
  
  // useEffect: Update the like state and count when props change
  useEffect(() => {
    setIsLiked(props.isLiked);
    setLikeCount(props.likes_count || 0);
  }, [props.isLiked, props.likes_count]);
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the like from opening the thread detail

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // Optimistic Update
    setIsLiked(!isLiked);
    setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1));

    try {
      // Use props.id since that is what Home.tsx passes down
      await api.post(`/like/${props.id}`); 
      
      // To see immediate changes, should pass a refresh function from Home.tsx
      if (props.onLikeToggle) props.onLikeToggle();
    } catch (error) {
      console.error("Error liking thread", error);

      // Revert the optimistic update
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    }
  };

  // Function to navigate to detail
  const handleCardClick = () => {
    navigate(`/thread/${props.id}`);
  };
  
  return (
    <div
    onClick={handleCardClick} // UI Trigger: Click anywhere on the card 
    className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors"
    >
      <div className="flex gap-3">
        {/* Show the author's profile picture */}
        <Avatar className="h-10 w-10" onClick={(e) => e.stopPropagation()}>
          <AvatarImage src={`${import.meta.env.VITE_URL_AVATAR}/${props.author?.photo_profile}`} /> 
          <AvatarFallback>{props.author?.full_name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* Show the author's full name */}
            <span className="font-bold text-sm hover:underline text-white">{props.author?.full_name}</span>
            {/* Show the author's username */}
            <span className="text-zinc-500 text-xs">@{props.author?.username}</span>
          </div>
          
          {/* Show the thread content */}
          <p className="mt-1 text-sm text-zinc-200">{props.content}</p>

          {/* Show Uploaded Post Images */}
          {props.image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800">
              <img 
                src={`${import.meta.env.VITE_URL_AVATAR}/${props.image}`} 
                alt="post content"
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}
          
          <div className="flex mt-3 gap-6" onClick={(e) => e.stopPropagation()}>
            {/* Interactive Like Section */}
            <div 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer group`}
            >
              <Heart 
                className={`w-4 h-4 transition-all ${
                  isLiked 
                    ? "fill-red-500 text-red-500" 
                    : "text-zinc-500 group-hover:text-red-500"
                }`} 
              />
              {/* Show the number of likes */}
              <span className={`text-xs ${isLiked ? "text-red-500" : "text-zinc-500"}`}>
                {likeCount}
              </span>
            </div>

            {/* Show the number of replies */}            
            <ReplyModal threadId={props.id} onSuccess={props.onLikeToggle}>
              <div className="flex items-center gap-1.5 text-zinc-500 hover:text-[#04A51E] transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{props.replies_count || 0}</span>
              </div>
            </ReplyModal>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;


