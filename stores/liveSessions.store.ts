import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  InstructorAvailability,
  SessionOffering,
  LiveSession,
  BookingRequest,
  TimeSlot,
  WeeklySchedule,
  SessionNotification,
  PaymentIntent,
  InstructorPayout,
  SessionStats,
  PriceRule,
  SessionStatus,
  BookingStatus,
  PaymentStatus,
  PayoutStatus,
  SessionTopicType,
  SessionType,
  SessionFormat,
  SessionMode,
  LiveSessionType,
  CancellationPolicy,
} from '@/features/sessions/types/session.types';

interface LiveSessionsState {
  // Core data
  availability: InstructorAvailability[];
  offerings: SessionOffering[];
  liveSessions: LiveSession[];
  bookingRequests: BookingRequest[];
  timeSlots: TimeSlot[];
  weeklySchedules: WeeklySchedule[];
  notifications: SessionNotification[];
  paymentIntents: PaymentIntent[];
  payouts: InstructorPayout[];
  stats: SessionStats;
  priceRules: PriceRule[];

  // UI state
  isLoading: boolean;
  error: string | null;
  selectedDate: Date;
  selectedOffering: SessionOffering | null;
  selectedSession: LiveSession | null;
  isAvailabilityModalOpen: boolean;
  isOfferingModalOpen: boolean;
  isBookingModalOpen: boolean;
  isPaymentModalOpen: boolean;
  isSessionModalOpen: boolean;
  viewMode: 'calendar' | 'list' | 'grid';

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedOffering: (offering: SessionOffering | null) => void;
  setSelectedSession: (session: LiveSession | null) => void;
  toggleAvailabilityModal: () => void;
  toggleOfferingModal: () => void;
  toggleBookingModal: () => void;
  togglePaymentModal: () => void;
  toggleSessionModal: () => void;
  setViewMode: (mode: 'calendar' | 'list' | 'grid') => void;

  // Availability management
  addAvailability: (availability: Omit<InstructorAvailability, 'id'>) => void;
  updateAvailability: (id: string, updates: Partial<InstructorAvailability>) => void;
  deleteAvailability: (id: string) => void;
  getAvailabilityForDay: (dayOfWeek: number) => InstructorAvailability[];

