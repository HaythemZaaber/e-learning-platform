// components/video/VideoCallInterface.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Call,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideoClient,
  useCallStateHooks,
  PaginatedGridLayout,
} from '@stream-io/video-react-sdk';
import { VideoCallControls } from './VideoCallControls';
import { VideoParticipantsList } from './VideoParticipantsList';
import { VideoChatPanel } from './VideoChatPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  LayoutGrid, 
  Users, 
  MessageSquare,
  Hand,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LayoutMode = 'speaker' | 'grid' | 'sidebar';

interface VideoCallInterfaceProps {
  client: StreamVideoClient;
  callId: string;
  callType: 'default' | 'livestream' | 'audio_room';
  onLeave: () => void;
  sessionTitle?: string;
}

export function VideoCallInterface({
  client,
  callId,
  callType,
  onLeave,
  sessionTitle = 'Live Session'
}: VideoCallInterfaceProps) {
  const [call, setCall] = useState<Call | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('speaker');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!client) return;

    const myCall = client.call(callType, callId);
    
    myCall.join({ create: false })
      .then(() => {
        setCall(myCall);
      })
      .catch((error) => {
        console.error('Failed to join call:', error);
      });

    return () => {
      myCall.leave().catch(console.error);
    };
  }, [client, callId, callType]);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining session...</p>
        </div>
      </div>
    );
  }

  const renderLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout groupSize={9} />;
      case 'sidebar':
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="bottom" />;
    }
  };

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <div 
          className="h-screen flex flex-col bg-gray-950 relative"
          onMouseMove={handleMouseMove}
        >
           {/* Top Bar */}
           <div className={cn(
             "absolute top-0 left-0 right-0 z-50 transition-all duration-300",
             showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
           )}>
             <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-3">
               <div className="flex items-center justify-between">
                 <h1 className="text-white font-semibold text-lg">{sessionTitle}</h1>
                 <div className="flex items-center gap-2">
                   <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                     Live
                   </Badge>
                 </div>
               </div>
             </div>
           </div>

          {/* Main Content */}
          <div className="flex-1 flex relative">
            {/* Video Area */}
            <div className={cn(
              "transition-all duration-300",
              showParticipants || showChat ? "flex-1" : "w-full"
            )}>
              {renderLayout()}
            </div>

            {/* Right Sidebar */}
            {(showParticipants || showChat) && (
              <div className="w-80 xl:w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 flex flex-col">
                {/* Sidebar Tabs */}
                <div className="flex border-b border-gray-800">
                  <button
                    onClick={() => {
                      setShowParticipants(true);
                      setShowChat(false);
                    }}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                      showParticipants 
                        ? "text-white border-b-2 border-blue-500 bg-gray-800/50" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                    )}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    People
                  </button>
                  <button
                    onClick={() => {
                      setShowChat(true);
                      setShowParticipants(false);
                    }}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                      showChat 
                        ? "text-white border-b-2 border-blue-500 bg-gray-800/50" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => {
                      setShowParticipants(false);
                      setShowChat(false);
                    }}
                    className="px-3 text-gray-400 hover:text-white hover:bg-gray-800/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-hidden">
                  {showParticipants && <VideoParticipantsList />}
                  {showChat && <VideoChatPanel />}
                </div>
              </div>
            )}
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-20 right-4 flex flex-col gap-2 z-40">
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 transition-all",
                layout === 'grid' && "bg-blue-600 hover:bg-blue-700"
              )}
              onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
            >
              <LayoutGrid className="w-5 h-5 text-white" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "rounded-full bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 transition-all",
                isHandRaised && "bg-yellow-500 hover:bg-yellow-600"
              )}
              onClick={() => {
                setIsHandRaised(!isHandRaised);
                // Send hand raise event
                call.sendCustomEvent({
                  type: 'hand_raised',
                  raised: !isHandRaised
                });
              }}
            >
              <Hand className="w-5 h-5 text-white" />
            </Button>
          </div>

           {/* Reactions placeholder */}
           <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
             {/* Reactions will be implemented here */}
           </div>

          {/* Bottom Controls */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 z-50 transition-all duration-300",
            showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}>
            <div className="bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-8 pb-6">
              <VideoCallControls 
                onLeave={onLeave}
                onToggleParticipants={() => {
                  setShowParticipants(!showParticipants);
                  setShowChat(false);
                }}
                onToggleChat={() => {
                  setShowChat(!showChat);
                  setShowParticipants(false);
                }}
                layout={layout}
                onLayoutChange={setLayout}
              />
            </div>
          </div>
        </div>
      </StreamTheme>
    </StreamCall>
  );
}