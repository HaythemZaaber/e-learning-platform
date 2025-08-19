// types/courseTypes.ts
import { StaticImageData } from "next/image";
import { Instructor } from "@/data/instructorsData";
import { UserRole } from "@/stores/auth.store";

// ============================================================================
// ENHANCED ENUM TYPES (Aligned with Prisma Schema)
// ============================================================================
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "ARCHIVED" | "SUSPENDED" | "COMING_SOON";
export type CourseIntensity = "LIGHT" | "REGULAR" | "INTENSIVE" | "BOOTCAMP";
export type EnrollmentType = "FREE" | "PAID" | "SUBSCRIPTION" | "INVITATION_ONLY" | "WAITLIST";
export type CourseBadgeColor = "primary" | "secondary" | "success" | "error" | "warning" | "info";

// Enhanced content types
export type LectureType = 
  | "VIDEO" 
  | "TEXT" 
  | "AUDIO" 
  | "QUIZ" 
  | "ASSIGNMENT" 
  |"IMAGE"
  |"DOCUMENT"
  |"ARCHIVE"
  |"RESOURCE"
export type ContentType = 
  | "VIDEO" 
  | "AUDIO" 
  | "DOCUMENT" 
  | "TEXT" 
  | "QUIZ" 
  | "ASSIGNMENT" 
  | "RESOURCE" 
  | "IMAGE" 
  | "ARCHIVE" 
  | "RESOURCE";

export type VideoProvider = "YOUTUBE" | "VIMEO" | "WISTIA" | "SELF_HOSTED" | "AWS_S3" | "CLOUDINARY";

export type QuestionType = 
  | "MULTIPLE_CHOICE" 
  | "SINGLE_CHOICE" 
  | "TRUE_FALSE" 
  | "FILL_IN_BLANK" 
  | "ESSAY" 
  | "MATCHING" 
  | "ORDERING" 
  | "NUMERIC";

export type AssignmentType = "TEXT" | "FILE_UPLOAD" | "URL_SUBMISSION" | "PEER_REVIEW";
export type SubmissionStatus = "DRAFT" | "SUBMITTED" | "GRADED" | "RETURNED" | "LATE";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "SUSPENDED" | "REFUNDED" | "EXPIRED";
export type PaymentStatus = "FREE" | "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL_REFUND";

export type ReviewStatus = "PUBLISHED" | "PENDING" | "FLAGGED" | "HIDDEN";
export type EnrollmentSource = "DIRECT" | "REFERRAL" | "PROMOTION" | "BUNDLE" | "LEARNING_PATH";

export type NotificationType = 
  | "COURSE_UPDATE" 
  | "NEW_LESSON" 
  | "ASSIGNMENT_DUE" 
  | "CERTIFICATE_EARNED" 
  | "DISCUSSION_REPLY" 
  | "INSTRUCTOR_APPROVED" 
  | "SYSTEM_ANNOUNCEMENT" 
  | "AI_RECOMMENDATION" 
  | "ENROLLMENT_CONFIRMATION" 
  | "PAYMENT_CONFIRMATION";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type AnnouncementPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type AIInteractionType = 
  | "QUESTION" 
  | "EXPLANATION" 
  | "QUIZ_GENERATION" 
  | "SUMMARY" 
  | "RECOMMENDATION" 
  | "TUTORING" 
  | "CODE_REVIEW" 
  | "CONTENT_ANALYSIS";

export type DiscussionType = "QUESTION" | "ANSWER" | "ANNOUNCEMENT" | "GENERAL" | "BUG_REPORT" | "FEATURE_REQUEST";

// Backward compatibility aliases
export type LessonType = LectureType;

// ============================================================================
// ENHANCED USER INTERFACE
// ============================================================================

export interface CourseInstructor extends Omit<Instructor, 'socialLinks'> {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  instructorBio?: string;
  expertise?: string[];
  qualifications?: string[];
  experience: number;
  socialLinks?: Record<string, string>;
  teachingRating?: number;
  totalStudentsTaught?: number;
  totalCourses?: number;
  averageRating?: number;
}

// ============================================================================
// ENHANCED CONTENT INTERFACES
// ============================================================================

