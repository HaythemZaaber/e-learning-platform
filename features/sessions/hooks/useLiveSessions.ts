// =============================================================================
// ENHANCED LIVE SESSIONS REACT QUERY HOOKS
// =============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { liveSessionsApi, getAuthenticatedLiveSessionsApi, ApiError } from '../services/api/liveSessionsApi';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  InstructorProfile,
  InstructorAvailability,
  SessionOffering,
  LiveSession,
  BookingRequest,
  SessionReservation,
  SessionPayment,
  PaymentIntent,
  InstructorPayout,
  SessionStats,
  SessionReview,
  SessionNotification,
  TimeSlot,
  SessionTopic,
  TopicRequest,
  TopicCluster,
  AIInsight,
  CancellationPolicy,
  SessionType,
  SessionFormat,
  SessionTopicType,
  BookingMode,
  PaymentStatus,
  SessionStatus,
  PayoutStatus,
  BookingStatus,
  CreateLiveSessionDto,
  UpdateLiveSessionDto,
  CreateSessionOfferingDto,
  UpdateSessionOfferingDto,
  ReservationStatus,
  AttendanceStatus,
  LiveSessionType,
  StartLiveSessionDto,
  EndLiveSessionDto,
  CancelLiveSessionDto,
  RescheduleLiveSessionDto,
  LiveSessionFilterDto,
} from '../types/session.types';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const liveSessionsKeys = {
  all: ['live-sessions'] as const,
  instructorProfiles: () => [...liveSessionsKeys.all, 'instructor-profiles'] as const,
  instructorProfile: (userId: string) => [...liveSessionsKeys.instructorProfiles(), userId] as const,
  availability: () => [...liveSessionsKeys.all, 'availability'] as const,
  instructorAvailability: (instructorId: string, startDate?: Date, endDate?: Date) => 
    [...liveSessionsKeys.availability(), instructorId, startDate, endDate] as const,
  timeSlots: () => [...liveSessionsKeys.all, 'time-slots'] as const,
  availableTimeSlots: (instructorId: string, date: Date, offeringId?: string) => 
    [...liveSessionsKeys.timeSlots(), 'available', instructorId, date, offeringId] as const,
  topics: () => [...liveSessionsKeys.all, 'topics'] as const,
  instructorTopics: (instructorId: string) => [...liveSessionsKeys.topics(), instructorId] as const,
  offerings: () => [...liveSessionsKeys.all, 'offerings'] as const,
  instructorOfferings: (instructorId?: string, filters?: any) => 
    [...liveSessionsKeys.offerings(), instructorId, filters] as const,
  offering: (id: string) => [...liveSessionsKeys.offerings(), id] as const,
  bookingRequests: () => [...liveSessionsKeys.all, 'booking-requests'] as const,
  instructorBookingRequests: (instructorId: string, status?: BookingStatus) => 
    [...liveSessionsKeys.bookingRequests(), 'instructor', instructorId, status] as const,
  studentBookingRequests: (studentId: string, status?: BookingStatus) => 
    [...liveSessionsKeys.bookingRequests(), 'student', studentId, status] as const,
  bookingRequest: (id: string) => [...liveSessionsKeys.bookingRequests(), id] as const,
  liveSessions: () => [...liveSessionsKeys.all, 'sessions'] as const,
  instructorLiveSessions: (instructorId: string, status?: SessionStatus) => 
    [...liveSessionsKeys.liveSessions(), 'instructor', instructorId, status] as const,
  studentLiveSessions: (studentId: string, status?: SessionStatus) => 
    [...liveSessionsKeys.liveSessions(), 'student', studentId, status] as const,
  liveSession: (id: string) => [...liveSessionsKeys.liveSessions(), id] as const,
  sessionReservations: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'reservations'] as const,
  sessionPayments: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'payments'] as const,
  sessionReviews: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'reviews'] as const,
  sessionAttendance: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'attendance'] as const,
  sessionParticipants: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'participants'] as const,
  paymentIntents: () => [...liveSessionsKeys.all, 'payment-intents'] as const,
  instructorPayouts: (instructorId: string, status?: PayoutStatus) => 
    [...liveSessionsKeys.all, 'payouts', instructorId, status] as const,
  notifications: (userId: string, isRead?: boolean) => 
    [...liveSessionsKeys.all, 'notifications', userId, isRead] as const,
  sessionStats: (instructorId: string, startDate?: Date, endDate?: Date) => 
    [...liveSessionsKeys.all, 'stats', instructorId, startDate, endDate] as const,
  aiInsights: (instructorId: string) => [...liveSessionsKeys.all, 'ai-insights', instructorId] as const,
  topicRequests: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'topic-requests'] as const,
  upcomingSessions: (instructorId?: string, studentId?: string, days?: number) => 
    [...liveSessionsKeys.liveSessions(), 'upcoming', instructorId, studentId, days] as const,
};

