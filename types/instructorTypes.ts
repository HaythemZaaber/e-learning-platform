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
  languagesSpoken: any;
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
  startTime: string;
  endTime: string;
  timezone: string;
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