export interface ContentItem {
  id?: string;
  title: string;
  description?: string;
  type: ContentType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  contentData?: any;
  version?: string;
  checksum?: string;
  order: number;
  isPublished?: boolean;
  isDownloadable?: boolean;
  requiresAuth?: boolean;
  courseId?: string;
  lessonId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseLecture {
  id: string;
  title: string;
  description?: string;
  type: LectureType;
  content?: string;
  
  // Enhanced video fields
  videoUrl?: string;
  videoProvider?: VideoProvider;
  videoDuration?: number;
  
  // Lesson properties
  duration: number;
  order?: number;
  isPreview?: boolean;
  isInteractive?: boolean;
  isRequired?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  
  // AI features
  hasAIQuiz?: boolean;
  aiSummary?: string;
  transcription?: string;
  autoTranscript?: boolean;
  
  // Accessibility
  captions?: string;
  transcript?: string;
  
  // Download & offline
  downloadable?: boolean;
  offlineContent?: string;
  
  // Content association
  contentItem?: ContentItem;
  
  // Settings and metadata
  settings?: any;
  metadata?: any;
  status?: string;
  sectionId?: string;
  
  // Legacy support
  articleContent?: string;
  isFree?: boolean;
  
  // Resources
  resources?: {
    name: string;
    url: string;
    type: "pdf" | "code" | "link" | "image";
  }[];
  
  // Quiz data (embedded)
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  
  // Computed fields
  completionCount?: number;
  averageTimeSpent?: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  isLocked?: boolean;
  isRequired?: boolean;
  estimatedDuration?: number; // in minutes
  lectures: CourseLecture[];
  courseId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Computed fields
  duration: number; // Total duration for backward compatibility
  totalLessons?: number;
  totalDuration?: number;
  completionRate?: number;
}

// ============================================================================
// ENHANCED QUIZ & ASSIGNMENT INTERFACES
// ============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: any; // Flexible for different question types
  correctAnswer: any;
  explanation?: string;
  points: number;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  timeLimit?: number; // in minutes
  attempts: number;
  passingScore: number;
  showResults: boolean;
  randomize: boolean;
  isPublished: boolean;
  order: number;
  courseId: string;
  questions?: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
  
  // Computed fields
  totalQuestions?: number;
  totalPoints?: number;
  attemptCount?: number;
  averageScore?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate?: Date;
  points: number;
  submissionType: AssignmentType;
  allowLateSubmission: boolean;
  maxFileSize?: number; // in MB
  isPublished: boolean;
  order: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Computed fields
  submissionCount?: number;
  gradedCount?: number;
  averageGrade?: number;
}

export interface AssignmentSubmission {
  id: string;
  content?: string;
  fileUrls: string[];
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  assignmentId: string;
}

// ============================================================================
// ENHANCED REVIEW INTERFACE
// ============================================================================

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment?: string;
  isVerified?: boolean;
  helpfulCount?: number;
  
  // Enhanced review details
  courseQuality?: number;
  instructorRating?: number;
  difficultyRating?: number;
  valueForMoney?: number;
  
  status?: ReviewStatus;
  flaggedCount?: number;
  createdAt: Date;
  updatedAt?: Date;
  
  // Legacy fields
  title?: string;
  helpful?: number;
  verified?: boolean;
}

// ============================================================================
// ENHANCED PROGRESS INTERFACE
// ============================================================================

export interface CourseProgress {
  completedLectures: number;
  totalLectures: number;
  completedSections: string[];
  lastWatchedLecture?: string;
  timeSpent: number; // in minutes
  completionPercentage: number;
  certificateEarned: boolean;
  
  // Enhanced progress tracking
  watchTime?: number; // in seconds for videos
  interactions?: any; // Track interactions
  currentLessonId?: string;
  streakDays?: number;
  lastAccessedAt?: Date;
  
  // AI insights
  difficultyRating?: number;
  aiRecommendations?: string[];
}

// ============================================================================
// ENHANCED COURSE SETTINGS
// ============================================================================

export interface AccessibilitySettings {
  captions: boolean;
  transcripts: boolean;
  audioDescription: boolean;
  signLanguage?: boolean;
  [key: string]: boolean | undefined;
}

export interface PricingSettings {
  amount: number;
  currency: string;
  discountPercentage: number;
  discountValidUntil?: Date;
  earlyBirdDiscount: boolean;
  installmentPlans: boolean;
}

export interface EnrollmentSettings {
  maxStudents?: number;
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  courseStartDate?: Date;
  courseEndDate?: Date;
  enrollmentDeadline?: string;
  prerequisitesCourse?: string;
  ageRestriction: string;
  waitlistEnabled?: boolean;
}

export interface CommunicationSettings {
  discussionForum: boolean;
  directMessaging: boolean;
  liveChat: boolean;
  announcementEmails: boolean;
  [key: string]: boolean | undefined;
}

export interface CompletionSettings {
  passingGrade: number;
  allowRetakes: boolean;
  maxAttempts?: number;
  timeLimit?: number;
  certificateTemplate?: string;
}

