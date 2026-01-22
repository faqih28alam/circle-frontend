// Register.tsx

import { useState } from 'react'; // Removed useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '',
    full_name: '', 
    email: '', 
    password: '',
    photo_profile: null as File | null,
    bio: '' 
  });
  const { login } = useAuth(); // Use your provider's login function
  const navigate = useNavigate();
  const [ errorMsg, setErrorMsg ] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Use FormData to send files
    const data = new FormData();
    data.append('username', formData.username);
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('bio', formData.bio);

    if (formData.photo_profile) {
      // Ensure 'photo_profile' matches the name your backend multer expects
      data.append('photo_profile', formData.photo_profile);
    }

    // Make a POST request to the backend
    try {
      const response = await axios.post('http://localhost:3000/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
      });

      // Use the login function from your AuthProvider
      login(response.data.token);
      alert("Registration Successful!");
      navigate('/login');

    } catch (error:any) {
      console.error("Registration failed", error);
      setErrorMsg(error.response?.data?.message || 'Registration failed, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1d1d1d] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Logo */}
        <div className="flex justify-start">
           <img src="./src/assets/images/circle app.png" alt="circle" className="h-10 w-auto" />
        </div>

        <h2 className="text-white text-3xl font-bold tracking-tight">
          Create account Circle
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="Username *"
            className="bg-transparent border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input
            placeholder="Full Name *"
            className="bg-transparent border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email *"
            className="bg-transparent border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password *"
            className="bg-transparent border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            placeholder="Bio (optional)"
            className="bg-transparent border-zinc-700 text-white h-12 focus-visible:ring-[#04A51E]"
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          {/* Upload profile picture */}
          <Label className="text-green-400">Upload Profile Picture</Label>
          <Input
            type="file"
            className="bg-transparent border-zinc-700 text-white h-12"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              setFormData({ ...formData, photo_profile: file });
            }}
          />

          {/* Error message*/}
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          {/* Explicitly set the green color to override shadcn defaults */}
          <Button 
            className="w-full bg-[#04A51E] hover:bg-[#038b18] text-black rounded-full h-12 text-lg font-bold"
          >
            Create
          </Button>
        </form>

        <p className="text-zinc-400 text-sm">
          Already have account?{" "}
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