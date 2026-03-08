// src/hooks/useFollows.ts

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export interface FollowUser {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
    bio: string | null;
    isFollowing: boolean;
}

const getToken = () => localStorage.getItem("token");
const API = import.meta.env.VITE_API_URL;

export const useFollows = (tab: "followers" | "following") => {
    const [users, setUsers] = useState<FollowUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API}/follows/${tab}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setUsers(res.data.data);
        } catch {
            setError("Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    }, [tab]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Optimistic toggle — update UI instantly, then sync with server
    const toggleFollow = async (targetId: number, isCurrentlyFollowing: boolean) => {
        // 1. Update UI immediately (optimistic)
        setUsers((prev) =>
            prev.map((u) =>
                u.id === targetId ? { ...u, isFollowing: !isCurrentlyFollowing } : u
            )
        );

        try {
            if (isCurrentlyFollowing) {
                await axios.delete(`${API}/follows/${targetId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
            } else {
                await axios.post(`${API}/follows/${targetId}`, {}, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
            }
        } catch {
            // 2. Revert UI if request fails
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === targetId ? { ...u, isFollowing: isCurrentlyFollowing } : u
                )
            );
        }
    };

    return { users, isLoading, error, toggleFollow };
};