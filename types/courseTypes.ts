// types/courseTypes.ts
import { StaticImageData } from "next/image";
import { Instructor } from "@/data/instructorsData";

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "All Levels";
export type CourseBadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";
export type LectureType =
  | "video"
  | "article"
  | "quiz"
  | "assignment"
  | "resource";
export type CourseStatus = "draft" | "published" | "archived";

export interface CourseFilters {
  categories?: string[];
  priceRange?: [number, number];
  levels?: CourseLevel[];
  durations?: string[];
  ratings?: number[];
  showFeatured?: boolean;
  search?: string;
  sortBy?: "newest" | "popular" | "rating" | "price-low" | "price-high";
}

// Use the Instructor type from instructorsData
export type CourseInstructor = Instructor;

export interface CourseLecture {
  id: string;
  title: string;
  description?: string;
  duration: string; // "5:30" format
  type: LectureType;
  isCompleted: boolean;
  isLocked: boolean;
  isFree?: boolean; // For preview lectures
  videoUrl?: string;
  articleContent?: string;
  resources?: {
    name: string;
    url: string;
    type: "pdf" | "code" | "link" | "image";
  }[];
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  duration: string; // Total section duration
  lectures: CourseLecture[];
  isLocked: boolean;
  order: number;
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

export interface CourseProgress {
  completedLectures: number;
  totalLectures: number;
  completedSections: string[];
  lastWatchedLecture?: string;
  timeSpent: number; // in minutes
  completionPercentage: number;
  certificateEarned: boolean;
}

export interface Course {
  // Basic Information
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;

  // Media
  image: StaticImageData | string;
  previewVideo?: string;

  // Categorization
  category: string;
  subcategory?: string;
  tags: string[];

  // Pricing
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  currency: string;

  // Course Metrics
  rating: number;
  ratingCount: number;
  totalStudents: number;
  totalDuration: string; // "40 hours"
  totalLectures: number;
  totalSections: number;
  level: CourseLevel;

  // Badge & Features
  badge?: string;
  badgeColor?: CourseBadgeColor;
  featured: boolean;
  bestseller?: boolean;
  trending?: boolean;

  // Instructor
  instructor: CourseInstructor;

  // Content Structure
  sections: CourseSection[];

  // Requirements & Learning Outcomes
  requirements: string[];
  whatYoullLearn: string[];
  targetAudience: string[];

  // Course Details
  language: string;
  hasSubtitles: boolean;
  subtitleLanguages?: string[];
  hasCertificate: boolean;
  hasLifetimeAccess: boolean;
  hasMobileAccess: boolean;

  // Reviews
  reviews: CourseReview[];

  // Progress (for enrolled students)
  progress?: CourseProgress;

  // Metadata
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // SEO & Marketing
  slug: string;
  metaTitle?: string;
  metaDescription?: string;

  // Additional Features
  downloadableResources: number;
  codingExercises: number;
  articles: number;
  quizzes: number;
  assignments: number;
}

// Category with icon
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  description?: string;
  courseCount?: number;
}
