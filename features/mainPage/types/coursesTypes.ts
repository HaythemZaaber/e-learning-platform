import { ReactNode } from "react";
import { StaticImageData } from "next/image";

export interface Course {
  id: number;
  title: string;
  category: string;
  teacher: string;
  teacherRole: string;
  teacherAvatar: StaticImageData;
  rating: number;
  ratingCount: number;
  duration: string;
  lessons: number;
  students: number;
  level: string;
  image: StaticImageData;
  price: number;
  originalPrice: number;
  badge: string;
  badgeColor: string;
  description: string;
  lastUpdated: string;
  tags: string[];
  featured: boolean;
}

export interface Category {
  name: string;
  icon: ReactNode;
}

export interface CoursesSectionProps {
  showFeatured?: boolean;
  selectedCategory?: string;
}
