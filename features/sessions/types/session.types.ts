// =============================================================================
// ENHANCED LIVE SESSIONS TYPES - COMPREHENSIVE SYSTEM
// =============================================================================

// Core enums
export enum LiveSessionType {
  COURSE_BASED = "COURSE_BASED",
  CUSTOM = "CUSTOM"
}

export enum SessionType {
  INDIVIDUAL = "INDIVIDUAL",
  SMALL_GROUP = "SMALL_GROUP",
  LARGE_GROUP = "LARGE_GROUP",
  WORKSHOP = "WORKSHOP",
  MASTERCLASS = "MASTERCLASS"
}

export enum SessionFormat {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  HYBRID = "HYBRID"
}

export enum SessionMode {
  LIVE = "LIVE",
  RECORDED = "RECORDED",
  BLENDED = "BLENDED"
}

export enum SessionStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum BookingMode {
  REQUEST = "REQUEST",
  DIRECT = "DIRECT"
}

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW"
}

export enum CancellationPolicy {
  FLEXIBLE = "FLEXIBLE",
  MODERATE = "MODERATE",
  STRICT = "STRICT"
}

export enum SessionTopicType {
  FIXED = "FIXED",
  FLEXIBLE = "FLEXIBLE",
  HYBRID = "HYBRID"
}

export enum TopicDifficulty {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT"
}

export enum ParticipantRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ASSISTANT = "ASSISTANT",
  OBSERVER = "OBSERVER"
}

export enum ParticipantStatus {
  ENROLLED = "ENROLLED",
  ATTENDED = "ATTENDED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export enum AttendanceStatus {
  NOT_ATTENDED = "NOT_ATTENDED",
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  LEFT_EARLY = "LEFT_EARLY",
  PARTIAL = "PARTIAL"
}

export enum DeviceType {
  DESKTOP = "DESKTOP",
  MOBILE = "MOBILE",
  TABLET = "TABLET"
}

export enum ReviewType {
  SESSION = "SESSION",
  INSTRUCTOR = "INSTRUCTOR"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  FREE = "FREE",
  PARTIAL_REFUND = "PARTIAL_REFUND",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED"
}

export enum PaymentTiming {
  BEFORE_SESSION = "BEFORE_SESSION",
  AFTER_SESSION = "AFTER_SESSION",
  ON_COMPLETION = "ON_COMPLETION"
}

export enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export enum NotificationType {
  BOOKING_RECEIVED = "BOOKING_RECEIVED",
  BOOKING_ACCEPTED = "BOOKING_ACCEPTED",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  SESSION_REMINDER = "SESSION_REMINDER",
  SESSION_STARTING = "SESSION_STARTING",
  SESSION_COMPLETED = "SESSION_COMPLETED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PAYOUT_PROCESSED = "PAYOUT_PROCESSED",
  TOPIC_APPROVAL_NEEDED = "TOPIC_APPROVAL_NEEDED",
  SCHEDULE_CONFLICT = "SCHEDULE_CONFLICT",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT"
}

export enum DeliveryStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  FAILED = "FAILED",
  RETRYING = "RETRYING"
}

// =============================================================================
// STUDENT PROFILE
// =============================================================================

export interface StudentProfile {
  id: string;
  userId: string;
  
  // Learning Preferences
  preferredSubjects: string[];
  learningGoals: string[];
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  preferredSessionTypes: SessionType[];
  preferredSessionFormats: SessionFormat[];
  
  // Learning Statistics
  totalSessions: number;
  completedSessions: number;
  totalLearningHours: number;
  averageRating: number;
  totalSpent: number;
  learningStreak: number;
  
  // Preferences
  maxSessionPrice: number;
  preferredTimeSlots: string[];
  timezone: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  // Progress Tracking
  currentCourses: string[];
  completedCourses: string[];
  certificates: string[];
  achievements: string[];
  
  // Social Learning
  favoriteInstructors: string[];
  studyGroups: string[];
  learningPartners: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// INSTRUCTOR PROFILE & AVAILABILITY
// =============================================================================

export interface InstructorProfile {
  id: string;
  userId: string;
  
  // =============================================================================
  // PROFESSIONAL INFORMATION
  // =============================================================================
  title?: string;
  bio?: string;
  shortBio?: string;
  expertise: string[];
  qualifications: string[];
  experience?: number;
  socialLinks: Record<string, string>;
  personalWebsite?: string;
  linkedinProfile?: string;

