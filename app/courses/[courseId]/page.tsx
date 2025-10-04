"use client";

import { useEffect, useCallback } from "react";
import { use } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, BookOpen, Clock, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CourseContent } from "@/features/courses/components/courseDetails/CourseContent";
import { CourseDescription } from "@/features/courses/components/courseDetails/CourseDescription";
import { CourseHeader } from "@/features/courses/components/courseDetails/CourseHeader";
import { CourseNavigation } from "@/features/courses/components/courseDetails/CourseNavigation";
import { CourseRequirements } from "@/features/courses/components/courseDetails/CourseRequirements";
import { InstructorCard } from "@/features/courses/components/courseDetails/InstructorCard";
import { PriceCard } from "@/features/courses/components/courseDetails/PriceCard";
import { RelatedCourses } from "@/features/courses/components/courseDetails/RelatedCourses";
import { ReviewSection } from "@/features/courses/components/courseDetails/ReviewSection";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useQuickPayment } from "@/features/payments/hooks/usePayment";

// Loading skeleton component
const CourseDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-gradient-to-r from-blue-800 to-purple-600 py-12">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-64 mb-4 bg-white/20" />
        <Skeleton className="h-12 w-3/4 mb-4 bg-white/20" />
        <Skeleton className="h-6 w-1/2 mb-6 bg-white/20" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32 bg-white/20" />
          <Skeleton className="h-6 w-24 bg-white/20" />
        </div>
      </div>
    </div>

    {/* Navigation skeleton */}
    <div className="sticky top-16 bg-white border-b shadow-md z-20">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 py-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// Error component
const CourseErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Course</AlertTitle>
        <AlertDescription className="mt-2">
          {error || "An unexpected error occurred while loading the course."}
        </AlertDescription>
      </Alert>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/courses">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        {onRetry && (
          <Button onClick={onRetry} className="w-full sm:w-auto">
            Try Again
          </Button>
        )}
      </div>
    </div>
  </div>
);

// Not found component
const CourseNotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Course Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/courses">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Browse All Courses
        </Button>
      </Link>
    </div>
  </div>
);