export interface ContentAccessSettings {
  downloadableResources: boolean;
  offlineAccess: boolean;
  mobileOptimized: boolean;
  printableMaterials: boolean;
  [key: string]: boolean | undefined;
}

export interface MarketingSettings {
  featuredCourse: boolean;
  courseTags: string[];
  difficultyRating: string;
  estimatedDuration?: string;
}

export interface CourseSettings {
  isPublic: boolean;
  isFeatured?: boolean;
  enrollmentType: EnrollmentType;
  language: string;
  subtitleLanguages?: string[];
  certificate: boolean;
  certificateTemplate?: string;
  seoDescription?: string;
  seoTags: string[];
  accessibility?: AccessibilitySettings;
  pricing?: PricingSettings;
  enrollment?: EnrollmentSettings;
  communication?: CommunicationSettings;
  completion?: CompletionSettings;
  content?: ContentAccessSettings;
  marketing?: MarketingSettings;
}

// ============================================================================
// ENHANCED ANNOUNCEMENT INTERFACE
// ============================================================================

export interface CourseAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  publishAt: Date;
  expiresAt?: Date;
  sendEmail: boolean;
  sendPush: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ENHANCED CERTIFICATE INTERFACE
// ============================================================================

export interface Certificate {
  id: string;
  certificateId: string; // Public certificate ID
  templateUrl: string;
  issueDate: Date;
  expiryDate?: Date;
  isVerified: boolean;
  completionScore?: number;
  completionTime: number; // hours
  grade?: string;
  verificationCode: string;
  isPublic: boolean;
  userId: string;
  courseId: string;
}

// ============================================================================
// ENHANCED ENROLLMENT INTERFACE
// ============================================================================

export interface Enrollment {
  id: string;
  enrolledAt: Date;
  completedAt?: Date;
  status: EnrollmentStatus;
  progress: number; // 0-100
  currentLessonId?: string;
  
  // Enhanced enrollment features
  enrollmentSource: EnrollmentSource;
  completedLessons: number;
  totalLessons: number;
  
  // Payment info
  paymentStatus: PaymentStatus;
  paymentId?: string;
  amountPaid?: number;
  discountApplied?: number;
  
  // Learning analytics
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastAccessedAt?: Date;
  
  // Certificates
  certificateEarned: boolean;
  certificateEarnedAt?: Date;
  
  userId: string;
  courseId: string;
}

// ============================================================================
// ENHANCED MAIN COURSE INTERFACE
// ============================================================================

export interface Course {
  // Basic Information
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
 
  description: string;
  shortDescription?: string;

  // Enhanced media
  
  thumbnail?: string;

  trailer?: string;
  galleryImages?: string[];

  // Categorization & SEO
  category: string;
  subcategory?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoTags?: string[];
  marketingTags?: string[];
  targetAudience?: string[];

  // Enhanced pricing
  price: number;
  originalPrice?: number;
  enrollmentType?: EnrollmentType;
  
  currency: string;
  discountPercent?: number;
  discountValidUntil?: Date;

  // Course metrics
  ratingCount: number;
  totalDuration: string;
  totalLectures: number;
  totalSections: number;
  level: CourseLevel;
  revenue?: number;

  // Enhanced course properties
  difficulty?: number; // 1.0-5.0
  intensityLevel?: CourseIntensity;
  estimatedHours?: number;
  estimatedMinutes?: number;
  version?: string;
  lastMajorUpdate?: Date;

  // Badge and marketing properties
  badge?: string;
  badgeColor?: CourseBadgeColor;
 
  isBestseller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  trending?: boolean; 

  // Instructor
  instructor: CourseInstructor;
  instructorId?: string;

  // Content structure
  sections: CourseSection[];
  quizzes?: Quiz[];
  assignments?: Assignment[];
  announcements?: CourseAnnouncement[];

  // Requirements & learning outcomes
  requirements: string[];
  whatYouLearn: string[];
  objectives?: string[];
  prerequisites?: string[];

  // Course details
  language: string;
  hasSubtitles: boolean;
  subtitleLanguages?: string[];
  hasCertificate: boolean;
  hasLifetimeAccess: boolean;
  hasMobileAccess: boolean;

  // Enhanced features
  
  hasLiveSessions?: boolean;

  hasDiscussions?: boolean;
  hasAssignments?: boolean;
  downloadableResources?: boolean | number;

  mobileOptimized?: boolean;

  // Scheduling & availability
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  courseStartDate?: Date;
  courseEndDate?: Date;

  // Capacity management
  maxStudents?: number;
  currentEnrollments?: number;
  waitlistEnabled?: boolean;