  // =============================================================================
  // TEACHING SPECIALIZATION
  // =============================================================================
  subjectsTeaching: string[];
  teachingCategories: string[];
  languagesSpoken: string[];
  teachingStyle?: string;
  targetAudience?: string;
  teachingMethodology?: string;

  // =============================================================================
  // LIVE SESSIONS CONFIGURATION
  // =============================================================================
  liveSessionsEnabled: boolean;
  defaultSessionDuration: number; // minutes
  defaultSessionType: SessionType;
  preferredGroupSize: number;
  bufferBetweenSessions: number; // minutes
  maxSessionsPerDay: number;
  minAdvanceBookings: number; // hours
  autoAcceptBookings: boolean;
  instantMeetingEnabled: boolean;

  // =============================================================================
  // PRICING CONFIGURATION
  // =============================================================================
  individualSessionRate?: number;
  groupSessionRate?: number;
  currency: string;
  platformFeeRate: number; // percentage

  // =============================================================================
  // DEFAULT POLICIES
  // =============================================================================
  defaultCancellationPolicy: CancellationPolicy;
  defaultSessionFormat: SessionFormat;

  // =============================================================================
  // PLATFORM STATISTICS
  // =============================================================================
  teachingRating: number;
  totalStudents: number;
  totalCourses: number;
  totalLiveSessions: number;
  totalRevenue: number;

  // =============================================================================
  // PERFORMANCE METRICS
  // =============================================================================
  averageCourseRating: number;
  averageSessionRating: number;
  studentRetentionRate: number;
  courseCompletionRate: number;
  sessionCompletionRate: number;
  responseTime: number; // hours
  studentSatisfaction: number;

  // =============================================================================
  // TEACHING AVAILABILITY
  // =============================================================================
  isAcceptingStudents: boolean;
  maxStudentsPerCourse?: number;
  preferredSchedule: Record<string, any>;
  availableTimeSlots: any[];

