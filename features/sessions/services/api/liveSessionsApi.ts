// =============================================================================
// LIVE SESSIONS API SERVICE
// =============================================================================

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
  StudentProfile,
  CreateLiveSessionDto,
  UpdateLiveSessionDto,
  CreateSessionOfferingDto,
  UpdateSessionOfferingDto,
  LiveSessionType,
  SessionMode,
  StartLiveSessionDto,
  EndLiveSessionDto,
  CancelLiveSessionDto,
  RescheduleLiveSessionDto,
  LiveSessionFilterDto,
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

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' }, token);
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  }

  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
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
// LIVE SESSIONS API SERVICE
// =============================================================================

class LiveSessionsApiService {
  private http: HttpClient;
  private token?: string;

  constructor(token?: string) {
    this.http = new HttpClient(API_BASE_URL);
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
  }

  // ============================================================================
  // STUDENT PROFILE MANAGEMENT
  // ============================================================================

  async getStudentProfile(userId: string): Promise<StudentProfile> {
    // TODO: Replace with actual API call
    return {
      id: `student-${userId}`,
      userId,
      preferredSubjects: ["React", "TypeScript", "Node.js"],
      learningGoals: ["Master React Hooks", "Learn TypeScript", "Build Full-Stack Apps"],
      skillLevel: "INTERMEDIATE",
      preferredSessionTypes: [SessionType.INDIVIDUAL, SessionType.SMALL_GROUP],
      preferredSessionFormats: [SessionFormat.ONLINE],
      totalSessions: 12,
      completedSessions: 10,
      totalLearningHours: 8.5,
      averageRating: 4.7,
      totalSpent: 450,
      learningStreak: 5,
      maxSessionPrice: 100,
      preferredTimeSlots: ["14:00", "16:00", "18:00"],
      timezone: "UTC-5",
      notificationPreferences: {
        email: true,
        push: true,
        sms: false
      },
      currentCourses: ["react-advanced", "typescript-fundamentals"],
      completedCourses: ["javascript-basics"],
      certificates: ["javascript-basics-cert"],
      achievements: ["first-session", "learning-streak-5"],
      favoriteInstructors: ["instructor-1", "instructor-2"],
      studyGroups: ["react-learners"],
      learningPartners: ["student-2", "student-3"],
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-15T00:00:00Z")
    };
  }

  async getStudentBookings(userId: string): Promise<BookingRequest[]> {
    // TODO: Replace with actual API call
    return [];
  }

  async getStudentSessions(userId: string): Promise<LiveSession[]> {
    // TODO: Replace with actual API call
    return [];
  }

  async getStudentStats(userId: string): Promise<any> {
    // TODO: Replace with actual API call
    return {
      totalSessions: 12,
      completedSessions: 10,
      totalHours: 8.5,
      averageRating: 4.7,
      totalSpent: 450,
      learningStreak: 5,
      favoriteInstructor: "Sarah Johnson",
      topSubject: "React Development",
      unreadNotifications: 3
    };
  }

  // ============================================================================
  // INSTRUCTOR PROFILE MANAGEMENT
  // ============================================================================

  async getInstructorProfile(userId: string): Promise<InstructorProfile> {
    return this.http.get<InstructorProfile>(`/instructor-profiles/${userId}`, undefined, this.token);
  }

