// App.tsx

// Pages 
import Register from "./pages/Register"
import Login from "./pages/Login"
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'
import Test from './pages/Test'
import Home from './pages/Home'
import ThreadDetail from "./pages/ThreadDetailPage"

// Components
import Header from './components/Header';

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute' // The gatekeeper component

//function for router
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes>

            {/* AUTH ROUTES (No Header) */}

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/test" element={<Test />} />
            

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/thread/:id" element={<ThreadDetail />} />
              {/* <Route path="/follows" element={<Follow />} /> */}
            </Route>

            {/* 2. APP ROUTES (With Header) */}
            <Route 
              path="/" 
              element={
                <>
                  <Header />
                  <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
                    <h1 className="text-4xl font-bold">Welcome to Circle</h1>
                  </div>
                </>
              } 
            />
            
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App