"use client";

import React, { useState, useEffect } from "react";
import { Search, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/features/courses/shared/CourseCard";
import { useCourses } from "../hooks/useCourses";
import { Pagination } from "@/components/shared/Pagination";
import CourseSearchAndFilters from "./CourseSearchAndFilters";
import { useCoursesStore } from "@/stores/courses.store";
import { usePaymentStore } from "@/stores/payment.store";
import { useQuickPayment } from "@/features/payments/hooks/usePayment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const CoursesGrid = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Payment store and hooks
  const { checkoutItems, addToCheckout, removeFromCheckout } = usePaymentStore();
  const { 
    handleAddToCart, 
    handleRemoveFromCart, 
    handleBuyNow, 
    handleEnrollFree 
  } = useQuickPayment();
  
  const {
    // Data
    courses,
    categories,
    levels,
    
    // Loading states
    isLoading,
    isFiltering,
    isSearching,
    isCategoryLoading,
    isInstructorLoading,
    
    // Error states
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    
    // UI state
    viewMode,
    savedCourses,
    
    // Actions
    refetchCourses,
    handleBookmarkCourse,
    handleEnrollCourse,
    handleUnenrollCourse,
    handleUpdateProgress,
    handleRateCourse,
    handleUpdateReview,
    handleDeleteReview,
    handleTrackView,
    handleTrackInteraction,
    
    // Filtering and search
    applyFilters,
    clearAllFilters,
    handleSearch,
    handlePageChange,
    handleViewModeChange,
    
    // Utility
    isCourseSaved,
    getCourseById,
  } = useCourses({
    limit: ITEMS_PER_PAGE,
  });

  // Get filters from store
  const { filters } = useCoursesStore();

  // Local state for UI
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  // Handle quick search
  const handleQuickSearch = (query: string) => {
    setQuickSearch(query);
    handleSearch(query);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    applyFilters(filters);
  };

  // Handle view mode change
  const handleViewModeChangeLocal = (mode: "grid" | "list") => {
    handleViewModeChange(mode);
  };

  // Handle course actions
  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      switch (action) {
        case "bookmark":
          await handleBookmarkCourse(courseId);
          break;
        case "enroll":
          await handleEnrollCourse(courseId);
          break;
        case "unenroll":
          await handleUnenrollCourse(courseId);
          break;
        case "view":
          await handleTrackView(courseId);
          break;
        case "interaction":
          await handleTrackInteraction(courseId, "card_click");
          break;
        default:
          console.log(`Action ${action} not implemented`);
      }
    } catch (error) {
      console.error(`Failed to handle course action ${action}:`, error);
    }
  };

  // Handle enrollment using payment session API
  const handleEnroll = async (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }

    try {
      // Check if course is free
      const isFree = course.price === 0 || course.settings?.enrollmentType === "FREE";
      
      if (isFree) {
        // Use payment session API for free courses
        await handleEnrollFree(course);
      } else {
        // For paid courses, add to cart and redirect to checkout
        handleAddToCart(course);
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  // Handle add to cart (including free courses)
  const handleAddToCartAction = async (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }

    try {
      // Allow adding both free and paid courses to cart
      handleAddToCart(course);
      toast.success(`Added "${course.title}" to cart`);
    } catch (error) {
      console.error("Failed to add course to cart:", error);
      toast.error("Failed to add course to cart");
    }
  };

  // Handle remove from cart
  const handleRemoveFromCartAction = async (courseId: string) => {
    try {
      handleRemoveFromCart(courseId);
    } catch (error) {
      console.error("Failed to remove course from cart:", error);
      toast.error("Failed to remove course from cart");
    }
  };

  // Handle buy now
  const handleBuyNowAction = async (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }

    try {
      handleBuyNow(course);
    } catch (error) {
      console.error("Failed to proceed to checkout:", error);
      toast.error("Failed to proceed to checkout");
    }
  };

  // Handle continue learning
  const handleContinueLearning = (courseId: string) => {
    router.push(`/courses/${courseId}/learn`);
  };

  // Handle preview
  const handlePreview = (courseId: string) => {
    router.push(`/courses/${courseId}?preview=true`);
  };

  // Check if user is enrolled in a course
  const isUserEnrolled = (course: any) => {
    return course.enrollments.some((enrollment: any) => enrollment.userId === user?.id);
  };

  // Get enrollment progress data
  const getEnrollmentData = (course: any) => {
    if (!course.enrollments) return null;
    
    // Find the specific enrollment for the current user
    const userEnrollment = course.enrollments.find((enrollment: any) => enrollment.userId === user?.id);
    
    if (!userEnrollment) return null;
    
    return {
      progress: userEnrollment.progress || 0,
      timeSpent: userEnrollment.totalTimeSpent || 0,
      streakDays: userEnrollment.streakDays || 0,
      certificateEarned: userEnrollment.certificateEarned || false,
      lastWatchedLecture: userEnrollment.lastWatchedLecture,
      nextLessonId: userEnrollment.currentLessonId,
      completedLectures: userEnrollment.completedLectures || 0,
      totalLectures: userEnrollment.totalLectures || 0,
    };
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  // Loading component
  const LoadingSpinner = () => (
    <motion.div
      variants={loadingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="col-span-full"
    >
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 bg-gray-200 rounded-md w-64 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-16 animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading skeleton for courses */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col space-y-4"
        }>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="animate-pulse">
              {viewMode === "grid" ? (
                // Grid view skeleton
                <div className="bg-white rounded-xl shadow-md overflow-hidden border-0 h-[700px] flex flex-col">
                  {/* Image skeleton */}
                  <div className="relative h-64 w-full bg-gray-200 flex-shrink-0">
                    <div className="absolute top-3 left-3">
                      <div className="h-6 w-16 bg-gray-300 rounded-full mb-2"></div>
                      <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                      <div className="space-y-1">
                        <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                        <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="h-5 w-12 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-2">
                        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded ml-1"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex items-center text-xs">
                          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                          <div>
                            <div className="h-3 w-8 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 w-12 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        <div className="h-3 w-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Footer skeleton */}
                  <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ) : (
                // List view skeleton
                <div className="bg-white rounded-xl shadow-md overflow-hidden border-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image skeleton */}
                    <div className="relative md:w-80 md:h-56 aspect-video md:aspect-auto flex-shrink-0 bg-gray-200">
                      <div className="absolute top-3 left-3">
                        <div className="h-6 w-16 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                        <div className="flex gap-2">
                          <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                          <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-5 w-12 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Content skeleton */}
                    <div className="flex-grow p-6 flex flex-col">
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="flex items-center">
                            <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                            <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            <div className="h-3 w-12 bg-gray-200 rounded ml-1"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <div key={j} className="flex items-center text-sm">
                              <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                              <div>
                                <div className="h-4 w-8 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 w-12 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {Array.from({ length: 2 }).map((_, j) => (
                            <div key={j}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                <div className="h-3 w-8 bg-gray-200 rounded"></div>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Footer skeleton */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                          <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Error component
  const ErrorDisplay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full text-center py-20"
    >
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-500 mb-6">
          {error || "Failed to load courses. Please try again."}
        </p>
        <Button onClick={() => refetchCourses()}>
          Try Again
        </Button>
      </div>
    </motion.div>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full text-center py-20"
    >
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your search criteria or filters to find what
          you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={clearAllFilters}>
            Reset Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickSearch("")}
            disabled={!quickSearch}
          >
            Clear Search
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen">
      <div className="py-8">
        {/* Search and Filters */}
        <CourseSearchAndFilters
          quickSearch={quickSearch}
          onQuickSearchChange={handleQuickSearch}
          showFilters={showFilters}
          onShowFiltersChange={setShowFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChangeLocal}
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onResetFilters={clearAllFilters}
        />

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-lg font-medium text-gray-900">
              {totalItems} courses found
            </p>
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(endIndex, totalItems)} of {totalItems} results
              {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && !isLoading && <ErrorDisplay />}

        {/* Courses Grid/List */}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${viewMode}-${quickSearch}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
                  : "flex flex-col space-y-4 mb-12"
              }
            >
              {currentCourses.length > 0 ? (
                currentCourses.map((course) => {
                  const isEnrolled = isUserEnrolled(course);
                  const enrollmentData = getEnrollmentData(course);
                  
                  return (
                    <motion.div
                      key={course.id}
                      variants={cardVariants}
                      layout
                      className={viewMode === "list" ? "w-full" : undefined}
                    >
                      <CourseCard
                        course={course}
                        isSaved={isCourseSaved(course.id)}
                        onToggleSave={(id) => handleCourseAction(id, "bookmark")}
                        className={`${viewMode === "list" ? "w-full" : "h-full"}`}
                        viewMode={viewMode}
                        isEnrolled={isEnrolled}
                        progress={enrollmentData?.progress || 0}
                        timeSpent={enrollmentData?.timeSpent || 0}
                        streakDays={enrollmentData?.streakDays || 0}
                        certificateEarned={enrollmentData?.certificateEarned || false}
                        lastWatchedLecture={enrollmentData?.lastWatchedLecture}
                        nextLessonId={enrollmentData?.nextLessonId}
                        completedLectures={enrollmentData?.completedLectures || 0}
                        totalLectures={enrollmentData?.totalLectures || 0}
                        onEnroll={handleEnroll}
                        onContinueLearning={handleContinueLearning}
                        onPreview={handlePreview}
                        onTrackView={(id) => handleCourseAction(id, "view")}
                        onAddToCart={handleAddToCartAction}
                        onRemoveFromCart={handleRemoveFromCartAction}
                        onBuyNow={handleBuyNowAction}
                        isInCart={checkoutItems.some(item => item.courseId === course.id)}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <EmptyState />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showSummary={true}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
};

export default CoursesGrid;