// =============================================================================
// ENHANCED LIVE SESSIONS HOOKS
// =============================================================================

export const useInstructorLiveSessions = (instructorId: string, filters?: LiveSessionFilterDto) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorLiveSessions(instructorId, filters?.status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSessions({ instructorId, ...filters });
    },
    enabled: !!instructorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useStudentLiveSessions = (studentId: string, filters?: LiveSessionFilterDto) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.studentLiveSessions(studentId, filters?.status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSessions({ studentId, ...filters });
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLiveSession = (id: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.liveSession(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSession(id);
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (session: CreateLiveSessionDto) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createLiveSession(session);
    },
    onSuccess: (data) => {
      // Invalidate sessions lists and stats
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorLiveSessions(data.instructorId),
      });
      queryClient.invalidateQueries({
        queryKey: [...liveSessionsKeys.all, 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.upcomingSessions(),
      });
      toast.success('Live session created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create live session');
    },
  });
};

export const useUpdateLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateLiveSessionDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateLiveSession(id, updates);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      toast.success('Live session updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update live session');
    },
  });
};

export const useStartLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, startData }: { id: string; startData?: StartLiveSessionDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.startLiveSession(id, startData);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: [...liveSessionsKeys.all, 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.upcomingSessions(),
      });
      toast.success('Live session started successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to start live session');
    },
  });
};

export const useEndLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, endData }: { id: string; endData?: EndLiveSessionDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.endLiveSession(id, endData);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: [...liveSessionsKeys.all, 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.upcomingSessions(),
      });
      toast.success('Live session ended successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to end live session');
    },
  });
};

export const useCancelLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, cancelData }: { id: string; cancelData?: CancelLiveSessionDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.cancelLiveSession(id, cancelData);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: [...liveSessionsKeys.all, 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.upcomingSessions(),
      });
      toast.success('Live session cancelled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel live session');
    },
  });
};

export const useRescheduleLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, rescheduleData }: { id: string; rescheduleData: RescheduleLiveSessionDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.rescheduleLiveSession(id, rescheduleData);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      queryClient.invalidateQueries({
        queryKey: [...liveSessionsKeys.all, 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.upcomingSessions(),
      });
      toast.success('Live session rescheduled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reschedule live session');
    },
  });
};

// =============================================================================
// PARTICIPANT MANAGEMENT HOOKS
// =============================================================================

export const useSessionParticipants = (sessionId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.sessionParticipants(sessionId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionParticipants(sessionId);
    },
    enabled: !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ sessionId, participantData }: { 
      sessionId: string; 
      participantData: { userId: string; role?: string } 
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.addParticipant(sessionId, participantData);
    },
    onSuccess: (data, { sessionId }) => {
      // Invalidate participants list
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.sessionParticipants(sessionId),
      });
      // Invalidate session data
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSession(sessionId),
      });
      toast.success('Participant added successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to add participant');
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.removeParticipant(sessionId, userId);
    },
    onSuccess: (data, { sessionId }) => {
      // Invalidate participants list
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.sessionParticipants(sessionId),
      });
      // Invalidate session data
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSession(sessionId),
      });
      toast.success('Participant removed successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to remove participant');
    },
  });
};

// =============================================================================
// ATTENDANCE MANAGEMENT HOOKS
// =============================================================================

