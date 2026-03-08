// src/components/layout/RightBar.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { GithubIcon, LinkedinIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

interface SuggestedUser {
  id: number;
  username: string;
  full_name: string;
  photo_profile: string | null;
  isFollowing: boolean;
}

interface FollowCounts {
  followersCount: number;
  followingCount: number;
}

const RightBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Real data states
  const [counts, setCounts] = useState<FollowCounts>({ followersCount: 0, followingCount: 0 });
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

  // Keep local state in sync with Redux
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Fetch follow counts + suggested users on mount
  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };

    const fetchData = async () => {
      try {
        const [countsRes, suggestedRes] = await Promise.all([
          axios.get(`${API}/follows/count`, { headers }),
          axios.get(`${API}/follows/suggested`, { headers }),
        ]);
        setCounts(countsRes.data.data);
        setSuggested(suggestedRes.data.data);
      } catch (error) {
        console.error("RightBar fetch error:", error);
      } finally {
        setLoadingSuggested(false);
      }
    };

    fetchData();
  }, []);

  // Optimistic follow toggle for suggested users
  const toggleFollow = async (targetId: number, isCurrentlyFollowing: boolean) => {
    // Update UI instantly
    setSuggested((prev) =>
      prev.map((u) =>
        u.id === targetId ? { ...u, isFollowing: !isCurrentlyFollowing } : u
      )
    );
    // Update count optimistically
    setCounts((prev) => ({
      ...prev,
      followingCount: isCurrentlyFollowing
        ? prev.followingCount - 1
        : prev.followingCount + 1,
    }));

    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      if (isCurrentlyFollowing) {
        await axios.delete(`${API}/follows/${targetId}`, { headers });
      } else {
        await axios.post(`${API}/follows/${targetId}`, {}, { headers });
      }
    } catch {
      // Revert on failure
      setSuggested((prev) =>
        prev.map((u) =>
          u.id === targetId ? { ...u, isFollowing: isCurrentlyFollowing } : u
        )
      );
      setCounts((prev) => ({
        ...prev,
        followingCount: isCurrentlyFollowing
          ? prev.followingCount + 1
          : prev.followingCount - 1,
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("bio", bio);
    if (imageFile) formData.append("photo_profile", imageFile);

    try {
      const response = await api.patch("/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(updateUser(response.data.user));
      setIsOpen(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* My Profile Card */}
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <h3 className="font-bold mb-3 text-sm text-white">My Profile</h3>
        <div className="relative mb-12">
          <img
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400"
            className="h-[80px] w-full rounded-lg object-cover"
            alt="cover"
          />
          <Avatar className="absolute -bottom-10 left-4 w-20 h-20 border-4 border-[#1A1A1A]">
            <AvatarImage src={`${import.meta.env.VITE_URL_AVATAR}/${user?.photo_profile}`} />
            <AvatarFallback>{user?.full_name?.[0] || "?"}</AvatarFallback>
          </Avatar>

          {/* Edit Profile Modal */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full text-black border-zinc-700 bg-white absolute -bottom-10 right-4 hover:bg-black hover:text-white hover:border-lime-500 hover:border-3 cursor-pointer transition-all"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#121212] border-zinc-700 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-[#121212] border-zinc-700 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Profile Picture</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="bg-[#121212] border-zinc-700 file:text-green-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  Save Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col mt-2 text-white">
          <h4 className="font-bold text-xl">{user?.full_name || "Guest User ✨"}</h4>
          <p className="text-zinc-500 text-sm">@{user?.username || "guest"}</p>
          <p className="text-sm mt-2">{user?.bio || "No bio yet."}</p>
          {/* Real counts from API */}
          <div className="flex gap-4 mt-3">
            <p className="text-xs text-zinc-400">
              <span className="font-bold text-white">{counts.followingCount}</span> Following
            </p>
            <p className="text-xs text-zinc-400">
              <span className="font-bold text-white">{counts.followersCount}</span> Followers
            </p>
          </div>
        </div>
      </div>

      {/* Suggested for You */}
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <h3 className="font-bold mb-4 text-sm">Suggested for you</h3>

        {loadingSuggested ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#04A51E]" />
          </div>
        ) : suggested.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-2">No suggestions right now</p>
        ) : (
          <div className="flex flex-col gap-4">
            {suggested.map((suggestedUser) => (
              <div key={suggestedUser.id} className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        suggestedUser.photo_profile
                          ? `${import.meta.env.VITE_URL_AVATAR}/${suggestedUser.photo_profile}`
                          : undefined
                      }
                    />
                    <AvatarFallback>{suggestedUser.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold">{suggestedUser.full_name}</p>
                    <p className="text-[10px] text-zinc-500">@{suggestedUser.username}</p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleFollow(suggestedUser.id, suggestedUser.isFollowing)}
                  variant="outline"
                  className={`h-8 rounded-full text-[10px] px-4 cursor-pointer transition-all ${suggestedUser.isFollowing
                    ? "border-zinc-600 text-white bg-transparent hover:bg-zinc-800"
                    : "border-white text-black hover:bg-black hover:text-white hover:border-lime-500"
                    }`}
                >
                  {suggestedUser.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#1A1A1A] rounded-xl p-4">
        <p className="flex flex-row font-bold text-sm mb-3 gap-1">
          Developed by Faqih
          <a className="text-zinc-500" href="https://github.com/faqih28alam/circle-frontend" target="_blank" rel="noopener noreferrer">
            <GithubIcon size={20} />
          </a>
          <a className="text-zinc-500" href="https://www.linkedin.com/in/faqih82alam/" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon size={20} color="#0077B5" />
          </a>
        </p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Powered by Dumbways Indonesia</p>
      </div>
    </div>
  );
};

export default RightBar;