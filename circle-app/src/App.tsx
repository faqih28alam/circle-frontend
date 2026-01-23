// App.tsx

// Import Pages 
import Register from "./pages/Register"
import Login from "./pages/Login"
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'

// Import UI components
import { Button } from './components/ui/button'

import './App.css'
import { BrowserRouter, Link, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { useAuth } from './hooks/useAuth'

//function to separate components & router: 
//function for components
function Header() {
  const { token, logout } = useAuth();

  return(
      <div className="w-full flex gap-4 p-4 justify-center border-b mb-8">
        {/* <Button asChild variant="outline"> 
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="outline"> 
          <Link to="/about">About</Link>
        </Button>

        {token && (
          <Button asChild variant="outline"> 
            <Link to="/products">Products</Link>
          </Button>
        )} */}
        
        {token ? 
        (<Button onClick={logout} variant="destructive">Logout</Button>) : 
        (<Button asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>)
        }

        {/* <ThemeToggle/> */}

      </div>
  )
}

//function for router
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset" element={<Reset />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
