"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Story } from "@/types/storiesReelsTypes";
import { StoryViewer } from "./StoryViewer";

interface StoriesBarProps {
  stories: Story[];
  isOwnProfile?: boolean;
  onCreateClick?: () => void;
}

export function StoriesBar({
  stories,
  isOwnProfile,
  onCreateClick,
}: StoriesBarProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleStoryClick = (index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  };

  if (!isOwnProfile && stories.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Create Story Button (for own profile) */}
        {isOwnProfile && (
          <button
            onClick={onCreateClick}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">
              Create Story
            </span>
          </button>
        )}

        {/* Stories */}
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(index)}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px] hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {story.mediaType === "VIDEO" ? (
                  <video
                    src={story.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={story.mediaUrl}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-purple-600 max-w-[80px] truncate">
              {story.instructor.firstName}
            </span>
          </button>
        ))}
      </div>

      {viewerOpen && (
        <StoryViewer
          stories={stories}
          initialIndex={initialIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
