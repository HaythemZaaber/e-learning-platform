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
import { toast } from "sonner";

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
      className="flex items-center justify-center py-20"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading courses...</p>
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
                currentCourses.map((course) => (
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
                    />
                  </motion.div>
                ))
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
