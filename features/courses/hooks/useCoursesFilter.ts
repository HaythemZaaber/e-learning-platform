"use client";

import { useState, useMemo, useEffect } from "react";
import { useCoursesStore } from "@/stores/courses.store";
import { Course, CourseFilters, CourseLevel } from "@/types/courseTypes";

interface UseCoursesFilterOptions {
  initialFilters?: Partial<CourseFilters>;
  enableSearch?: boolean;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export const useCoursesFilter = (options: UseCoursesFilterOptions = {}) => {
  const {
    initialFilters = {},
    enableSearch = true,
    enablePagination = true,
    itemsPerPage = 12,
  } = options;

  const {
    courses,
    filteredCourses,
    categories,
    levels,
    isLoading,
    isFiltering,
    error,
    currentPage,
    totalPages,
    totalItems,
    viewMode,
    filters,
    searchQuery,
    
    setFilteredCourses,
    setLoading,
    setFiltering,
    setError,
    setCurrentPage,
    setItemsPerPage,
    updateFilters,
    resetFilters,
    setSearchQuery,
    setViewMode,
  } = useCoursesStore();

  // Local state for filter UI
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  // Initialize filters
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      updateFilters(initialFilters);
    }
  }, [initialFilters, updateFilters]);

  // Apply filters to courses
  const applyFiltersToCourses = useMemo(() => {
    if (!courses.length) return [];

    let filtered = [...courses];

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower) ||
        course.instructor?.name?.toLowerCase().includes(searchLower) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((course) =>
        filters.categories!.includes(course.category)
      );
    }

    // Apply level filter
    if (filters.levels && filters.levels.length > 0) {
      filtered = filtered.filter((course) =>
        filters.levels!.includes(course.level)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const { min: minPrice, max: maxPrice } = filters.priceRange;
      filtered = filtered.filter((course) => {
        const price = course.originalPrice || course.price;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      filtered = filtered.filter((course) =>
        filters.ratings!.includes(Math.floor(course.avgRating || 0))
      );
    }

    // Apply duration filter
    if (filters.durations && filters.durations.length > 0) {
      filtered = filtered.filter((course) => {
        const duration = course.totalDuration;
        return filters.durations!.some(durationFilter => {
          if (durationFilter === "short") return duration.includes("1-3") || duration.includes("0-2");
          if (durationFilter === "medium") return duration.includes("4-6") || duration.includes("3-5");
          if (durationFilter === "long") return duration.includes("7+") || duration.includes("6+");
          return false;
        });
      });
    }

    // Apply featured filter
    if (filters.showFeatured) {
      filtered = filtered.filter((course) => course.isFeatured);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "popular":
            return (b.currentEnrollments || 0) - (a.currentEnrollments || 0);
          case "rating":
            return (b.avgRating || 0) - (a.avgRating || 0);
          case "price-low":
            return (a.originalPrice || a.price) - (b.originalPrice || b.price);
          case "price-high":
            return (b.originalPrice || b.price) - (a.originalPrice || a.price);
          case "duration":
            return parseInt(a.totalDuration) - parseInt(b.totalDuration);
          case "enrollments":
            return (b.currentEnrollments || 0) - (a.currentEnrollments || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [courses, searchQuery, filters]);

  // Update filtered courses in store
  useEffect(() => {
    setFilteredCourses(applyFiltersToCourses);
  }, [applyFiltersToCourses, setFilteredCourses]);

  // Handle search
  const handleSearch = (query: string) => {
    setQuickSearch(query);
    setSearchQuery(query);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    updateFilters(newFilters);
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      updateFilters({ categories: [] });
    } else {
      updateFilters({ categories: [category] });
    }
  };

  // Handle level selection
  const handleLevelChange = (level: CourseLevel) => {
    if (level === "ALL_LEVELS") {
      updateFilters({ levels: [] });
    } else {
      updateFilters({ levels: [level] });
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    updateFilters({ priceRange: range });
  };

  // Handle rating filter
  const handleRatingChange = (ratings: number[]) => {
    updateFilters({ ratings });
  };

  // Handle duration filter
  const handleDurationChange = (durations: string[]) => {
    updateFilters({ durations });
  };

  // Handle featured toggle
  const handleFeaturedToggle = (showFeatured: boolean) => {
    updateFilters({ showFeatured });
  };

  // Handle sorting
  const handleSortChange = (sortBy: CourseFilters["sortBy"]) => {
    updateFilters({ sortBy });
  };

  // Clear all filters
  const clearAllFilters = () => {
    resetFilters();
    setQuickSearch("");
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Get current page courses
  const currentPageCourses = useMemo(() => {
    if (!enablePagination) return filteredCourses;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, currentPage, itemsPerPage, enablePagination]);

  // Get filter summary
  const filterSummary = useMemo(() => {
    const activeFilters = [];
    
    if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);
    if (filters.categories?.length) activeFilters.push(`Categories: ${filters.categories.join(", ")}`);
    if (filters.levels?.length) activeFilters.push(`Levels: ${filters.levels.join(", ")}`);
    if (filters.priceRange) activeFilters.push(`Price: $${filters.priceRange.min}-$${filters.priceRange.max}`);
    if (filters.ratings?.length) activeFilters.push(`Ratings: ${filters.ratings.join("+ stars, ")}`);
    if (filters.durations?.length) activeFilters.push(`Duration: ${filters.durations.join(", ")}`);
    if (filters.showFeatured) activeFilters.push("Featured only");
    if (filters.sortBy) activeFilters.push(`Sorted by: ${filters.sortBy}`);

    return activeFilters;
  }, [searchQuery, filters]);

  return {
    // Data
    courses: currentPageCourses,
    allCourses: filteredCourses,
    categories,
    levels,
    
    // Loading states
    isLoading,
    isFiltering,
    
    // Error state
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    
    // UI state
    viewMode,
    showFilters,
    quickSearch,
    filterSummary,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handleCategoryChange,
    handleLevelChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleDurationChange,
    handleFeaturedToggle,
    handleSortChange,
    clearAllFilters,
    handlePageChange,
    handleViewModeChange,
    setShowFilters,
    
    // Current filters
    filters,
    searchQuery,
  };
};
