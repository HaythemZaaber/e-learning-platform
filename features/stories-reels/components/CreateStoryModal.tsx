"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Loader2,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { storiesReelsService } from "../services/storiesReelsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { STORY_MAX_DURATION } from "@/types/storiesReelsTypes";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateStoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateStoryModalProps) {
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please select a valid image or video file");
      return;
    }

    // Validate file size (50MB max)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    // For videos, check duration
    if (selectedFile.type.startsWith("video/")) {
      try {
        const duration = await storiesReelsService.getVideoDuration(
          selectedFile
        );
        setVideoDuration(duration);

        const validation = storiesReelsService.validateVideoDuration(
          duration,
          "STORY"
        );
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }
      } catch (error) {
        toast.error("Failed to process video");
        return;
      }
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setIsUploading(true);
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to create a story");
        return;
      }

      await storiesReelsService.createStory(
        {
          file,
          caption: caption || undefined,
          duration: videoDuration || undefined,
          isPublic,
        },
        token
      );

      toast.success("Story created successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create story:", error);
      toast.error(error.response?.data?.message || "Failed to create story");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setVideoDuration(null);
    setIsPublic(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Story</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          {!preview ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">
                    Upload Photo or Video
                  </p>
                  <p className="text-sm text-gray-500">
                    Max {STORY_MAX_DURATION}s for videos • Max 50MB
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported: JPG, PNG, GIF, WebP, MP4, WebM
                  </p>
                </div>
                <Button type="button" variant="outline">
                  Select File
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-h-[400px]">
                {file?.type.startsWith("video/") ? (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setVideoDuration(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Duration Info */}
              {videoDuration !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{videoDuration}s</span>
                </div>
              )}

              {/* Caption Input */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input
                  id="caption"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 text-right">
                  {caption.length}/200
                </p>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-600" />
                  )}
                  <div>
                    <Label
                      htmlFor="privacy"
                      className="font-semibold cursor-pointer"
                    >
                      {isPublic ? "Public Story" : "Private Story"}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {isPublic
                        ? "Visible to all your followers"
                        : "Only visible to you"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="privacy"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || isUploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Story"
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your story will be visible to all your
              followers and will automatically expire after 24 hours.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