export const useSessionAttendance = (sessionId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.sessionAttendance(sessionId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionAttendance(sessionId);
    },
    enabled: !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      userId, 
      attendanceData 
    }: { 
      sessionId: string; 
      userId: string; 
      attendanceData: {
        joinedAt?: string;
        leftAt?: string;
        status?: string;
        engagementMetrics?: {
          cameraOnTime?: number;
          micActiveTime?: number;
          chatMessages?: number;
          questionsAsked?: number;
          pollResponses?: number;
        };
      }
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateAttendance(sessionId, userId, attendanceData);
    },
    onSuccess: (data, { sessionId }) => {
      // Invalidate attendance list
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.sessionAttendance(sessionId),
      });
      toast.success('Attendance updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update attendance');
    },
  });
};

// =============================================================================
// SESSION STATISTICS HOOKS
// =============================================================================

export const useSessionStats = (
  instructorId?: string, 
  studentId?: string, 
  startDate?: Date, 
  endDate?: Date
) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.sessionStats(instructorId || '', startDate, endDate),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionStats(instructorId, studentId, startDate, endDate);
    },
    enabled: !!(instructorId || studentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpcomingSessions = (
  instructorId?: string, 
  studentId?: string, 
  days: number = 7
) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.upcomingSessions(instructorId, studentId, days),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getUpcomingSessions(instructorId, studentId, days);
    },
    enabled: !!(instructorId || studentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// =============================================================================
// EXISTING HOOKS (keeping for backward compatibility)
// =============================================================================

export const useInstructorProfile = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorProfile(userId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getInstructorProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudentProfile = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['student-profile', userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getStudentProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAIInsights = (instructorId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.aiInsights(instructorId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getAIInsights(instructorId);
    },
    enabled: !!instructorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// =============================================================================
// AVAILABILITY MANAGEMENT HOOKS
// =============================================================================

export const useInstructorAvailability = (instructorId: string, startDate?: Date, endDate?: Date) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorAvailability(instructorId, startDate, endDate),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getInstructorAvailability(instructorId, startDate, endDate);
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (availability: Omit<InstructorAvailability, 'id' | 'createdAt' | 'updatedAt'>) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createAvailability(availability);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorAvailability(data.instructorId),
      });
      toast.success('Availability created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create availability');
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InstructorAvailability> }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateAvailability(id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorAvailability(data.instructorId),
      });
      toast.success('Availability updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update availability');
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.deleteAvailability(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.availability(),
      });
      toast.success('Availability deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete availability');
    },
  });
};

export const useGenerateTimeSlots = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ instructorId, startDate, endDate }: { instructorId: string; startDate: Date; endDate: Date }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.generateTimeSlots(instructorId, startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.availability(),
      });
      toast.success('Time slots generated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to generate time slots');
    },
  });
};

export const useCheckAvailability = () => {
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ instructorId, date, startTime, endTime }: { 
      instructorId: string; 
      date: Date; 
      startTime: string; 
      endTime: string; 
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.checkAvailability(instructorId, date, startTime, endTime);
    },
  });
};

export const useAvailableTimeSlots = (instructorId: string, date: Date, offeringId?: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.availableTimeSlots(instructorId, date, offeringId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getAvailableTimeSlots(instructorId, date, offeringId);
    },
    enabled: !!instructorId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBlockTimeSlot = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ slotId, reason }: { slotId: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.blockTimeSlot(slotId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.timeSlots(),
      });
      toast.success('Time slot blocked successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to block time slot');
    },
  });
};

export const useUnblockTimeSlot = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (slotId: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.unblockTimeSlot(slotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.timeSlots(),
      });
      toast.success('Time slot unblocked successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to unblock time slot');
    },
  });
};

