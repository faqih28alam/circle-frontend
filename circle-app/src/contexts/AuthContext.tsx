// AuthContext.tsx
// src/contexts/AuthContext.tsx

import { createContext } from "react";

export interface User {
  id: number;
  username: string;
  full_name: string;
  photo_profile?: string;
  bio?: string;
  following?: number[];
  followers?: number[];
}

export type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
};

// export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthContext = createContext<AuthContextType | undefined>(undefined);