  // Offerings management
  addOffering: (offering: Omit<SessionOffering, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOffering: (id: string, updates: Partial<SessionOffering>) => void;
  deleteOffering: (id: string) => void;
  toggleOfferingActive: (id: string) => void;
  getActiveOfferings: () => SessionOffering[];

  // Live sessions management
  createLiveSession: (session: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLiveSession: (id: string, updates: Partial<LiveSession>) => void;
  cancelLiveSession: (id: string, reason?: string) => void;
  completeLiveSession: (id: string, notes?: string) => void;
  getUpcomingSessions: () => LiveSession[];
  getCompletedSessions: () => LiveSession[];

  // Booking management
  createBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'expiresAt'>) => void;
  updateBookingRequest: (id: string, updates: Partial<BookingRequest>) => void;
  acceptBookingRequest: (id: string) => void;
  rejectBookingRequest: (id: string, reason?: string) => void;
  cancelBookingRequest: (id: string, reason?: string) => void;
  getPendingRequests: () => BookingRequest[];

  // Time slot management
  generateTimeSlots: (startDate: Date, endDate: Date) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  getAvailableTimeSlots: (date: Date, offeringId?: string) => TimeSlot[];

  // Payment management
  createPaymentIntent: (bookingId: string, amount: number, currency: string) => Promise<PaymentIntent>;
  updatePaymentStatus: (paymentIntentId: string, status: PaymentIntent['status']) => void;
  processRefund: (bookingId: string, amount: number, reason: string) => void;

  // Payout management
  createPayout: (instructorId: string, sessionIds: string[]) => void;
  updatePayoutStatus: (payoutId: string, status: InstructorPayout['status']) => void;
  getPendingPayouts: () => InstructorPayout[];

  // Notifications
  addNotification: (notification: Omit<SessionNotification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotifications: () => SessionNotification[];

  // Stats and analytics
  updateStats: (updates: Partial<SessionStats>) => void;
  calculateEarnings: (startDate: Date, endDate: Date) => number;
  getPopularTimeSlots: () => string[];

  // Utility functions
  isTimeSlotAvailable: (date: Date, time: string, offeringId?: string) => boolean;
  canBookSession: (offeringId: string, date: Date, time: string) => boolean;
  getSessionPrice: (offeringId: string, isGroup?: boolean) => number;
  formatDuration: (minutes: number) => string;
  formatPrice: (amount: number, currency: string) => string;
}

const initialState = {
  // Core data
  availability: [
    {
      id: 'avail-1',
      instructorId: 'instructor-1',
      specificDate: new Date('2024-01-15'),
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
      maxSessionsInSlot: 1,
      defaultSlotDuration: 60,
      minAdvanceHours: 12,
      bufferMinutes: 15,
      timezone: 'America/New_York',
      autoAcceptBookings: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'avail-2',
      instructorId: 'instructor-1',
      specificDate: new Date('2024-01-16'),
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
      maxSessionsInSlot: 1,
      defaultSlotDuration: 60,
      minAdvanceHours: 12,
      bufferMinutes: 15,
      timezone: 'America/New_York',
      autoAcceptBookings: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'avail-3',
      instructorId: 'instructor-2',
      specificDate: new Date('2024-01-15'),
      startTime: '10:00',
      endTime: '18:00',
      isActive: true,
      maxSessionsInSlot: 5,
      defaultSlotDuration: 90,
      minAdvanceHours: 12,
      bufferMinutes: 15,
      timezone: 'America/New_York',
      autoAcceptBookings: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  offerings: [
    {
      id: 'sample-1',
      instructorId: 'instructor-1',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns including custom hooks, context optimization, and performance techniques.',
      shortDescription: 'Master advanced React development patterns',
      topicType: SessionTopicType.FIXED,
      sessionType: SessionType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      duration: 60,
      capacity: 1,
      basePrice: 75,
      currency: 'USD',
      isActive: true,
      isPublic: true,
      requiresApproval: false,
      recordingEnabled: true,
      whiteboardEnabled: true,
      chatEnabled: true,
      screenShareEnabled: true,
      cancellationPolicy: CancellationPolicy.MODERATE,
      materials: ['React documentation', 'Code examples'],
      tags: ['React', 'JavaScript', 'Frontend'],
      prerequisites: ['Basic React knowledge', 'JavaScript fundamentals'],
      equipment: ['Computer with internet', 'Code editor'],
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'sample-2',
      instructorId: 'instructor-2',
      title: 'Data Science Fundamentals',
      description: 'Introduction to data science concepts, Python programming, and basic machine learning algorithms.',
      shortDescription: 'Get started with data science and Python',
      topicType: SessionTopicType.FLEXIBLE,
      domain: 'Data Science',
      sessionType: SessionType.SMALL_GROUP,
      sessionFormat: SessionFormat.ONLINE,
      duration: 90,
      capacity: 5,
      basePrice: 50,
      currency: 'USD',
      isActive: true,
      isPublic: true,
      requiresApproval: false,
      recordingEnabled: true,
      whiteboardEnabled: true,
      chatEnabled: true,
      screenShareEnabled: true,
      cancellationPolicy: CancellationPolicy.MODERATE,
      materials: ['Python documentation', 'Jupyter notebooks'],
      tags: ['Python', 'Data Science', 'Machine Learning'],
      prerequisites: ['Basic programming knowledge'],
      equipment: ['Computer with Python installed'],
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  liveSessions: [],
  bookingRequests: [],
  timeSlots: [],
  weeklySchedules: [],
  notifications: [],
  paymentIntents: [],
  payouts: [],
  stats: {
    pendingRequests: 0,
    totalEarnings: 0,
    upcomingSessions: 0,
    completionRate: 0,
    averageBid: 0,
    popularTimeSlots: [],
    totalSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    averageRating: 0,
    totalLearners: 0,
    totalStudents: 0,
    totalPayouts: 0,
    pendingPayouts: 0,
  },
  priceRules: [],

  // UI state
  isLoading: false,
  error: null,
  selectedDate: new Date(),
  selectedOffering: null,
  selectedSession: null,
  isAvailabilityModalOpen: false,
  isOfferingModalOpen: false,
  isBookingModalOpen: false,
  isPaymentModalOpen: false,
  isSessionModalOpen: false,
  viewMode: 'calendar' as const,
};

export const useLiveSessionsStore = create<LiveSessionsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // UI Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setSelectedDate: (date) => set({ selectedDate: date }),
        setSelectedOffering: (offering) => set({ selectedOffering: offering }),
        setSelectedSession: (session) => set({ selectedSession: session }),
        toggleAvailabilityModal: () => set((state) => ({ isAvailabilityModalOpen: !state.isAvailabilityModalOpen })),
        toggleOfferingModal: () => set((state) => ({ isOfferingModalOpen: !state.isOfferingModalOpen })),
        toggleBookingModal: () => set((state) => ({ isBookingModalOpen: !state.isBookingModalOpen })),
        togglePaymentModal: () => set((state) => ({ isPaymentModalOpen: !state.isPaymentModalOpen })),
        toggleSessionModal: () => set((state) => ({ isSessionModalOpen: !state.isSessionModalOpen })),
        setViewMode: (mode) => set({ viewMode: mode }),

        // Availability management
        addAvailability: (availability) => {
          const newAvailability: InstructorAvailability = {
            ...availability,
            id: `avail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          set((state) => ({
            availability: [...state.availability, newAvailability],
          }));
        },

        updateAvailability: (id, updates) => {
          set((state) => ({
            availability: state.availability.map((avail) =>
              avail.id === id ? { ...avail, ...updates } : avail
            ),
          }));
        },

        deleteAvailability: (id) => {
          set((state) => ({
            availability: state.availability.filter((avail) => avail.id !== id),
          }));
        },

        getAvailabilityForDay: (dayOfWeek) => {
          const { availability } = get();
          // Filter by specific date instead of dayOfWeek since availability uses specificDate
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return availability.filter((avail) => {
            const availDate = new Date(avail.specificDate);
            availDate.setHours(0, 0, 0, 0);
            return availDate.getTime() === today.getTime() && avail.isActive;
          });
        },

        // Offerings management
        addOffering: (offering) => {
          const newOffering: SessionOffering = {
            ...offering,
            id: `offering_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            offerings: [...state.offerings, newOffering],
          }));
        },

        updateOffering: (id, updates) => {
          set((state) => ({
            offerings: state.offerings.map((offering) =>
              offering.id === id ? { ...offering, ...updates, updatedAt: new Date() } : offering
            ),
          }));
        },

        deleteOffering: (id) => {
          set((state) => ({
            offerings: state.offerings.filter((offering) => offering.id !== id),
          }));
        },

        toggleOfferingActive: (id) => {
          set((state) => ({
            offerings: state.offerings.map((offering) =>
              offering.id === id ? { ...offering, isActive: !offering.isActive, updatedAt: new Date() } : offering
            ),
          }));
        },

        getActiveOfferings: () => {
          const { offerings } = get();
          return offerings.filter((offering) => offering.isActive);
        },

        // Live sessions management
        createLiveSession: (session) => {
          const newSession: LiveSession = {
            ...session,
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            liveSessions: [...state.liveSessions, newSession],
          }));
        },

        updateLiveSession: (id, updates) => {
          set((state) => ({
            liveSessions: state.liveSessions.map((session) =>
              session.id === id ? { ...session, ...updates, updatedAt: new Date() } : session
            ),
          }));
        },

        cancelLiveSession: (id, reason) => {
          set((state) => ({
            liveSessions: state.liveSessions.map((session) =>
              session.id === id
                ? { ...session, status: SessionStatus.CANCELLED, updatedAt: new Date() }
                : session
            ),
          }));
        },

        completeLiveSession: (id, notes) => {
          set((state) => ({
            liveSessions: state.liveSessions.map((session) =>
              session.id === id
                ? { ...session, status: SessionStatus.COMPLETED, instructorNotes: notes, updatedAt: new Date() }
                : session
            ),
          }));
        },

        getUpcomingSessions: () => {
          const { liveSessions } = get();
          const now = new Date();
          return liveSessions.filter(
            (session) => session.scheduledStart > now && session.status === SessionStatus.SCHEDULED
          );
        },

        getCompletedSessions: () => {
          const { liveSessions } = get();
          return liveSessions.filter((session) => session.status === SessionStatus.COMPLETED);
        },

        // Booking management
        createBookingRequest: (request) => {
          const newRequest: BookingRequest = {
            ...request,
            id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          };
          set((state) => ({
            bookingRequests: [...state.bookingRequests, newRequest],
          }));
        },

        updateBookingRequest: (id, updates) => {
          set((state) => ({
            bookingRequests: state.bookingRequests.map((request) =>
              request.id === id ? { ...request, ...updates } : request
            ),
          }));
        },

        acceptBookingRequest: (id) => {
          set((state) => ({
            bookingRequests: state.bookingRequests.map((request) =>
              request.id === id ? { ...request, status: BookingStatus.ACCEPTED } : request
            ),
          }));
        },

        rejectBookingRequest: (id, reason) => {
          set((state) => ({
            bookingRequests: state.bookingRequests.map((request) =>
              request.id === id ? { ...request, status: BookingStatus.REJECTED } : request
            ),
          }));
        },

        cancelBookingRequest: (id, reason) => {
          set((state) => ({
            bookingRequests: state.bookingRequests.map((request) =>
              request.id === id ? { ...request, status: BookingStatus.CANCELLED, refundReason: reason } : request
            ),
          }));
        },

        getPendingRequests: () => {
          const { bookingRequests } = get();
          return bookingRequests.filter((request) => request.status === BookingStatus.PENDING);
        },

        // Time slot management
        generateTimeSlots: (startDate, endDate) => {
          const { availability, offerings } = get();
          const timeSlots: TimeSlot[] = [];
          
          // Generate time slots based on availability and offerings
          // This is a simplified implementation
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            const dayAvailability = availability.filter(
              (avail) => {
                const availDate = new Date(avail.specificDate);
                return availDate.getDay() === dayOfWeek && avail.isActive;
              }
            );

            dayAvailability.forEach((avail) => {
              const startTime = new Date(currentDate);
              const [startHour, startMinute] = avail.startTime.split(':').map(Number);
              startTime.setHours(startHour, startMinute, 0, 0);

              const endTime = new Date(currentDate);
              const [endHour, endMinute] = avail.endTime.split(':').map(Number);
              endTime.setHours(endHour, endMinute, 0, 0);

              // Generate 30-minute slots
              while (startTime < endTime) {
                const slotEnd = new Date(startTime.getTime() + 30 * 60 * 1000);
                if (slotEnd <= endTime) {
                  timeSlots.push({
                    id: `slot_${startTime.getTime()}`,
                    availabilityId: avail.id,
                    startTime: new Date(startTime),
                    endTime: slotEnd,
                    date: new Date(currentDate),
                    dayOfWeek: currentDate.getDay(),
                    slotDuration: 30,
                    isAvailable: true,
                    isBooked: false,
                    isBlocked: false,
                    maxBookings: avail.maxSessionsInSlot,
                    currentBookings: 0,
                    timezone: avail.timezone,
                    generatedAt: new Date(),
                  });
                }
                startTime.setTime(startTime.getTime() + 30 * 60 * 1000);
              }
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }

          set({ timeSlots });
        },

        updateTimeSlot: (id, updates) => {
          set((state) => ({
            timeSlots: state.timeSlots.map((slot) =>
              slot.id === id ? { ...slot, ...updates } : slot
            ),
          }));
        },

        getAvailableTimeSlots: (date, offeringId) => {
          const { timeSlots } = get();
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);

          return timeSlots.filter(
            (slot) =>
              slot.startTime >= dayStart &&
              slot.startTime <= dayEnd &&
              slot.isAvailable &&
              !slot.isBooked
          );
        },

        // Payment management
        createPaymentIntent: async (bookingId, amount, currency) => {
          // TODO: Integrate with Stripe API
          const paymentIntent: PaymentIntent = {
            id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            bookingId,
            amount,
            currency,
            status: 'requires_payment_method',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            paymentIntents: [...state.paymentIntents, paymentIntent],
          }));

