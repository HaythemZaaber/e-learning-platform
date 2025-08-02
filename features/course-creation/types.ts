// types/course.ts

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type EnrollmentType = "FREE" | "PAID" | "SUBSCRIPTION";
export type ContentType =
  | "video"
  | "audio"
  | "text"
  | "document"
  | "image"
  | "assignment"
  | "quiz"
  | "link"
  | "archive";
export type LessonType = "video" | "text" | "quiz" | "assignment" | "resource";

export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

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
  earlyBirdDiscount: boolean;
  installmentPlans: boolean;
}

export interface EnrollmentSettings {
  maxStudents?: number;
  enrollmentDeadline?: string;
  prerequisitesCourse?: string;
  ageRestriction: string;
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
  timeLimit?: number;
  certificateTemplate: string;
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
  enrollmentType: EnrollmentType;
  language: string;
  certificate: boolean;
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
  order: number;
  isPublished?: boolean;
  courseId?: string;
  lessonId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  duration: number;
  content?: string;
  order?: number;
  isPreview?: boolean;
  isInteractive?: boolean;
  contentItems?: ContentItem[];
  settings?: any;
  status?: string;
  sectionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order?: number;
  lectures: Lecture[];
  courseId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseData {
  id?: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  level: CourseLevel;
  thumbnail?: string;
  trailer?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  objectives: string[];
  prerequisites: string[];
  whatYouLearn?: string[];
  seoTags?: string[];
  marketingTags?: string[];
  sections: Section[];
  settings?: CourseSettings;
  additionalContent?: ContentItem[];

  // Metadata
  instructorId?: string;
  status?: string;
  views?: number;
  avgRating?: number;
  totalRatings?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

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
}

export interface TextContent extends UploadedFile {
  title: string;
  content: string;
  description?: string;
  createdAt: Date;
}

export interface Assignment extends UploadedFile {
  title: string;
  description: string;
  instructions?: string;
  dueDate?: string;
  points?: number;
  createdAt: Date;
}

export interface Resource extends UploadedFile {
  title: string;
  description?: string;
  url: string;
  resourceType: string;
  createdAt: Date;
}

export interface Quiz extends UploadedFile {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  attempts?: number;
  passingScore?: number;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

export interface CourseCreationResponse extends ApiResponse {
  course?: CourseData;
  completionPercentage?: number;
}

export interface CourseDraftResponse extends ApiResponse {
  draftData?: any;
  currentStep?: number;
  completionScore?: number;
}

export interface ContentCreationResponse extends ApiResponse {
  contentItem?: ContentItem;
}

export interface FileUploadResponse extends ApiResponse {
  fileInfo?: {
    file_url: string;
    originalName: string;
    size: number;
    mimetype: string;
    uploadedAt: string;
  };
}

// Form Types
export interface CourseInformationForm {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: CourseLevel;
  price: number;
  currency: string;
  objectives: string[];
  prerequisites: string[];
  thumbnail?: File;
}

export interface CourseStructureForm {
  sections: Section[];
}

export interface CourseSettingsForm extends CourseSettings {}

// Validation Types
export interface ValidationRule {
  field: string;
  message: string;
  validator: (value: any, data: CourseData) => boolean;
}

export interface StepValidationConfig {
  step: number;
  rules: ValidationRule[];
  warnings?: ValidationRule[];
}

// Store Types
export interface UploadProgressItem {
  progress: number;
  status: "uploading" | "complete" | "error";
  fileName: string;
  fileSize: number;
}

export interface UploadedFilesState {
  videos: UploadedFile[];
  documents: UploadedFile[];
  images: UploadedFile[];
  text: TextContent[];
  assignments: Assignment[];
  resources: Resource[];
  quizzes: Quiz[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Error Types
export interface CourseCreationError extends Error {
  code?: string;
  field?: string;
  details?: any;
}

export interface ValidationError extends CourseCreationError {
  field: string;
  rule: string;
}

export interface UploadError extends CourseCreationError {
  fileName: string;
  fileSize: number;
  fileType: string;
}

// Constants
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
] as const;

export const COURSE_LEVELS: CourseLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export const ENROLLMENT_TYPES: EnrollmentType[] = [
  "FREE",
  "PAID",
  "SUBSCRIPTION",
];

export const CONTENT_TYPES: ContentType[] = [
  "video",
  "audio",
  "text",
  "document",
  "image",
  "assignment",
  "quiz",
  "link",
  "archive",
];

export const LESSON_TYPES: LessonType[] = [
  "video",
  "text",
  "quiz",
  "assignment",
  "resource",
];

export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/avi",
];

export const SUPPORTED_DOCUMENT_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_FILE_SIZES = {
  video: 500 * 1024 * 1024, // 500MB
  document: 50 * 1024 * 1024, // 50MB
  image: 10 * 1024 * 1024, // 10MB
  audio: 100 * 1024 * 1024, // 100MB
  archive: 100 * 1024 * 1024, // 100MB
} as const;
