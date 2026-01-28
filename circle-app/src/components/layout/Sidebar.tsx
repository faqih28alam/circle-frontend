// Sidebar.tsx
// src/components/layout/Sidebar.tsx
// Component that displays the sidebar

import { Home, Search, Heart, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { setLogout } from '@/store/slices/authSlice';
import { CreatePostModal } from '../features/CreatePostModal';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, href: '/home' },
    { name: 'Search', icon: Search, href: '/search' },
    { name: 'Follows', icon: Heart, href: '/follows' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div className="p-6 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <h1 className="text-5xl font-bold text-[#04A51E] tracking-tighter">circle</h1>

        <nav className="flex flex-col gap-4">
          {/* Render navigation items */}
          {navItems.map((item) => (
            <Link
              onClick={() => navigate(item.href)}
              key={item.name}
              to={item.href}
              className={`flex items-center gap-4 py-2 transition-colors hover:text-[#04A51E] ${
                location.pathname === item.href ? "text-[#04A51E]" : "text-white"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg font-semibold">{item.name}</span>
            </Link>
          ))}

          {/* "Create Post" Button */}
          <CreatePostModal onPostSuccess={() => window.location.reload()}> 
              <Button className="w-full bg-[#04A51E] hover:bg-[#038a19] text-white rounded-full py-6 mt-4 text-lg font-bold cursor-pointer">
                Create Post
              </Button>
          </CreatePostModal>

        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 text-white hover:text-red-500 transition-colors mb-4 font-semibold cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}