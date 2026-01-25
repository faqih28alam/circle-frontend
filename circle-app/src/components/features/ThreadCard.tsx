// ThreadCard.tsx
// src/components/ThreadCard.tsx
// Component that displays a thread

import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ThreadCard = (props: any) => {
  return (
    <div className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={props.user?.profile_picture} />
          <AvatarFallback>{props.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{props.user?.name}</span>
            <span className="text-zinc-500 text-xs">@{props.user?.username} • 4h</span>
          </div>
          <p className="mt-1 text-sm text-zinc-200">{props.content}</p>
          
          <div className="flex mt-3 gap-6">
            <div className={`flex items-center gap-1.5 transition-colors ${props.isLiked ? "text-red-500" : "text-zinc-500 hover:text-red-500"}`}>
              <Heart className={`w-4 h-4 ${props.isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{props.likes}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-zinc-500 hover:text-[#04A51E] transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{props.reply} Replies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;