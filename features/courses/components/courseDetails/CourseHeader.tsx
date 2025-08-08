import {
  Star,
  Clock,
  Users,
  Globe,
  Award,
  ChevronRight,
  Calendar,
  BookOpen,
} from "lucide-react";
import instructor from "@/public/images/courses/course.jpg"
import Image from "next/image";
import { Course } from "@/types/courseTypes";

export function CourseHeader({ course }: { course: Course }) {
  if (!course) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex gap-2 mb-4">
              <div className="h-4 bg-slate-700 rounded w-16"></div>
              <div className="h-4 bg-slate-700 rounded w-2"></div>
              <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
            <div className="h-10 bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="flex gap-4 mb-4">
              <div className="h-6 bg-slate-700 rounded w-24"></div>
              <div className="h-6 bg-slate-700 rounded w-32"></div>
            </div>
            <div className="flex gap-6">
              <div className="h-4 bg-slate-700 rounded w-32"></div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
              <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;

      return (
        <Star
          key={i}
          className={`w-4 h-4 ${
            filled
              ? "fill-yellow-400 text-yellow-400"
              : halfFilled
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-slate-600 text-slate-600"
          }`}
        />
      );
    });
  };

  const getBestseller = () => {
    // Simple logic: if discount price is significantly lower or high student count
    return (
      (course.currentEnrollments || 0) > 5000 ||
      (course.price &&
        course.originalPrice &&
        course.originalPrice < course.price * 0.3)
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-purple-600 text-white py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(var(--secondary-rgb),0.4),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="px-5 relative">
        {/* Breadcrumbs */}
        <nav
          className="flex items-center gap-2 text-sm text-slate-300 mb-6"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <ChevronRight className="w-4 h-4" />
          <a href="/courses" className="hover:text-white transition-colors">
            Courses
          </a>
          {course.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <a
                href={`/categories/${course.category.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {course.category}
              </a>
            </>
          )}
        </nav>

        <div className="max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {getBestseller() && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" />
                Bestseller
              </span>
            )}
            {course.isFeatured && (
              <span className="bg-purple-500/20 border border-purple-400/30 text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
            {course.isTrending && (
              <span className="bg-red-500/20 border border-red-400/30 text-red-200 px-3 py-1 rounded-full text-xs font-medium">
                Trending
              </span>
            )}
          </div>

          {/* Title and Description */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-6 leading-relaxed">
            {course.shortDescription}
          </p>

          {/* Rating and Stats */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(course.avgRating || 0)}
              </div>
              <span className="font-semibold text-lg">{course.avgRating || 0}</span>
              <button className="text-blue-300 hover:text-blue-200 cursor-pointer transition-colors underline-offset-2 hover:underline">
                ({formatNumber(course.totalRatings || 0)} reviews)
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <Users className="w-4 h-4" />
              <span>{formatNumber(course.currentEnrollments || 0)} students</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-slate-300">Created by</span>
            <div className="flex items-center gap-2">
              {course.instructor?.profileImage && (
                <Image
                  src={course.instructor.profileImage}
                  alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                  className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
                />
              )}
              <div>
                <button className="text-blue-300 hover:text-blue-200 font-medium transition-colors underline-offset-2 hover:underline">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </button>
                {course.instructor?.rating && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.instructor.rating}</span>
                    {course.instructor.totalCourses && (
                      <span>• {course.instructor.totalCourses} courses</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.level}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {course.estimatedHours || 0}h {course.estimatedMinutes || 0}m
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{course.language}</span>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLectures || 0} lectures</span>
            </div>
          </div>

          {/* Price Preview (Mobile Only) */}
          <div className="flex lg:hidden items-center gap-4 mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            {course.originalPrice && course.price ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ${course.price}
                </span>
                <span className="text-lg text-slate-400 line-through">
                  ${course.originalPrice}
                </span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  {Math.round(
                    ((course.originalPrice - course.price) / course.originalPrice) * 100
                  )}
                  % OFF
                </span>
              </div>
            ) : course.price ? (
              <span className="text-2xl font-bold">${course.price}</span>
            ) : null}
            <button className="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


