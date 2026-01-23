// Reset.tsx
// Page that handles password reset

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Reset() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            // Connect to your backend route: http://localhost:3000/auth/reset
            const response = await axios.post('http://localhost:3000/auth/reset', { email });

            // Use the actual token from your backend
            resetPassword(response.data.token);
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
                    <img src="./src/assets/images/circle app.png" alt="circle" className="h-10 w-auto" />
                </div>

                {/* Reset Password Form */}
                <h2 className="text-white text-3xl font-bold">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-4">

                    <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                    <Button type="submit">Reset Password</Button>
                </form>
                
            </div>
        </div>
    )
}
