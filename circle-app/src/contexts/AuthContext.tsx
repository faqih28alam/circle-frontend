// AuthContext.tsx
// src/contexts/AuthContext.tsx

import { createContext } from "react";

export type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

// export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthContext = createContext<AuthContextType | undefined>(undefined);