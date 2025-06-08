"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { StoryHighlight, SocialContent } from "@/data/instructorsData"

interface EnhancedStoriesViewerProps {
  highlights: StoryHighlight[]
  recentStories: SocialContent[]
  instructorName: string
  instructorAvatar: string
}

export function EnhancedStoriesViewer({
  highlights,
  recentStories,
  instructorName,
  instructorAvatar,
}: EnhancedStoriesViewerProps) {
  const [selectedStory, setSelectedStory] = useState<SocialContent | null>(null)
  const [selectedHighlight, setSelectedHighlight] = useState<StoryHighlight | null>(null)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  const handleStoryClick = (story: SocialContent, stories: SocialContent[], index = 0) => {
    setSelectedStory(story)
    setCurrentStoryIndex(index)
    setIsStoryOpen(true)
  }

  const handleHighlightClick = (highlight: StoryHighlight) => {
    if (highlight.stories.length > 0) {
      setSelectedHighlight(highlight)
      setSelectedStory(highlight.stories[0])
      setCurrentStoryIndex(0)
      setIsStoryOpen(true)
    }
  }

  const handleNextStory = () => {
    const stories = selectedHighlight ? selectedHighlight.stories : recentStories
    if (currentStoryIndex < stories.length - 1) {
      const nextIndex = currentStoryIndex + 1
      setCurrentStoryIndex(nextIndex)
      setSelectedStory(stories[nextIndex])
    } else {
      setIsStoryOpen(false)
    }
  }

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1
      setCurrentStoryIndex(prevIndex)
      const stories = selectedHighlight ? selectedHighlight.stories : recentStories
      setSelectedStory(stories[prevIndex])
    }
  }

  const closeStoryViewer = () => {
    setIsStoryOpen(false)
    setSelectedStory(null)
    setSelectedHighlight(null)
    setCurrentStoryIndex(0)
  }

  if (recentStories.length === 0 && highlights.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Stories</h3>
        {recentStories.length > 0 && (
          <span className="text-sm text-muted-foreground">• {recentStories.length} new</span>
        )}
      </div>

      {/* Stories Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Recent Stories */}
        {recentStories.map((story, index) => (
          <button
            key={story.id}
            className="flex-shrink-0 relative"
            onClick={() => handleStoryClick(story, recentStories, index)}
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-orange-500">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={story.thumbnail || "/placeholder.svg"}
                  alt={story.title}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <span className="text-xs text-center block mt-1 max-w-[64px] truncate">New</span>
          </button>
        ))}

        {/* Story Highlights */}
        {highlights.map((highlight) => (
          <button key={highlight.id} className="flex-shrink-0 relative" onClick={() => handleHighlightClick(highlight)}>
            <div className="w-16 h-16 rounded-full p-0.5 bg-gray-300">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={highlight.thumbnail || "/placeholder.svg"}
                  alt={highlight.title}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <span className="text-xs text-center block mt-1 max-w-[64px] truncate">{highlight.title}</span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={isStoryOpen} onOpenChange={closeStoryViewer}>
        <DialogContent className="max-w-sm p-0 bg-black border-0">
          {selectedStory && (
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={selectedStory.thumbnail || "/placeholder.svg"}
                alt={selectedStory.title}
                fill
                className="object-cover"
              />

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={closeStoryViewer}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Story Progress Bars */}
              <div className="absolute top-4 left-4 right-16 flex gap-1">
                {(selectedHighlight ? selectedHighlight.stories : recentStories).map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white rounded-full transition-all duration-300 ${
                        index < currentStoryIndex ? "w-full" : index === currentStoryIndex ? "w-1/3" : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="absolute top-12 left-4 right-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={instructorAvatar || "/placeholder.svg"}
                    alt={instructorName}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-white font-medium text-sm">{instructorName}</span>
                <span className="text-white/70 text-xs">{selectedHighlight ? selectedHighlight.title : "2h"}</span>
              </div>

              {/* Story Content */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold mb-2">{selectedStory.title}</h3>
                {selectedStory.description && <p className="text-white/80 text-sm">{selectedStory.description}</p>}
              </div>

              {/* Navigation Areas */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 cursor-pointer" onClick={handlePrevStory} style={{ zIndex: 1 }} />
                <div className="flex-1 cursor-pointer" onClick={handleNextStory} style={{ zIndex: 1 }} />
              </div>

              {/* Navigation Buttons */}
              {(selectedHighlight ? selectedHighlight.stories : recentStories).length > 1 && (
                <>
                  {currentStoryIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                      onClick={handlePrevStory}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  )}

                  {currentStoryIndex < (selectedHighlight ? selectedHighlight.stories : recentStories).length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                      onClick={handleNextStory}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
