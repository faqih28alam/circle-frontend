// src/hooks/useProfile.ts

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export interface ProfileUser {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
    bio: string | null;
    followersCount: number;
    followingCount: number;
    threadsCount: number;
    isFollowing: boolean;
    isOwnProfile: boolean;
}

export interface ProfileThread {
    id: number;
    content: string;
    image: string | null;
    created_at: string;
    likes_count: number;
    replies_count: number;
    isLiked: boolean;
    author: {
        id: number;
        username: string;
        full_name: string;
        photo_profile: string | null;
    };
}

export const useProfile = (username: string) => {
    const [profile, setProfile] = useState<ProfileUser | null>(null);
    const [threads, setThreads] = useState<ProfileThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!username) return;
        setIsLoading(true);
        setError(null);
        try {
            const [profileRes, threadsRes] = await Promise.all([
                axios.get(`${API}/users/${username}`, { headers: headers() }),
                axios.get(`${API}/users/${username}/threads`, { headers: headers() }),
            ]);
            setProfile(profileRes.data.data);
            setThreads(threadsRes.data.data);
        } catch {
            setError("Failed to load profile.");
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Optimistic follow toggle
    const toggleFollow = async () => {
        if (!profile) return;
        const wasFollowing = profile.isFollowing;

        setProfile((prev) =>
            prev ? {
                ...prev,
                isFollowing: !wasFollowing,
                followersCount: wasFollowing
                    ? prev.followersCount - 1
                    : prev.followersCount + 1,
            } : prev
        );

        try {
            if (wasFollowing) {
                await axios.delete(`${API}/follows/${profile.id}`, { headers: headers() });
            } else {
                await axios.post(`${API}/follows/${profile.id}`, {}, { headers: headers() });
            }
        } catch {
            // Revert on failure
            setProfile((prev) =>
                prev ? {
                    ...prev,
                    isFollowing: wasFollowing,
                    followersCount: wasFollowing
                        ? prev.followersCount + 1
                        : prev.followersCount - 1,
                } : prev
            );
        }
    };

    return { profile, threads, isLoading, error, toggleFollow, refetch: fetchProfile };
};