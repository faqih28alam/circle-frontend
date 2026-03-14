// App.tsx

// Pages 
import Register from "./pages/Register"
import Login from "./pages/Login"
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'
import Home from './pages/Home'
import ThreadDetail from "./pages/ThreadDetailPage"
import Search from "./pages/Search"
import Follows from "./pages/Follows"
import Profile from "./pages/Profile"
// Components
import MainLayout from "./components/layout/MainLayout"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' // The gatekeeper component
import { Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

//function for router
function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES (No Header) */}

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        {/* <Route path="/test" element={<Test />} /> */}


        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/thread/:id" element={<ThreadDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/follows" element={<Follows />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/home" />} />

      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  )
}

export default App