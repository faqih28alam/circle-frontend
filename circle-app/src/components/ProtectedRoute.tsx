// ProtectedRoute.tsx
// src/components/ProtectedRoute.tsx
// The gatekeeper component

// import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token);

  // If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Use <Outlet /> to allow this component to work as a wrapper in App.tsx
  return <Outlet />;
};

export default ProtectedRoute;