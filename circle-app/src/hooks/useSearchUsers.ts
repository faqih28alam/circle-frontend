// src/hooks/useSearchUsers.ts

import { useState, useEffect } from "react";
import axios from "axios";

export interface SearchUser {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
    bio: string | null;
    isFollowing: boolean;  // 👈 added
}

const API = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

export const useSearchUsers = (query: string, delay: number = 400) => {
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(`${API}/search`, {
                    params: { q: query },
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setResults(response.data.data);
            } catch {
                setError("Something went wrong. Please try again.");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [query, delay]);

    // Optimistic follow toggle — same pattern as useFollows
    const toggleFollow = async (targetId: number, isCurrentlyFollowing: boolean) => {
        // Update UI instantly
        setResults((prev) =>
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
            // Revert if request fails
            setResults((prev) =>
                prev.map((u) =>
                    u.id === targetId ? { ...u, isFollowing: isCurrentlyFollowing } : u
                )
            );
        }
    };

    return { results, isLoading, error, toggleFollow };
};