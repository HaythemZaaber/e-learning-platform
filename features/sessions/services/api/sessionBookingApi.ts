// =============================================================================
// SESSION BOOKING API SERVICE
// =============================================================================

import {
  BookingRequest,
  BookingStatus,
  PaymentStatus,
  SessionStatus,
  LiveSession,
  TimeSlot,
  SessionOffering,
} from '../../types/session.types';

// =============================================================================
// API CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// =============================================================================
// HTTP CLIENT
// =============================================================================

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  }

  async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

// =============================================================================
// SESSION BOOKING API
// =============================================================================

export interface CreateSessionBookingDto {
  timeSlotId: string;
  offeringId: string;
  studentId: string;
  customTopic?: string;
  studentMessage?: string;
  customRequirements?: string;
  agreedPrice: number;
  currency: string;
  paymentMethodId?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface ConfirmSessionBookingDto {
  bookingId: string;
  paymentIntentId?: string; // Optional since we might only have stripeSessionId
  stripeSessionId?: string;
  checkoutSessionId?: string; // Alternative field name
}

export interface CompleteSessionDto {
  sessionId?: string; // Optional since it's passed as URL parameter
  summary?: string;
  instructorNotes?: string;
  sessionArtifacts?: string[];
  actualDuration?: number;
}

export interface SessionBookingFilterDto {
  instructorId?: string;
  studentId?: string;
  status?: BookingStatus;
  offeringId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CancelSessionBookingDto {
  bookingId: string;
  reason?: string;
  processRefund?: boolean;
}

export interface RescheduleSessionDto {
  bookingId: string;
  newTimeSlotId: string;
  reason?: string;
}

export interface SessionBookingResponse {
  success: boolean;
  bookingRequest?: BookingRequest;
  paymentIntent?: {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
  };
  checkoutSession?: {
    id: string;
    url: string;
  };
  autoApproved?: boolean;
  liveSession?: LiveSession;
  error?: string;
}

export interface ConfirmBookingResponse {
  success: boolean;
  liveSession?: LiveSession;
  paymentIntent?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

export interface CompleteSessionResponse {
  success: boolean;
  session?: LiveSession;
  paymentCaptured?: boolean;
  error?: string;
}

export interface MeetingInfoResponse {
  meetingRoomId: string;
  meetingLink: string;
  meetingPassword?: string;
  joinInstructions: string;
}

export interface JoinSessionResponse {
  success: boolean;
  meetingLink: string;
  joinedAt: Date;
}

export interface LeaveSessionResponse {
  success: boolean;
  leftAt: Date;
}

export class SessionBookingApi {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient(API_BASE_URL);
  }

  // =============================================================================
  // BOOKING MANAGEMENT
  // =============================================================================

  /**
   * Create a new session booking with payment
   */
  async createSessionBooking(
    bookingData: CreateSessionBookingDto,
    token: string
  ): Promise<SessionBookingResponse> {
    return this.http.post<SessionBookingResponse>(
      '/session-bookings',
      bookingData,
      token
    );
  }

  /**
   * Confirm session booking after payment
   */
  async confirmSessionBooking(
    confirmData: ConfirmSessionBookingDto,
    token: string
  ): Promise<ConfirmBookingResponse> {
    return this.http.post<ConfirmBookingResponse>(
      '/session-bookings/confirm',
      confirmData,
      token
    );
  }

  /**
   * Complete a live session and capture payment
   */
  async completeSession(
    sessionId: string,
    completeData: CompleteSessionDto,
    token: string
  ): Promise<CompleteSessionResponse> {
    return this.http.patch<CompleteSessionResponse>(
      `/session-bookings/sessions/${sessionId}/complete`,
      completeData,
      token
    );
  }

  /**
   * Start a live session
   */
  async startSession(sessionId: string, token: string): Promise<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `/session-bookings/sessions/${sessionId}/start`,
      {},
      token
    );
  }

  /**
   * Get session bookings with filters
   */
  async getSessionBookings(
    filters: SessionBookingFilterDto = {},
    token: string
  ): Promise<BookingRequest[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          queryParams.append(key, value.toISOString());
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const endpoint = `/session-bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.get<BookingRequest[]>(endpoint, token);
  }

  /**
   * Get session booking by ID
   */
  async getSessionBookingById(id: string, token: string): Promise<BookingRequest> {
    return this.http.get<BookingRequest>(`/session-bookings/${id}`, token);
  }

  /**
   * Approve a pending session booking
   */
  async approveSessionBooking(
    id: string,
    instructorMessage?: string,
    token?: string
  ): Promise<{ success: boolean; message: string; bookingRequest: BookingRequest; liveSession?: LiveSession }> {
    return this.http.patch<{ success: boolean; message: string; bookingRequest: BookingRequest; liveSession?: LiveSession }>(
      `/session-bookings/${id}/approve`,
      { instructorMessage },
      token
    );
  }

  /**
   * Reject a pending session booking
   */
  async rejectSessionBooking(
    id: string,
    reason?: string,
    token?: string
  ): Promise<{ success: boolean; message: string; bookingRequest: BookingRequest }> {
    return this.http.patch<{ success: boolean; message: string; bookingRequest: BookingRequest }>(
      `/session-bookings/${id}/reject`,
      { reason },
      token
    );
  }

  /**
   * Cancel a session booking
   */
  async cancelSessionBooking(
    id: string,
    cancelData: CancelSessionBookingDto,
    token: string
  ): Promise<{ success: boolean; message: string; refundProcessed: boolean }> {
    return this.http.patch<{ success: boolean; message: string; refundProcessed: boolean }>(
      `/session-bookings/${id}/cancel`,
      cancelData,
      token
    );
  }

  /**
   * Reschedule a session booking
   */
  async rescheduleSession(
    id: string,
    rescheduleData: RescheduleSessionDto,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `/session-bookings/${id}/reschedule`,
      rescheduleData,
      token
    );
  }

  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  /**
   * Get meeting information for a session
   */
  async getMeetingInfo(sessionId: string, token: string): Promise<MeetingInfoResponse> {
    return this.http.get<MeetingInfoResponse>(
      `/session-bookings/sessions/${sessionId}/meeting-info`,
      token
    );
  }

  /**
   * Get session participants
   */
  async getSessionParticipants(sessionId: string, token: string): Promise<any[]> {
    return this.http.get<any[]>(
      `/session-bookings/sessions/${sessionId}/participants`,
      token
    );
  }

  /**
   * Join a live session
   */
  async joinSession(sessionId: string, token: string): Promise<JoinSessionResponse> {
    return this.http.post<JoinSessionResponse>(
      `/session-bookings/sessions/${sessionId}/join`,
      {},
      token
    );
  }

  /**
   * Leave a live session
   */
  async leaveSession(sessionId: string, token: string): Promise<LeaveSessionResponse> {
    return this.http.post<LeaveSessionResponse>(
      `/session-bookings/sessions/${sessionId}/leave`,
      {},
      token
    );
  }

  // =============================================================================
  // WEBHOOK HANDLERS
  // =============================================================================

  /**
   * Handle Stripe webhook for payment events
   */
  async handleStripeWebhook(event: any): Promise<{ received: boolean }> {
    return this.http.post<{ received: boolean }>(
      '/session-bookings/webhook/stripe',
      event
    );
  }
}

// =============================================================================
// API INSTANCES
// =============================================================================

export const sessionBookingApi = new SessionBookingApi();

export const getAuthenticatedSessionBookingApi = (token: string) => {
  return sessionBookingApi;
};

export { ApiError };

