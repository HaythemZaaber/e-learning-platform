"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseShareModal } from "./CourseShareModal";

interface ShareButtonProps {
  courseId: string;
  courseTitle: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const ShareButton = ({
  courseId,
  courseTitle,
  variant = "outline",
  size = "sm",
  className = "",
  showIcon = true,
  children
}: ShareButtonProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size as "default" | "sm" | "lg" | "icon" | null | undefined}
        onClick={() => setIsShareModalOpen(true)}
        className={className}
      >
        {showIcon && <Share2 className="h-4 w-4 mr-2" />}
        {children || "Share"}
      </Button>

      <CourseShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </>
  );
}; 