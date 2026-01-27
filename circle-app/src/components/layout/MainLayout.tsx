// src/layouts/MainLayout.tsx
import Sidebar from './Sidebar';
import RightBar from './RightBar';
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* Left Sidebar - Fixed width */}
      <div className="w-[280px] border-r border-zinc-800 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main Feed - Flexible width */}
      <main className="flex-1 border-r border-zinc-800 min-w-[600px]">
        <Outlet /> {/* This is where Home or ThreadDetail will render */}
      </main>

      {/* Right Sidebar - Fixed width */}
      <div className="w-[400px] h-screen sticky top-0 p-4 hidden lg:block">
        <RightBar />
      </div>
    </div>
  );
};

export default MainLayout;