// Reset.tsx
// src/pages/Reset.tsx
// Page that handles password reset

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Reset() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            // Replace with your actual password reset endpoint logic
            await axios.post('http://localhost:3000/auth/reset', { password });

            alert("Password reset successful!");
            navigate("/login"); 
        } catch (error: any) {
            console.error("Reset failed", error);
            setErrorMsg(error.response?.data?.message || 'Failed to reset password');
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

                    {/* Reset Password Form */}
                    <h2 className="text-white text-3xl font-bold tracking-tight mb-6">
                        Reset Password
                    </h2>
                    
                    <form onSubmit={handleReset} className="space-y-4">
                        <Input 
                            type="password" 
                            placeholder="New Password" 
                            className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                        <Input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required
                        />

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                        
                        <Button 
                            type="submit"
                            className="w-full bg-[#04A51E] hover:bg-[#038b18] text-black rounded-full h-12 text-lg font-bold mt-2"
                        >
                            Reset Password
                        </Button>
                    </form>

                    <p className="text-zinc-400 text-sm mt-6">
                        Back to{" "}
                        <span 
                            className="text-[#04A51E] cursor-pointer hover:underline" 
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