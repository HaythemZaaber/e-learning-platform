// =============================================================================
// SESSION BOOKING REACT QUERY HOOKS
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  sessionBookingApi, 
  getAuthenticatedSessionBookingApi,
  ApiError,
  CreateSessionBookingDto,
  ConfirmSessionBookingDto,
  CompleteSessionDto,
  SessionBookingFilterDto,
  CancelSessionBookingDto,
  RescheduleSessionDto,
  SessionBookingResponse,
  ConfirmBookingResponse,
  CompleteSessionResponse,
  MeetingInfoResponse,
  JoinSessionResponse,
  LeaveSessionResponse
} from '../services/api/sessionBookingApi';
import {
  BookingRequest,
  BookingStatus,
  SessionStatus,
  LiveSession,
} from '../types/session.types';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const sessionBookingKeys = {
  all: ['sessionBookings'] as const,
  lists: () => [...sessionBookingKeys.all, 'list'] as const,
  list: (filters: SessionBookingFilterDto) => [...sessionBookingKeys.lists(), filters] as const,
  details: () => [...sessionBookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionBookingKeys.details(), id] as const,
  instructorBookings: (instructorId: string, status?: BookingStatus) => 
    [...sessionBookingKeys.all, 'instructor', instructorId, status] as const,
  studentBookings: (studentId: string, status?: BookingStatus) => 
    [...sessionBookingKeys.all, 'student', studentId, status] as const,
  meetingInfo: (sessionId: string) => [...sessionBookingKeys.all, 'meeting', sessionId] as const,
  participants: (sessionId: string) => [...sessionBookingKeys.all, 'participants', sessionId] as const,
};

// =============================================================================
// BOOKING MANAGEMENT HOOKS
// =============================================================================

/**
 * Get session bookings with filters
 */
export const useSessionBookings = (filters: SessionBookingFilterDto = {}) => {
  const { getToken, isAuthenticated } = useAuth();
  

  
  return useQuery({
    queryKey: sessionBookingKeys.list(filters),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.getSessionBookings(filters, token);
    },
    enabled: (!!filters.instructorId || !!filters.studentId) && isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get session booking by ID
 */
export const useSessionBooking = (id: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: sessionBookingKeys.detail(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.getSessionBookingById(id, token);
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Create a new session booking with payment
 */
export const useCreateSessionBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (bookingData: CreateSessionBookingDto): Promise<SessionBookingResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.createSessionBooking(bookingData, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      // Invalidate all instructor bookings since we don't have the instructor ID in the response
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.studentBookings(data.bookingRequest?.studentId || '', undefined),
      });
      
      if (data.success) {
        toast.success('Session booking created successfully');
      } else {
        toast.error(data.error || 'Failed to create session booking');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create session booking');
    },
  });
};

/**
 * Confirm session booking after payment
 */
export const useConfirmSessionBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (confirmData: ConfirmSessionBookingDto): Promise<ConfirmBookingResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.confirmSessionBooking(confirmData, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Session booking confirmed successfully');
      } else {
        toast.error(data.error || 'Failed to confirm session booking');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to confirm session booking');
    },
  });
};

/**
 * Complete a live session and capture payment
 */
export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ sessionId, completeData }: { sessionId: string; completeData: CompleteSessionDto }): Promise<CompleteSessionResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.completeSession(sessionId, completeData, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Session completed successfully');
      } else {
        toast.error(data.error || 'Failed to complete session');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to complete session');
    },
  });
};

/**
 * Start a live session
 */
export const useStartSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.startSession(sessionId, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Session started successfully');
      } else {
        toast.error('Failed to start session');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to start session');
    },
  });
};

// =============================================================================
// BOOKING STATUS MANAGEMENT HOOKS
// =============================================================================

/**
 * Approve a pending session booking
 */
export const useApproveSessionBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, instructorMessage }: { id: string; instructorMessage?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.approveSessionBooking(id, instructorMessage, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Booking approved successfully');
      } else {
        toast.error('Failed to approve booking');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to approve booking');
    },
  });
};

/**
 * Reject a pending session booking
 */
export const useRejectSessionBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.rejectSessionBooking(id, reason, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Booking rejected successfully');
      } else {
        toast.error('Failed to reject booking');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reject booking');
    },
  });
};

/**
 * Cancel a session booking
 */
export const useCancelSessionBooking = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (cancelData: CancelSessionBookingDto) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.cancelSessionBooking(cancelData.bookingId, cancelData, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
};

/**
 * Reschedule a session booking
 */
export const useRescheduleSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (rescheduleData: RescheduleSessionDto) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.rescheduleSession(rescheduleData.bookingId, rescheduleData, token);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.details(),
      });
      
      if (data.success) {
        toast.success('Session rescheduled successfully');
      } else {
        toast.error('Failed to reschedule session');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to reschedule session');
    },
  });
};

// =============================================================================
// SESSION MANAGEMENT HOOKS
// =============================================================================

/**
 * Get meeting information for a session
 */
export const useMeetingInfo = (sessionId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: sessionBookingKeys.meetingInfo(sessionId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.getMeetingInfo(sessionId, token);
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get session participants
 */
export const useSessionParticipants = (sessionId: string) => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: sessionBookingKeys.participants(sessionId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.getSessionParticipants(sessionId, token);
    },
    enabled: !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Join a live session
 */
export const useJoinSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (sessionId: string): Promise<JoinSessionResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.joinSession(sessionId, token);
    },
    onSuccess: (data) => {
      // Invalidate participants query
      queryClient.invalidateQueries({
        queryKey: sessionBookingKeys.participants(data.meetingLink.split('/').pop() || ''),
      });
      
      if (data.success) {
        toast.success('Successfully joined session');
      } else {
        toast.error('Failed to join session');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to join session');
    },
  });
};

/**
 * Leave a live session
 */
export const useLeaveSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  
  return useMutation({
    mutationFn: async (sessionId: string): Promise<LeaveSessionResponse> => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      const api = getAuthenticatedSessionBookingApi(token);
      return api.leaveSession(sessionId, token);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Successfully left session');
      } else {
        toast.error('Failed to leave session');
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to leave session');
    },
  });
};

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Get instructor bookings
 */
export const useInstructorBookings = (instructorId: string, status?: BookingStatus) => {
  return useSessionBookings({ instructorId, status });
};

/**
 * Get student bookings
 */
export const useStudentBookings = (studentId: string, status?: BookingStatus) => {
  return useSessionBookings({ studentId, status });
};

/**
 * Get pending bookings for instructor
 */
export const usePendingBookings = (instructorId: string) => {
  return useInstructorBookings(instructorId, BookingStatus.PENDING);
};

/**
 * Get upcoming bookings for student
 */
export const useUpcomingBookings = (studentId: string) => {
  return useSessionBookings({ 
    studentId, 
    status: BookingStatus.ACCEPTED,
    startDate: new Date()
  });
};
