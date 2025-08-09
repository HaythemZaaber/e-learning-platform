"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  Rewind,
  FastForward,
  PictureInPicture,
  Subtitles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VideoPlayerProps {
  src: string;
  title: string;
  currentLecture: {
    id: string;
    title: string;
    duration: string;
    hasNotes?: boolean;
    hasTranscript?: boolean;
    hasSubtitles?: boolean;
  };
  onNext?: () => void;
  onPrevious?: () => void;
  onProgress?: (progress: number) => void;
  initialProgress?: number;
}

export function VideoPlayer({
  src,
  title,
  currentLecture,
  onNext,
  onPrevious,
  onProgress,
  initialProgress = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastReportedProgress = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [showSubtitles, setShowSubtitles] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Features
  const [showNotes, setShowNotes] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [markers, setMarkers] = useState<Array<{ time: number; label: string }>>([]);

  // Initialize video with saved progress
  useEffect(() => {
    if (videoRef.current && initialProgress > 0 && duration > 0) {
      const startTime = (initialProgress / 100) * duration;
      videoRef.current.currentTime = startTime;
    }
  }, [initialProgress, duration]);

  // Report progress periodically (every 10 seconds of actual watch time)
  useEffect(() => {
    if (isPlaying && onProgress) {
      progressIntervalRef.current = setInterval(() => {
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        
        // Only report if progress changed by at least 1%
        if (Math.abs(progress - lastReportedProgress.current) >= 1) {
          onProgress(progress);
          lastReportedProgress.current = progress;
        }
      }, 10000); // Every 10 seconds
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, onProgress]);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => resetControlsTimeout();
    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    setVideoError(false);
    
    // Restore volume from localStorage
    const savedVolume = localStorage.getItem("videoPlayerVolume");
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      videoRef.current.volume = volume;
      setVolume(volume);
    }
    
    // Restore playback rate
    const savedRate = localStorage.getItem("videoPlayerRate");
    if (savedRate) {
      const rate = parseFloat(savedRate);
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    
    // Update buffered amount
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered((bufferedEnd / videoRef.current.duration) * 100);
    }
  }, []);

  const handleVideoError = useCallback((e: any) => {
    console.error("Video error:", e);
    setVideoError(true);
    setIsLoading(false);
    setIsPlaying(false);
    
    // Determine error message
    if (!src) {
      setErrorMessage("No video source provided");
    } else if (e.target?.error?.code === 4) {
      setErrorMessage("Video format not supported");
    } else if (e.target?.error?.code === 3) {
      setErrorMessage("Video decoding failed");
    } else if (e.target?.error?.code === 2) {
      setErrorMessage("Network error while loading video");
    } else {
      setErrorMessage("Failed to load video");
    }
  }, [src]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    setIsBuffering(false);
    setVideoError(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    
    // Report 100% completion
    if (onProgress) {
      onProgress(100);
    }
    
    // Auto-play next if available
    if (onNext) {
      toast.success("Lecture completed! Moving to next lecture...");
      setTimeout(onNext, 2000);
    }
  }, [onProgress, onNext]);

  // Control functions
  const togglePlay = useCallback(() => {
    if (!videoRef.current || videoError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Play failed:", error);
        toast.error("Failed to play video");
      });
    }
  }, [isPlaying, videoError]);

  const skip = useCallback((seconds: number) => {
    if (!videoRef.current || videoError) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    
    // Show skip indicator
    toast(`${seconds > 0 ? 'Forward' : 'Backward'} ${Math.abs(seconds)} seconds`, {
      duration: 1000,
    });
  }, [currentTime, duration, videoError]);

  const handleSeek = useCallback((value: number[]) => {
    if (!videoRef.current || videoError) return;
    
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration, videoError]);

  const adjustVolume = useCallback((delta: number) => {
    if (!videoRef.current) return;
    
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Save to localStorage
    localStorage.setItem("videoPlayerVolume", newVolume.toString());
  }, [volume]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Save to localStorage
    localStorage.setItem("videoPlayerVolume", newVolume.toString());
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current || videoError) return;
    
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    
    // Save to localStorage
    localStorage.setItem("videoPlayerRate", rate.toString());
    
    toast(`Playback speed: ${rate}x`, { duration: 1000 });
  }, [videoError]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, [isFullscreen]);

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (!isPiP) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }
    } catch (error) {
      console.error("PiP error:", error);
      toast.error("Picture-in-Picture not supported");
    }
  }, [isPiP]);

  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current || videoError) return;

      // Don't handle if user is typing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
        case "KeyJ":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
        case "KeyL":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyP":
          e.preventDefault();
          togglePiP();
          break;
        case "KeyC":
          e.preventDefault();
          setShowSubtitles(!showSubtitles);
          break;
        case "Comma":
          if (e.shiftKey) {
            e.preventDefault();
            changePlaybackRate(Math.max(0.25, playbackRate - 0.25));
          }
          break;
        case "Period":
          if (e.shiftKey) {
            e.preventDefault();
            changePlaybackRate(Math.min(2, playbackRate + 0.25));
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [videoError, showSubtitles, playbackRate, togglePlay, skip, adjustVolume, toggleMute, toggleFullscreen, togglePiP, changePlaybackRate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Use fallback video URL for testing if no source provided
  const videoSrc = src || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">{currentLecture.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-400 text-sm">Duration: {currentLecture.duration}</span>
              {currentLecture.hasNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                  className="h-auto p-1 text-gray-400 hover:text-white"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Notes
                </Button>
              )}
              {currentLecture.hasTranscript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="h-auto p-1 text-gray-400 hover:text-white"
                >
                  <Subtitles className="w-4 h-4 mr-1" />
                  Transcript
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onPrevious && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="text-gray-400 hover:text-white"
              >
                Previous
              </Button>
            )}
            {onNext && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="text-gray-400 hover:text-white"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative bg-black aspect-video group"
        onMouseEnter={() => setShowControls(true)}
      >
        {videoError ? (
          // Error State
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium text-white mb-2">
                {errorMessage}
              </h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Please check your internet connection or try refreshing the page.
              </p>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onCanPlay={handleCanPlay}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleVideoError}
              onClick={togglePlay}
              playsInline
              crossOrigin="anonymous"
            />

            {/* Loading/Buffering Overlay */}
            {(isLoading || isBuffering) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
                <div className="text-white text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                  <p>{isLoading ? "Loading video..." : "Buffering..."}</p>
                </div>
              </div>
            )}

            {/* Center Play Button */}
            {!isPlaying && !isLoading && !isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur text-white border-0 rounded-full w-20 h-20 pointer-events-auto"
                >
                  <Play className="w-10 h-10 ml-1" />
                </Button>
              </div>
            )}

            {/* Controls Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              style={{ pointerEvents: showControls ? 'auto' : 'none' }}
            >
              {/* Progress Bar */}
              <div className="absolute bottom-16 left-0 right-0 px-4">
                <div className="relative">
                  {/* Buffered indicator */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gray-600 rounded-full pointer-events-none"
                    style={{ width: `${buffered}%` }}
                  />
                  
                  <Slider
                    value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                    disabled={videoError}
                  />
                  
                  {/* Chapter markers */}
                  {markers.map((marker, index) => (
                    <div
                      key={index}
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-yellow-500 rounded-full pointer-events-none"
                      style={{ left: `${(marker.time / duration) * 100}%` }}
                      title={marker.label}
                    />
                  ))}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                      disabled={videoError}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>

                    {/* Skip backward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/20"
                      disabled={videoError}
                    >
                      <Rewind className="w-5 h-5" />
                    </Button>

                    {/* Skip forward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(10)}
                      className="text-white hover:bg-white/20"
                      disabled={videoError}
                    >
                      <FastForward className="w-5 h-5" />
                    </Button>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </Button>
                      <div className="w-24 hidden sm:block">
                        <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <span className="text-white text-sm ml-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Subtitles */}
                    {currentLecture.hasSubtitles && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className={cn(
                          "text-white hover:bg-white/20",
                          showSubtitles && "bg-white/20"
                        )}
                      >
                        <Subtitles className="w-5 h-5" />
                      </Button>
                    )}

                    {/* Settings */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="px-2 py-1.5 text-sm font-semibold">
                          Playback Speed
                        </div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                          <DropdownMenuItem
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={cn(
                              "flex items-center justify-between",
                              playbackRate === rate && "bg-accent"
                            )}
                          >
                            <span>{rate}x</span>
                            {playbackRate === rate && "✓"}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-sm font-semibold">
                          Quality
                        </div>
                        {["auto", "1080p", "720p", "480p", "360p"].map((q) => (
                          <DropdownMenuItem
                            key={q}
                            onClick={() => setQuality(q)}
                            className={cn(
                              "flex items-center justify-between",
                              quality === q && "bg-accent"
                            )}
                          >
                            <span>{q}</span>
                            {quality === q && "✓"}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* PiP */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePiP}
                      className={cn(
                        "text-white hover:bg-white/20 hidden sm:inline-flex",
                        isPiP && "bg-white/20"
                      )}
                    >
                      <PictureInPicture className="w-5 h-5" />
                    </Button>

                    {/* Fullscreen */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Keyboard shortcuts help */}
      <div className="bg-gray-900 p-2 border-t border-gray-800">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>Space: Play/Pause</span>
          <span>←/→: Skip 10s</span>
          <span>M: Mute</span>
          <span>F: Fullscreen</span>
          <span>Shift+,/.: Speed</span>
        </div>
      </div>

      {/* Notes Panel (optional) */}
      {showNotes && (
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white">Lecture Notes</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-gray-300">
              Add your notes here while watching the lecture.
            </p>
          </div>
        </div>
      )}

      {/* Transcript Panel (optional) */}
      {showTranscript && (
        <div className="p-4 border-t border-gray-800 bg-gray-900 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white">Transcript</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-blue-400 font-mono">00:00</span>
              <p className="text-gray-300">
                Welcome to this lecture. Today we'll be covering...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}