"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Heart, MessageCircle, Share, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SocialContent } from "@/data/instructorsData"

interface ReelsViewerProps {
  reels: SocialContent[]
  initialIndex?: number
  autoPlay?: boolean
  onClose?: () => void
  fullScreen?: boolean
}

export function ReelsViewer({
  reels,
  initialIndex = 0,
  autoPlay = true,
  onClose,
  fullScreen = false,
}: ReelsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentReel = reels[currentIndex]

  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement) {
      const playVideo = async () => {
        if (isPlaying) {
          try {
            await videoElement.play()
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Video playback error:", error)
              setIsPlaying(false)
            }
          }
        } else {
          videoElement.pause()
        }
      }

      playVideo()
    }

    return () => {
      if (videoElement) {
        videoElement.pause()
      }
    }
  }, [isPlaying, currentIndex])

  useEffect(() => {
    setIsPlaying(autoPlay)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [currentIndex, autoPlay])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (!currentReel) return null

  const containerClass = fullScreen ? "w-full h-full flex items-center justify-center bg-black" : "max-w-sm mx-auto"

  const cardClass = fullScreen
    ? "relative bg-black aspect-[9/16] max-h-screen max-w-[400px]"
    : "relative overflow-hidden bg-black aspect-[9/16]"

  return (
    <div className={containerClass}>
      {fullScreen && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      <div className={cardClass}>
        {/* Video/Thumbnail */}
        <div className="relative w-full h-full">
          {currentReel.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              poster={currentReel.thumbnail}
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setIsPlaying(false)
              }}
            >
              <source src={currentReel.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={currentReel.thumbnail || "/placeholder.svg"}
              alt={currentReel.title}
              fill
              className="object-cover"
            />
          )}

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            {!isPlaying && (
              <div className="bg-black/50 rounded-full p-4">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {reels.length > 1 && (
            <>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 text-white"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 text-white"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}

          {/* Controls */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Content Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex justify-between items-end">
              <div className="flex-1 mr-4">
                <h3 className="text-white font-semibold text-sm mb-1">{currentReel.title}</h3>
                {currentReel.description && (
                  <p className="text-white/80 text-xs mb-2 line-clamp-2">{currentReel.description}</p>
                )}
                <div className="flex gap-2">
                  {currentReel.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex flex-col gap-3">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Heart className="h-5 w-5" />
                </Button>
                <span className="text-white text-xs text-center">{formatNumber(currentReel.likes)}</span>

                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <span className="text-white text-xs text-center">{formatNumber(currentReel.comments)}</span>

                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Share className="h-5 w-5" />
                </Button>
                <span className="text-white text-xs text-center">{formatNumber(currentReel.shares)}</span>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          {reels.length > 1 && (
            <div className="absolute top-4 left-4 flex gap-1">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    index === currentIndex ? "bg-white w-8" : "bg-white/50 w-4"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && currentReel.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Reel Counter */}
      {!fullScreen && reels.length > 1 && (
        <div className="text-center mt-2 text-sm text-muted-foreground">
          {currentIndex + 1} of {reels.length}
        </div>
      )}
    </div>
  )
}
