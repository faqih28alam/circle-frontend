// useAuth.ts
// src/hooks/useAuth.ts

// import { useContext } from "react";
// import { AuthContext } from "@/contexts/AuthContext";

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// update useAuth hook so it looks into Redux instead of local state.
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store";
import { setUser, logout as logoutAction } from "@/store/slices/authSlice";
import { api } from "@/services/api";

export const useAuth = () => {
  const dispatch = useDispatch();

  // Retrieve data profile from redux
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const login = async (credentials: any) => {
    try {
      const response = await api.post("/login", credentials);
      const { user, token } = response.data;

      // 1. Save to LocalStorage for persistence
      localStorage.setItem("token", token);
      
      // 2. Store data profile to redux
      dispatch(setUser(user)); 
      
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // Update data profile on redux (clear it)
    dispatch(logoutAction());
    localStorage.removeItem("token");
  };

  return {
    user,
    isAuthenticated: !!token,
    login,
    logout
  };
};