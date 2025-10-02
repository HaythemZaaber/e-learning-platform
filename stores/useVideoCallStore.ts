// stores/useVideoCallStore.ts
import { create } from 'zustand';
import { VideoCallState, VideoParticipant } from '@/types/stream-video.types';

interface VideoCallStore extends VideoCallState {
  // Actions
  setConnected: (connected: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVideoEnabled: (enabled: boolean) => void;
  setScreenSharing: (sharing: boolean) => void;
  setRecording: (recording: boolean) => void;
  addParticipant: (participant: VideoParticipant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<VideoParticipant>) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: VideoCallState = {
  isConnected: false,
  isAudioEnabled: false,
  isVideoEnabled: false,
  isScreenSharing: false,
  isRecording: false,
  participants: [],
  error: null
};

export const useVideoCallStore = create<VideoCallStore>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),
  
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  
  setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
  
  setScreenSharing: (sharing) => set({ isScreenSharing: sharing }),
  
  setRecording: (recording) => set({ isRecording: recording }),
  
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant]
    })),
  
  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId)
    })),
  
  updateParticipant: (userId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.userId === userId ? { ...p, ...updates } : p
      )
    })),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState)
}));