  async createInstructorProfile(profile: Omit<InstructorProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstructorProfile> {
    return this.http.post<InstructorProfile>('/instructor-profiles', profile, this.token);
  }

  async updateInstructorProfile(userId: string, updates: Partial<InstructorProfile>): Promise<InstructorProfile> {
    return this.http.patch<InstructorProfile>(`/instructor-profiles/${userId}`, updates, this.token);
  }

  async enableLiveSessions(userId: string): Promise<InstructorProfile> {
    return this.http.patch<InstructorProfile>(`/instructor-profiles/${userId}/enable-live-sessions`, undefined, this.token);
  }

  // ============================================================================
  // AVAILABILITY MANAGEMENT
  // ============================================================================

  async getInstructorAvailability(instructorId: string, startDate?: Date, endDate?: Date): Promise<InstructorAvailability[]> {
    const params: Record<string, any> = { instructorId };
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.http.get<InstructorAvailability[]>('/instructor-availability', params, this.token);
  }

  async createAvailability(availability: Omit<InstructorAvailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstructorAvailability> {
    return this.http.post<InstructorAvailability>('/instructor-availability', availability, this.token);
  }

  async updateAvailability(id: string, updates: Partial<InstructorAvailability>): Promise<InstructorAvailability> {
    return this.http.patch<InstructorAvailability>(`/instructor-availability/${id}`, updates, this.token);
  }

  async deleteAvailability(id: string): Promise<void> {
    return this.http.delete<void>(`/instructor-availability/${id}`, this.token);
  }

  async generateTimeSlots(instructorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    return this.http.post<TimeSlot[]>('/instructor-availability/generate-slots', {
      instructorId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }, this.token);
  }

  async checkAvailability(instructorId: string, date: Date, startTime: string, endTime: string): Promise<{
    available: boolean;
    conflicts?: any[];
  }> {
    return this.http.post<{ available: boolean; conflicts?: any[] }>('/instructor-availability/check-availability', {
      instructorId,
      date: date.toISOString(),
      startTime,
      endTime,
    }, this.token);
  }

  async getAvailableTimeSlots(instructorId: string, date: Date, offeringId?: string): Promise<TimeSlot[]> {
    const params: Record<string, any> = { 
      instructorId, 
      date: date.toISOString() 
    };
    if (offeringId) params.offeringId = offeringId;
    
    return this.http.get<TimeSlot[]>('/instructor-availability/time-slots/available', params, this.token);
  }

  async blockTimeSlot(slotId: string, reason?: string): Promise<TimeSlot> {
    return this.http.patch<TimeSlot>(`/instructor-availability/time-slots/${slotId}/block`, { reason }, this.token);
  }

  async unblockTimeSlot(slotId: string): Promise<TimeSlot> {
    return this.http.patch<TimeSlot>(`/instructor-availability/time-slots/${slotId}/unblock`, undefined, this.token);
  }

  async getUpcomingAvailability(instructorId: string, days?: number): Promise<InstructorAvailability[]> {
    const params: Record<string, any> = {};
    if (days) params.days = days;
    
    return this.http.get<InstructorAvailability[]>(`/instructor-availability/${instructorId}/upcoming`, params, this.token);
  }

  async getAvailabilityStats(instructorId: string): Promise<{
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    blockedSlots: number;
    utilizationRate: number;
  }> {
    return this.http.get<{
      totalSlots: number;
      availableSlots: number;
      bookedSlots: number;
      blockedSlots: number;
      utilizationRate: number;
    }>(`/instructor-availability/${instructorId}/stats`, undefined, this.token);
  }

  // ============================================================================
  // SESSION TOPICS
  // ============================================================================

  async getSessionTopics(instructorId: string): Promise<SessionTopic[]> {
    return this.http.get<SessionTopic[]>(`/session-topics?instructorId=${instructorId}`, undefined, this.token);
  }

  async createSessionTopic(topic: Omit<SessionTopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionTopic> {
    return this.http.post<SessionTopic>('/session-topics', topic, this.token);
  }

  async updateSessionTopic(id: string, updates: Partial<SessionTopic>): Promise<SessionTopic> {
    return this.http.patch<SessionTopic>(`/session-topics/${id}`, updates, this.token);
  }

  async deleteSessionTopic(id: string): Promise<void> {
    return this.http.delete<void>(`/session-topics/${id}`, this.token);
  }

  // ============================================================================
  // SESSION OFFERINGS
  // ============================================================================

  async getSessionOfferings(filters?: {
    instructorId?: string;
    isActive?: boolean;
    sessionType?: SessionType;
    topicType?: SessionTopicType;
    category?: string;
    search?: string;
  }): Promise<SessionOffering[]> {
    return this.http.get<SessionOffering[]>('/session-offerings', filters, this.token);
  }

  async getSessionOffering(id: string): Promise<SessionOffering> {
    return this.http.get<SessionOffering>(`/session-offerings/${id}`, undefined, this.token);
  }

  async createSessionOffering(offering: CreateSessionOfferingDto): Promise<SessionOffering> {
    return this.http.post<SessionOffering>('/session-offerings', offering, this.token);
  }

  async updateSessionOffering(id: string, updates: UpdateSessionOfferingDto): Promise<SessionOffering> {
    return this.http.patch<SessionOffering>(`/session-offerings/${id}`, updates, this.token);
  }

  async deleteSessionOffering(id: string): Promise<void> {
    return this.http.delete<void>(`/session-offerings/${id}`, this.token);
  }

  async toggleOfferingActive(id: string): Promise<SessionOffering> {
    return this.http.patch<SessionOffering>(`/session-offerings/${id}/toggle-active`, undefined, this.token);
  }

  // ============================================================================
  // BOOKING REQUESTS
  // ============================================================================

  async getBookingRequests(filters?: {
    instructorId?: string;
    studentId?: string;
    status?: BookingStatus;
    offeringId?: string;
  }): Promise<BookingRequest[]> {
    return this.http.get<BookingRequest[]>('/booking-requests', filters, this.token);
  }

  async getBookingRequest(id: string): Promise<BookingRequest> {
    return this.http.get<BookingRequest>(`/booking-requests/${id}`, undefined, this.token);
  }

  async createBookingRequest(request: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingRequest> {
    return this.http.post<BookingRequest>('/booking-requests', request, this.token);
  }

  async updateBookingRequest(id: string, updates: Partial<BookingRequest>): Promise<BookingRequest> {
    return this.http.patch<BookingRequest>(`/booking-requests/${id}`, updates, this.token);
  }

  async acceptBookingRequest(id: string, response?: string): Promise<BookingRequest> {
    return this.http.patch<BookingRequest>(`/booking-requests/${id}/accept`, { response }, this.token);
  }

  async rejectBookingRequest(id: string, reason?: string): Promise<BookingRequest> {
    return this.http.patch<BookingRequest>(`/booking-requests/${id}/reject`, { reason }, this.token);
  }

  async cancelBookingRequest(id: string, reason?: string): Promise<BookingRequest> {
    return this.http.patch<BookingRequest>(`/booking-requests/${id}/cancel`, { reason }, this.token);
  }

  // ============================================================================
  // LIVE SESSIONS - ENHANCED WITH ALL BACKEND ROUTES
  // ============================================================================

  async getLiveSessions(filters?: LiveSessionFilterDto): Promise<LiveSession[]> {
    const params: Record<string, any> = {};
    
    if (filters?.instructorId) params.instructorId = filters.instructorId;
    if (filters?.studentId) params.studentId = filters.studentId;
    if (filters?.status) params.status = filters.status;
    if (filters?.sessionType) params.sessionType = filters.sessionType;
    if (filters?.format) params.format = filters.format;
    if (filters?.startDate) params.startDate = filters.startDate.toISOString();
    if (filters?.endDate) params.endDate = filters.endDate.toISOString();
    if (filters?.courseId) params.courseId = filters.courseId;
    if (filters?.topicId) params.topicId = filters.topicId;
    if (filters?.payoutStatus) params.payoutStatus = filters.payoutStatus;
    
    return this.http.get<LiveSession[]>('/live-sessions', params, this.token);
  }

  async getLiveSession(id: string): Promise<LiveSession> {
    return this.http.get<LiveSession>(`/live-sessions/${id}`, undefined, this.token);
  }

  async createLiveSession(session: CreateLiveSessionDto): Promise<LiveSession> {
    return this.http.post<LiveSession>('/live-sessions', session, this.token);
  }

  async updateLiveSession(id: string, updates: UpdateLiveSessionDto): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/live-sessions/${id}`, updates, this.token);
  }

  async startLiveSession(id: string, startData?: StartLiveSessionDto): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/live-sessions/${id}/start`, startData, this.token);
  }

  async endLiveSession(id: string, endData?: EndLiveSessionDto): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/live-sessions/${id}/end`, endData, this.token);
  }

  async cancelLiveSession(id: string, cancelData?: CancelLiveSessionDto): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/live-sessions/${id}/cancel`, cancelData, this.token);
  }

