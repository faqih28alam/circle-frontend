// src/pages/Follows.tsx

import { useState } from "react";
import { Loader2, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFollows } from "@/hooks/useFollows";

function UserRow({
    user,
    onToggle,
}: {
    user: {
        id: number;
        username: string;
        full_name: string;
        photo_profile: string | null;
        bio: string | null;
        isFollowing: boolean;
    };
    onToggle: (id: number, isFollowing: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-4 px-4 hover:bg-zinc-900/60 transition-colors rounded-xl">
            <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11">
                    <AvatarImage
                        src={
                            user.photo_profile
                                ? `${import.meta.env.VITE_API_URL}/uploads/${user.photo_profile}`
                                : undefined
                        }
                    />
                    <AvatarFallback className="bg-zinc-800 text-white text-sm font-bold">
                        {user.full_name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm leading-tight">
                        {user.full_name}
                    </span>
                    <span className="text-zinc-500 text-xs mt-0.5">@{user.username}</span>
                    {user.bio && (
                        <span className="text-zinc-500 text-xs mt-1 line-clamp-1 max-w-[280px]">
                            {user.bio}
                        </span>
                    )}
                </div>
            </div>

            <Button
                onClick={() => onToggle(user.id, user.isFollowing)}
                size="sm"
                className={
                    user.isFollowing
                        ? "rounded-full border border-zinc-600 text-white bg-transparent hover:bg-zinc-800 text-xs px-5 h-8"
                        : "rounded-full bg-white text-black hover:bg-zinc-200 text-xs px-5 h-8 font-semibold"
                }
            >
                {user.isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
}

function TabBody({ tab }: { tab: "followers" | "following" }) {
    const { users, isLoading, error, toggleFollow } = useFollows(tab);

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-[#04A51E]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center py-16">
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-zinc-600">
                <UserRound className="w-10 h-10" />
                <p className="text-sm">
                    {tab === "followers" ? "No followers yet" : "Not following anyone yet"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {users.map((user) => (
                <UserRow key={user.id} user={user} onToggle={toggleFollow} />
            ))}
        </div>
    );
}

export default function Follows() {
    const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

    return (
        <div className="max-w-xl mx-auto py-6">

            {/* Header */}
            <div className="px-4 mb-2">
                <h1 className="text-white font-bold text-xl">Follows</h1>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "followers" | "following")}
            >
                {/* Tab Headers */}
                <TabsList className="w-full bg-transparent border-b border-zinc-800 rounded-none p-0 h-auto">
                    <TabsTrigger
                        value="followers"
                        className={`flex-1 py-3 rounded-none text-sm font-semibold bg-transparent border-b-2 transition-all cursor-pointer
                            ${activeTab === "followers"
                                ? "border-[#04A51E] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Followers
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className={`flex-1 py-3 rounded-none text-sm font-semibold bg-transparent border-b-2 transition-all cursor-pointer
                            ${activeTab === "following"
                                ? "border-[#04A51E] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        Following
                    </TabsTrigger>
                </TabsList>

                {/* Tab Content */}
                <TabsContent value="followers" className="mt-2">
                    <TabBody tab="followers" />
                </TabsContent>
                <TabsContent value="following" className="mt-2">
                    <TabBody tab="following" />
                </TabsContent>
            </Tabs>
        </div>
    );
}