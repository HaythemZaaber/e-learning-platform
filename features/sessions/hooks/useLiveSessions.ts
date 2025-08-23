// =============================================================================
// LIVE SESSIONS REACT QUERY HOOKS
// =============================================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
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
  topicClusters: (sessionId: string) => [...liveSessionsKeys.liveSessions(), sessionId, 'topic-clusters'] as const,
};

// =============================================================================
// BOOKING REQUEST HOOKS
// =============================================================================

export const useBookingRequests = (instructorId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorBookingRequests(instructorId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getBookingRequests({ instructorId });
    },
    enabled: !!instructorId,
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookingId, instructorId }: { bookingId: string; instructorId: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.acceptBookingRequest(bookingId);
    },
    onSuccess: (data, { instructorId }) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorBookingRequests(instructorId),
      });
      toast.success('Booking request approved successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to approve booking request');
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookingId, instructorId, reason }: { bookingId: string; instructorId: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.rejectBookingRequest(bookingId, reason);
    },
    onSuccess: (data, { instructorId }) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorBookingRequests(instructorId),
      });
      toast.success('Booking request rejected');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reject booking request');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookingId, status, instructorId }: { bookingId: string; status: BookingStatus; instructorId: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateBookingRequest(bookingId, { status });
    },
    onSuccess: (data, { instructorId }) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorBookingRequests(instructorId),
      });
      toast.success('Booking status updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};

// =============================================================================
// LIVE SESSIONS HOOKS
// =============================================================================

export const useLiveSessions = (instructorId: string, status?: SessionStatus) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorLiveSessions(instructorId, status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSessions({ instructorId, status });
    },
    enabled: !!instructorId,
  });
};

export const useCreateSession = () => {
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
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      toast.success('Session created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create session');
    },
  });
};

export const useUpdateSession = () => {
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
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      toast.success('Session updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update session');
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.cancelLiveSession(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      toast.success('Session cancelled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel session');
    },
  });
};

export const useSessionAnalytics = (instructorId: string, startDate?: Date, endDate?: Date) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.sessionStats(instructorId, startDate, endDate),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionStats(instructorId, startDate, endDate);
    },
    enabled: !!instructorId,
  });
};

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

// =============================================================================
// STUDENT PROFILE HOOKS
// =============================================================================

export const useStudentProfile = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['studentProfile', userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getStudentProfile(userId);
    },
    enabled: !!userId,
  });
};

export const useStudentBookings = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['studentBookings', userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getStudentBookings(userId);
    },
    enabled: !!userId,
  });
};

export const useStudentSessions = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['studentSessions', userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getStudentSessions(userId);
    },
    enabled: !!userId,
  });
};

export const useStudentStats = (userId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['studentStats', userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getStudentStats(userId);
    },
    enabled: !!userId,
  });
};

// =============================================================================
// INSTRUCTOR PROFILE HOOKS
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

export const useCreateInstructorProfile = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (profile: Omit<InstructorProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createInstructorProfile(profile);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(liveSessionsKeys.instructorProfile(data.userId), data);
      toast.success('Instructor profile created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create instructor profile');
    },
  });
};

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
      queryClient.setQueryData(liveSessionsKeys.instructorProfile(data.userId), data);
      toast.success('Instructor profile updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update instructor profile');
    },
  });
};

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
      queryClient.setQueryData(liveSessionsKeys.instructorProfile(data.userId), data);
      toast.success('Live sessions enabled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to enable live sessions');
    },
  });
};

// =============================================================================
// AVAILABILITY HOOKS
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
    staleTime: 2 * 60 * 1000, // 2 minutes
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
      // Invalidate and refetch availability queries
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
      // Optimistically update the cache
      queryClient.setQueryData(
        liveSessionsKeys.instructorAvailability(data.instructorId),
        (old: InstructorAvailability[] | undefined) => {
          if (!old) return [data];
          return old.map(avail => avail.id === data.id ? data : avail);
        }
      );
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
    onSuccess: (_, id) => {
      // Optimistically remove from cache
      queryClient.setQueryData(
        liveSessionsKeys.availability(),
        (old: InstructorAvailability[] | undefined) => {
          if (!old) return [];
          return old.filter(avail => avail.id !== id);
        }
      );
      toast.success('Availability deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete availability');
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
    staleTime: 1 * 60 * 1000, // 1 minute
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
    onSuccess: (data, { instructorId }) => {
      // Invalidate time slots queries
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.availableTimeSlots(instructorId, new Date()),
      });
      toast.success(`${data.length} time slots generated successfully`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to generate time slots');
    },
  });
};

// =============================================================================
// SESSION TOPICS HOOKS
// =============================================================================

export const useSessionTopics = (instructorId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorTopics(instructorId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionTopics(instructorId);
    },
    enabled: !!instructorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSessionTopic = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (topic: Omit<SessionTopic, 'id' | 'createdAt' | 'updatedAt'>) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createSessionTopic(topic);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorTopics(data.instructorId),
      });
      toast.success('Session topic created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create session topic');
    },
  });
};

