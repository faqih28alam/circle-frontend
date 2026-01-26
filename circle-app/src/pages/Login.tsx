// Login.tsx
// src/pages/Login.tsx

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');    
    const [ password, setPassword ] = useState('');
    const [ errorMsg, setErrorMsg ] = useState('');

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault();

        // TODO: handle login logic
        try {
            // Connect to your backend route: http://localhost:3000/auth/login
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            // Access both token and user from the response data
            const { token, user } = response.data;
            // Use the actual token from your backend, Pass BOTH to the login function
            login(token, user);
            alert("Login Successful!");
            // navigate("/");
            navigate("/home"); // Redirect to home/dashboard

        } catch (error:any) {
            console.error("Login failed", error);
            setErrorMsg(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
    /* matching your Register page background and centering */
    // <div className="min-h-screen w-full bg-[#1d1d1d] flex flex-col items-center justify-center p-4">
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      {/* <div className="w-full max-w-[400px] space-y-6"> */}
      <Card className="w-full max-w-sm bg-[#1d1d1d] border-none shadow-lg">
        <CardContent>

          {/* Logo */}
          <div className="flex justify-start">
            <img src="./src/assets/images/circle app.png" alt="circle" className="h-10 w-auto" />
          </div>


          {/* Login form */}
          <h2 className="text-white text-3xl font-bold tracking-tight mb-4">
            Login to Circle
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input fields: Email */}
            <Input
              type="email"
              placeholder="Email"
              className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="">
              {/* Link to forgot password */}
              <p className="text-zinc-400 text-sm text-right">
                <span
                  className="text-xs text-muted-foreground hover:text-green-500 cursor-pointer"
                  onClick={() => navigate('/forgot')}
                >
                  Forgot Password?
                </span>
              </p>
              {/* Input fields: Password */}
              <Input
                type="password"
                placeholder="Password"
                className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Error message */}
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <Button
              type="submit"
              className="w-full bg-[#04A51E] hover:bg-[#038b18] text-black rounded-full h-12 text-lg font-bold cursor-pointer"
            >
              Login
            </Button>
          </form>

          {/* Link to register */}
          <p className="text-zinc-400 text-sm">
            Don't have an account yet?{" "}
            <span
              className="text-[#04A51E] cursor-pointer hover:underline"
              onClick={() => navigate('/register')}
            >
              Create Account
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}