// AuthProvider.tsx
// src/contexts/AuthProvider.tsx

import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { useEffect } from "react";
import { api } from "@/services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

useEffect(() => {
  const fetchProfile = async () => {
    if (token) {
      try {
        // If your axios instance 'api' uses /api as baseURL, 
        // you might need to use a full path or fix the baseURL
        const response = await api.get("http://localhost:3000/auth/check"); 
        setUser(response.data); // Directly sets the user object from res.json(req.user)
      } catch (err) {
        logout(); 
      }
    }
  };
  fetchProfile();
}, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}