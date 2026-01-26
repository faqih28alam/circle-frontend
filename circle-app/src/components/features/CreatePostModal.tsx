// CreatePostModal.tsx
// src/components/features/CreatePostModal.tsx
// handle the FormData and the API call to your backend createThread route.

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { ImagePlus } from "lucide-react";

export function CreatePostModal({ children, onPostSuccess }: { children: React.ReactNode, onPostSuccess?: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", content); // Matches backend req.body
      if (image) formData.append("image", image); // Matches backend upload.single("image")

      await api.post("/thread", formData); // Hits the corrected createThread route

      setContent("");
      setImage(null);
      setIsOpen(false);
      if (onPostSuccess) onPostSuccess(); // Refresh the feed if needed
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#1A1A1A] border-zinc-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Textarea 
            placeholder="What is happening?!" 
            className="bg-transparent border-none focus-visible:ring-0 text-lg resize-none min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <hr className="border-zinc-800" />
          <div className="flex justify-between items-center">
            <label className="cursor-pointer text-[#04A51E] hover:opacity-80">
              <ImagePlus size={24} />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            <Button 
              onClick={handlePost}
              className="bg-[#04A51E] hover:bg-[#038a19] rounded-full px-6"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}