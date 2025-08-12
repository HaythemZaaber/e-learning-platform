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
  AlertCircle,
  Loader2,
  Rewind,
  FastForward,
  PictureInPicture,
  Subtitles,
  RotateCcw,
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
import { useVideoDuration } from "@/features/courses/hooks/useVideoDuration";

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
  courseId?: string; // Add courseId for cache updates
  onNext?: () => void;
  onPrevious?: () => void;
  onProgress?: (progress: number, currentTime: number, duration: number) => void;
  initialTime?: number; // Start time in seconds
}

export function VideoPlayer({
  src,
  title,
  currentLecture,
  courseId,
  onNext,
  onPrevious,
  onProgress,
  initialTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressReportTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastReportedProgress = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSetInitialTime = useRef<boolean>(false);
  const progressSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressSyncRef = useRef<number>(0);
  const durationDetectedRef = useRef<boolean>(false);

  // Video duration detection
  const { updateLectureDuration } = useVideoDuration();

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime || 0);
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

  // Progress tracking state
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Sync progress to backend at intervals
  const syncProgress = useCallback(() => {
    if (!onProgress || !duration || duration === 0 || !videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    const progress = (current / duration) * 100;
    
    // Only sync if progress changed significantly (at least 1%)
    if (Math.abs(progress - lastProgressSyncRef.current) >= 1) {
      onProgress(progress, current, duration);
      lastProgressSyncRef.current = progress;
      
      console.log('📊 Progress synced:', {
        progress: progress.toFixed(1) + '%',
        currentTime: current.toFixed(0) + 's',
        duration: duration.toFixed(0) + 's'
      });
    }
  }, [onProgress, duration]);

  // Seek to specific timestamp
  const seekTo = useCallback((timestamp: number) => {
    if (videoRef.current && duration > 0) {
      const clampedTime = Math.max(0, Math.min(timestamp, duration));
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
      
      console.log('🎯 Seeking to:', formatTime(clampedTime));
    }
  }, [duration]);

  // Expose seek function to parent component
  useEffect(() => {
    // Create a global function that can be called from parent
    (window as any).seekVideoTo = seekTo;
    
    return () => {
      delete (window as any).seekVideoTo;
    };
  }, [seekTo]);

  // Set up progress sync interval - only when playing
  useEffect(() => {
    if (isPlaying && hasStarted) {
      // Sync progress every 10 seconds while playing
      progressSyncIntervalRef.current = setInterval(syncProgress, 10000);
    } else {
      if (progressSyncIntervalRef.current) {
        clearInterval(progressSyncIntervalRef.current);
        progressSyncIntervalRef.current = null;
      }
    }
    
    return () => {
      if (progressSyncIntervalRef.current) {
        clearInterval(progressSyncIntervalRef.current);
      }
    };
  }, [isPlaying, hasStarted, syncProgress]);

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
  const handleLoadedMetadata = useCallback(async () => {
    if (!videoRef.current) return;
    
    const videoDuration = videoRef.current.duration;
    setDuration(videoDuration);
    setIsLoading(false);
    setVideoError(false);
    
    // Detect and update video duration if not already done
    if (videoDuration > 0 && !durationDetectedRef.current && src && courseId) {
      durationDetectedRef.current = true;
      
      // Try to update the lecture duration with the video element duration
      try {
        await updateLectureDuration(currentLecture.id, videoDuration, courseId);
        console.log('✅ Video duration updated:', {
          lectureId: currentLecture.id,
          duration: `${Math.floor(videoDuration / 60)}m ${videoDuration % 60}s`
        });
      } catch (updateError) {
        console.log('ℹ️ Could not update lecture duration:', updateError);
      }
    }
    
    // Set initial time if provided and not already set
    if (initialTime > 0 && !hasSetInitialTime.current && videoDuration > 0) {
      const startTime = Math.min(initialTime, videoDuration - 1);
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      
      // Also update progress percentage to match the initial time
      const initialProgress = (startTime / videoDuration) * 100;
      setProgressPercentage(initialProgress);
      
      hasSetInitialTime.current = true;
    }
    
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
  }, [initialTime, src, currentLecture.id, courseId, updateLectureDuration]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    
    // Only update local state, no progress callbacks
    setCurrentTime(current);
    
    // Update progress percentage for UI only
    if (total > 0) {
      const progress = (current / total) * 100;
      setProgressPercentage(progress);
    }
    
    // Update buffered amount for UI
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered((bufferedEnd / total) * 100);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setHasStarted(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Sync progress when paused
    syncProgress();
  }, [syncProgress]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    
    // Report 100% completion
    if (onProgress) {
      onProgress(100, duration, duration);
    }
    
    // Auto-play next if available
    if (onNext) {
      toast.success("Lecture completed! Moving to next...", {
        action: {
          label: "Stay here",
          onClick: () => {
            // Cancel navigation
          },
        },
      });
      setTimeout(onNext, 3000);
    }
  }, [duration, onProgress, onNext]);

  const handleVideoError = useCallback((e: any) => {
    console.error("Video error:", e);
    setVideoError(true);
    setIsLoading(false);
    setIsPlaying(false);
    
    if (!src) {
      setErrorMessage("No video source provided");
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
    
    toast(`${seconds > 0 ? 'Forward' : 'Backward'} ${Math.abs(seconds)} seconds`, {
      duration: 1000,
    });
  }, [currentTime, duration, videoError]);

  const handleSeek = useCallback((value: number[]) => {
    if (!videoRef.current || videoError) return;
    
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Sync progress immediately after seeking
    syncProgress();
  }, [duration, videoError, syncProgress]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
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

  const restartVideo = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      videoRef.current.play();
    }
    
    toast("Video restarted", { duration: 1000 });
  }, [isPlaying]);

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
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyR":
          e.preventDefault();
          restartVideo();
          break;
        case "Digit0":
        case "Numpad0":
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [videoError, togglePlay, skip, toggleMute, toggleFullscreen, restartVideo]);

  // Cleanup
  useEffect(() => {
    return () => {
      // Final progress sync on unmount
      syncProgress();
      
      if (progressSyncIntervalRef.current) {
        clearInterval(progressSyncIntervalRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [syncProgress]);

  const videoSrc = src || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">{currentLecture.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-400 text-sm">
                Duration: {(() => {
                  const duration = parseInt(currentLecture.duration) || 0;
                  const hours = Math.floor(duration / 3600);
                  const minutes = Math.floor((duration % 3600) / 60);
                  const seconds = duration % 60;
                  
                  if (hours > 0) {
                    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                  }
                  if (minutes > 0) {
                    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
                  }
                  return `${seconds}s`;
                })()}
              </span>
              {progressPercentage > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(progressPercentage)}% watched
                </Badge>
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium text-white mb-2">
                {errorMessage}
              </h3>
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
              onPlay={handlePlay}
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
                    value={[duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                    disabled={videoError}
                  />
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

                    {/* Restart */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={restartVideo}
                      className="text-white hover:bg-white/20"
                      disabled={videoError}
                      title="Restart (R)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>

                    {/* Skip backward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/20"
                      disabled={videoError}
                      title="Back 10s (←)"
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
                      title="Forward 10s (→)"
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
                        title="Mute (M)"
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
                      title="Picture in Picture (P)"
                    >
                      <PictureInPicture className="w-5 h-5" />
                    </Button>

                    {/* Fullscreen */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                      title="Fullscreen (F)"
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
          <span>R: Restart</span>
          <span>0: Beginning</span>
        </div>
      </div>
    </div>
  );
}