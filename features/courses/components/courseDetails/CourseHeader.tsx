"use client";

import {
  Star,
  Clock,
  Users,
  Globe,
  Award,
  ChevronRight,
  Calendar,
  BookOpen,
  Play,
  Share2,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { Course } from "@/types/courseTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { cn } from "@/lib/utils";

export function CourseHeader({ course }: { course: Course | null }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useCoursePreviewStore();

  const isWishlisted = course ? wishlistItems.has(course.id) : false;

  // Calculate actual total duration from course sections
  const getActualTotalDuration = () => {
    if (!course?.sections) return { hours: 0, minutes: 0 };

    const totalSeconds = course.sections.reduce(
      (total: number, section: any) => {
        const sectionDuration =
          section.lectures?.reduce(
            (lectureTotal: number, lecture: any) =>
              lectureTotal + (lecture.duration || 0),
            0
          ) || 0;
        return total + sectionDuration;
      },
      0
    );

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return { hours, minutes };
  };

  const actualDuration = getActualTotalDuration();

  // Loading skeleton
  if (!course) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20 bg-white/20" />
              <Skeleton className="h-6 w-20 bg-white/20" />
              <Skeleton className="h-6 w-20 bg-white/20" />
            </div>
            <Skeleton className="h-12 w-3/4 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-1/2 mb-4 bg-white/20" />
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-6 w-24 bg-white/20" />
              <Skeleton className="h-6 w-32 bg-white/20" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-4 w-20 bg-white/20" />
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
          className={cn(
            "w-4 h-4 transition-colors",
            filled
              ? "fill-yellow-400 text-yellow-400"
              : halfFilled
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-slate-600 text-slate-600"
          )}
        />
      );
    });
  };

  const getBestseller = () => {
    const isFree =
      course.price === 0 || course.settings?.enrollmentType === "FREE";
    return (
      (course.currentEnrollments || 0) > 5000 ||
      (!isFree &&
        course.price &&
        course.originalPrice &&
        course.originalPrice < course.price * 0.3)
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: course.title,
          text: course.shortDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Course link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share course");
    }
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(course.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(course.id);
      toast.success("Added to wishlist");
    }
  };

  const lastUpdated = course.lastMajorUpdate
    ? new Date(course.lastMajorUpdate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="relative bg-gradient-to-r from-blue-800 to-purple-600 text-white  overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative px-6 py-12 mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Content - Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumbs */}
              <nav
                className="flex items-center gap-2 text-sm text-slate-300 mb-6"
                aria-label="Breadcrumb"
              >
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
                <ChevronRight className="w-4 h-4" />
                <a
                  href="/courses"
                  className="hover:text-white transition-colors"
                >
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

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {(course.price === 0 ||
                  course.settings?.enrollmentType === "FREE") && (
                  <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Free Course
                  </Badge>
                )}
                {!!getBestseller() && (
                  <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    Bestseller
                  </Badge>
                )}
                {course.isFeatured && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 border-purple-400/30 text-purple-200"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {course.isTrending && (
                  <Badge
                    variant="secondary"
                    className="bg-red-500/20 border-red-400/30 text-red-200"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {lastUpdated && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 border-green-400/30 text-green-200"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {lastUpdated}
                  </Badge>
                )}
              </div>

              {/* Title and Description */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in">
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
                  <span className="font-semibold text-lg">
                    {(course.avgRating || 0).toFixed(1)}
                  </span>
                  <button
                    className="text-blue-300 hover:text-blue-200 transition-colors underline-offset-2 hover:underline"
                    onClick={() =>
                      document
                        .getElementById("review-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    ({formatNumber(course.totalRatings || 0)} reviews)
                  </button>
                </div>

                <div className="flex items-center gap-1 text-slate-300">
                  <Users className="w-4 h-4" />
                  <span>
                    {formatNumber(course.currentEnrollments || 0)} students
                  </span>
                </div>

                {course.completionRate !== null &&
                  course.completionRate !== undefined &&
                  course.completionRate > 0 && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Shield className="w-4 h-4" />
                      <span>
                        {course.completionRate?.toFixed(1) || 0}% completion
                        rate
                      </span>
                    </div>
                  )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-slate-300">Created by</span>
                <div className="flex items-center gap-2">
                  {course.instructor?.profileImage && (
                    <div className="relative w-10 h-10">
                      {!imageLoaded && (
                        <Skeleton className="w-10 h-10 rounded-full absolute inset-0" />
                      )}
                      <Image
                        src={course.instructor.profileImage}
                        alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                        width={40}
                        height={40}
                        className={cn(
                          "rounded-full border-2 border-white/20 object-cover",
                          !imageLoaded && "opacity-0"
                        )}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>
                  )}
                  <div>
                    <button
                      className="text-blue-300 hover:text-blue-200 font-medium transition-colors underline-offset-2 hover:underline"
                      onClick={() =>
                        document
                          .getElementById("instructor-section")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      {course.instructor?.firstName}{" "}
                      {course.instructor?.lastName}
                    </button>
                    {!!course.instructor?.rating && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.instructor?.rating}</span>
                        {course.instructor?.totalCourses && (
                          <span>
                            • {course.instructor?.totalCourses} courses
                          </span>
                        )}
                        {course.instructor?.totalStudentsTaught && (
                          <span>
                            •{" "}
                            {formatNumber(
                              course.instructor?.totalStudentsTaught
                            )}{" "}
                            students
                          </span>
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
                    {actualDuration.hours > 0
                      ? `${actualDuration.hours}h `
                      : ""}
                    {actualDuration.minutes}m
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{course.language}</span>
                  {course.subtitleLanguages &&
                    course.subtitleLanguages.length > 0 && (
                      <span className="text-xs">
                        (+{course.subtitleLanguages.length} subtitles)
                      </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLectures || 0} lectures</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleWishlist}
                  className={cn(
                    "bg-white/10 hover:bg-white/20 text-white border-white/20",
                    isWishlisted && "bg-red-500/20 border-red-400/30"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 mr-2",
                      isWishlisted && "fill-current"
                    )}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                {course.trailer && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setVideoModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}
              </div>
            </div>

            {/* Right Content - Course Thumbnail */}
            <div className="hidden lg:block">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-auto object-cover"
                  />
                )}
                {course.trailer && (
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center group hover:bg-black/60 transition-colors"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && course.trailer && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 z-10"
            >
              ✕
            </button>
            <video
              src={course.trailer}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