export const useUpdateSessionTopic = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SessionTopic> }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updateSessionTopic(id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorTopics(data.instructorId),
      });
      toast.success('Session topic updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update session topic');
    },
  });
};

export const useDeleteSessionTopic = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.deleteSessionTopic(id);
    },
    onSuccess: (_, id) => {
      // Invalidate topics queries
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.topics(),
      });
      toast.success('Session topic deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete session topic');
    },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSessionOffering = (id: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.offering(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionOffering(id);
    },
    enabled: !!id,
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
      // Update the specific offering in cache
      queryClient.setQueryData(liveSessionsKeys.offering(data.id), data);
      // Invalidate offerings list
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
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: liveSessionsKeys.offering(id),
      });
      // Invalidate offerings lists
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

export const useToggleOfferingActive = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.toggleOfferingActive(id);
    },
    onSuccess: (data) => {
      // Update cache optimistically
      queryClient.setQueryData(liveSessionsKeys.offering(data.id), data);
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorOfferings(data.instructorId),
      });
      toast.success(`Session offering ${data.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to toggle offering status');
    },
  });
};

// =============================================================================
// BOOKING REQUESTS HOOKS
// =============================================================================

export const useInstructorBookingRequests = (instructorId: string, status?: BookingStatus) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorBookingRequests(instructorId, status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getBookingRequests({ instructorId, status });
    },
    enabled: !!instructorId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useStudentBookingRequests = (studentId: string, status?: BookingStatus) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.studentBookingRequests(studentId, status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getBookingRequests({ studentId, status });
    },
    enabled: !!studentId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useBookingRequest = (id: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.bookingRequest(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getBookingRequest(id);
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
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
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorBookingRequests(data.offeringId),
      });
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.studentBookingRequests(data.studentId),
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
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.bookingRequest(data.id), data);
      // Invalidate lists
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
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.bookingRequest(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.bookingRequests(),
      });
      toast.success('Booking request rejected');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reject booking request');
    },
  });
};



// =============================================================================
// LIVE SESSIONS HOOKS
// =============================================================================

export const useInstructorLiveSessions = (instructorId: string, status?: SessionStatus) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.instructorLiveSessions(instructorId, status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSessions({ instructorId, status });
    },
    enabled: !!instructorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useStudentLiveSessions = (studentId: string, status?: SessionStatus) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.studentLiveSessions(studentId, status),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getLiveSessions({ studentId, status });
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
      // Invalidate sessions lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.instructorLiveSessions(data.instructorId),
      });
      toast.success('Live session created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create live session');
    },
  });
};

export const useStartLiveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.startLiveSession(id);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
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
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.endLiveSession(id, notes);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
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
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.cancelLiveSession(id, reason);
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(liveSessionsKeys.liveSession(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.liveSessions(),
      });
      toast.success('Live session cancelled successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel live session');
    },
  });
};

// =============================================================================
// PAYMENT HOOKS
// =============================================================================

export const useCreatePaymentIntent = () => {
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookingId, amount, currency }: { bookingId: string; amount: number; currency: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.createPaymentIntent(bookingId, amount, currency);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create payment intent');
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ paymentIntentId, status }: { paymentIntentId: string; status: PaymentStatus }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.updatePaymentStatus(paymentIntentId, status);
    },
    onSuccess: (data) => {
      // Invalidate payment-related queries
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.paymentIntents(),
      });
      toast.success('Payment status updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update payment status');
    },
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ bookingId, amount, reason }: { bookingId: string; amount: number; reason: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.processRefund(bookingId, amount, reason);
    },
    onSuccess: (data) => {
      // Invalidate payment queries
      queryClient.invalidateQueries({
        queryKey: liveSessionsKeys.sessionPayments(data.sessionId),
      });
      toast.success('Refund processed successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to process refund');
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
    staleTime: 30 * 1000, // 30 seconds
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
      // Update cache optimistically
      queryClient.setQueryData(
        liveSessionsKeys.notifications(data.userId),
        (old: SessionNotification[] | undefined) => {
          if (!old) return [data];
          return old.map(notif => notif.id === data.id ? data : notif);
        }
      );
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
    onSuccess: (_, userId) => {
      // Invalidate notifications queries
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
// ANALYTICS HOOKS
// =============================================================================

export const useSessionStats = (instructorId: string, startDate?: Date, endDate?: Date) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: liveSessionsKeys.sessionStats(instructorId, startDate, endDate),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.getSessionStats(instructorId, startDate, endDate);
    },
    enabled: !!instructorId,
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
// UTILITY HOOKS
// =============================================================================

export const useCheckTimeSlotAvailability = () => {
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
      return api.checkTimeSlotAvailability(instructorId, date, startTime, endTime);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to check time slot availability');
    },
  });
};

export const useCalculateSessionPrice = () => {
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ offeringId, sessionType, participantCount }: {
      offeringId: string;
      sessionType: SessionType;
      participantCount?: number;
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedLiveSessionsApi(token);
      return api.calculateSessionPrice(offeringId, sessionType, participantCount);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to calculate session price');
    },
  });
};