// Mobile price banner component
const MobilePriceBanner = ({ 
  course, 
  isEnrolled 
}: { 
  course: any; 
  isEnrolled: boolean;
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { handleAddToCart, handleRemoveFromCart, handleBuyNow, handleEnrollFree } = useQuickPayment();
  const { cartItems } = useCoursePreviewStore();
  
  const isInCart = course ? cartItems.has(course.id) : false;
  const isFree = course?.price === 0 || course?.settings?.enrollmentType === "FREE";
  const isDiscounted = !isFree && course?.originalPrice && course?.price && course.originalPrice > course.price;
  const discountPercentage = isDiscounted && course?.originalPrice && course?.price 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to enroll in courses");
      router.push("/sign-in");
      return;
    }

    try {
      if (isFree) {
        await handleEnrollFree(course);
      } else {
        handleAddToCart(course);
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  const handleCartAction = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your cart");
      router.push("/sign-in");
      return;
    }

    try {
      if (isInCart) {
        handleRemoveFromCart(course.id);
      } else {
        handleAddToCart(course);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleBuyNowAction = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase courses");
      router.push("/sign-in");
      return;
    }

    try {
      await handleBuyNow(course);
    } catch (error) {
      console.error("Failed to purchase course:", error);
      toast.error("Failed to purchase course");
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-30">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <div>
          {isEnrolled ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-700">Enrolled</span>
            </div>
          ) : isFree ? (
            <div>
              <div className="text-2xl font-bold text-green-600">FREE</div>
              <div className="text-xs text-green-700">No cost to enroll</div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${course.price?.toFixed(2) || '0.00'}
                </span>
                {!!isDiscounted && (
                  <span className="text-sm text-gray-500 line-through">
                    ${course.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              {isDiscounted && (
                <div className="text-xs text-red-600 font-medium">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isEnrolled ? (
            <Button 
              size="sm" 
              className="text-xs bg-green-600 hover:bg-green-700"
              onClick={() => router.push(`/courses/${course.id}/learn`)}
            >
              Continue Learning
            </Button>
          ) : (
            <>
              {!isFree && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleCartAction}
                >
                  {isInCart ? "Remove" : "Add to Cart"}
                </Button>
              )}
              <Button 
                size="sm" 
                className="text-xs bg-blue-600 hover:bg-blue-700"
                onClick={isFree ? handleEnroll : handleBuyNowAction}
              >
                {isFree ? "Enroll for Free" : "Buy Now"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  
  const {
    activeSection,
    setActiveSection,
    setCourse,
    setProgress,
    setLoadingStates,
    setErrors,
  } = useCoursePreviewStore();

  const {
    course: courseData,
    progress,
    isLoading,
    courseLoading,
    error,
    courseError,
    isEnrolled,
    isAuthenticated,
    isFreeCourse,
    canAccessContent,
    refetchCourse,
    refetchProgress,
  } = useCoursePreview({ 
    courseId,
    autoTrackView: true,
    autoTrackProgress: true,
  });

  // Update store when data changes
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData, setCourse]);

  useEffect(() => {
    if (progress) {
      setProgress(progress);
    }
  }, [progress, setProgress]);

  // Update loading states
  useEffect(() => {
    setLoadingStates({
      isLoadingCourse: courseLoading,
    });
  }, [courseLoading, setLoadingStates]);

  // Handle errors
  useEffect(() => {
    if (courseError) {
      setErrors({ courseError: courseError.message });
      toast.error(courseError.message, {
        duration: 5000,
      });
    }
  }, [courseError, setErrors]);

  // Auto-save scroll position
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(`course-${courseId}-scroll`);
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }

    const handleScroll = () => {
      sessionStorage.setItem(`course-${courseId}-scroll`, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [courseId]);

  // Handle retry
  const handleRetry = useCallback(() => {
    toast.info("Retrying to load course...");
    refetchCourse();
    if (isAuthenticated) {
      refetchProgress();
    }
  }, [refetchCourse, refetchProgress, isAuthenticated]);

  // Loading state
  if (isLoading && !courseData) {
    return <CourseDetailsSkeleton />;
  }

  // Error state
  if (error && !courseData) {
    return <CourseErrorState error={error.message} onRetry={handleRetry} />;
  }

  // Not found state
  if (!isLoading && !courseData) {
    return <CourseNotFound />;
  }

  // Calculate actual total duration from course sections
  const getActualTotalDuration = () => {
    if (!courseData?.sections) return { hours: 0, minutes: 0 };
    
    const totalSeconds = courseData.sections.reduce((total: number, section: any) => {
      const sectionDuration = section.lectures?.reduce((lectureTotal: number, lecture: any) => 
        lectureTotal + (lecture.duration || 0), 0) || 0;
      return total + sectionDuration;
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return { hours, minutes };
  };

  const actualDuration = getActualTotalDuration();

  // Course details quick stats
  const quickStats = courseData ? [
    {
      icon: <Clock className="h-4 w-4" />,
      label: `${actualDuration.hours > 0 ? `${actualDuration.hours}h ` : ''}${actualDuration.minutes}m`,
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: `${courseData.totalLectures || 0} lectures`,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: `${courseData.currentEnrollments || 0} students`,
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <CourseHeader course={courseData} />
      
      {/* Navigation */}
      <CourseNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        courseProgress={canAccessContent ? progress : undefined}
      />

      {/* Quick Stats Bar (Mobile) */}
      <div className="lg:hidden bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around text-sm">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1 text-gray-600">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <section id="overview-section" className="scroll-mt-28">
              <CourseDescription course={courseData} />
            </section>

            <section id="content-section" className="scroll-mt-28">
              <CourseContent 
                sections={courseData?.sections || []} 
                courseId={courseId}
                isEnrolled={isEnrolled}
                isFreeCourse={isFreeCourse}
                canAccessContent={canAccessContent}
                progress={canAccessContent ? progress : undefined}
              />
            </section>

            <section id="details-section" className="scroll-mt-28">
              <CourseRequirements course={courseData} />
            </section>

            <section id="instructor-section" className="scroll-mt-28">
              {courseData?.instructor && (
                <InstructorCard instructor={courseData.instructor} />
              )}
            </section>

            <section id="review-section" className="scroll-mt-28">
              <ReviewSection course={courseData} />
            </section>

            <section id="related-section">
              <RelatedCourses 
                course={courseData}
                userRole={isAuthenticated ? "STUDENT" : "VISITOR"}
              />
            </section>
          </div>

          {/* Right Sidebar - Price Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <PriceCard
                course={courseData}
                isEnrolled={isEnrolled}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Price Banner */}
      {courseData && <MobilePriceBanner course={courseData} isEnrolled={isEnrolled || false} />}
    </div>
  );
}