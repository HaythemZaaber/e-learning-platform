// app/sessions/[sessionId]/video-call/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  StreamVideoClient, 
  StreamVideo, 
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  PaginatedGridLayout,
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PermissionRequests,
  useCall,
  useCallStateHooks,
  CallingState,
  useConnectedUser
} from '@stream-io/video-react-sdk';
import { useJoinSession } from '@/hooks/useStreamVideo';
import { useAuth } from '@/hooks/useAuth';
import { useLiveSession, useEndLiveSession } from '@/features/sessions/hooks/useLiveSessions';
import { 
  Loader2, 
  Users, 
  Grid3X3, 
  PhoneOff,
  MessageSquare,
  Wifi,
  AlertCircle,
  Video
} from 'lucide-react';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { VideoChatPanel } from '@/components/video/VideoChatPanel';

// Custom styles for better white text visibility and proper layout
const customStyles = `
  .str-video__call-controls {
    color: white !important;
  }
  .str-video__call-controls button {
    color: white !important;
  }
  .str-video__call-controls button svg {
    color: white !important;
  }
  .str-video__participant-details {
    color: white !important;
  }
  .str-video__participant-details__name {
    color: white !important;
  }
  .str-video__participant-details__status {
    color: white !important;
  }
  .str-video__participants-bar {
    background-color: rgba(31, 41, 55, 0.9) !important;
  }
  .str-video__participants-bar button {
    color: white !important;
  }
  .str-video__participants-bar button svg {
    color: white !important;
  }
  .str-video__call-stats {
    color: white !important;
  }
  .str-video__call-stats button {
    color: white !important;
  }
  .str-video__call-stats button svg {
    color: white !important;
  }
  .str-video__permission-requests {
    color: white !important;
  }
  .str-video__permission-requests button {
    color: white !important;
  }
  .str-video__permission-requests button svg {
    color: white !important;
  }
  .str-video__participant-list {
    background-color: rgba(31, 41, 55, 0.95) !important;
  }
  .str-video__participant-list-item {
    color: white !important;
  }
  .str-video__participant-list-item__name {
    color: white !important;
  }
  .str-video__participant-list-item__status {
    color: white !important;
  }
`;

