"use client";

import { useState } from "react";
import { Play, Heart, Eye, X, Clock } from "lucide-react";
import { Reel } from "@/types/storiesReelsTypes";
import { ReelsFeed } from "./ReelsFeed";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface ReelsGridProps {
  reels: Reel[];
  instructorId?: string;
}

export function ReelsGrid({ reels, instructorId }: ReelsGridProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState<number>(0);

  if (reels.length === 0) {
    return null;
  }

  const handleReelClick = (index: number) => {
    setSelectedReelIndex(index);
    setIsViewerOpen(true);
  };

  const handleClose = () => {
    setIsViewerOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {reels.map((reel, index) => (
          <button
            key={reel.id}
            onClick={() => handleReelClick(index)}
            className="relative aspect-[9/16] group cursor-pointer overflow-hidden rounded-lg"
          >
            {/* Thumbnail */}
            {reel.mediaType === "VIDEO" ? (
              <video
                src={reel.mediaUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={reel.mediaUrl}
                alt="Reel"
                className="w-full h-full object-cover"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
            </div>

            {/* Stats */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-2">
                {reel.caption && (
                  <p className="text-white text-xs line-clamp-2 px-1">
                    {reel.caption}
                  </p>
                )}
                <div className="flex items-center justify-between text-white text-xs px-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{reel.likesCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{reel.views.toLocaleString()}</span>
                    </div>
                  </div>
                  {reel.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{reel.duration}s</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Reels Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-full w-full h-full p-0 border-0 bg-black">
          <VisuallyHidden>
            <DialogTitle>Reels Viewer</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[60] text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Reels Feed */}
            <ReelsFeed
              initialReels={reels}
              instructorId={instructorId}
              initialIndex={selectedReelIndex}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
