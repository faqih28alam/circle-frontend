// src/pages/Search.tsx

import { useState } from "react";
import { Search as SearchIcon, Loader2, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchUsers } from "@/hooks/useSearchUsers";

export default function Search() {
    const [query, setQuery] = useState("");
    const { results, isLoading, error, toggleFollow } = useSearchUsers(query); // 👈 added toggleFollow

    return (
        <div className="max-w-xl mx-auto px-4 py-6">

            {/* Search Input */}
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or username..."
                    className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus-visible:ring-[#04A51E]"
                />
            </div>

            {/* Results Area */}
            <div className="mt-4 flex flex-col gap-1">

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-5 h-5 animate-spin text-[#04A51E]" />
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <p className="text-center text-sm text-red-400 py-6">{error}</p>
                )}

                {/* Empty state */}
                {!isLoading && !error && query.trim() && results.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-10 text-zinc-500">
                        <UserRound className="w-8 h-8" />
                        <p className="text-sm">No users found for "{query}"</p>
                    </div>
                )}

                {/* Idle state */}
                {!query.trim() && (
                    <p className="text-center text-sm text-zinc-500 py-10">
                        Search for people on Circle
                    </p>
                )}

                {/* Results */}
                {!isLoading && results.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900 transition-colors"
                    >
                        {/* Avatar + Info */}
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

                        {/* Follow / Following Button */}
                        <Button
                            onClick={() => toggleFollow(user.id, user.isFollowing)}
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
                ))}
            </div>
        </div>
    );
}