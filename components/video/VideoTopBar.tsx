// components/video/VideoTopBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Shield, 
  Wifi, 
  WifiOff,
  Clock
} from 'lucide-react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface VideoTopBarProps {
  sessionTitle: string;
  onLeave: () => void;
}

export function VideoTopBar({ sessionTitle, onLeave }: VideoTopBarProps) {
  const { useCallSession } = useCallStateHooks();
  const session = useCallSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (session?.started_at) {
        const start = new Date(session.started_at);
        const diff = Math.floor((Date.now() - start.getTime()) / 1000);
        setDuration(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.started_at]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Session Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-white font-medium text-lg truncate max-w-md">
              {sessionTitle}
            </h1>
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live
            </Badge>
          </div>

          {/* Duration */}
          {duration > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(duration)}</span>
            </div>
          )}

          {/* Session Info Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Info className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white">
              <div className="space-y-2">
                <h4 className="font-medium">Session details</h4>
                <div className="text-sm space-y-1">
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Started:</span>{' '}
                    {session?.started_at 
                      ? new Date(session.started_at).toLocaleTimeString() 
                      : 'Not started'}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Duration:</span>{' '}
                    {formatDuration(duration)}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Connected</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}