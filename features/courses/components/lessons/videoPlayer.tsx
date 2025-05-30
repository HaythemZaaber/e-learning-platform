"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  src: string;
  title: string;
  currentLecture: {
    id: string;
    title: string;
    duration: string;
    hasNotes?: boolean;
    hasTranscript?: boolean;
  };
  onNext?: () => void;
  onPrevious?: () => void;
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({
  src,
  title,
  currentLecture,
  onNext,
  onPrevious,
  onProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("720p");
  const [showNotes, setShowNotes] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add safety checks for props
  if (!src || !currentLecture) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{title || "Loading..."}</h2>
        </div>
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use a working sample video URL for demonstration
  const videoSrc =
    !src || src.includes("placeholder")
      ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      : src;

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => resetTimeout();

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      clearTimeout(timeout);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current || videoError) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [volume, videoError]);

  const togglePlay = () => {
    if (!videoRef.current || videoError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    if (onProgress && duration > 0) {
      onProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setVideoError(false);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current || videoError) return;

    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current || videoError) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    if (!videoRef.current || videoError) return;
    videoRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const skipBackward = () => {
    if (!videoRef.current || videoError) return;
    videoRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current || videoError) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Video Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{currentLecture.title}</h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span>Duration: {currentLecture.duration}</span>
          {currentLecture.hasNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="h-auto p-1"
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
              className="h-auto p-1"
            >
              <FileText className="w-4 h-4 mr-1" />
              Transcript
            </Button>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative bg-black aspect-video group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isPlaying && setShowControls(false)}
      >
        {videoError ? (
          // Error State
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Video Unavailable</h3>
              <p className="text-gray-400 mb-4">
                This video is currently unavailable or still being processed.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleCanPlay}
              onError={handleVideoError}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              preload="metadata"
            />

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Center Play Button */}
              {!isPlaying && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-16 h-16"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
              )}

              {/* Bottom Controls */}
              {!isLoading && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Slider
                      value={[
                        duration > 0 ? (currentTime / duration) * 100 : 0,
                      ]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onPrevious}
                        disabled={!onPrevious}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipBackward}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="w-4 h-4" />
                        <span className="text-xs ml-1">10s</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipForward}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="w-4 h-4" />
                        <span className="text-xs ml-1">10s</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNext}
                        disabled={!onNext}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>

                      {/* Volume Control */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="w-20">
                          <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>

                      {/* Time Display */}
                      <span className="text-white text-sm ml-4">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Playback Speed */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            {playbackRate}x
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <DropdownMenuItem
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                            >
                              {rate}x
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Quality */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["1080p", "720p", "480p", "360p"].map((q) => (
                            <DropdownMenuItem
                              key={q}
                              onClick={() => setQuality(q)}
                            >
                              {q} {q === quality && "✓"}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Fullscreen */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-4 h-4" />
                        ) : (
                          <Maximize className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Lecture Notes</h3>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
          <div className="prose prose-sm max-w-none">
            <p>
              This lecture covers the fundamental concepts of Python programming
              including variables, data types, and basic operations.
            </p>
            <ul>
              <li>Variables and naming conventions</li>
              <li>Data types: strings, integers, floats, booleans</li>
              <li>Basic arithmetic operations</li>
              <li>String manipulation</li>
            </ul>
          </div>
        </div>
      )}

      {/* Transcript Panel */}
      {showTranscript && (
        <div className="p-4 border-t bg-gray-50 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Transcript</h3>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-blue-600 font-mono">00:15</span>
              <p>
                Welcome to this Python programming course. In this lecture,
                we'll cover the basics...
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-mono">00:45</span>
              <p>
                Let's start by understanding what variables are and how we can
                use them in Python...
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-mono">01:20</span>
              <p>
                Python supports several data types including strings, integers,
                and floats...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
