// services/stream-video.service.ts
import { apiClient } from '../lib/api-client';
import { 
  StreamCallData, 
  StreamTokenData, 
  JoinSessionResponse 
} from '../types/stream-video.types';

export class StreamVideoService {
  // Create a new call for a session
  static async createCall(sessionId: string): Promise<StreamCallData> {
    return await apiClient.post<StreamCallData>('/stream/calls', { sessionId });
  }

  // Generate token for joining a call
  static async generateToken(
    callId: string, 
    userId?: string, 
    role?: string
  ): Promise<StreamTokenData> {
    return await apiClient.post<StreamTokenData>(`/stream/calls/${callId}/token`, {
      userId,
      role
    });
  }

  // Get call information
  static async getCall(callId: string, token?: string): Promise<StreamCallData> {
    return await apiClient.get<StreamCallData>(`/stream/calls/${callId}`, token);
  }

  // Start recording
  static async startRecording(callId: string, token?: string): Promise<void> {
    await apiClient.post<void>(`/stream/calls/${callId}/recording/start`, {}, token);
  }

  // Stop recording
  static async stopRecording(callId: string, token?: string): Promise<{ recordingUrl: string }> {
    return await apiClient.post<{ recordingUrl: string }>(`/stream/calls/${callId}/recording/stop`, {}, token);
  }

  // Get call participants
  static async getParticipants(callId: string): Promise<any[]> {
    const response = await apiClient.get<{ participants: any[] }>(`/stream/calls/${callId}/participants`);
    return response.participants;
  }

  // Join a session (creates call + generates token)
  static async joinSession(
    sessionId: string, 
    role: 'INSTRUCTOR' | 'STUDENT' = 'STUDENT',
    token?: string
  ): Promise<JoinSessionResponse> {
    return await apiClient.post<JoinSessionResponse>(`/stream/sessions/${sessionId}/join`, { 
      sessionId,
      role 
    }, token);
  }

  // Get session call info
  static async getSessionCallInfo(sessionId: string): Promise<any> {
    return await apiClient.get<any>(`/stream/sessions/${sessionId}/call-info`);
  }

  // End call
  static async endCall(callId: string): Promise<void> {
    await apiClient.delete(`/stream/calls/${callId}`);
  }
}