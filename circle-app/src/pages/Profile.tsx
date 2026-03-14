// src/pages/Profile.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import UserProfile from "@/components/user/UserProfile";
import ThreadCard from "@/components/features/ThreadCard";

export default function Profile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const currentUser = useAppSelector((state) => state.auth.user);

    // If no username in URL, default to logged-in user's profile
    const targetUsername = username || currentUser?.username || "";

    console.log("currentUser:", currentUser)
    console.log("targetUsername:", targetUsername)

    const { profile, threads, isLoading, error, toggleFollow, refetch } = useProfile(targetUsername);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#04A51E]" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center py-20 gap-2 text-zinc-500">
                <p>User not found.</p>
            </div>
        );
    }

    // Media threads = threads that have an image
    const mediaThreads = threads.filter((t) => t.image);

    return (
        <div className="min-h-screen">
            {/* Profile Header */}
            <UserProfile profile={profile} onToggleFollow={toggleFollow} />

            {/* Tabs */}
            <Tabs defaultValue="threads">
                <TabsList className="w-full bg-transparent border-b border-zinc-800 rounded-none p-0 h-auto sticky top-0 z-10 bg-black">
                    <TabsTrigger
                        value="threads"
                        className="flex-1 py-3 rounded-none text-sm font-semibold bg-transparent border-b-2 border-transparent
                            text-zinc-500 hover:text-zinc-300 cursor-pointer
                            data-[state=active]:border-[#04A51E] data-[state=active]:text-white transition-all"
                    >
                        All Threads
                    </TabsTrigger>
                    <TabsTrigger
                        value="media"
                        className="flex-1 py-3 rounded-none text-sm font-semibold bg-transparent border-b-2 border-transparent
                            text-zinc-500 hover:text-zinc-300 cursor-pointer
                            data-[state=active]:border-[#04A51E] data-[state=active]:text-white transition-all"
                    >
                        Media
                    </TabsTrigger>
                </TabsList>

                {/* All Threads Tab */}
                <TabsContent value="threads" className="mt-0">
                    {threads.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-16 text-zinc-600">
                            <p className="text-sm">No threads yet</p>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <ThreadCard
                                key={thread.id}
                                {...thread}
                                onLikeToggle={refetch}
                            />
                        ))
                    )}
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="mt-0">
                    {mediaThreads.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-16 text-zinc-600">
                            <ImageIcon className="w-8 h-8" />
                            <p className="text-sm">No media yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1 p-1">
                            {mediaThreads.map((thread) => (
                                <div
                                    key={thread.id}
                                    onClick={() => navigate(`/thread/${thread.id}`)}
                                    className="aspect-square overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <img
                                        src={`${import.meta.env.VITE_IMG_URL}/uploads/${thread.image}`}
                                        alt="media"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}