  // Reviews
  reviews: CourseReview[];

  // Progress (for enrolled students)
  progress?: CourseProgress;
  enrollment?: Enrollment;

  // Settings
  settings?: CourseSettings;
  accessibility?: AccessibilitySettings;
  metadata?: any;

  // Status & metadata
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  archivedAt?: Date;

  

  // Analytics
  views?: number;
  uniqueViews?: number;
  avgRating?: number;
  totalRatings?: number;
  completionRate?: number;

  // Additional content metrics
  codingExercises?: number;
  articles?: number;
  quizCount?: number;
  assignmentCount?: number;

  // User-specific fields


  // Content organization
  organizedContent?: {
    contentByLecture: Record<string, any>;
    summary: {
      totalLectures: number;
      totalContent: number;
      contentTypes: Record<string, number>;
      lectureBreakdown: Record<string, any>;
    };
  };


}

// ============================================================================
// ENHANCED API DATA INTERFACES
// ============================================================================

export interface CourseData {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  level: CourseLevel;
  
  // Enhanced media
  thumbnail?: string;
  trailer?: string;
  galleryImages?: string[];
  
  // Enhanced pricing
  price: number;
  originalPrice?: number;
  currency?: string;
  discountPercent?: number;
  discountValidUntil?: Date;
  
  // Enhanced duration & difficulty
  estimatedHours?: number;
  estimatedMinutes?: number;
  difficulty?: number;
  intensityLevel?: CourseIntensity;
  
  // Enhanced capacity
  maxStudents?: number;
  waitlistEnabled?: boolean;
  
  // Enhanced scheduling
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  courseStartDate?: Date;
  courseEndDate?: Date;
  
  // Enhanced content structure
  objectives: string[];
  prerequisites: string[];
  whatYouLearn?: string[];
  requirements?: string[];
  
  // Enhanced SEO & marketing
  seoTitle?: string;
  seoDescription?: string;
  seoTags?: string[];
  marketingTags?: string[];
  targetAudience?: string[];
  
  // Enhanced features
  hasAITutor?: boolean;
  aiPersonality?: string;
  hasAIQuizzes?: boolean;
  hasInteractiveElements?: boolean;
  hasLiveSessions?: boolean;
  hasProjectWork?: boolean;
  hasDiscussions?: boolean;
  hasAssignments?: boolean;
  hasQuizzes?: boolean;
  downloadableResources?: boolean;
  offlineAccess?: boolean;
  mobileOptimized?: boolean;
  
  // Versioning
  version?: string;
  
  sections: CourseSection[];
  settings?: CourseSettings;
  additionalContent?: ContentItem[];
  
  // Metadata
  instructorId?: string;
  status?: CourseStatus;
  views?: number;
  uniqueViews?: number;
  avgRating?: number;
  totalRatings?: number;
  completionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  archivedAt?: Date;
  enrollmentType?: EnrollmentType;
  
  // Enhanced metadata
  metadata?: any;
}

// ============================================================================
// ENHANCED API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  warnings?: string[];
  metadata?: any;
}

export interface CourseCreationResponse extends ApiResponse {
  course?: CourseData | Course;
  completionPercentage?: number;
  nextSteps?: string[];
  readyForReview?: boolean;
  isValid?: boolean;
  validationScore?: number;
}

export interface CourseDraftResponse extends ApiResponse {
  draftData?: any;
  currentStep?: number;
  completionScore?: number;
  version?: number;
  lastAutoSave?: Date;
  saveCount?: number;
}

export interface ContentCreationResponse extends ApiResponse {
  contentItem?: ContentItem;
  fileInfo?: FileUploadInfo;
}

export interface FileUploadResponse extends ApiResponse {
  fileInfo?: FileUploadInfo;
}

export interface FileUploadInfo {
  file_url: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  filePath?: string;
}

// Enhanced analytics responses
export interface CourseAnalyticsResponse extends ApiResponse {
  analytics?: {
    course: {
      id: string;
      title: string;
      views: number;
      uniqueViews: number;
      avgRating: number;
      totalRatings: number;
    };
    enrollments: {
      total: number;
      active: number;
      completed: number;
      completionRate: number;
      averageProgress: number;
    };
    revenue: {
      total: number;
      currency: string;
    };
    engagement: {
      totalDiscussions: number;
      totalReviews: number;
      averageTimeSpent: number;
      retentionRate: number;
    };
    trends: {
      enrollments: Record<string, { count: number; revenue: number }>;
      completion: Record<string, number>;
      engagement: Record<string, number>;
    };
    insights: {
      topPerformingLessons: any[];
      strugglingStudents: number;
      recommendedImprovements: string[];
      contentGaps: string[];
    };
    comparisons: {
      categoryAverage: number;
      industryBenchmark: number;
      previousPeriod: number;
    };
  };
}