// Simple Call Interface using Stream's built-in components
function CallInterface({ 
  onLeave, 
  onEndSession, 
  isInstructor,
  isEndingSession 
}: { 
  onLeave: () => void;
  onEndSession?: () => Promise<void>;
  isInstructor: boolean;
  isEndingSession: boolean;
}) {
  const call = useCall();
  const connectedUser = useConnectedUser();
  const { 
    useCallCallingState, 
    useParticipants,
    useCallStartedAt,
    useIsCallLive
  } = useCallStateHooks();
  
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const callStartedAt = useCallStartedAt();
  const isCallLive = useIsCallLive();
  
  const [isGridView, setIsGridView] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  // Calculate call duration
  useEffect(() => {
    if (!callStartedAt || !isCallLive) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(callStartedAt);
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartedAt, isCallLive]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    const isLeft = callingState === CallingState.LEFT;
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-white text-lg">
            {isLeft ? 'You have left the call' : 'Unable to join call'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {isLeft 
              ? 'The session may still be active for other participants.' 
              : 'The session may have ended or there was a connection issue.'}
          </p>
          <button
            onClick={onLeave}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header with session info */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live Session</span>
            </div>
            
            {callDuration !== '00:00' && (
              <div className="text-white text-sm font-medium">
                {callDuration}
              </div>
            )}
            
            <div className="text-white text-sm font-medium">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CallStatsButton />
            <PermissionRequests />
            
            <button
              onClick={() => setIsGridView(!isGridView)}
              className={`p-2 rounded-md transition-colors ${
                isGridView 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isGridView ? 'Switch to Speaker View' : 'Switch to Grid View'}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`p-2 rounded-md transition-colors ${
                showParticipants 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title="Show Participants"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-md transition-colors ${
                showChat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title="Show Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex ">
        {/* Video area */}
        <div className={`flex-1 relative transition-all duration-300 ${
          (showParticipants || showChat) ? 'mr-80' : ''
        }`}>
          <StreamTheme className="h-full w-full">
            {isGridView ? (
              <PaginatedGridLayout 
                groupSize={9}
                excludeLocalParticipant={true}
              />
            ) : (
              <SpeakerLayout 
                participantsBarPosition="bottom"
                participantsBarLimit={6}
              />
            )}
          </StreamTheme>
        </div>

        {/* Right sidebar */}
        {(showParticipants || showChat) && (
          <div className="text-white w-80 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Sidebar tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => {
                  setShowParticipants(true);
                  setShowChat(false);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  showParticipants 
                    ? "text-white border-b-2 border-blue-500 bg-gray-700/50" 
                    : "text-white hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                People ({participants.length})
              </button>
              <button
                onClick={() => {
                  setShowChat(true);
                  setShowParticipants(false);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  showChat 
                    ? "text-white border-b-2 border-blue-500 bg-gray-700/50" 
                    : "text-white hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {showParticipants && (
                <div className="flex-1 overflow-hidden">
                  <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
              )}
              {showChat && (
                <div className="flex-1 overflow-hidden">
                  <VideoChatPanel />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Call Controls - centered to avoid overlap with AI assistant (bottom-right) */}
      <div className="flex-shrink-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center gap-4">
          {isInstructor && onEndSession && (
            <button
              onClick={() => onEndSession()}
              disabled={isEndingSession}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-70 text-white rounded-lg transition-colors"
            >
              {isEndingSession ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <PhoneOff className="w-4 h-4" />
                  End Session for All
                </>
              )}
            </button>
          )}
          <div className="flex items-center justify-center">
            <StreamTheme>
              <CallControls onLeave={onLeave} />
            </StreamTheme>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Extract sessionId from params or pathname as fallback
  let sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  
  // Fallback: extract from pathname if params don't work
  if (!sessionId) {
    const pathParts = pathname.split('/');
    const sessionIndex = pathParts.findIndex(part => part === 'sessions');
    if (sessionIndex !== -1 && pathParts[sessionIndex + 1]) {
      sessionId = pathParts[sessionIndex + 1];
    }
  }

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLeft, setHasLeft] = useState(false);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndLiveSession();
  const { data: session } = useLiveSession(String(sessionId));

  // Determine role: from URL param (instructor nav) or from session (student nav)
  const roleParam = searchParams.get('role');
  const isInstructor = roleParam === 'instructor' || (!!session && session.instructorId === user?.id);
  const joinRole = isInstructor ? 'INSTRUCTOR' : 'STUDENT';

  useEffect(() => {
    if (!user?.id || !sessionId || typeof sessionId !== 'string' || isInitializing) return;

    let isMounted = true;

    const initializeCall = async () => {
      try {
        // If we have session data and it's already ended, don't try to join
        if (session?.status === 'COMPLETED' || session?.status === 'CANCELLED') {
          if (isMounted) setError('This session has already ended.');
          return;
        }

        setIsInitializing(true);
        setError(null);
        
        // Join session via GetStream - get token and call credentials
        const response = await joinSessionMutation.mutateAsync({
          sessionId: String(sessionId),
          role: joinRole
        });

        if (!isMounted) return;

        // Initialize Stream Video client
        const videoClient = new StreamVideoClient({
          apiKey: response.apiKey,
          user: {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.id,
            image: user.profileImage || undefined
          },
          token: response.token,
          options: {
            logLevel: 'error', // suppress "Participant with sessionId not found" (harmless race when someone leaves)
          }
        });

        // Create call instance - use callId from response (format: session-{sessionId})
        const callInstance = videoClient.call(response.callData.callType, response.callData.callId);
        
        // Role: "audience" is only valid for livestream calls. For "default" call type, use "speaker".
        const callType = response.callData.callType || 'default';
        const memberRole = isInstructor ? 'host' : (callType === 'livestream' ? 'audience' : 'speaker');
        
        // Join the call - create: true allows join even if timing race (creates if not exists)
        await callInstance.join({ 
          create: true,
          data: {
            members: [{
              user_id: user.id,
              role: memberRole
            }]
          }
        });

        if (!isMounted) {
          await callInstance.leave();
          await videoClient.disconnectUser();
          return;
        }

        setClient(videoClient);
        setCall(callInstance);
      } catch (error: any) {
        console.error('Failed to join video call:', error);
        if (isMounted) {
          setError(error.message || 'Failed to join video call');
          setTimeout(() => {
            router.push(isInstructor ? '/instructor/dashboard/sessions' : '/student/sessions');
          }, 3000);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeCall();

    return () => {
      isMounted = false;
    };
  }, [sessionId, user?.id, joinRole]);

  const handleLeave = async () => {
    if (hasLeft) return;
    setHasLeft(true);
    try {
      // CallControls' hang-up button already calls call.leave() before onLeave fires,
      // so only attempt leave if the call hasn't been left yet.
      if (call && call.state?.callingState !== 'left') {
        try {
          await call.leave();
        } catch (_) {
          // Already left — safe to ignore
        }
      }
      if (client) {
        try {
          await client.disconnectUser();
        } catch (_) {
          // Safe to ignore
        }
      }
    } finally {
      router.push(isInstructor ? '/instructor/dashboard/sessions' : '/student/sessions');
    }
  };

  const handleEndSession = async () => {
    if (hasLeft) return;
    setHasLeft(true);
    try {
      await endSessionMutation.mutateAsync({ id: String(sessionId) });
      if (call && call.state?.callingState !== 'left') {
        try {
          await call.leave();
        } catch (_) {
          // Already left — safe to ignore
        }
      }
      if (client) {
        try {
          await client.disconnectUser();
        } catch (_) {
          // Safe to ignore
        }
      }
    } catch (err) {
      console.error('End session error:', err);
      setHasLeft(false);
      return;
    } finally {
      router.push('/instructor/dashboard/sessions');
    }
  };

  // Cleanup on unmount - only if user didn't leave via button
  useEffect(() => {
    return () => {
      if (!hasLeft && call && call.state?.callingState !== 'left') {
        call.leave().catch(() => {});
      }
      if (!hasLeft && client) {
        client.disconnectUser().catch(() => {});
      }
    };
  }, [call, client, hasLeft]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Connection Failed</h2>
          <p className="text-white mb-4">{error}</p>
          <p className="text-gray-300 text-sm mb-6">Redirecting to dashboard in a few seconds...</p>
          <button
            onClick={() => router.push(isInstructor ? '/instructor/dashboard/sessions' : '/student/sessions')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isInitializing || !client || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-6" />
          <h2 className="text-white text-xl font-semibold mb-2">Setting up your video call</h2>
          <p className="text-white mb-4">Please wait while we connect you to the session</p>
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Establishing secure connection...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallInterface 
            onLeave={handleLeave}
            onEndSession={isInstructor ? handleEndSession : undefined}
            isInstructor={isInstructor}
            isEndingSession={endSessionMutation.isPending}
          />
        </StreamCall>
      </StreamVideo>
    </>
  );
}