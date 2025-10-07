"use client";

import { useState, useEffect, useRef } from "react";
import { X, Heart, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Story } from "@/types/storiesReelsTypes";
import { storiesReelsService } from "../services/storiesReelsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export function StoryViewer({
  stories,
  initialIndex = 0,
  onClose,
}: StoryViewerProps) {
  const { getToken } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.mediaType === "VIDEO";
  const duration =
    isVideo && currentStory.duration ? currentStory.duration * 1000 : 5000;

  // Initialize likes
  useEffect(() => {
    if (currentStory) {
      setIsLiked(currentStory.isLiked || false);
      setLikesCount(currentStory.likesCount || 0);
    }
  }, [currentStory]);

  // Track view when story changes
  useEffect(() => {
    if (!currentStory) return;

    const trackView = async () => {
      try {
        const token = await getToken();
        if (token) {
          await storiesReelsService.trackStoryView(currentStory.id, token);
        }
      } catch (error) {
        // Silently fail - view tracking shouldn't interrupt user experience
        console.debug("Failed to track story view:", error);
      }
    };

    trackView();
  }, [currentStory?.id, getToken]);

  // Progress timer
  useEffect(() => {
    if (!currentStory || isPaused) return;

    setProgress(0);
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        handleNext();
      }
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, isPaused, duration]);

  // Video control
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleLike = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to like stories");
        return;
      }

      const result = await storiesReelsService.likeStory(
        currentStory.id,
        token
      );

      setIsLiked(result.liked);
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1));

      if (result.liked) {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
      }
    } catch (error) {
      console.error("Failed to like story:", error);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (!isLiked) {
      handleLike();
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "Escape") onClose();
    if (e.key === " ") {
      e.preventDefault();
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isPaused]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: `${
                  index < currentIndex
                    ? 100
                    : index === currentIndex
                    ? progress
                    : 0
                }%`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-50 px-4 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={currentStory.instructor.profileImage || "/placeholder.svg"}
                alt={currentStory.instructor.firstName || "Instructor"}
                fill
                className="rounded-full object-cover border-2 border-white"
              />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {currentStory.instructor.firstName}{" "}
                {currentStory.instructor.lastName}
              </p>
              <p className="text-white/80 text-xs">
                {formatDistanceToNow(new Date(currentStory.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white hover:text-white/80 transition-colors"
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentStory.mediaUrl}
            className="max-w-full max-h-full object-contain"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Double Tap Heart Animation */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="h-32 w-32 text-white fill-white animate-ping" />
          </div>
        )}

        {/* Navigation Areas */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer focus:outline-none"
          aria-label="Previous story"
        />
        <button
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer focus:outline-none"
          aria-label="Next story"
        />

        {/* Navigation Buttons (Desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      {/* Caption & Like Button */}
      {(currentStory.caption || true) && (
        <div className="absolute bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-black/80 to-transparent">
          {currentStory.caption && (
            <p className="text-white text-sm mb-4">{currentStory.caption}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="font-semibold">
                  {likesCount.toLocaleString()}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
