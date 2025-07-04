import {
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Users,
  Award,
  MoreHorizontal,
} from "lucide-react";
import course from "@/public/images/courses/course.jpg";
import programming from "@/public/images/courses/programming.jpg";
import math from "@/public/images/courses/math.jpg";
import { Course, CourseLevel, CourseBadgeColor } from "../types/coursesTypes";

export const categories = [
  { name: "All", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Programming", icon: <TrendingUp className="h-4 w-4" /> },
  { name: "Mathematics", icon: <CheckCircle2 className="h-4 w-4" /> },
  { name: "Languages", icon: <Users className="h-4 w-4" /> },
  { name: "Science", icon: <Award className="h-4 w-4" /> },
  { name: "More", icon: <MoreHorizontal className="h-4 w-4" /> },
];

export const coursesData: Course[] = [
  {
    id: "1",
    title: "JavaScript Mastery: From Beginner to Professional",
    category: "Programming",
    teacher: "Jane Doe",
    teacherRole: "Senior Developer",
    teacherAvatar: course,
    rating: 4.8,
    ratingCount: 1248,
    duration: "12h 30m",
    lessons: 24,
    students: 3452,
    level: "Beginner" as CourseLevel,
    image: programming,
    price: 49.99,
    originalPrice: 89.99,
    badge: "Trending",
    badgeColor: "primary" as CourseBadgeColor,
    description:
      "Master JavaScript fundamentals, ES6 features, async programming and build real-world applications.",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-04-01"),
    featured: true,
  },
  {
    id: "2",
    title: "Algebra Fundamentals: Equations & Functions",
    category: "Mathematics",
    teacher: "John Smith",
    teacherRole: "Math Professor",
    teacherAvatar: course,
    rating: 4.6,
    ratingCount: 856,
    duration: "10h 15m",
    lessons: 18,
    students: 2156,
    level: "Intermediate" as CourseLevel,
    image: math,
    price: 39.99,
    originalPrice: 59.99,
    badge: "New",
    badgeColor: "success" as CourseBadgeColor,
    description:
      "Learn algebraic concepts, equations, inequalities, and functions with practical examples.",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-05-01"),
    featured: false,
  },
  {
    id: "3",
    title: "French for Beginners: Conversational Fluency",
    category: "Languages",
    teacher: "Emma Brown",
    teacherRole: "Language Expert",
    teacherAvatar: course,
    rating: 4.9,
    ratingCount: 2035,
    duration: "8h 45m",
    lessons: 32,
    students: 5689,
    level: "Beginner" as CourseLevel,
    image: course,
    price: 0,
    originalPrice: 49.99,
    badge: "Free",
    badgeColor: "info" as CourseBadgeColor,
    description:
      "Start speaking French with confidence through practical conversation exercises and vocabulary building.",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-03-01"),
    featured: true,
  },
  {
    id: "4",
    title: "Python Data Science Toolkit",
    category: "Programming",
    teacher: "Michael Chen",
    teacherRole: "Data Scientist",
    teacherAvatar: course,
    rating: 4.7,
    ratingCount: 1532,
    duration: "15h 20m",
    lessons: 28,
    students: 4230,
    level: "Intermediate" as CourseLevel,
    image: programming,
    price: 59.99,
    originalPrice: 99.99,
    badge: "Bestseller",
    badgeColor: "secondary" as CourseBadgeColor,
    description:
      "Learn Python for data science, including pandas, NumPy, Matplotlib and machine learning basics.",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-06-01"),
    featured: true,
  },
  {
    id: "5",
    title: "Chemistry 101: Matter and Reactions",
    category: "Science",
    teacher: "Sarah Johnson",
    teacherRole: "Chemistry Professor",
    teacherAvatar: course,
    rating: 4.5,
    ratingCount: 782,
    duration: "11h 45m",
    lessons: 22,
    students: 1856,
    level: "Beginner" as CourseLevel,
    image: math,
    price: 44.99,
    originalPrice: 69.99,
    description:
      "Explore fundamental chemistry concepts including atoms, molecules, and chemical reactions.",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-05-01"),
    featured: false,
  },
  {
    id: "6",
    title: "Digital Marketing Fundamentals",
    category: "More",
    teacher: "David Wilson",
    teacherRole: "Marketing Director",
    teacherAvatar: course,
    rating: 4.8,
    ratingCount: 2145,
    duration: "9h 30m",
    lessons: 20,
    students: 6542,
    level: "Beginner" as CourseLevel,
    image: programming,
    price: 54.99,
    originalPrice: 89.99,
    badge: "Hot",
    badgeColor: "error" as CourseBadgeColor,
    description:
      "Learn SEO, social media marketing, content strategy, and paid advertising fundamentals.",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-04-01"),
    featured: true,
  },
];
