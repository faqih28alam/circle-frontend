// src/hooks/useSearchUsers.ts

import { useState, useEffect } from "react";
import axios from "axios";

export interface SearchUser {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
    bio: string | null;
}

export const useSearchUsers = (query: string, delay: number = 400) => {
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If query is empty, clear results immediately — no need to wait
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        // Debounce: wait for user to stop typing before firing the request
        const timer = setTimeout(async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/search`,
                    {
                        params: { q: query },
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setResults(response.data.data);
            } catch (err) {
                setError("Something went wrong. Please try again.");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, delay);

        // Cleanup: cancel the previous timer if user keeps typing
        return () => clearTimeout(timer);
    }, [query, delay]);

    return { results, isLoading, error };
};