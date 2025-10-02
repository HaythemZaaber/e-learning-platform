// types/stream-video.types.ts
export interface StreamCallSettings {
    audio: boolean;
    video: boolean;
    screenSharing: boolean;
    recording: boolean;
    transcription: boolean;
    backstage: boolean;
    broadcasting: boolean;
    geoBlocking: boolean;
    maxParticipants: number;
  }
  
  export interface StreamCallData {
    callId: string;
    callType: 'default' | 'livestream' | 'audio_room';
    callCid: string;
    createdBy: string;
    createdAt: Date;
    custom: Record<string, any>;
    settings: StreamCallSettings;
  }
  
  export interface StreamTokenData {
    token: string;
    expiresAt: Date;
    userId: string;
    callId: string;
  }
  
  export interface JoinSessionResponse {
    success: boolean;
    callData: StreamCallData;
    token: string;
    apiKey: string;
    session: any;
  }
  
  export interface VideoParticipant {
    userId: string;
    name: string;
    image?: string;
    role: string;
    isLocal: boolean;
    audioEnabled: boolean;
    videoEnabled: boolean;
    screenShareEnabled: boolean;
  }
  
  export interface VideoCallState {
    isConnected: boolean;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
    isRecording: boolean;
    participants: VideoParticipant[];
    error: string | null;
  }