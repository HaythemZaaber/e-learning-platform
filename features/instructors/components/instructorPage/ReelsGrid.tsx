"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Heart, MessageCircle, Eye, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ReelsViewer } from "./ReelsViewer"
import type { SocialContent } from "@/data/instructorsData"

interface ReelsGridProps {
  reels: SocialContent[]
  instructorName: string
}

export function ReelsGrid({ reels, instructorName }: ReelsGridProps) {
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleReelClick = (index: number) => {
    setSelectedReelIndex(index)
    setIsViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    setSelectedReelIndex(null)
  }

  if (reels.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Reels Yet</h3>
          <p className="text-muted-foreground">
            This instructor hasn't posted any reels yet. Check back later for quick educational content!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Latest Reels</h3>
          <Badge variant="outline" className="font-normal">
            {reels.length} {reels.length === 1 ? "reel" : "reels"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reels.map((reel, index) => (
            <Card
              key={reel.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={() => handleReelClick(index)}
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <Image
                  src={reel.thumbnail || "/placeholder.svg"}
                  alt={reel.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <Play className="h-6 w-6 text-black fill-black" />
                  </div>
                </div>

                {/* Duration Badge */}
                {reel.duration && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white border-0 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(reel.duration)}
                    </Badge>
                  </div>
                )}

                {/* Engagement Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatNumber(reel.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{formatNumber(reel.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{formatNumber(reel.comments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-3">
                <h4 className="font-medium text-sm line-clamp-2 mb-2">{reel.title}</h4>
                {reel.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{reel.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {reel.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {reel.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{reel.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Screen Reels Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={handleCloseViewer}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedReelIndex !== null && (
              <ReelsViewer
                reels={reels}
                initialIndex={selectedReelIndex}
                onClose={handleCloseViewer}
                fullScreen={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