export interface CourseSearchResponse extends ApiResponse {
  courses?: Course[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  facets?: {
    categories: Array<{ name: string; count: number }>;
    levels: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number; avg: number };
    durationRange: { min: number; max: number; avg: number };
  };
}

export interface CourseRecommendationsResponse extends ApiResponse {
  courses?: Course[];
  metadata?: {
    basedOn: {
      enrollments: number;
      bookmarks: number;
      categories: string[];
      tags: string[];
    };
  };
}

// ============================================================================
// ENHANCED FILE UPLOAD TYPES
// ============================================================================

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  section?: string;
  lecture?: string;
  uploadedAt: Date;
  serverData?: any;
  version?: string;
  checksum?: string;
}

export interface TextContent extends UploadedFile {
  title: string;
  content: string;
  description?: string;
  createdAt: Date;
}

export interface Resource extends UploadedFile {
  title: string;
  description?: string;
  url: string;
  resourceType: string;
  createdAt: Date;
}

// ============================================================================
// ENHANCED FORM TYPES
// ============================================================================

export interface CourseInformationForm {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  currency: string;
  objectives: string[];
  prerequisites: string[];
  whatYouLearn?: string[];
  requirements?: string[];
  thumbnail?: File;
  trailer?: string;
  galleryImages?: string[];
  
  // Enhanced form fields
  estimatedHours?: number;
  estimatedMinutes?: number;
  difficulty?: number;
  intensityLevel?: CourseIntensity;
  maxStudents?: number;
  waitlistEnabled?: boolean;
  
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoTags?: string[];
  marketingTags?: string[];
  targetAudience?: string[];
}

export interface CourseStructureForm {
  sections: CourseSection[];
}

export interface CourseSettingsForm extends CourseSettings {}

// ============================================================================
// ENHANCED VALIDATION TYPES
// ============================================================================

export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completionPercentage?: number;
  validationDetails?: {
    basicInfo: boolean;
    content: boolean;
    pricing: boolean;
    settings: boolean;
    accessibility: boolean;
    seo: boolean;
  };
  missingRequirements?: string[];
  recommendations?: string[];
}

export interface ValidationRule {
  field: string;
  message: string;
  validator: (value: any, data: CourseData) => boolean;
}

export interface ValidationError extends Error {
  field: string;
  rule: string;
  code?: string;
  details?: any;
}

export interface StepValidationConfig {
  step: number;
  rules: ValidationRule[];
  warnings?: ValidationRule[];
}

// ============================================================================
// ENHANCED STORE TYPES
// ============================================================================

export interface UploadProgressItem {
  progress: number;
  status: "uploading" | "complete" | "error";
  fileName: string;
  fileSize: number;
}

export interface UploadedFilesState {
  videos: UploadedFile[];
  audio: UploadedFile[];
  documents: UploadedFile[];
  images: UploadedFile[];
  archives: UploadedFile[];
  text: TextContent[];
  assignments: Assignment[];
  resources: Resource[];
  quizzes: Quiz[];
  presentations: UploadedFile[];
  spreadsheets: UploadedFile[];
  ebooks: UploadedFile[];
}

// ============================================================================
// ENHANCED FILTER TYPES
// ============================================================================


export interface priceRange {
  min: number;
  max: number;
}
export interface CourseFilters {
  search?: string;  
  categories?: string[];
  subcategories?: string[];
  levels?: CourseLevel[];
  priceRange?: { min: number; max: number };
  durations?: string[];
  ratings?: number[];
  instructors?: string[];
  languages?: string[];
  features?: string[];
  tags?: string[];
  enrollmentTypes?: EnrollmentType[];
  showFeatured?: boolean;
  showNew?: boolean;
  showBestsellers?: boolean;
  sortBy?: "newest" | "popular" | "rating" | "price-low" | "price-high" | "duration" | "enrollments";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  description?: string;
  courseCount?: number;
  subcategories?: CourseCategory[];
}

// ============================================================================
// ENHANCED ERROR TYPES
// ============================================================================

export interface CourseCreationError extends Error {
  code?: string;
  field?: string;
  details?: any;
}

