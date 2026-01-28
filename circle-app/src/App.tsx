// App.tsx

// Pages 
import Register from "./pages/Register"
import Login from "./pages/Login"
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'
import Home from './pages/Home'
import ThreadDetail from "./pages/ThreadDetailPage"
// Components
import MainLayout from "./components/layout/MainLayout"

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' // The gatekeeper component
import { Navigate } from "react-router-dom"

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
              {/* <Route path="/follows" element={<Follow />} /> */}
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/home" />} />
          
        </Routes>
    </BrowserRouter>
  )
}

export default App