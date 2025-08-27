// =============================================================================
// GRAPHQL INSTRUCTOR TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: string;
  instructorStatus?: string;
}

export interface InstructorProfile {
  id: string;
  userId: string;
  title?: string;
  bio?: string;
  shortBio?: string;
  expertise: string[];
  qualifications: string[];
  experience?: number;
  socialLinks: any;
  personalWebsite?: string;
  linkedinProfile?: string;
  subjectsTeaching: string[];
  teachingCategories: string[];
  languagesSpoken: any;
  teachingStyle?: string;
  targetAudience?: string;
  teachingMethodology?: string;
  teachingRating?: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  currency: string;
  averageCourseRating: number;
  studentRetentionRate: number;
  courseCompletionRate: number;
  individualSessionRate: number;
  groupSessionRate: number;
  responseTime: number;
  studentSatisfaction: number;
  isAcceptingStudents: boolean;
  maxStudentsPerCourse?: number;
  preferredSchedule: any;
  availableTimeSlots: any;
  isVerified: boolean;
  verificationLevel?: string;
  lastVerificationDate?: Date;
  complianceStatus?: string;
  totalLectures: number;
  totalVideoHours: number;
  totalQuizzes: number;
  totalAssignments: number;
  contentUpdateFreq: number;
  payoutSettings: any;
  taxInformation: any;
  paymentPreferences: any;
  revenueSharing?: number;
  isPromotionEligible: boolean;
  marketingConsent: boolean;
  featuredInstructor: boolean;
  badgesEarned: string[];
  lastCourseUpdate?: Date;
  lastStudentReply?: Date;
  lastContentCreation?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

// =============================================================================
// LANDING PAGE TYPES
// =============================================================================

export interface FeaturedInstructorsResponse {
  featuredInstructors: InstructorProfile[];
  total: number;
  hasMore: boolean;
}

export interface InstructorHeroStats {
  totalInstructors: number;
  availableToday: number;
  averageRating: number;
  totalStudents: number;
  liveSessionsEnabled: number;
  verifiedInstructors: number;
}

// =============================================================================
// INSTRUCTORS PAGE TYPES
// =============================================================================

export interface InstructorListFiltersInput {
  // Search
  searchQuery?: string;

  // Categories and Expertise
  categories?: string[];
  expertise?: string[];
  teachingCategories?: string[];

  // Experience and Rating
  experienceLevels?: string[];
  minRating?: number;
  minExperience?: number;

  // Languages
  languages?: string[];

  // Live Sessions
  availableToday?: boolean;
  offersLiveSessions?: boolean;
  groupSessionsAvailable?: boolean;

  // Time Preferences
  timePreferences?: string[];

  // Session Types
  sessionTypes?: string[];

  // Content and Activity
  hasRecordedCourses?: boolean;
  activeOnReels?: boolean;
  regularStoryPoster?: boolean;

  // Price Range
  minPrice?: number;
  maxPrice?: number;

  // Verification and Status
  isVerified?: boolean;
  isAcceptingStudents?: boolean;
  featuredInstructor?: boolean;

  // Location
  location?: string;