export interface UploadError extends CourseCreationError {
  fileName: string;
  fileSize: number;
  fileType: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// ENHANCED CONSTANTS
// ============================================================================

export const COURSE_CATEGORIES = [
  "technology",
  "business",
  "design",
  "marketing",
  "programming",
  "data-science",
  "photography",
  "music",
  "health",
  "language",
  "arts",
  "science",
  "mathematics",
  "cooking",
  "fitness",
  "personal-development",
  "finance",
  "education",
  "lifestyle",
  "sports",
] as const;

export const COURSE_LEVELS: CourseLevel[] = [
  "BEGINNER",
  "INTERMEDIATE", 
  "ADVANCED",
  "EXPERT",
  "ALL_LEVELS",
];

export const COURSE_INTENSITIES: CourseIntensity[] = [
  "LIGHT",
  "REGULAR",
  "INTENSIVE",
  "BOOTCAMP",
];

export const ENROLLMENT_TYPES: EnrollmentType[] = [
  "FREE",
  "PAID",
  "SUBSCRIPTION",
  "INVITATION_ONLY",
  "WAITLIST",
];

export const LECTURE_TYPES: LectureType[] = [
  "VIDEO",
  "TEXT",
  "AUDIO",
  "QUIZ",
  "ASSIGNMENT",
  "IMAGE",
  "ARCHIVE",
  "RESOURCE",
];

export const CONTENT_TYPES: ContentType[] = [
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
  "TEXT",
  "QUIZ",
  "ASSIGNMENT",
  "IMAGE",
  "ARCHIVE",
  "RESOURCE",
];

export const VIDEO_PROVIDERS: VideoProvider[] = [
  "YOUTUBE",
  "VIMEO",
  "WISTIA",
  "SELF_HOSTED",
  "AWS_S3",
  "CLOUDINARY",
];

export const QUESTION_TYPES: QuestionType[] = [
  "MULTIPLE_CHOICE",
  "SINGLE_CHOICE",
  "TRUE_FALSE",
  "FILL_IN_BLANK",
  "ESSAY",
  "MATCHING",
  "ORDERING",
  "NUMERIC",
];

export const ASSIGNMENT_TYPES: AssignmentType[] = [
  "TEXT",
  "FILE_UPLOAD",
  "URL_SUBMISSION",
  "PEER_REVIEW",
];

export const COURSE_STATUSES: CourseStatus[] = [
  "DRAFT",
  "UNDER_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
  "COMING_SOON",
];

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "SUSPENDED",
  "REFUNDED",
  "EXPIRED",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "FREE",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIAL_REFUND",
];

export const REVIEW_STATUSES: ReviewStatus[] = [
  "PUBLISHED",
  "PENDING",
  "FLAGGED",
  "HIDDEN",
];

// Enhanced file format support
export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/wmv",
  "video/flv",
] as const;

export const SUPPORTED_AUDIO_FORMATS = [
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  "audio/m4a",
] as const;

export const SUPPORTED_DOCUMENT_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/plain", // .txt
  "text/csv", // .csv
  "application/rtf", // .rtf
] as const;

export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
] as const;

export const SUPPORTED_ARCHIVE_FORMATS = [
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
] as const;

export const SUPPORTED_EBOOK_FORMATS = [
  "application/epub+zip", // .epub
  "application/x-mobipocket-ebook", // .mobi
  "application/vnd.amazon.ebook", // .azw
] as const;

// Enhanced file size limits (in bytes)
export const MAX_FILE_SIZES = {
  video: 2 * 1024 * 1024 * 1024, // 2GB
  audio: 500 * 1024 * 1024, // 500MB
  document: 100 * 1024 * 1024, // 100MB
  image: 25 * 1024 * 1024, // 25MB
  archive: 500 * 1024 * 1024, // 500MB
  presentation: 100 * 1024 * 1024, // 100MB
  spreadsheet: 50 * 1024 * 1024, // 50MB
  ebook: 100 * 1024 * 1024, // 100MB
  scorm: 500 * 1024 * 1024, // 500MB
} as const;

// Default course settings
export const DEFAULT_COURSE_SETTINGS: CourseSettings = {
  isPublic: true,
  isFeatured: false,
  enrollmentType: "FREE",
  language: "en",
  subtitleLanguages: [],
  certificate: false,
  seoTags: [],
  accessibility: {
    captions: false,
    transcripts: false,
    audioDescription: false,
    signLanguage: false,
  },
  pricing: {
    amount: 0,
    currency: "USD",
    discountPercentage: 0,
    earlyBirdDiscount: false,
    installmentPlans: false,
  },
  enrollment: {
    ageRestriction: "none",
    waitlistEnabled: false,
  },
  communication: {
    discussionForum: true,
    directMessaging: false,
    liveChat: false,
    announcementEmails: true,
  },
  completion: {
    passingGrade: 70,
    allowRetakes: true,
    certificateTemplate: "default",
  },
  content: {
    downloadableResources: true,
    offlineAccess: false,
    mobileOptimized: true,
    printableMaterials: false,
  },
  marketing: {
    featuredCourse: false,
    courseTags: [],
    difficultyRating: "beginner",
  },
};

