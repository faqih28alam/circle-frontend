// RightBar.tsx
// src/components/layout/RightBar.tsx
// Component that displays the right sidebar

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';

const RightBar = () => {

  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      {/* My Profile Card */}
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <h3 className="font-bold mb-3 text-sm">My Profile</h3>
        <div className="relative mb-12">
          {/* Banner Image */}
          <img 
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400" 
            className="h-[80px] w-full rounded-lg object-cover" 
            alt="cover"
          />
          {/* Dynamic User Profile Picture */}
          <Avatar className="absolute -bottom-10 left-4 w-20 h-20 border-4 border-[#1A1A1A]">
            <AvatarImage src={`${import.meta.env.VITE_URL_AVATAR}/${user?.photo_profile}`} />
            <AvatarFallback>{user?.full_name?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col mt-2">
          {/* Dynamic User Profile Details */}
          <h4 className="font-bold text-xl">{user?.full_name || "Guest User ✨"}</h4>
          <p className="text-zinc-500 text-sm">@{user?.username || "guest"}</p>
          <p className="text-sm mt-2">{user?.bio || "No bio yet."}</p>
          <div className="flex gap-4 mt-3">
            <p className="text-xs text-zinc-400"><span className="font-bold text-white">291</span> Following</p>
            <p className="text-xs text-zinc-400"><span className="font-bold text-white">23</span> Followers</p>
          </div>
        </div>
      </div>

      {/* Suggested for You */}
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <h3 className="font-bold mb-4 text-sm">Suggested for you</h3>
        <div className="flex flex-col gap-4">
          {['Mohammed Jawahir', 'Shakia Kimathi'].map((user) => (
            <div key={user} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-bold">{user}</p>
                  <p className="text-[10px] text-zinc-500">@{user.split(' ')[0].toLowerCase()}</p>
                </div>
              </div>
              <Button variant="outline" className="h-8 rounded-full border-white text-black hover:bg-white hover:text-green-500 text-[10px] px-4 cursor-pointer">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <p className="font-bold text-sm mb-1">Developed by Faqih</p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Powered by Dumbways Indonesia</p>
      </div>
    </div>
  );
};

export default RightBar;