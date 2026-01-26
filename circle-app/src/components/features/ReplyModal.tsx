// ReplyModal.tsx
// src/components/features/ReplyModal.tsx
// function for users to reply to a thread

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2 } from "lucide-react";
import { api } from "@/services/api";

interface ReplyModalProps {
  children: React.ReactNode;
  threadId: number;
  onSuccess?: () => void;
}

export function ReplyModal({ children, threadId, onSuccess }: ReplyModalProps) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);      // For image preview
    const [isLoading, setIsLoading] = useState(false);
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

    const handleReply = async () => {
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("thread_id", threadId.toString()); // Match the backend requirement
            if (image) formData.append("image", image);

            await api.post("/reply", formData); // Hits your new endpoint

            setContent("");
            setImage(null);
            setIsOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to reply", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-zinc-800 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-left">Reply to Post</DialogTitle>
                    </DialogHeader>
            
                    <div className="flex flex-col gap-4 mt-2">
                        <Textarea 
                            placeholder="Type your reply!" 
                            className="bg-transparent border-none focus-visible:ring-0 text-md resize-none min-h-[100px]"
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

                        <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                            <label className="cursor-pointer text-[#04A51E] hover:opacity-80">
                                <ImagePlus size={20} />
                                <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                            </label>

                            <Button 
                                onClick={handleReply}
                                disabled={isLoading || !content.trim()}
                                className="bg-[#04A51E] hover:bg-[#038a19] rounded-full px-5 h-9 font-bold"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
        </Dialog>
    );
}