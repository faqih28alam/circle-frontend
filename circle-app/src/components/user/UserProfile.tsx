// src/components/user/UserProfile.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type ProfileUser } from "@/hooks/useProfile";

interface UserProfileProps {
    profile: ProfileUser;
    onToggleFollow: () => void;
}

export default function UserProfile({ profile, onToggleFollow }: UserProfileProps) {
    return (
        <div className="border-b border-zinc-800">
            {/* Cover Image */}
            <div className="relative h-32 bg-gradient-to-r from-zinc-800 to-zinc-700">
                <img
                    src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400"
                    className="w-full h-full object-cover"
                    alt="cover"
                />

                {/* Avatar */}
                <Avatar className="absolute -bottom-8 left-4 w-16 h-16 border-4 border-black">
                    {/* <AvatarImage
                        src={
                            profile.photo_profile
                                ? `${import.meta.env.VITE_IMG_URL}/uploads/${profile.photo_profile}`
                                : undefined
                        }
                    /> */}
                    <AvatarImage src={profile.photo_profile ?? undefined} />
                    <AvatarFallback className="bg-zinc-700 text-white text-xl font-bold">
                        {profile.full_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Follow / Edit button */}
                {!profile.isOwnProfile && (
                    <div className="absolute -bottom-5 right-4">
                        <Button
                            onClick={onToggleFollow}
                            size="sm"
                            className={
                                profile.isFollowing
                                    ? "rounded-full border border-zinc-600 text-white bg-transparent hover:bg-zinc-800 text-xs px-5"
                                    : "rounded-full bg-white text-black hover:bg-zinc-200 text-xs px-5 font-semibold"
                            }
                        >
                            {profile.isFollowing ? "Following" : "Follow"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 pt-12 pb-4">
                <h2 className="text-white font-bold text-xl">{profile.full_name}</h2>
                <p className="text-zinc-500 text-sm">@{profile.username}</p>
                {profile.bio && (
                    <p className="text-zinc-300 text-sm mt-2">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex gap-4 mt-3">
                    <p className="text-xs text-zinc-400">
                        <span className="font-bold text-white">{profile.followingCount}</span> Following
                    </p>
                    <p className="text-xs text-zinc-400">
                        <span className="font-bold text-white">{profile.followersCount}</span> Followers
                    </p>
                </div>
            </div>
        </div>
    );
}