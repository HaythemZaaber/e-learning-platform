// components/video/EnhancedVideoCallControls.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Phone,
  Users,
  MessageSquare,
  Circle,
  MoreVertical,
  Settings,
  Hand,
  Smile,
  LayoutGrid
} from 'lucide-react';
import { 
  useCallStateHooks,
  useCall 
} from '@stream-io/video-react-sdk';
import { useVideoCallStore } from '@/stores/useVideoCallStore';
import { useStartRecording, useStopRecording } from '@/hooks/useStreamVideo';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface videoCallControlsProps {
  onLeave: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  layout: 'speaker' | 'grid' | 'sidebar';
  onLayoutChange: (layout: 'speaker' | 'grid' | 'sidebar') => void;
}

export function VideoCallControls({ 
  onLeave,
  onToggleParticipants,
  onToggleChat,
  layout,
  onLayoutChange
}: videoCallControlsProps) {
  const call = useCall();
  const { 
    useMicrophoneState, 
    useCameraState, 
    useScreenShareState, 
    useParticipants 
  } = useCallStateHooks();
  
  const { microphone, isMute: isAudioMuted } = useMicrophoneState();
  const { camera, isMute: isVideoMuted } = useCameraState();
  const { screenShare, isMute: isScreenShareOff } = useScreenShareState();
  const participants = useParticipants();

  const videoStore = useVideoCallStore();
  const startRecordingMutation = useStartRecording();
  const stopRecordingMutation = useStopRecording();

  const [isRecording, setIsRecording] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['👍', '❤️', '😂', '🎉', '👏', '🤔'];

  const handleReaction = (emoji: string) => {
    call?.sendCustomEvent({
      type: 'reaction',
      emoji
    });
    setShowReactions(false);
  };

  const handleStartRecording = async () => {
    if (!call) return;
    
    try {
      await startRecordingMutation.mutateAsync(call.id);
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    if (!call) return;
    
    try {
      await stopRecordingMutation.mutateAsync(call.id);
      setIsRecording(false);
      toast.success('Recording stopped');
    } catch (error) {
      toast.error('Failed to stop recording');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="flex items-center justify-between">
        {/* Left: Session Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <Circle className="w-2 h-2 mr-1 fill-current" />
              Recording
            </Badge>
          )}

          <Separator orientation="vertical" className="h-6 bg-gray-700" />
          
          <span className="text-gray-400 text-sm">
            {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
          </span>
        </div>

        {/* Center: Main Controls */}
        <div className="flex items-center gap-2">
          {/* Audio */}
          <div className="relative group">
            <Button
              size="lg"
              variant={isAudioMuted ? "destructive" : "secondary"}
              className="rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg"
              onClick={() => {
                microphone.toggle();
                videoStore.setAudioEnabled(!isAudioMuted);
              }}
            >
              {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isAudioMuted ? 'Unmute' : 'Mute'}
            </span>
          </div>

          {/* Video */}
          <div className="relative group">
            <Button
              size="lg"
              variant={isVideoMuted ? "destructive" : "secondary"}
              className="rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg"
              onClick={() => {
                camera.toggle();
                videoStore.setVideoEnabled(!isVideoMuted);
              }}
            >
              {isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
            </span>
          </div>

          {/* Screen Share */}
          <div className="relative group">
            <Button
              size="lg"
              variant={isScreenShareOff ? "secondary" : "default"}
              className="rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg"
              onClick={() => {
                screenShare.toggle();
                videoStore.setScreenSharing(!isScreenShareOff);
              }}
            >
              {isScreenShareOff ? <Monitor className="w-6 h-6" /> : <MonitorOff className="w-6 h-6" />}
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isScreenShareOff ? 'Present' : 'Stop presenting'}
            </span>
          </div>

          {/* Reactions */}
          <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
            <DropdownMenuTrigger asChild>
              <div className="relative group">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg"
                >
                  <Smile className="w-6 h-6" />
                </Button>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Reactions
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="mb-2 bg-gray-800 border-gray-700">
              <div className="grid grid-cols-3 gap-1 p-2">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-2 hover:bg-gray-700 rounded text-2xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Leave Call */}
          <div className="relative group ml-2">
            <Button
              size="lg"
              variant="destructive"
              className="rounded-full w-14 h-14 hover:scale-105 transition-all shadow-lg bg-red-600 hover:bg-red-700"
              onClick={onLeave}
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Leave call
            </span>
          </div>
        </div>

        {/* Right: Secondary Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Participants */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full w-12 h-12 text-white hover:bg-gray-800"
              onClick={onToggleParticipants}
            >
              <Users className="w-5 h-5" />
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              People
            </span>
          </div>

          {/* Chat */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full w-12 h-12 text-white hover:bg-gray-800"
              onClick={onToggleChat}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat
            </span>
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full w-12 h-12 text-white hover:bg-gray-800"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  More options
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="mb-2 bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem onClick={() => onLayoutChange('speaker')} className="hover:bg-gray-700">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Speaker view
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLayoutChange('grid')} className="hover:bg-gray-700">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Grid view
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              {!isRecording ? (
                <DropdownMenuItem onClick={handleStartRecording} className="hover:bg-gray-700">
                  <Circle className="w-4 h-4 mr-2 text-red-500" />
                  Start recording
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleStopRecording} className="hover:bg-gray-700">
                  <Circle className="w-4 h-4 mr-2 text-red-500 fill-current" />
                  Stop recording
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}