export const useUpcomingAvailability = (instructorId: string, days: number = 7) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: [...liveSessionsKeys.availability(), 'upcoming', instructorId, days],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getUpcomingAvailability(instructorId, days);
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAvailabilityStats = (instructorId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: [...liveSessionsKeys.availability(), 'stats', instructorId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getAvailabilityStats(instructorId);
    },
    enabled: !!instructorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// =============================================================================
// SESSION OFFERINGS HOOKS
// =============================================================================

export const useSessionOfferings = (filters?: {
  instructorId?: string;
  isActive?: boolean;
  sessionType?: SessionType;
  topicType?: SessionTopicType;
  category?: string;
  search?: string;
}) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorOfferings(filters?.instructorId, filters),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionOfferings(filters);
    },
    enabled: !!filters?.instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSessionOffering = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (offering: CreateSessionOfferingDto) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createSessionOffering(offering);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorOfferings(data.instructorId),
      });
      toast.success('Session offering created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create session offering');
    },
  });
};

export const useUpdateSessionOffering = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateSessionOfferingDto }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateSessionOffering(id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.offering(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorOfferings(data.instructorId),
      });
      toast.success('Session offering updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update session offering');
    },
  });
};

export const useDeleteSessionOffering = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.deleteSessionOffering(id);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.offering(id),
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.offerings(),
      });
      toast.success('Session offering deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete session offering');
    },
  });
};

// =============================================================================
// BOOKING REQUESTS HOOKS
// =============================================================================

export const useBookingRequests = (filters?: {
  instructorId?: string;
  studentId?: string;
  status?: BookingStatus;
  offeringId?: string;
}) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: filters?.instructorId 
      ? liveSessionsKeys.instructorBookingRequests(filters.instructorId, filters.status)
      : filters?.studentId 
      ? liveSessionsKeys.studentBookingRequests(filters.studentId, filters.status)
      : liveSessionsKeys.bookingRequests(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getBookingRequests(filters);
    },
    enabled: !!(filters?.instructorId || filters?.studentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateBookingRequest = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (request: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createBookingRequest(request);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create booking request');
    },
  });
};

export const useAcceptBookingRequest = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.acceptBookingRequest(id, response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request accepted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to accept booking request');
    },
  });
};

export const useRejectBookingRequest = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.rejectBookingRequest(id, reason);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request rejected successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reject booking request');
    },
  });
};

// Alias for backward compatibility
export const useApproveBooking = useAcceptBookingRequest;
export const useRejectBooking = useRejectBookingRequest;

// Update booking request (for students to modify their requests)
export const useUpdateBookingRequest = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BookingRequest> }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateBookingRequest(id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update booking request');
    },
  });
};

// Cancel booking request (for students to cancel their requests)
export const useCancelBookingRequest = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.cancelBookingRequest(id, reason);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request cancelled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel booking request');
    },
  });
};

// For now, useUpdateBookingStatus will use accept/reject based on status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: BookingStatus; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      
      // Use existing methods based on status
      if (status === BookingStatus.ACCEPTED) {
        return api.acceptBookingRequest(id);
      } else if (status === BookingStatus.REJECTED) {
        return api.rejectBookingRequest(id, reason);
      } else {
        throw new Error(`Unsupported booking status: ${status}`);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking status updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};

// =============================================================================
// NOTIFICATIONS HOOKS
// =============================================================================

export const useNotifications = (userId: string, isRead?: boolean) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.notifications(userId, isRead),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getNotifications(userId, isRead);
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.markNotificationAsRead(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.notifications(data.userId),
      });
      toast.success('Notification marked as read');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.markAllNotificationsAsRead(userId);
    },
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.notifications(userId),
      });
      toast.success('All notifications marked as read');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to mark notifications as read');
    },
  });
};

// =============================================================================
// ENABLE LIVE SESSIONS HOOK
// =============================================================================

export const useEnableLiveSessions = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.enableLiveSessions(userId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorProfile(data.userId),
      });
      toast.success('Live sessions enabled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to enable live sessions');
    },
  });
};

// =============================================================================
// INSTRUCTOR PROFILE HOOKS
// =============================================================================

export const useUpdateInstructorProfile = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<InstructorProfile> }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateInstructorProfile(userId, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorProfile(data.userId),
      });
      toast.success('Instructor profile updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update instructor profile');
    },
  });
};
