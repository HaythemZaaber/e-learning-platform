"use client";

import React, { useState, useMemo } from "react";
import { Search, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/features/courses/shared/CourseCard";
import { useCoursesFilter } from "../hooks/useCoursesFilter";
import { useSavedCourses } from "../hooks/useSavedCourses";
import { Pagination } from "@/components/shared/Pagination";
import CourseSearchAndFilters from "./CourseSearchAndFilters";
import { coursesData } from "@/data/coursesData";

const ITEMS_PER_PAGE = 5;

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

const CoursesGrid = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  const { savedCourses, toggleSavedCourse } = useSavedCourses();

  const {
    filters,
    categories,
    filteredCourses,
    updateFilter,
    resetFilters,
    isLoaded,
  } = useCoursesFilter(coursesData);

  // Quick search functionality
  const searchFilteredCourses = useMemo(() => {
    if (!quickSearch.trim()) return filteredCourses;

    return filteredCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(quickSearch.toLowerCase()) ||
        course.instructor.name
          .toLowerCase()
          .includes(quickSearch.toLowerCase()) ||
        course.category.toLowerCase().includes(quickSearch.toLowerCase())
    );
  }, [filteredCourses, quickSearch]);

  // Pagination calculations
  const totalPages = Math.ceil(searchFilteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = searchFilteredCourses.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, quickSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen ">
      <div className=" py-8">
        <CourseSearchAndFilters
          quickSearch={quickSearch}
          onQuickSearchChange={setQuickSearch}
          showFilters={showFilters}
          onShowFiltersChange={setShowFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          categories={categories}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
        />

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-lg font-medium text-gray-900">
              {searchFilteredCourses.length} courses found
            </p>
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(endIndex, searchFilteredCourses.length)} of{" "}
              {searchFilteredCourses.length} results
              {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          {searchFilteredCourses.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Courses Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${viewMode}-${JSON.stringify(
              filters
            )}-${quickSearch}`}
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 "
                : "flex flex-col space-y-4 mb-12"
            }
          >
            {currentCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={cardVariants}
                layout
                className={viewMode === "list" ? "w-full" : undefined}
              >
                <CourseCard
                  course={course}
                  isSaved={savedCourses.includes(course.id)}
                  onToggleSave={toggleSavedCourse}
                  className={`${viewMode === "list" ? "w-full" : "h-full"} `}
                  viewMode={viewMode}
                  userRole="learner"
                />
              </motion.div>
            ))}

            {currentCourses.length === 0 && (
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
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setQuickSearch("")}
                      disabled={!quickSearch}
                    >
                      Clear Search
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={searchFilteredCourses.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          showSummary={true}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default CoursesGrid;
