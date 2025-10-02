// hooks/useStreamVideo.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StreamVideoService } from '@/services/stream-video.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useJoinSession() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ sessionId, role }: { sessionId: string; role?: 'INSTRUCTOR' | 'STUDENT' }) => {
      const token = await getToken();
      return StreamVideoService.joinSession(sessionId, role, token || undefined);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session', data.session.id] });
      // Success notification is handled by the session booking system to avoid duplicates
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to join session');
    }
  });
}

export function useStreamCall(callId: string | null) {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['stream-call', callId],
    queryFn: async () => {
      const token = await getToken();
      return StreamVideoService.getCall(callId!, token || undefined);
    },
    enabled: !!callId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
}

export function useStartRecording() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (callId: string) => {
      const token = await getToken();
      return StreamVideoService.startRecording(callId, token || undefined);
    },
    onSuccess: (_, callId) => {
      queryClient.invalidateQueries({ queryKey: ['stream-call', callId] });
      toast.success('Recording started');
    },
    onError: (error: any) => {
      toast.error('Failed to start recording');
    }
  });
}

export function useStopRecording() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (callId: string) => {
      const token = await getToken();
      return StreamVideoService.stopRecording(callId, token || undefined);
    },
    onSuccess: (data, callId) => {
      queryClient.invalidateQueries({ queryKey: ['stream-call', callId] });
      toast.success('Recording stopped');
      return data.recordingUrl;
    },
    onError: (error: any) => {
      toast.error('Failed to stop recording');
    }
  });
}

export function useCallParticipants(callId: string | null) {
  return useQuery({
    queryKey: ['call-participants', callId],
    queryFn: () => StreamVideoService.getParticipants(callId!),
    enabled: !!callId,
    refetchInterval: 5000 // Refresh every 5 seconds
  });
}