// Course validation constants
export const VALIDATION_RULES = {
  title: {
    minLength: 10,
    maxLength: 100,
  },
  description: {
    minLength: 100,
    maxLength: 5000,
  },
  shortDescription: {
    minLength: 50,
    maxLength: 200,
  },
  objectives: {
    minCount: 3,
    maxCount: 10,
    itemMinLength: 10,
    itemMaxLength: 200,
  },
  prerequisites: {
    maxCount: 10,
    itemMaxLength: 200,
  },
  whatYouLearn: {
    minCount: 3,
    maxCount: 15,
    itemMinLength: 10,
    itemMaxLength: 200,
  },
  requirements: {
    maxCount: 10,
    itemMaxLength: 200,
  },
  sections: {
    minCount: 1,
    maxCount: 50,
  },
  lectures: {
    minCountPerSection: 1,
    maxCountPerSection: 100,
  },
  price: {
    min: 0,
    max: 10000,
  },
} as const;

// UI Constants
export const COURSE_BADGE_COLORS: Record<CourseBadgeColor, string> = {
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-cyan-100 text-cyan-800",
};

// Content type icons mapping (you can use your preferred icon library)
export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  VIDEO: "🎥",
  AUDIO: "🎵",
  DOCUMENT: "📄",
  TEXT: "📝",
  QUIZ: "❓",
  ASSIGNMENT: "📋",
  RESOURCE: "📎",
  IMAGE: "🖼️",
  ARCHIVE: "📦",
};

export const LECTURE_TYPE_ICONS: Record<LectureType, string> = {
  VIDEO: "🎥",
  TEXT: "📝",
  AUDIO: "🎵",
  QUIZ: "❓",
  ASSIGNMENT: "📋",
  IMAGE: "🖼️",
  DOCUMENT: "📄",
  ARCHIVE: "📁",
  RESOURCE: "📂",
};

// Duration formatting helpers
export const DURATION_UNITS = {
  SECONDS: "seconds",
  MINUTES: "minutes", 
  HOURS: "hours",
  DAYS: "days",
} as const;

// Difficulty levels with numeric mapping
export const DIFFICULTY_LEVELS: Record<CourseLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
  ALL_LEVELS: 0,
};

// Intensity levels with numeric mapping  
export const INTENSITY_LEVELS: Record<CourseIntensity, number> = {
  LIGHT: 1,
  REGULAR: 2,
  INTENSIVE: 3,
  BOOTCAMP: 4,
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
};

// Language codes and names
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  tr: "Turkish",
  pl: "Polish",
  nl: "Dutch",
};

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Search and filter defaults
export const SEARCH_DEFAULTS = {
  MIN_SEARCH_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
} as const;

// Analytics time ranges
export const ANALYTICS_TIME_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 12 months", value: "12m" },
  { label: "All time", value: "all" },
] as const;

// Notification priorities with colors
export const NOTIFICATION_PRIORITY_COLORS: Record<NotificationPriority, string> = {
  LOW: "text-gray-600",
  NORMAL: "text-blue-600", 
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

// Course creation steps
export const COURSE_CREATION_STEPS = [
  { id: 1, name: "Basic Information", description: "Course title, description, and category" },
  { id: 2, name: "Course Structure", description: "Sections and lectures" },
  { id: 3, name: "Content Upload", description: "Videos, documents, and resources" },
  { id: 4, name: "Pricing & Settings", description: "Price, accessibility, and course settings" },
  { id: 5, name: "Review & Publish", description: "Review course and publish" },
] as const;

// Export type for the steps
export type CourseCreationStep = typeof COURSE_CREATION_STEPS[number];

// Progress calculation weights
export const COMPLETION_WEIGHTS = {
  BASIC_INFO: 25,
  CONTENT_STRUCTURE: 25,
  MEDIA_CONTENT: 20,
  LEARNING_OBJECTIVES: 15,
  SETTINGS: 10,
  SEO_MARKETING: 5,
} as const;

// Feature flags for course capabilities
export const COURSE_FEATURES = {
  AI_TUTOR: "hasAITutor",
  AI_QUIZZES: "hasAIQuizzes", 
  INTERACTIVE_ELEMENTS: "hasInteractiveElements",
  LIVE_SESSIONS: "hasLiveSessions",
  PROJECT_WORK: "hasProjectWork",
  DISCUSSIONS: "hasDiscussions",
  ASSIGNMENTS: "hasAssignments",
  QUIZZES: "hasQuizzes",
  DOWNLOADABLE_RESOURCES: "downloadableResources",
  OFFLINE_ACCESS: "offlineAccess",
  MOBILE_OPTIMIZED: "mobileOptimized",
  CERTIFICATES: "certificate",
  SUBTITLES: "hasSubtitles",
  LIFETIME_ACCESS: "hasLifetimeAccess",
} as const;

export type CourseFeature = keyof typeof COURSE_FEATURES;

// ============================================================================
// TYPE GUARDS AND UTILITY FUNCTIONS
// ============================================================================

export const isCourseLevel = (value: string): value is CourseLevel => {
  return COURSE_LEVELS.includes(value as CourseLevel);
};

export const isContentType = (value: string): value is ContentType => {
  return CONTENT_TYPES.includes(value as ContentType);
};

export const isLectureType = (value: string): value is LectureType => {
  return LECTURE_TYPES.includes(value as LectureType);
};

export const isCourseStatus = (value: string): value is CourseStatus => {
  return COURSE_STATUSES.includes(value as CourseStatus);
};

export const isEnrollmentType = (value: string): value is EnrollmentType => {
  return ENROLLMENT_TYPES.includes(value as EnrollmentType);
};

// Utility function to format duration
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  
  return `${size} ${sizes[i]}`;
};

