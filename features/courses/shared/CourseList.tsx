"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseCard } from "./CourseCard";
import { Course } from "@/types/courseTypes";
import { coursesData } from "@/data/coursesData";
import { Pagination } from "@/components/shared/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { useCoursesFilter } from "../hooks/useCoursesFilter";
import { useSavedCourses } from "../hooks/useSavedCourses";

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

interface CourseListProps {
  variant?: "grid" | "list";
  cardVariant?: "default" | "compact" | "detailed";
  showFilters?: boolean;
  showActions?: boolean;
  limit?: number;
  status?: Course["status"];
  
}

export function CourseList({
  variant = "grid",
  cardVariant = "default",
  showFilters = true,
  showActions = false,
  limit,
  status,
 
}: CourseListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(variant);
  const [currentPage, setCurrentPage] = useState(1);
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
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, quickSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

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
                userRole="instructor"
                isInstructorDashboard={true}
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

      {coursesData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}
    </div>
  );
}