          return paymentIntent;
        },

        updatePaymentStatus: (paymentIntentId, status) => {
          set((state) => ({
            paymentIntents: state.paymentIntents.map((intent) =>
              intent.id === paymentIntentId
                ? { ...intent, status, updatedAt: new Date() }
                : intent
            ),
          }));
        },

        processRefund: (bookingId, amount, reason) => {
          // TODO: Integrate with Stripe refund API
          set((state) => ({
            bookingRequests: state.bookingRequests.map((request) =>
              request.id === bookingId
                ? { ...request, paymentStatus: PaymentStatus.REFUNDED, refundReason: reason }
                : request
            ),
          }));
        },

        // Payout management
        createPayout: (instructorId, sessionIds) => {
          const { liveSessions } = get();
          const sessions = liveSessions.filter((session) => sessionIds.includes(session.id));
          const totalAmount = sessions.reduce((sum, session) => sum + session.instructorPayout, 0);
          const platformFee = sessions.reduce((sum, session) => sum + session.platformFee, 0);

          const payout: InstructorPayout = {
            id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            instructorId,
            amount: totalAmount,
            currency: 'USD',
            status: PayoutStatus.PENDING,
            platformFee,
            netAmount: totalAmount - platformFee,
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            payouts: [...state.payouts, payout],
          }));
        },

        updatePayoutStatus: (payoutId, status) => {
          set((state) => ({
            payouts: state.payouts.map((payout) =>
              payout.id === payoutId
                ? { 
                    ...payout, 
                    status, 
                    paidAt: status === PayoutStatus.PAID ? new Date() : undefined,
                    updatedAt: new Date()
                  }
                : payout
            ),
          }));
        },

        getPendingPayouts: () => {
          const { payouts } = get();
          return payouts.filter((payout) => payout.status === PayoutStatus.PENDING);
        },

        // Notifications
        addNotification: (notification) => {
          const newNotification: SessionNotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));
        },

        markNotificationAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map((notif) =>
              notif.id === id ? { ...notif, isRead: true, updatedAt: new Date() } : notif
            ),
          }));
        },

        markAllNotificationsAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((notif) => ({ 
              ...notif, 
              isRead: true, 
              updatedAt: new Date() 
            })),
          }));
        },

        getUnreadNotifications: () => {
          const { notifications } = get();
          return notifications.filter((notif) => !notif.isRead);
        },

        // Stats and analytics
        updateStats: (updates) => {
          set((state) => ({
            stats: { ...state.stats, ...updates },
          }));
        },

        calculateEarnings: (startDate, endDate) => {
          const { liveSessions } = get();
          return liveSessions
            .filter(
              (session) =>
                session.scheduledStart >= startDate &&
                session.scheduledStart <= endDate &&
                session.status === SessionStatus.COMPLETED
            )
            .reduce((sum, session) => sum + session.instructorPayout, 0);
        },

        getPopularTimeSlots: () => {
          const { liveSessions } = get();
          const timeSlotCounts: { [key: string]: number } = {};
          
          liveSessions.forEach((session) => {
            const hour = session.scheduledStart.getHours();
            const timeSlot = `${hour}:00-${hour + 1}:00`;
            timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
          });

          return Object.entries(timeSlotCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([timeSlot]) => timeSlot);
        },

        // Utility functions
        isTimeSlotAvailable: (date, time, offeringId) => {
          const { timeSlots } = get();
          const [hours, minutes] = time.split(':').map(Number);
          const slotTime = new Date(date);
          slotTime.setHours(hours, minutes, 0, 0);

          return timeSlots.some(
            (slot) =>
              slot.startTime.getTime() === slotTime.getTime() &&
              slot.isAvailable &&
              !slot.isBooked
          );
        },

        canBookSession: (offeringId, date, time) => {
          const { offerings } = get();
          const offering = offerings.find((o) => o.id === offeringId);
          if (!offering || !offering.isActive) return false;

          const { isTimeSlotAvailable } = get();
          return isTimeSlotAvailable(date, time, offeringId);
        },

        getSessionPrice: (offeringId, isGroup = false) => {
          const { offerings } = get();
          const offering = offerings.find((o) => o.id === offeringId);
          return offering ? offering.basePrice : 0;
        },

        formatDuration: (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        },

        formatPrice: (amount, currency) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
          }).format(amount);
        },
      }),
      {
        name: 'live-sessions-store',
        partialize: (state) => ({
          availability: state.availability,
          offerings: state.offerings,
          priceRules: state.priceRules,
          selectedDate: state.selectedDate,
          viewMode: state.viewMode,
        }),
      }
    ),
    {
      name: 'live-sessions-store',
    }
  )
);
