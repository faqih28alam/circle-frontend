// Forgot.tsx
// src/pages/Forgot.tsx
// Page that handles password reset

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            // Connect to your backend route
            await axios.post('http://localhost:3000/auth/forgot', { email });

            alert("If an account exists, a reset link has been sent!");
            navigate("/login"); 

        } catch (error: any) {
            console.error("Forgot password request failed", error);
            setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
            <Card className="w-full max-w-sm bg-[#1d1d1d] border-none shadow-lg">
                <CardContent className="pt-6">
                    {/* Logo */}
                    <div className="flex justify-start mb-2">
                        <img src="./src/assets/images/circle app.png" alt="circle" className="h-10 w-auto" />
                    </div>

                    {/* Form Header */}
                    <h2 className="text-white text-3xl font-bold tracking-tight mb-2">
                        Forgot Password
                    </h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        Enter your email and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleForgot} className="space-y-4">
                        <Input 
                            type="email" 
                            placeholder="Email" 
                            className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                        
                        <Button 
                            type="submit"
                            className="w-full bg-[#04A51E] hover:bg-[#038b18] text-black rounded-full h-12 text-lg font-bold mt-2"
                        >
                            Send Instruction
                        </Button>
                    </form>

                    {/* Link to login */}
                    <p className="text-zinc-400 text-sm mt-6">
                        Already have an account?{" "}
                        <span
                            className="text-[#04A51E] cursor-pointer hover:underline font-medium"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}