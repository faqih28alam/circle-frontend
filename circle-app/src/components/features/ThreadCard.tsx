// ThreadCard.tsx
// src/components/ThreadCard.tsx
// Component that displays a thread

import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/services/api";

const ThreadCard = (props: any) => {
  
  const handleLike = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevents clicking the like from opening the thread detail
      try {
        // Use props.id since that is what Home.tsx passes down
        await api.post(`/like/${props.id}`); 
        
        // To see immediate changes, you should pass a refresh function from Home.tsx
        if (props.onLikeToggle) props.onLikeToggle();
      } catch (error) {
        console.error("Error liking thread", error);
      }
  };

  // return (
  //   <div className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors">
  //     <div className="flex gap-3">
  //       <Avatar className="h-10 w-10">
  //         {/* Show the author's profile picture */}
  //         <AvatarImage src={`${import.meta.env.VITE_URL_AVATAR}/${props.author?.photo_profile}`} /> 
  //         <AvatarFallback>{props.author?.full_name?.[0]}</AvatarFallback>
  //       </Avatar>
        
  //       <div className="flex-1">
  //         <div className="flex items-center gap-2">
  //           {/* Show the author's full name */}
  //           <span className="font-bold text-sm">{props.author?.full_name}</span>
  //           {/* Show the author's username */}
  //           <span className="text-zinc-500 text-xs">@{props.author?.username} • 4h</span>
  //         </div>
  //         <p className="mt-1 text-sm text-zinc-200">{props.content}</p>
          
  //         <div className="flex mt-3 gap-6">
  //           <div className={`flex items-center gap-1.5 transition-colors ${props.isLiked ? "text-red-500" : "text-zinc-500 hover:text-red-500"}`}>
  //             <Heart className={`w-4 h-4 ${props.isLiked ? "fill-current" : ""}`} />
  //             <span className="text-xs">{props.likes || 0}</span> {/* Show the number of likes */}
  //           </div>
            
  //           <div className="flex items-center gap-1.5 text-zinc-500 hover:text-[#04A51E] transition-colors">
  //             <MessageCircle className="w-4 h-4" />
  //             <span className="text-xs">{props.number_of_replies || 0} Replies</span> {/* Show the number of replies */}
  //           </div>
  //         </div>
  //         {/* Like button */}
  //         <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
  //           <Heart className={isLiked ? "fill-red-500 text-red-500" : "text-zinc-500"} size={18} />
  //           <span className="text-xs text-zinc-500">{likeCount}</span>
  //         </div>          
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors">
      <div className="flex gap-3">
        {/* Show the author's profile picture */}
        <Avatar className="h-10 w-10">
          <AvatarImage src={`${import.meta.env.VITE_URL_AVATAR}/${props.author?.photo_profile}`} /> 
          <AvatarFallback>{props.author?.full_name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* Show the author's full name */}
            <span className="font-bold text-sm">{props.author?.full_name}</span>
            {/* Show the author's username */}
            <span className="text-zinc-500 text-xs">@{props.author?.username}</span>
          </div>
          
          {/* Show the thread content */}
          <p className="mt-1 text-sm text-zinc-200">{props.content}</p>
          
          <div className="flex mt-3 gap-6">
            {/* Interactive Like Section */}
            <div 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer group`}
            >
              <Heart 
                className={`w-4 h-4 transition-all ${
                  props.isLiked 
                    ? "fill-red-500 text-red-500" 
                    : "text-zinc-500 group-hover:text-red-500"
                }`} 
              />
              {/* Show the number of likes */}
              <span className={`text-xs ${props.isLiked ? "text-red-500" : "text-zinc-500"}`}>
                {props.likes_count || 0}
              </span>
            </div>
            {/* Show the number of replies */}            
            <div className="flex items-center gap-1.5 text-zinc-500 hover:text-[#04A51E]">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{props.replies_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;


