// // Test.tsx
// // src/pages/Test.tsx

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { api } from "../services/api";

// // import { useAppDispatch } from "@/store/hooks";
// // import { setCredentials } from "@/store/authSlice";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const Login = () => {
//   const navigate = useNavigate();
//   // const dispatch = useAppDispatch();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//     //   const res = await api.post("/login", { email, password });

//     //   dispatch(
//     //     setCredentials({
//     //       user: res.data.data.user,
//     //       token: res.data.token,
//     //     })
//     //   );

//       navigate("/home");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#121212]">
//       <Card className="w-full max-w-sm bg-[#1a1a1a] border-none shadow-lg">
//         <CardHeader className="space-y-1 text-center">
//           <p className="text-green-500 font-semibold text-xl">circle</p>
//           <CardTitle className="text-white text-lg">
//             Login to Circle
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {error && (
//             <p className="mb-4 text-sm text-red-500 text-center">
//               {error}
//             </p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-1">
//               <Label className="text-muted-foreground text-xs">
//                 Email *
//               </Label>
//               <Input
//                 className="bg-[#121212] border-[#2a2a2a] text-white focus:border-green-500"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <Label className="text-muted-foreground text-xs">
//                   Password *
//                 </Label>
//                 <button
//                   type="button"
//                   className="text-xs text-muted-foreground hover:text-green-500"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <Input
//                 type="password"
//                 className="bg-[#121212] border-[#2a2a2a] text-white focus:border-green-500"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//           </form>

//           <p className="mt-4 text-center text-sm text-muted-foreground">
//             Don’t have an account?{" "}
//             <button
//               onClick={() => navigate("/register")}
//               className="text-green-500 hover:underline"
//             >
//               Create account
//             </button>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;   
/////////////////////////////////////////////////////////////////
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '',
    full_name: '', 
    email: '', 
    password: '',
    photo_profile: null as File | null,
    bio: '' 
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [ errorMsg, setErrorMsg ] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('bio', formData.bio);

    if (formData.photo_profile) {
      data.append('photo_profile', formData.photo_profile);
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      login(response.data.token);
      alert("Registration Successful!");
      navigate('/login');
    } catch (error: any) {
      console.error("Registration failed", error);
      setErrorMsg(error.response?.data?.message || 'Registration failed, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
      <Card className="w-full max-w-md bg-[#1d1d1d] border-none shadow-lg">
        <CardContent className="pt-6">
          {/* Logo */}
          <div className="flex justify-start mb-2">
            <img src="./src/assets/images/circle app.png" alt="circle" className="h-10 w-auto" />
          </div>

          <h2 className="text-white text-3xl font-bold tracking-tight mb-6">
            Create account Circle
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Username *"
              className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <Input
              placeholder="Full Name *"
              className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email *"
              className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password *"
              className="bg-[#121212] border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            
            <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-medium ml-1">Profile Picture (Optional)</Label>
                <Input
                type="file"
                className="bg-[#121212] border-zinc-700 text-white h-12 cursor-pointer file:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 hover:file:bg-zinc-700"
                onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setFormData({ ...formData, photo_profile: file });
                }}
                />
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <Button 
              type="submit"
              className="w-full bg-[#04A51E] hover:bg-[#038b18] text-black rounded-full h-12 text-lg font-bold mt-2"
            >
              Create
            </Button>
          </form>

          <p className="text-zinc-400 text-sm mt-6">
            Already have account?{" "}
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