  // =============================================================================
  // VERIFICATION & COMPLIANCE
  // =============================================================================
  isVerified: boolean;
  verificationLevel?: string;
  lastVerificationDate?: Date;
  complianceStatus: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorAvailability {
  id: string;
  instructorId: string;
  
  // DAILY AVAILABILITY (Day-by-day control)
  specificDate: Date; // Each availability is for a specific date
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  
  // Settings and rules
  isActive: boolean;
  maxSessionsInSlot: number;
  defaultSlotDuration: number; // Default, offerings can override
  minAdvanceHours: number;
  maxAdvanceHours?: number; // 30 days default
  bufferMinutes: number;
  autoAcceptBookings: boolean;
  
  // Pricing overrides
  priceOverride?: number;
  currency?: string;
  
  // Metadata
  timezone: string;
  notes?: string;
  title?: string;
  
  // Generated time slots
  generatedSlots?: TimeSlot[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  availabilityId: string;
  
  // Slot details
  startTime: Date;
  endTime: Date;
  date: Date;
  dayOfWeek: number;
  slotDuration: number; // Actual duration for this specific slot
  
  // Status
  isAvailable: boolean;
  isBooked: boolean;
  isBlocked: boolean;
  
  // Booking info
  maxBookings: number;
  currentBookings: number;
  
  // Metadata
  timezone: string;
  generatedAt: Date;
}

// =============================================================================
// SESSION TOPICS & OFFERINGS
// =============================================================================

export interface SessionTopic {
  id: string;
  instructorId: string;
  
  name: string;
  description?: string;
  category?: string;
  difficulty: TopicDifficulty;
  
  // Topic flexibility
  isCustom: boolean;
  isActive: boolean;
  isApproved: boolean;
  
  // Suggested session details
  suggestedDuration?: number;
  suggestedFormat?: SessionType;
  prerequisites: string[];
  materials: string[];
  
  // Usage statistics
  totalSessions: number;
  averageRating: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionOffering {
  id: string;
  instructorId: string;
  
  // Basic info
  title: string;
  description: string;
  shortDescription?: string;
  
  // Topic configuration
  topicType: SessionTopicType;
  topicId?: string;
  fixedTopic?: string;
  domain?: string;
  tags: string[];
  
  // Session configuration
  sessionType: SessionType;
  sessionFormat: SessionFormat;
  duration: number; // minutes
  capacity: number;
  minParticipants?: number;
  
  // Pricing
  basePrice: number;
  currency: string;
  
  // Policies
  cancellationPolicy: CancellationPolicy;
  
  // Rules and settings
  isActive: boolean;
  isPublic: boolean;
  requiresApproval: boolean;
  
  // Content
  materials: string[];
  prerequisites: string[];
  equipment: string[];
  
  // Features
  recordingEnabled: boolean;
  whiteboardEnabled: boolean;
  screenShareEnabled: boolean;
  chatEnabled: boolean;
  
  // Statistics
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// BOOKING & RESERVATION SYSTEM
// =============================================================================

export interface BookingRequest {
  id: string;
  offeringId: string;
  studentId: string;
  
  // Booking approach
  bookingMode: BookingMode;
  
  // Request-based booking
  preferredDate?: Date;
  preferredTime?: string;
  alternativeDates: Date[];
  
  // Direct slot booking
  timeSlotId?: string;
  
  // Custom requirements
  customTopic?: string;
  topicDescription?: string;
  customRequirements?: string;
  studentMessage?: string;
  instructorResponse?: string;
  
  // Status management
  status: BookingStatus;
  priority: number;
  rescheduleCount: number;
  
  // Pricing
  offeredPrice: number;
  finalPrice?: number;
  currency: string;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  stripeSessionId?: string;
  
  // Timestamps
  expiresAt: Date;
  respondedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  cancelledAt?: Date;
  
  // Additional properties for UI
  message?: string;
  requestDate?: Date;
  sessionDate?: Date;
  sessionTime?: string;
  sessionType?: SessionType;

  timeSlot?: TimeSlot;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionReservation {
  id: string;
  sessionId: string;
  learnerId: string;
  
  // Reservation lifecycle
  status: ReservationStatus;
  
  // Payment tracking
  paymentStatus: PaymentStatus;
  paymentDue?: Date;
  
  // Attendance
  attendance: AttendanceStatus;
  joinedAt?: Date;
  leftAt?: Date;
  totalTime: number; // minutes
  
  // Custom requirements
  requestedTopic?: string;
  learnerNotes?: string;
  instructorNotes?: string;
  
  // Pricing
  agreedPrice: number;
  currency: string;
  
  // Timestamps
  reservedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// LIVE SESSIONS
// =============================================================================

export interface LiveSession {
  id: string;
  
  // Session can be booking-based OR standalone
  bookingRequestId?: string;
  offeringId: string;
  instructorId: string;
  
  // Flexibility: Course-based OR Custom
  sessionType: LiveSessionType;
  
  // Course-based sessions (if linked to existing courses)
  courseId?: string;
  lectureId?: string;
  
  // Custom sessions
  topicId?: string;
  customTopic?: string;
  
  // Session details
  title: string;
  description?: string;
  finalTopic?: string;
  
  // Format and mode
  format: SessionFormat;
  sessionFormat: SessionFormat;
  sessionMode: SessionMode;
  
  // Capacity management
  maxParticipants: number;
  minParticipants: number;
  currentParticipants: number;
  maxStudents?: number;
  
  // Scheduling
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  duration: number; // planned duration
  actualDuration?: number; // actual duration
  startTime?: Date;
  endTime?: Date;
  
  // Status
  status: SessionStatus;
  
  // Technical setup
  meetingRoomId?: string;
  meetingLink?: string;
  meetingPassword?: string;
  recordingUrl?: string;
  recordingEnabled: boolean;
  location?: string;
  
  // Content and artifacts
  materials: string[];
  sessionNotes?: string;
  instructorNotes?: string;
  summary?: string;
  sessionArtifacts: string[];
  
  // Financial
  pricePerPerson: number;
  totalPrice?: number;
  totalRevenue: number;
  platformFee: number;
  instructorPayout: number;
  currency: string;
  payoutStatus: PayoutStatus;
  price?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// PAYMENT & PAYOUT SYSTEM
// =============================================================================

export interface SessionPayment {
  id: string;
  
  // Can be linked to reservation OR session directly
  reservationId?: string;
  sessionId: string;
  payerId: string;
  
  // Payment details
  amount: number;
  currency: string;
  
  // Flexible timing
  paymentTiming: PaymentTiming;
  
  // Status and processing
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  stripePaymentId?: string;
  
  // Refund handling
  refundAmount: number;
  refundReason?: string;
  refundedAt?: Date;
  
  // Timestamps
  dueAt?: Date;
  paidAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "requires_confirmation" | "requires_action" | "processing" | "requires_capture" | "canceled" | "succeeded";
  clientSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorPayout {
  id: string;
  instructorId: string;
  
  // Payout details
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  
  // Status and processing
  status: PayoutStatus;
  payoutMethod?: string;
  
  // Processing details
  scheduledDate: Date;
  processedAt?: Date;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  
  // External references
  stripePayoutId?: string;
  bankTransferId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutSession {
  id: string;
  payoutId: string;
  sessionId: string;
  
  sessionAmount: number;
  platformFee: number;
  netAmount: number;
  
  createdAt: Date;
}

// =============================================================================
// PARTICIPANTS & ATTENDANCE
// =============================================================================

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  
  role: ParticipantRole;
  status: ParticipantStatus;
  deviceType: DeviceType;
  
  // Payment details
  paidAmount: number;
  currency: string;
  paymentDate?: Date;
  
  // Participation tracking
  joinedAt?: Date;
  leftAt?: Date;
  totalTime: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  
  joinedAt?: Date;
  leftAt?: Date;
  duration: number;
  status: AttendanceStatus;
  
  // Engagement metrics
  cameraOnTime: number;
  micActiveTime: number;
  chatMessages: number;
  questionsAsked: number;
  pollResponses: number;
  engagementScore: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// REVIEWS & FEEDBACK
// =============================================================================

export interface SessionReview {
  id: string;
  sessionId: string;
  reviewerId: string;
  
  reviewType: ReviewType;
  
  // Ratings (1-5)
  overallRating: number;
  contentQuality?: number;
  instructorRating?: number;
  technicalQuality?: number;
  valueForMoney?: number;
  
  // Feedback
  positives?: string;
  improvements?: string;
  comment?: string;
  
  // Metadata
  isVerified: boolean;
  isPublic: boolean;
  helpfulVotes: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// NOTIFICATIONS SYSTEM
// =============================================================================

export interface SessionNotification {
  id: string;
  userId: string;
  
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  
  // Delivery management
  isRead: boolean;
  isEmail: boolean;
  isPush: boolean;
  isSMS: boolean;
  deliveryStatus: DeliveryStatus;
  
  // Relations
  sessionId?: string;
  bookingRequestId?: string;
  
  // Scheduling
  scheduledFor: Date;
  sentAt?: Date;
  
  // Additional properties for UI
  action?: string;
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// ANALYTICS & STATISTICS
// =============================================================================

export interface SessionStats {
  pendingRequests: number;
  totalEarnings: number;
  upcomingSessions: number;
  completionRate: number;
  averageBid: number;
  popularTimeSlots: string[];
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  averageRating: number;
  totalLearners: number;
  totalStudents: number;
  totalPayouts: number;
  pendingPayouts: number;
}

export enum InsightType {
  DEMAND_PREDICTION = "demand_prediction",
  PRICING_SUGGESTION = "pricing_suggestion",
  SCHEDULE_OPTIMIZATION = "schedule_optimization",
  PERFORMANCE_ANALYSIS = "performance_analysis",
  STUDENT_ENGAGEMENT = "student_engagement",
  REVENUE_OPTIMIZATION = "revenue_optimization"
}

export enum InsightPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

export interface AIInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  action?: string;
  impact: number; // 1-10 scale
  metrics?: Record<string, number>;
  recommendations?: string[];
  category: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TopicRequest {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  suggestedTopic: string;
  description?: string;
  createdAt: Date;
  priority: number; // 1-5 scale
}

export interface TopicCluster {
  id: string;
  sessionId: string;
  mainTopic: string;
  relatedTopics: string[];
  requestIds: string[];
  confidence: number; // AI clustering confidence 0-1
  learnerCount: number;
}

// =============================================================================
// CALENDAR & SCHEDULING
// =============================================================================

export interface WeeklySchedule {
  instructorId: string;
  weekStart: Date;
  timeSlots: TimeSlot[];
  availability: InstructorAvailability[];
}

export interface PriceRule {
  id: string;
  sessionType: SessionType;
  basePrice: number;
  minBidPrice: number;
  maxBidPrice: number;
  autoAcceptThreshold: number;
  leadTimeCutoff: number; // hours before session
  platformFeePercentage: number;
  minSessionDuration: number; // minutes
  maxSessionDuration: number; // minutes
  cancellationPolicy: {
    freeCancellationHours: number;
    partialRefundHours: number;
    noRefundHours: number;
  };
}

// =============================================================================
// DTOs (Data Transfer Objects)
// =============================================================================

export interface CreateSessionOfferingDto {
  instructorId: string;
  title: string;
  description: string;
  shortDescription?: string;
  topicType: SessionTopicType;
  topicId?: string;
  fixedTopic?: string;
  domain?: string;
  tags?: string[];
  sessionType: SessionType;
  sessionFormat: SessionFormat;
  duration: number;
  capacity: number;
  minParticipants?: number;
  basePrice: number;
  currency: string;
  cancellationPolicy: CancellationPolicy;
  isActive: boolean;
  isPublic: boolean;
  requiresApproval: boolean;
  materials?: string[];
  prerequisites?: string[];
  equipment?: string[];
  recordingEnabled: boolean;
  whiteboardEnabled: boolean;
  screenShareEnabled: boolean;
  chatEnabled: boolean;
}

export interface UpdateSessionOfferingDto extends Partial<CreateSessionOfferingDto> {
  // All fields are optional for updates
}

export interface CreateLiveSessionDto {
  instructorId: string;
  offeringId: string;
  sessionType: LiveSessionType;
  courseId?: string;
  lectureId?: string;
  topicId?: string;
  customTopic?: string;
  title: string;
  description?: string;
  finalTopic?: string;
  format: SessionFormat;
  sessionFormat: SessionFormat;
  sessionMode: SessionMode;
  maxParticipants: number;
  minParticipants: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  duration: number;
  timeSlotId?: string;
  meetingRoomId?: string;
  meetingLink?: string;
  meetingPassword?: string;
  recordingEnabled: boolean;
  materials?: string[];
  location?: string;
  pricePerPerson: number;
  currency: string;
  bookingRequestId?: string;
}

export interface UpdateLiveSessionDto extends Partial<CreateLiveSessionDto> {
  // All fields are optional for updates
}

// =============================================================================
// ENHANCED LIVE SESSION DTOs
// =============================================================================

export interface StartLiveSessionDto {
  meetingLink?: string;
  meetingPassword?: string;
  instructorNotes?: string;
}

export interface EndLiveSessionDto {
  notes?: string;
  summary?: string;
  recordingUrl?: string;
  sessionArtifacts?: string[];
}

export interface CancelLiveSessionDto {
  reason?: string;
  cancellationMessage?: string;
}

export interface RescheduleLiveSessionDto {
  newStartTime: Date;
  newEndTime: Date;
  reason?: string;
  rescheduleMessage?: string;
}

export interface LiveSessionFilterDto {
  instructorId?: string;
  studentId?: string;
  status?: SessionStatus;
  sessionType?: LiveSessionType;
  format?: SessionFormat;
  startDate?: Date;
  endDate?: Date;
  courseId?: string;
  topicId?: string;
  payoutStatus?: PayoutStatus;
}

// =============================================================================
// LEGACY INTERFACES (for backward compatibility)
// =============================================================================

export interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "individual" | "group";
  status: "available" | "pending" | "booked" | "completed" | "cancelled";
  capacity: number;
  basePrice: number;
  currentPrice?: number;
  learnerIds?: string[];
  color: string;
  topicType: "fixed" | "flexible";
  domain?: string;
  fixedTopic?: string;
  topicRequests?: TopicRequest[];
  topicClusters?: TopicCluster[];
  finalizedTopic?: SessionTopic;
  topicDeadline?: Date;
  offeringId?: string;
  liveRoomLink?: string;
  attendance?: AttendanceRecord[];
  recordingUrl?: string;
  instructorNotes?: string;
  learnerReviews?: SessionReview[];
  payoutStatus?: "pending" | "processed" | "paid";
  platformFee?: number;
  instructorPayout?: number;
}

export interface LearnerReview {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}
