"use client";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstructorFollow } from "@/hooks/useInstructorFollow";

interface FollowButtonProps {
  instructorId: string;
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  initialIsFollowing?: boolean;
}

export function FollowButton({
  instructorId,
  size = "default",
  className,
  variant = "solid",
  initialIsFollowing,
}: FollowButtonProps) {
  const { isFollowing, loading, toggleFollow } = useInstructorFollow(
    instructorId,
    initialIsFollowing
  );

  const baseClasses = cn(
    variant === "solid" &&
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    variant === "outline" && "border-2",
    variant === "ghost" && "hover:bg-muted",
    className
  );

  return (
    <Button
      size={size === "icon" ? "icon" : size}
      variant={
        variant === "outline"
          ? "outline"
          : variant === "ghost"
          ? "ghost"
          : "default"
      }
      className={baseClasses}
      disabled={loading}
      onClick={async () => {
        await toggleFollow();
        // Consumers can listen to follow changes via custom event for syncing counts
        try {
          window.dispatchEvent(
            new CustomEvent("instructor-follow-toggled", {
              detail: { instructorId, isFollowing: !isFollowing },
            })
          );
        } catch {}
      }}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? "Unfollow instructor" : "Follow instructor"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : size === "icon" ? (
        <Heart
          className={cn(
            "h-4 w-4",
            isFollowing ? "fill-pink-500 text-pink-500" : ""
          )}
        />
      ) : (
        <div className="flex items-center gap-2">
          {isFollowing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
          <span>{isFollowing ? "Following" : "Follow"}</span>
        </div>
      )}
    </Button>
  );
}
