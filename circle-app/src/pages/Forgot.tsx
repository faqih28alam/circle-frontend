// Forgot.tsx
// Page that handles password reset

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            // Connect to your backend route: http://localhost:3000/auth/forgot
            const response = await axios.post('http://localhost:3000/auth/forgot', { email });

            // Use the actual token from your backend
            login(response.data.token);
            alert("Password reset email sent!");
            navigate("/login"); // Redirect to login page

        } catch (error:any) {
            console.error("Login failed", error);
            setErrorMsg(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#1d1d1d] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[400px] space-y-6">

                {/* Logo */}
                <div className="flex justify-start">
                    <img src="./src/assets/images/circle app.png" alt="circle" className="h-15 w-auto" />
                </div>

                {/* Form */}
                <h2 className="text-center text-3xl font-bold text-white">Forgot Password</h2>
                <form onSubmit={handleForgot} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                    <Button type="submit" className="w-full">Reset Password</Button>
                </form>
                
                {/*  Link to login */}
                <p className="text-zinc-400 text-sm">
                Already have an account?{" "}
                <span
                    className="text-[#04A51E] cursor-pointer hover:underline"
                    onClick={() => navigate('/login')}
                >
                    Login
                </span>
                </p>

            </div>
        </div>
    );
}
