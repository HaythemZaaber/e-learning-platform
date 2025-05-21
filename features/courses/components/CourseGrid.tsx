"use client";

import { useState } from "react";
import { Grid2X2, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Course } from "../types/course";
import { CourseLevel } from "../types/course";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/shared/CourseCard";
import CourseFilters from "./CourseFilters";
import { useCoursesFilter } from "../hooks/useCoursesFilter";
import { useSavedCourses } from "../hooks/useSavedCourses";

interface CoursesGridProps {
  courses: Course[];
}

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

const CoursesGrid = ({ courses }: CoursesGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { savedCourses, toggleSavedCourse } = useSavedCourses();

  const {
    filters,
    categories,
    filteredCourses,
    updateFilter,
    resetFilters,
    isLoaded,
  } = useCoursesFilter(courses);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Browse Courses</h1>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CourseFilters
        categories={categories}
        selectedCategories={[filters.category || "All"]}
        onCategoriesChange={(categories: string[]) =>
          updateFilter({ category: categories[0] })
        }
        showFeatured={filters.showFeatured || false}
        onFeaturedChange={(showFeatured) => updateFilter({ showFeatured })}
        search={filters.search || ""}
        onSearchChange={(search) => updateFilter({ search })}
        sortBy={filters.sortBy || "newest"}
        onSortChange={(sortBy) => updateFilter({ sortBy: sortBy as any })}
        onResetFilters={resetFilters}
        priceRange={filters.priceRange || [0, 200]}
        maxPrice={200}
        onPriceRangeChange={(range) => updateFilter({ priceRange: range })}
        selectedLevel={filters.level || "All Levels"}
        onLevelChange={(level) => updateFilter({ level: level as CourseLevel })}
        rating={filters.rating || 0}
        onRatingChange={(rating) => updateFilter({ rating })}
        duration={filters.duration || "any"}
        onDurationChange={(duration) => updateFilter({ duration })}
      />

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={
            filters.category +
            (filters.showFeatured ? "-featured" : "") +
            `-${viewMode}`
          }
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              : "flex flex-col space-y-4"
          }
        >
          {filteredCourses.map((course) => (
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
                className={viewMode === "list" ? "w-full" : undefined}
              />
            </motion.div>
          ))}

          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-lg text-gray-500">
                No courses found matching your criteria
              </p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CoursesGrid;
