import { StaticImageData } from "next/image";

export type CourseLevel =
  | "All Levels"
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type CourseBadgeColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface Course {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  category: string;
  level: CourseLevel;
  rating: number;
  ratingCount: number;
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  students: number;
  teacher: string;
  teacherRole: string;
  teacherAvatar: StaticImageData;
  badge?: string;
  badgeColor?: CourseBadgeColor;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  count: number;
}

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
