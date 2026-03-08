// src/pages/Follows.tsx

import { useState } from "react";
import { Loader2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFollows } from "@/hooks/useFollows";

// Reusable user row with Follow/Following toggle
function UserRow({
    user,
    onToggle,
}: {
    user: { id: number; username: string; full_name: string; photo_profile: string | null; bio: string | null; isFollowing: boolean };
    onToggle: (id: number, isFollowing: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3 px-1">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage
                        src={
                            user.photo_profile
                                ? `${import.meta.env.VITE_API_URL}/uploads/${user.photo_profile}`
                                : undefined
                        }
                    />
                    <AvatarFallback className="bg-zinc-800 text-white text-sm">
                        {user.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm leading-tight">
                        {user.full_name}
                    </span>
                    <span className="text-zinc-400 text-xs">@{user.username}</span>
                    {user.bio && (
                        <span className="text-zinc-500 text-xs mt-0.5 line-clamp-1">
                            {user.bio}
                        </span>
                    )}
                </div>
            </div>

            {/* Follow / Following toggle button */}
            <Button
                onClick={() => onToggle(user.id, user.isFollowing)}
                variant={user.isFollowing ? "outline" : "default"}
                size="sm"
                className={
                    user.isFollowing
                        ? "rounded-full border-zinc-600 text-white hover:bg-zinc-800 hover:text-white bg-transparent text-xs px-4"
                        : "rounded-full bg-white text-black hover:bg-zinc-200 text-xs px-4"
                }
            >
                {user.isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
}

// Tab content with loading/empty/list states
function TabBody({ tab }: { tab: "followers" | "following" }) {
    const { users, isLoading, error, toggleFollow } = useFollows(tab);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-[#04A51E]" />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-sm text-red-400 py-8">{error}</p>;
    }

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-12 text-zinc-500">
                <UserRound className="w-8 h-8" />
                <p className="text-sm">
                    {tab === "followers" ? "No followers yet" : "Not following anyone yet"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-zinc-800">
            {users.map((user) => (
                <UserRow key={user.id} user={user} onToggle={toggleFollow} />
            ))}
        </div>
    );
}

export default function Follows() {
    const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <h1 className="text-white font-bold text-xl mb-4">Follows</h1>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "followers" | "following")}
            >
                {/* Tab Headers */}
                <TabsList className="w-full bg-transparent border-b border-zinc-800 rounded-none p-0 h-auto mb-4">
                    <TabsTrigger
                        value="followers"
                        className={`flex-1 pb-3 rounded-none text-sm font-semibold bg-transparent border-b-2 transition-colors
              ${activeTab === "followers"
                                ? "border-[#04A51E] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Followers
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className={`flex-1 pb-3 rounded-none text-sm font-semibold bg-transparent border-b-2 transition-colors
              ${activeTab === "following"
                                ? "border-[#04A51E] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Following
                    </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="followers">
                    <TabBody tab="followers" />
                </TabsContent>
                <TabsContent value="following">
                    <TabBody tab="following" />
                </TabsContent>
            </Tabs>
        </div>
    );
}