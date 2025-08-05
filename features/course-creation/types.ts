// types/course.ts
// Import unified types from the main courseTypes file
import {
  CourseLevel,
  LectureType,
  CourseSettings,
  ContentItem,
  CourseLecture,
  CourseSection,
  CourseData,
  UploadedFile,
  TextContent,
  Assignment,
  Resource,
  Quiz,
  QuizQuestion,
  ApiResponse,
  CourseCreationResponse,
  CourseDraftResponse,
  ContentCreationResponse,
  FileUploadResponse,
  CourseInformationForm,
  CourseStructureForm,
  CourseSettingsForm,
  StepValidation,
  ValidationRule,
  StepValidationConfig,
  UploadProgressItem,
  UploadedFilesState,
  DeepPartial,
  RequiredFields,
  OptionalFields,
  CourseCreationError,
  ValidationError,
  UploadError,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  ENROLLMENT_TYPES,
  LECTURE_TYPES,
  SUPPORTED_VIDEO_FORMATS,
  SUPPORTED_DOCUMENT_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZES,
} from "@/types/courseTypes";

// Re-export all types for backward compatibility
export type {
  CourseLevel,
  LectureType,
  CourseSettings,
  ContentItem,
  CourseLecture,
  CourseSection,
  CourseData,
  UploadedFile,
  TextContent,
  Assignment,
  Resource,
  Quiz,
  QuizQuestion,
  ApiResponse,
  CourseCreationResponse,
  CourseDraftResponse,
  ContentCreationResponse,
  FileUploadResponse,
  CourseInformationForm,
  CourseStructureForm,
  CourseSettingsForm,
  StepValidation,
  ValidationRule,
  StepValidationConfig,
  UploadProgressItem,
  UploadedFilesState,
  DeepPartial,
  RequiredFields,
  OptionalFields,
  CourseCreationError,
  ValidationError,
  UploadError,
};

// Re-export constants
export {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  ENROLLMENT_TYPES,
  LECTURE_TYPES,
  SUPPORTED_VIDEO_FORMATS,
  SUPPORTED_DOCUMENT_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZES,
};

// Additional types specific to course creation that aren't in the main file
export type EnrollmentType = "FREE" | "PAID" | "SUBSCRIPTION";
export type ContentType = LectureType;
export type LessonType = LectureType;

// Additional interfaces specific to course creation
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

