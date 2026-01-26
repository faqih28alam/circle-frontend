// CreatePostModal.tsx
// src/components/features/CreatePostModal.tsx
// handle the FormData and the API call to your backend createThread route.

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { Loader2, ImagePlus } from "lucide-react";


export function CreatePostModal({ children, onPostSuccess }: { children: React.ReactNode, onPostSuccess?: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);      // For image preview
  const [loading, setLoading] = useState(false);                    // To handle wait state
  const [isOpen, setIsOpen] = useState(false);

  // useEffect: Create preview URL when image changes
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handlePost = async () => {
    if (!content.trim() && !image) return;

    setLoading(true);       // start waiting

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
    } finally {
      setLoading(false); // stop waiting
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

          {/* Image Preview Area */}
          {preview && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-zinc-800">
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ImagePlus size={18} />
              </button>
              <img src={preview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
            </div>
          )}

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

            {/* Post Button */}
            <Button 
              onClick={handlePost}
              disabled={loading || (!content.trim() && !image)}
              className="bg-[#04A51E] hover:bg-[#038a19] rounded-full px-6 font-bold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

}