// Utility function to calculate completion percentage
export const calculateCompletionPercentage = (
  completedLectures: number,
  totalLectures: number
): number => {
  if (totalLectures === 0) return 0;
  return Math.round((completedLectures / totalLectures) * 100);
};

// Utility function to get course level color
export const getCourseLevelColor = (level: CourseLevel): string => {
  const colors: Record<CourseLevel, string> = {
    BEGINNER: "text-green-600 bg-green-100",
    INTERMEDIATE: "text-blue-600 bg-blue-100", 
    ADVANCED: "text-orange-600 bg-orange-100",
    EXPERT: "text-red-600 bg-red-100",
    ALL_LEVELS: "text-purple-600 bg-purple-100",
  };
  return colors[level] || colors.BEGINNER;
};

// Utility function to get enrollment status color
export const getEnrollmentStatusColor = (status: EnrollmentStatus): string => {
  const colors: Record<EnrollmentStatus, string> = {
    ACTIVE: "text-green-600 bg-green-100",
    COMPLETED: "text-blue-600 bg-blue-100",
    CANCELLED: "text-gray-600 bg-gray-100",
    SUSPENDED: "text-orange-600 bg-orange-100",
    REFUNDED: "text-yellow-600 bg-yellow-100",
    EXPIRED: "text-red-600 bg-red-100",
  };
  return colors[status] || colors.ACTIVE;
};

// Utility function to validate file type
export const isValidFileType = (file: File, allowedTypes: readonly string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Utility function to validate file size
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// Default export for convenience
export default {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  COURSE_INTENSITIES,
  ENROLLMENT_TYPES,
  LECTURE_TYPES,
  CONTENT_TYPES,
  VIDEO_PROVIDERS,
  QUESTION_TYPES,
  ASSIGNMENT_TYPES,
  COURSE_STATUSES,
  ENROLLMENT_STATUSES,
  PAYMENT_STATUSES,
  REVIEW_STATUSES,
  SUPPORTED_VIDEO_FORMATS,
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_DOCUMENT_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_ARCHIVE_FORMATS,
  SUPPORTED_EBOOK_FORMATS,
  MAX_FILE_SIZES,
  DEFAULT_COURSE_SETTINGS,
  VALIDATION_RULES,
  COURSE_BADGE_COLORS,
  CONTENT_TYPE_ICONS,
  LECTURE_TYPE_ICONS,
  DURATION_UNITS,
  DIFFICULTY_LEVELS,
  INTENSITY_LEVELS,
  CURRENCY_SYMBOLS,
  SUPPORTED_LANGUAGES,
  PAGINATION_DEFAULTS,
  SEARCH_DEFAULTS,
  ANALYTICS_TIME_RANGES,
  NOTIFICATION_PRIORITY_COLORS,
  COURSE_CREATION_STEPS,
  COMPLETION_WEIGHTS,
  COURSE_FEATURES,
  // Utility functions
  isCourseLevel,
  isContentType,
  isLectureType,
  isCourseStatus,
  isEnrollmentType,
  formatDuration,
  formatFileSize,
  calculateCompletionPercentage,
  getCourseLevelColor,
  getEnrollmentStatusColor,
  isValidFileType,
  isValidFileSize,
};