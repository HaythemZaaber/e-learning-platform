export interface InstructorProfile {
  id: string;
  userId: string;
  user?: User;

  // Professional Information
  title?: string;
  bio?: string;
  shortBio?: string;
  expertise: string[];
  qualifications: string[];
  experience?: number;
  socialLinks: any;
  personalWebsite?: string;
  linkedinProfile?: string;

  // Teaching Specialization
  subjectsTeaching: string[];
  teachingCategories: string[];
  languagesSpoken: LanguageProficiency[];
  teachingStyle?: string;
  targetAudience?: string;
  teachingMethodology?: string;

  // Platform Statistics
  teachingRating?: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  currency: string;

  // Performance Metrics
  averageCourseRating: number;
  studentRetentionRate: number;
  courseCompletionRate: number;
  responseTime: number;
  studentSatisfaction: number;

  // Teaching Availability
  isAcceptingStudents: boolean;
  maxStudentsPerCourse?: number;
  preferredSchedule: any;
  availableTimeSlots: any;
  liveSessionsEnabled: boolean;
  defaultSessionDuration: number;
  defaultSessionType: string;
  individualSessionRate: number;
  groupSessionRate: number;

  // Verification & Compliance
  isVerified: boolean;
  verificationLevel?: string;
  lastVerificationDate?: Date;
  complianceStatus?: string;

  // Content Creation Stats
  totalLectures: number;
  totalVideoHours: number;
  totalQuizzes: number;
  totalAssignments: number;
  contentUpdateFreq: number;

  // Financial Information
  payoutSettings: any;
  taxInformation: any;
  paymentPreferences: any;
  revenueSharing?: number;

  // Marketing & Promotion
  isPromotionEligible: boolean;
  marketingConsent: boolean;
  featuredInstructor: boolean;
  badgesEarned: string[];

  // Activity Tracking
  lastCourseUpdate?: Date;
  lastStudentReply?: Date;
  lastContentCreation?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

export interface InstructorStats {
  profile: InstructorProfile;
  statistics: {
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    averageRating: number;
    courses: Course[];
  };
}

export interface Course {
  id: string;
  title: string;
  status: string;
  avgRating: number;
  currentEnrollments: number;
  price: number;
}

export interface InstructorSearchFilters {
  expertise?: string[];
  teachingCategories?: string[];
  minRating?: number;
  minExperience?: number;
  languages?: string[];
  isVerified?: boolean;
  isAcceptingStudents?: boolean;
  featuredInstructor?: boolean;
  limit?: number;
  offset?: number;
}

export interface InstructorSearchResponse {
  instructors: InstructorProfile[];
  total: number;
  hasMore: boolean;
}

export interface UpdateInstructorProfileInput {
  title?: string;
  bio?: string;
  shortBio?: string;
  expertise?: string[];
  qualifications?: string[];
  experience?: number;
  socialLinks?: any;
  personalWebsite?: string;
  linkedinProfile?: string;
  subjectsTeaching?: string[];
  teachingCategories?: string[];
  languagesSpoken?: any;
  teachingStyle?: string;
  targetAudience?: string;
  teachingMethodology?: string;
  isAcceptingStudents?: boolean;
  maxStudentsPerCourse?: number;
  preferredSchedule?: any;
  availableTimeSlots?: any;
  payoutSettings?: any;
  taxInformation?: any;
  paymentPreferences?: any;
  revenueSharing?: number;
  isPromotionEligible?: boolean;
  marketingConsent?: boolean;
  featuredInstructor?: boolean;
  badgesEarned?: string[];
}

export interface LanguageProficiency {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  slotId: string;
  isAvailable: boolean;
  isBooked: boolean;
  isBlocked: boolean;
  currentBookings: number;
  maxBookings: number;
}

export interface DaySchedule {
  available: boolean;
  timeSlots: TimeSlot[];
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface PayoutSettings {
  currency: string;
  minimumPayout: number;
  preferredMethod: 'bank_transfer' | 'paypal' | 'stripe';
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
}

export interface TaxInformation {
  country: string;
  taxStatus: 'individual' | 'business';
  taxId?: string;
  vatNumber?: string;
}

export interface PaymentPreferences {
  autoPayout: boolean;
  payoutFrequency: 'weekly' | 'monthly' | 'quarterly';
  notificationEmail: string;
}

// New types for backend API integration
export interface InstructorDetailsResponse {
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    teachingRating: number;
    totalStudents: number;
    totalCourses: number;
    expertise: string[];
    qualifications: string[];
    experience: number | null;
    bio: string | null;
  };
  profile: InstructorProfile;
  stats: InstructorProfile;
  recentCourses: Course[];
  recentReviews: Review[];
  availability: AvailabilityResponse;
  summary: {
    totalCourses: number;
    totalReviews: number;
    averageRating: number;
    totalStudents: number;
    totalSessions: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string | null;
  level: string;
  thumbnail: string | null;
  trailer: string | null;
  galleryImages: string[];
  price: number;
  originalPrice: number;
  currency: string;
  discountPercent: number;
  discountValidUntil: string | null;
  objectives: string[];
  prerequisites: string[];
  whatYouLearn: string[];
  requirements: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoTags: string[];
  marketingTags: string[];
  targetAudience: string[];
  status: string;
  enrollmentType: string;
  language: string;
  subtitleLanguages: string[];
  isPublic: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  isNew: boolean;
  certificate: boolean;
  certificateTemplate: string | null;
  passingGrade: number;
  allowRetakes: boolean;
  maxAttempts: number | null;
  estimatedHours: number;
  estimatedMinutes: number;
  difficulty: number;
  intensityLevel: string;
  settings: any;
  metadata: any;
  accessibility: any;
  views: number;
  uniqueViews: number;
  avgRating: number;
  totalRatings: number;
  completionRate: number;
  totalSections: number;
  totalLectures: number;
  totalQuizzes: number;
  totalAssignments: number;
  totalContentItems: number;
  totalDiscussions: number;
  totalAnnouncements: number;
  hasLiveSessions: boolean;
  hasRecordings: boolean;
  hasDiscussions: boolean;
  hasAssignments: boolean;
  hasQuizzes: boolean;
  downloadableResources: boolean;
  offlineAccess: boolean;
  mobileOptimized: boolean;
  enrollmentStartDate: string | null;
  enrollmentEndDate: string | null;
  courseStartDate: string | null;
  courseEndDate: string | null;
  maxStudents: number | null;
  currentEnrollments: number;
  waitlistEnabled: boolean;
  version: string;
  lastMajorUpdate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  instructorId: string;
  sections: CourseSection[];
  enrollments: CourseEnrollment[];
  reviews: CourseReview[];
  totalDuration: number;
  totalEnrollments: number;
  averageRating: number;
  totalReviews: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  isRequired: boolean;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lectures: CourseLecture[];
}

export interface CourseLecture {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
}

export interface CourseEnrollment {
  id: string;
  status: string;
}

export interface CourseReview {
  id: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  session: {
    id: string;
    title: string;
    sessionType: string;
    scheduledStart: string;
  };
  overallRating: number;
  contentQuality: number;
  instructorRating: number;
  technicalQuality: number;
  valueForMoney: number;
  comment: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  instructorId: string;
  specificDate: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  maxSessionsInSlot: number;
  defaultSlotDuration: number;
  minAdvanceHours: number;
  maxAdvanceHours: number;
  bufferMinutes: number;
  autoAcceptBookings: boolean;
  priceOverride: number | null;
  currency: string;
  timezone: string;
  notes: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  generatedSlots: GeneratedSlot[];
}

export interface AvailabilityResponse {
  availabilities: Availability[];
  defaultSettings: DefaultSettings;
  summary: AvailabilitySummary;
}

export interface GeneratedSlot {
  id: string;
  availabilityId: string;
  startTime: string;
  endTime: string;
  date: string;
  dayOfWeek: number;
  slotDuration: number;
  isAvailable: boolean;
  isBooked: boolean;
  isBlocked: boolean;
  maxBookings: number;
  currentBookings: number;
  timezone: string;
  generatedAt: string;
}

export interface DefaultSettings {
  defaultSessionDuration: number;
  defaultSessionType: string;
  individualSessionRate: number;
  groupSessionRate: number;
  currency: string;
  bufferBetweenSessions: number;
  maxSessionsPerDay: number;
  preferredSchedule: WeeklySchedule;
  availableTimeSlots: any[];
}

export interface AvailabilitySummary {
  totalAvailabilities: number;
  totalAvailableSlots: number;
  nextAvailableSlot: {
    date: Date;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    availabilityId: string;
    slotId: string;
  };
  activeAvailabilities: number;
  upcomingAvailabilities: number;
}

export interface InstructorCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InstructorReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageOverallRating: number;
  averageContentQuality: number;
  averageInstructorRating: number;
  averageTechnicalQuality: number;
  averageValueForMoney: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface BookingRequest {
  slotId: string;
  sessionType: 'individual' | 'group';
  duration: number;
  topic: string;
  offerPrice: number;
  specialRequirements: string;
  studentInfo: {
    name: string;
    email: string;
    phone: string;
  };
  timestamp: string;
}
