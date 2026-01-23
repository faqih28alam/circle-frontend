// Header.tsx
// src/components/Header.tsx

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="w-full flex gap-4 p-4 justify-center border-b border-zinc-800 bg-[#1d1d1d]">
      <Button asChild variant="ghost">
        <Link to="/">Home</Link>
      </Button>
      
      {token ? (
        <Button onClick={logout} variant="destructive">Logout</Button>
      ) : (
        <Button asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