  async rescheduleLiveSession(id: string, rescheduleData: RescheduleLiveSessionDto): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/live-sessions/${id}/reschedule`, rescheduleData, this.token);
  }

  // ============================================================================
  // PARTICIPANT MANAGEMENT
  // ============================================================================

  async addParticipant(sessionId: string, participantData: { userId: string; role?: string }): Promise<any> {
    return this.http.post<any>(`/live-sessions/${sessionId}/participants`, participantData, this.token);
  }

  async removeParticipant(sessionId: string, userId: string): Promise<any> {
    return this.http.delete<any>(`/live-sessions/${sessionId}/participants/${userId}`, this.token);
  }

  async getSessionParticipants(sessionId: string): Promise<any[]> {
    return this.http.get<any[]>(`/live-sessions/${sessionId}/participants`, undefined, this.token);
  }

  // ============================================================================
  // ATTENDANCE MANAGEMENT
  // ============================================================================

  async getSessionAttendance(sessionId: string): Promise<any[]> {
    return this.http.get<any[]>(`/live-sessions/${sessionId}/attendance`, undefined, this.token);
  }

  async updateAttendance(
    sessionId: string, 
    userId: string, 
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
  ): Promise<any> {
    return this.http.patch<any>(`/live-sessions/${sessionId}/attendance/${userId}`, attendanceData, this.token);
  }

  // ============================================================================
  // SESSION STATISTICS
  // ============================================================================

  async getSessionStats(
    instructorId?: string, 
    studentId?: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<SessionStats> {
    const params: Record<string, any> = {};
    if (instructorId) params.instructorId = instructorId;
    if (studentId) params.studentId = studentId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.http.get<SessionStats>('/live-sessions/stats/summary', params, this.token);
  }

  async getUpcomingSessions(
    instructorId?: string, 
    studentId?: string, 
    days?: number
  ): Promise<LiveSession[]> {
    const params: Record<string, any> = {};
    if (instructorId) params.instructorId = instructorId;
    if (studentId) params.studentId = studentId;
    if (days) params.days = days;
    
    return this.http.get<LiveSession[]>('/live-sessions/upcoming', params, this.token);
  }

  // ============================================================================
  // SESSION RESERVATIONS
  // ============================================================================

  async getSessionReservations(sessionId: string): Promise<SessionReservation[]> {
    return this.http.get<SessionReservation[]>(`/live-sessions/${sessionId}/reservations`, undefined, this.token);
  }

  async createSessionReservation(reservation: Omit<SessionReservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionReservation> {
    // TODO: Replace with actual API call
    // For now, return mock data for testing
    const mockReservation: SessionReservation = {
      id: `reservation-${Date.now()}`,
      sessionId: reservation.sessionId,
      learnerId: reservation.learnerId,
      status: reservation.status,
      paymentStatus: reservation.paymentStatus,
      paymentDue: reservation.paymentDue,
      attendance: reservation.attendance,
      joinedAt: reservation.joinedAt,
      leftAt: reservation.leftAt,
      totalTime: reservation.totalTime,
      requestedTopic: reservation.requestedTopic,
      learnerNotes: reservation.learnerNotes,
      instructorNotes: reservation.instructorNotes,
      agreedPrice: reservation.agreedPrice,
      currency: reservation.currency,
      reservedAt: reservation.reservedAt,
      confirmedAt: reservation.confirmedAt,
      cancelledAt: reservation.cancelledAt,
      completedAt: reservation.completedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return mockReservation;
  }

  async updateSessionReservation(id: string, updates: Partial<SessionReservation>): Promise<SessionReservation> {
    return this.http.patch<SessionReservation>(`/session-reservations/${id}`, updates, this.token);
  }

  async cancelSessionReservation(id: string, reason?: string): Promise<SessionReservation> {
    return this.http.patch<SessionReservation>(`/session-reservations/${id}/cancel`, { reason }, this.token);
  }

  // ============================================================================
  // PAYMENT MANAGEMENT
  // ============================================================================

  async createPaymentIntent(bookingId: string, amount: number, currency: string): Promise<PaymentIntent> {
    return this.http.post<PaymentIntent>('/payment-intents', {
      bookingId,
      amount,
      currency,
    }, this.token);
  }

  async updatePaymentStatus(paymentIntentId: string, status: PaymentStatus): Promise<PaymentIntent> {
    return this.http.patch<PaymentIntent>(`/payment-intents/${paymentIntentId}`, { status }, this.token);
  }

  async processRefund(bookingId: string, amount: number, reason: string): Promise<SessionPayment> {
    return this.http.post<SessionPayment>('/payments/refund', {
      bookingId,
      amount,
      reason,
    }, this.token);
  }

  async getSessionPayments(sessionId: string): Promise<SessionPayment[]> {
    return this.http.get<SessionPayment[]>(`/live-sessions/${sessionId}/payments`, undefined, this.token);
  }

  // ============================================================================
  // PAYOUT MANAGEMENT
  // ============================================================================

  async getInstructorPayouts(instructorId: string, status?: PayoutStatus): Promise<InstructorPayout[]> {
    const params: Record<string, any> = { instructorId };
    if (status) params.status = status;
    
    return this.http.get<InstructorPayout[]>('/instructor-payouts', params, this.token);
  }

  async createPayout(instructorId: string, sessionIds: string[]): Promise<InstructorPayout> {
    return this.http.post<InstructorPayout>('/instructor-payouts', {
      instructorId,
      sessionIds,
    }, this.token);
  }

  async updatePayoutStatus(payoutId: string, status: PayoutStatus): Promise<InstructorPayout> {
    return this.http.patch<InstructorPayout>(`/instructor-payouts/${payoutId}`, { status }, this.token);
  }

  // ============================================================================
  // SESSION REVIEWS
  // ============================================================================

  async getSessionReviews(sessionId: string): Promise<SessionReview[]> {
    return this.http.get<SessionReview[]>(`/live-sessions/${sessionId}/reviews`, undefined, this.token);
  }

  async createSessionReview(review: Omit<SessionReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionReview> {
    return this.http.post<SessionReview>('/session-reviews', review, this.token);
  }

  async updateSessionReview(id: string, updates: Partial<SessionReview>): Promise<SessionReview> {
    return this.http.patch<SessionReview>(`/session-reviews/${id}`, updates, this.token);
  }

  async deleteSessionReview(id: string): Promise<void> {
    return this.http.delete<void>(`/session-reviews/${id}`, this.token);
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  async getNotifications(userId: string, isRead?: boolean): Promise<SessionNotification[]> {
    const params: Record<string, any> = { userId };
    if (isRead !== undefined) params.isRead = isRead;
    
    return this.http.get<SessionNotification[]>('/session-notifications', params, this.token);
  }

  async markNotificationAsRead(id: string): Promise<SessionNotification> {
    return this.http.patch<SessionNotification>(`/session-notifications/${id}/read`, undefined, this.token);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    return this.http.patch<void>(`/session-notifications/mark-all-read`, { userId }, this.token);
  }

  // ============================================================================
  // ANALYTICS & STATISTICS
  // ============================================================================

  async getAIInsights(instructorId: string): Promise<AIInsight[]> {
    return this.http.get<AIInsight[]>(`/ai-insights?instructorId=${instructorId}`, undefined, this.token);
  }

  // ============================================================================
  // TOPIC REQUESTS & CLUSTERING
  // ============================================================================

  async getTopicRequests(sessionId: string): Promise<TopicRequest[]> {
    return this.http.get<TopicRequest[]>(`/live-sessions/${sessionId}/topic-requests`, undefined, this.token);
  }

  async createTopicRequest(request: Omit<TopicRequest, 'id' | 'createdAt'>): Promise<TopicRequest> {
    return this.http.post<TopicRequest>('/topic-requests', request, this.token);
  }

  async getTopicClusters(sessionId: string): Promise<TopicCluster[]> {
    return this.http.get<TopicCluster[]>(`/live-sessions/${sessionId}/topic-clusters`, undefined, this.token);
  }

  async finalizeSessionTopic(sessionId: string, finalTopic: string): Promise<any> {
    return this.http.patch<any>(`/live-sessions/${sessionId}/finalize-topic`, { finalTopic }, this.token);
  }

  // ============================================================================
  // UTILITY ENDPOINTS
  // ============================================================================

  async checkTimeSlotAvailability(
    instructorId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<{ available: boolean; conflicts?: any[] }> {
    return this.http.post<{ available: boolean; conflicts?: any[] }>('/time-slots/check-availability', {
      instructorId,
      date: date.toISOString(),
      startTime,
      endTime,
    }, this.token);
  }

  async getCancellationPolicy(policy: CancellationPolicy): Promise<{
    freeCancellationHours: number;
    partialRefundHours: number;
    noRefundHours: number;
  }> {
    return this.http.get<any>(`/cancellation-policies/${policy}`, undefined, this.token);
  }

  async calculateSessionPrice(
    offeringId: string,
    sessionType: SessionType,
    participantCount?: number
  ): Promise<{
    basePrice: number;
    finalPrice: number;
    platformFee: number;
    instructorPayout: number;
  }> {
    return this.http.post<any>('/pricing/calculate', {
      offeringId,
      sessionType,
      participantCount,
    }, this.token);
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const liveSessionsApi = new LiveSessionsApiService();

// Helper function to get authenticated API instance
export const getAuthenticatedLiveSessionsApi = (token: string) => {
  const api = new LiveSessionsApiService(token);
  return api;
};

export { ApiError };
