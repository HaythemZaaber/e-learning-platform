"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Reel } from "@/types/storiesReelsTypes";
import { storiesReelsService } from "../services/storiesReelsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface ReelsFeedProps {
  initialReels?: Reel[];
  instructorId?: string;
  initialIndex?: number;
}

export function ReelsFeed({
  initialReels,
  instructorId,
  initialIndex = 0,
}: ReelsFeedProps) {
  const { getToken } = useAuth();
  const [reels, setReels] = useState<Reel[]>(initialReels || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(!initialReels);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [hasScrolled, setHasScrolled] = useState(false);

  // Load reels
  const loadReels = useCallback(
    async (pageNum: number) => {
      try {
        setIsLoading(true);
        const token = await getToken();

        const response = instructorId
          ? await storiesReelsService.getInstructorReels(
              instructorId,
              pageNum,
              10,
              token || undefined
            )
          : await storiesReelsService.getReels(pageNum, 10, token || undefined);

        if (pageNum === 1) {
          setReels(response.data);
        } else {
          setReels((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Failed to load reels:", error);
        toast.error("Failed to load reels");
      } finally {
        setIsLoading(false);
      }
    },
    [instructorId, getToken]
  );

  // Initial load
  useEffect(() => {
    if (!initialReels) {
      loadReels(1);
    }
  }, []);

  // Scroll to initial index
  useEffect(() => {
    if (
      reels.length > 0 &&
      initialIndex > 0 &&
      !hasScrolled &&
      containerRef.current
    ) {
      // Wait for DOM to render
      setTimeout(() => {
        const reelElements =
          containerRef.current?.querySelectorAll(".reel-card");
        if (reelElements && reelElements[initialIndex]) {
          reelElements[initialIndex].scrollIntoView({
            behavior: "auto",
            block: "start",
          });
          setHasScrolled(true);
        }
      }, 100);
    }
  }, [reels, initialIndex, hasScrolled]);

  // Intersection Observer for auto-play and view tracking
  useEffect(() => {
    const trackedViews = new Set<string>();

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          const reelId = video.getAttribute("data-reel-id");

          if (entry.isIntersecting) {
            video.play().catch(console.error);

            // Track view once per reel
            if (reelId && !trackedViews.has(reelId)) {
              trackedViews.add(reelId);
              try {
                const token = await getToken();
                if (token) {
                  await storiesReelsService.trackReelView(reelId, token);
                }
              } catch (error) {
                // Silently fail - view tracking shouldn't interrupt user experience
                console.debug("Failed to track reel view:", error);
              }
            }
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels, getToken]);

  // Scroll handler for pagination
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadReels(nextPage);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [page, isLoading, hasMore, loadReels]);

  const handleLike = async (reelId: string, index: number) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to like reels");
        return;
      }

      const result = await storiesReelsService.likeReel(reelId, token);

      setReels((prev) =>
        prev.map((reel, i) =>
          i === index
            ? {
                ...reel,
                isLiked: result.liked,
                likesCount: result.liked
                  ? reel.likesCount + 1
                  : reel.likesCount - 1,
              }
            : reel
        )
      );
    } catch (error) {
      console.error("Failed to like reel:", error);
    }
  };

  if (isLoading && reels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-xl mb-2">No reels yet</p>
        <p className="text-gray-400">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {reels.map((reel, index) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          index={index}
          onLike={handleLike}
          videoRef={(el) => {
            if (el) {
              videoRefs.current.set(index, el);
            } else {
              videoRefs.current.delete(index);
            }
          }}
        />
      ))}

      {isLoading && (
        <div className="h-screen flex items-center justify-center snap-start">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

interface ReelCardProps {
  reel: Reel;
  index: number;
  onLike: (reelId: string, index: number) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}

function ReelCard({ reel, index, onLike, videoRef }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.isLiked || false);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    onLike(reel.id, index);
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    if (!isLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  return (
    <div className="relative h-screen snap-start flex items-center justify-center bg-black reel-card">
      {/* Video */}
      {reel.mediaType === "VIDEO" ? (
        <video
          ref={videoRef}
          src={reel.mediaUrl}
          className="h-full w-full object-contain"
          loop
          playsInline
          onDoubleClick={handleDoubleTap}
          data-reel-id={reel.id}
        />
      ) : (
        <img
          src={reel.mediaUrl}
          alt="Reel"
          className="h-full w-full object-contain"
          onDoubleClick={handleDoubleTap}
        />
      )}

      {/* Double Tap Heart Animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart className="h-32 w-32 text-white fill-white animate-ping" />
        </div>
      )}

      {/* Instructor Info */}
      <Link
        href={`/instructors/${reel.instructor.id}`}
        className="absolute top-4 left-4 flex items-center gap-3 z-10"
      >
        <div className="relative w-12 h-12">
          <Image
            src={reel.instructor.profileImage || "/placeholder.svg"}
            alt={reel.instructor.firstName || "Instructor"}
            fill
            className="rounded-full object-cover border-2 border-white"
          />
        </div>
        <div>
          <p className="text-white font-semibold drop-shadow-lg">
            {reel.instructor.firstName} {reel.instructor.lastName}
          </p>
          <p className="text-white/80 text-sm drop-shadow-lg">
            @{reel.instructor.username || reel.instructor.id}
          </p>
        </div>
      </Link>

      {/* Actions Sidebar */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 hover:bg-white/20 transition-colors">
            <Heart
              className={`h-8 w-8 ${
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </div>
          <span className="text-white text-sm font-semibold drop-shadow-lg">
            {likesCount.toLocaleString()}
          </span>
        </button>
      </div>

      {/* Caption */}
      {reel.caption && (
        <div className="absolute bottom-4 left-4 right-24 z-10">
          <p className="text-white drop-shadow-lg line-clamp-4 text-sm">
            {reel.caption}
          </p>
        </div>
      )}
    </div>
  );
}