  // Pagination
  limit?: number;
  offset?: number;
}

export interface InstructorListResponse {
  instructors: InstructorProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  filters: any;
}

// =============================================================================
// INSTRUCTOR STATISTICS TYPES
// =============================================================================

export interface CourseStats {
  id: string;
  title: string;
  status: string;
  avgRating: number;
  totalRatings: number;
  views: number;
  currentEnrollments: number;
  price: number;
}

export interface InstructorStatistics {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  courses: CourseStats[];
}

export interface InstructorStatsResponse {
  profile: InstructorProfile;
  statistics: InstructorStatistics;
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  courseCompletionRate: number;
  studentRetentionRate: number;
  studentSatisfactionRate: number;
  averageResponseTime: number;
  totalLectures: number;
  totalVideoHours: number;
  totalQuizzes: number;
  totalAssignments: number;
  contentUpdateFrequency: number;
  lastCourseUpdate?: Date;
  lastStudentReply?: Date;
  lastContentCreation?: Date;
  verificationStatus: string;
  complianceStatus: string;
}

// =============================================================================
// SEARCH TYPES
// =============================================================================

export interface InstructorSearchFiltersInput {
  searchQuery?: string;
  categories?: string[];
  expertise?: string[];
  minRating?: number;
  minExperience?: number;
  languages?: string[];
  isVerified?: boolean;
  featuredInstructor?: boolean;
  location?: string;
  limit?: number;
  offset?: number;
}

export interface InstructorSearchResponse {
  instructors: InstructorProfile[];
  total: number;
  hasMore: boolean;
}

// =============================================================================
// GRAPHQL RESPONSE TYPES
// =============================================================================

export interface GetFeaturedInstructorsData {
  getFeaturedInstructors: FeaturedInstructorsResponse;
}

export interface GetFeaturedInstructorsVars {
  limit?: number;
}

export interface GetInstructorHeroStatsData {
  getInstructorHeroStats: InstructorHeroStats;
}

export interface GetInstructorsListData {
  getInstructorsList: InstructorListResponse;
}

export interface GetInstructorsListVars {
  filters?: InstructorListFiltersInput;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface GetAvailableTodayInstructorsData {
  getAvailableTodayInstructors: InstructorProfile[];
}

export interface GetAvailableTodayInstructorsVars {
  limit?: number;
}

export interface GetInstructorProfileData {
  getInstructorProfile: InstructorProfile;
}

export interface GetInstructorProfileVars {
  userId: string;
}

export interface GetMyInstructorProfileData {
  getMyInstructorProfile: InstructorProfile;
}

export interface GetInstructorStatsData {
  getInstructorStats: InstructorStatsResponse;
}

export interface GetInstructorStatsVars {
  userId: string;
}

export interface GetMyInstructorStatsData {
  getMyInstructorStats: InstructorStatsResponse;
}

export interface SearchInstructorsData {
  searchInstructors: InstructorSearchResponse;
}

export interface SearchInstructorsVars {
  filters: InstructorSearchFiltersInput;
}

// =============================================================================
// TRANSFORMED TYPES FOR UI COMPATIBILITY
// =============================================================================

export interface TransformedInstructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  shortBio: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  coursesCount: number;
  responseTime: string;
  completionRate: number;
  languages: string[];
  experience: number;
  education: string[];
  certifications: string[];
  philosophy: string;
  categories: string[];
  skills: Array<{ name: string; proficiency: string }>;
  location: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    youtube?: string;
  };
  isOnline?: boolean;
  isVerified: boolean;
  priceRange: {
    min: number;
    max: number;
  };
  liveSessionsEnabled: boolean;
  groupSessionsEnabled: boolean;
  nextAvailableSlot?: {
    date: string;
    time: string;
    type: string;
    price: number;
  };
  weeklyBookings: number;
  responseTimeHours: number;
  contentEngagement: {
    totalViews: number;
    totalLikes: number;
    avgEngagementRate: number;
  };
  reels: any[];
  stories: any[];
  storyHighlights: any[];
  recordedCourses: any[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type SortOption = 
  | 'featured'
  | 'rating'
  | 'students'
  | 'newest'
  | 'available-today'
  | 'most-booked'
  | 'name';

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedExperience: string[];
  selectedRatings: string[];
  selectedLanguages: string[];
  selectedTimePreferences: string[];
  selectedSessionTypes: string[];
  priceRange: [number, number];
  availableToday: boolean;
  offersLiveSessions: boolean;
  groupSessionsAvailable: boolean;
  hasRecordedCourses: boolean;
  activeOnReels: boolean;
  regularStoryPoster: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  hasMore?: boolean;
}
