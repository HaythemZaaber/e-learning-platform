"use client";

import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import { useCoursesStore } from "@/stores/courses.store";
import {
  GET_ALL_COURSES,
  GET_FEATURED_COURSES,
  GET_TRENDING_COURSES,
  GET_COURSE_BY_ID,
  GET_COURSE_LEVELS,
  SEARCH_COURSES,
  GET_COURSES_BY_CATEGORY,
  GET_COURSES_BY_INSTRUCTOR,
} from "../services/graphql/courseQueries";
import { COURSE_CATEGORIES, COURSE_LEVELS } from "@/types/courseTypes";
import {
  BOOKMARK_COURSE,
  REMOVE_BOOKMARK,
  ENROLL_COURSE,
  UNENROLL_COURSE,
  UPDATE_COURSE_PROGRESS,
  RATE_COURSE,
  UPDATE_COURSE_REVIEW,
  DELETE_COURSE_REVIEW,
  TRACK_COURSE_VIEW,
  TRACK_COURSE_INTERACTION,
} from "../services/graphql/courseMutations";
import { Course, CourseFilters, CourseLevel } from "@/types/courseTypes";
import { toast } from "sonner";
import { useMemo, useEffect } from "react";

interface UseCoursesOptions {
  filters?: CourseFilters;
  searchQuery?: string;
  category?: string;
  instructorId?: string;
  limit?: number;
  featured?: boolean;
  trending?: boolean;
}

export const useCourses = (options: UseCoursesOptions = {}) => {
  const {
    filters,
    searchQuery,
    category,
    instructorId,
    limit,
    featured = false,
    trending = false,
  } = options;

  const { user, isAuthenticated } = useAuth();
  const client = useApolloClient();
  
  // Store actions
  const {
    courses,
    filteredCourses,
    featuredCourses,
    trendingCourses,
    isLoading,
    isFiltering,
    error,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    categories,
    levels,
    savedCourses,
    viewMode,
    filters: storeFilters,
    
    setCourses,
    setFilteredCourses,
    setFeaturedCourses,
    setTrendingCourses,
    setLoading,
    setFiltering,
    setError,
    setCurrentPage,
    setItemsPerPage,
    updateFilters,
    resetFilters,
    setSearchQuery,
    setViewMode,
    toggleSavedCourse,
    addSavedCourse,
    removeSavedCourse,
    clearSavedCourses,
    isCourseSaved,
    setCategories,
    setLevels,
  } = useCoursesStore();

  // ============================================================================
  // CLIENT-SIDE FILTERING LOGIC
  // ============================================================================

  const applyClientSideFilters = (courses: Course[], filters: CourseFilters, searchQuery: string): Course[] => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery && searchQuery.trim().length > 0) {
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((course) => {
        const searchableFields = [
          course.title,
          course.description,
          course.shortDescription,
          course.category,
          course.instructor?.firstName,
          course.instructor?.lastName,
          ...(course.tags || []),
          ...(course.whatYouLearn || []),
          ...(course.requirements || []),
        ].filter(Boolean);

        return searchableFields.some(field => 
          field && field.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((course) => {
        const courseCategory = course.category?.toLowerCase().trim();
        return filters.categories!.some(cat => {
          const filterCategory = cat.toLowerCase().trim();
          // Normalize category names for comparison
          const normalizedCourseCategory = courseCategory?.replace(/-/g, ' ').replace(/\s+/g, ' ');
          const normalizedFilterCategory = filterCategory?.replace(/-/g, ' ').replace(/\s+/g, ' ');
          return normalizedCourseCategory === normalizedFilterCategory;
        });
      });
    }

    // Apply level filter
    if (filters.levels && filters.levels.length > 0) {
      filtered = filtered.filter((course) => {
        return filters.levels!.includes(course.level);
      });
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
      filtered = filtered.filter((course) => {
        const courseRating = Math.floor(course.avgRating || 0);
        return filters.ratings!.includes(courseRating);
      });
    }

    // Apply duration filter
    if (filters.durations && filters.durations.length > 0) {
      filtered = filtered.filter((course) => {
        const duration = course.totalDuration || course.estimatedHours?.toString() || "0";
        return filters.durations!.some(durationFilter => {
          if (durationFilter === "0-2") return parseInt(duration) <= 2;
          if (durationFilter === "2-5") return parseInt(duration) >= 2 && parseInt(duration) <= 5;
          if (durationFilter === "5-10") return parseInt(duration) >= 5 && parseInt(duration) <= 10;
          if (durationFilter === "10+") return parseInt(duration) > 10;
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
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          case "popular":
            return (b.currentEnrollments || 0) - (a.currentEnrollments || 0);
          case "rating":
            return (b.avgRating || 0) - (a.avgRating || 0);
          case "price-low":
            return (a.originalPrice || a.price) - (b.originalPrice || b.price);
          case "price-high":
            return (b.originalPrice || b.price) - (a.originalPrice || a.price);
          case "duration":
            const aDuration = a.estimatedHours || 0;
            const bDuration = b.estimatedHours || 0;
            return aDuration - bDuration;
          case "enrollments":
            return (b.currentEnrollments || 0) - (a.currentEnrollments || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  // ============================================================================
  // MAIN COURSES QUERY
  // ============================================================================

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useQuery(GET_ALL_COURSES, {
    variables: {
      filters: {
        categories: filters?.categories || [],
        priceRange: filters?.priceRange || { min: 0, max: 200 },
        levels: filters?.levels || [],
        durations: filters?.durations || [],
        ratings: filters?.ratings || [],
        showFeatured: filters?.showFeatured || false,
        search: searchQuery || "",
        sortBy: filters?.sortBy || "newest",
      },
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // ============================================================================
  // FEATURED COURSES QUERY
  // ============================================================================

  const {
    data: featuredData,
    loading: featuredLoading,
    error: featuredError,
  } = useQuery(GET_FEATURED_COURSES, {
    variables: { limit: limit || 6 },
    skip: !featured,
    fetchPolicy: "cache-and-network",
  });

  // ============================================================================
  // TRENDING COURSES QUERY
  // ============================================================================

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useQuery(GET_TRENDING_COURSES, {
    variables: { limit: limit || 6 },
    skip: !trending,
    fetchPolicy: "cache-and-network",
  });

  // ============================================================================
  // STATIC CATEGORIES AND LEVELS
  // ============================================================================

  // Use static categories instead of GraphQL query
  const staticCategories = COURSE_CATEGORIES.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
    count: 0, // Will be calculated from actual courses
  }));

  // Use static levels instead of GraphQL query
  const staticLevels = COURSE_LEVELS.map(level => ({
    id: level,
    name: level.charAt(0).toUpperCase() + level.slice(1).toLowerCase(),
    count: 0, // Will be calculated from actual courses
  }));

  // ============================================================================
  // SEARCH QUERY
  // ============================================================================

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useQuery(SEARCH_COURSES, {
    variables: {
      query: searchQuery || "",
      filters: {
        categories: filters?.categories || [],
        priceRange: filters?.priceRange || [0, 200],
        levels: filters?.levels || [],
        durations: filters?.durations || [],
        ratings: filters?.ratings || [],
        showFeatured: filters?.showFeatured || false,
        sortBy: filters?.sortBy || "newest",
      },
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
    skip: !searchQuery || searchQuery.trim().length === 0,
    fetchPolicy: "cache-and-network",
  });

  // ============================================================================
  // CATEGORY-SPECIFIC QUERY
  // ============================================================================

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(GET_COURSES_BY_CATEGORY, {
    variables: {
      category: category || "",
      filters: {
        categories: filters?.categories || [],
        priceRange: filters?.priceRange || [0, 200],
        levels: filters?.levels || [],
        durations: filters?.durations || [],
        ratings: filters?.ratings || [],
        showFeatured: filters?.showFeatured || false,
        sortBy: filters?.sortBy || "newest",
      },
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
    skip: !category,
    fetchPolicy: "cache-and-network",
  });

  // ============================================================================
  // INSTRUCTOR-SPECIFIC QUERY
  // ============================================================================

  const {
    data: instructorData,
    loading: instructorLoading,
    error: instructorError,
  } = useQuery(GET_COURSES_BY_INSTRUCTOR, {
    variables: {
      instructorId: instructorId || "",
      filters: {
        categories: filters?.categories || [],
        priceRange: filters?.priceRange || [0, 200],
        levels: filters?.levels || [],
        durations: filters?.durations || [],
        ratings: filters?.ratings || [],
        showFeatured: filters?.showFeatured || false,
        sortBy: filters?.sortBy || "newest",
      },
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
      },
    },
    skip: !instructorId,
    fetchPolicy: "cache-and-network",
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const [bookmarkCourse] = useMutation(BOOKMARK_COURSE, {
    onCompleted: (data) => {
      if (data.bookmarkCourse.success) {
        toast.success("Course bookmarked successfully!");
        addSavedCourse(data.bookmarkCourse.courseId);
      } else {
        toast.error(data.bookmarkCourse.message || "Failed to bookmark course");
      }
    },
    onError: (error) => {
      toast.error(`Failed to bookmark course: ${error.message}`);
    },
  });

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: (data) => {
      if (data.removeBookmark.success) {
        toast.success("Bookmark removed successfully!");
        removeSavedCourse(data.removeBookmark.courseId);
      } else {
        toast.error(data.removeBookmark.message || "Failed to remove bookmark");
      }
    },
    onError: (error) => {
      toast.error(`Failed to remove bookmark: ${error.message}`);
    },
  });

  const [enrollCourse] = useMutation(ENROLL_COURSE, {
    onCompleted: (data) => {
      if (data.enrollCourse.success) {
        toast.success("Successfully enrolled in course!");
        refetchCourses();
      } else {
        toast.error(data.enrollCourse.message || "Failed to enroll in course");
      }
    },
    onError: (error) => {
      toast.error(`Failed to enroll in course: ${error.message}`);
    },
  });

  const [unenrollCourse] = useMutation(UNENROLL_COURSE, {
    onCompleted: (data) => {
      if (data.unenrollCourse.success) {
        toast.success("Successfully unenrolled from course!");
        refetchCourses();
      } else {
        toast.error(data.unenrollCourse.message || "Failed to unenroll from course");
      }
    },
    onError: (error) => {
      toast.error(`Failed to unenroll from course: ${error.message}`);
    },
  });

  const [updateProgress] = useMutation(UPDATE_COURSE_PROGRESS, {
    onCompleted: (data) => {
      if (data.updateCourseProgress.success) {
        // Progress updated successfully
        refetchCourses();
      } else {
        toast.error(data.updateCourseProgress.message || "Failed to update progress");
      }
    },
    onError: (error) => {
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });

  const [rateCourse] = useMutation(RATE_COURSE, {
    onCompleted: (data) => {
      if (data.rateCourse.success) {
        toast.success("Review submitted successfully!");
        refetchCourses();
      } else {
        toast.error(data.rateCourse.message || "Failed to submit review");
      }
    },
    onError: (error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });

  const [updateReview] = useMutation(UPDATE_COURSE_REVIEW, {
    onCompleted: (data) => {
      if (data.updateCourseReview.success) {
        toast.success("Review updated successfully!");
        refetchCourses();
      } else {
        toast.error(data.updateCourseReview.message || "Failed to update review");
      }
    },
    onError: (error) => {
      toast.error(`Failed to update review: ${error.message}`);
    },
  });

  const [deleteReview] = useMutation(DELETE_COURSE_REVIEW, {
    onCompleted: (data) => {
      if (data.deleteCourseReview.success) {
        toast.success("Review deleted successfully!");
        refetchCourses();
      } else {
        toast.error(data.deleteCourseReview.message || "Failed to delete review");
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete review: ${error.message}`);
    },
  });

  const [trackView] = useMutation(TRACK_COURSE_VIEW, {
    onError: (error) => {
      console.error("Failed to track course view:", error);
    },
  });

  const [trackInteraction] = useMutation(TRACK_COURSE_INTERACTION, {
    onError: (error) => {
      console.error("Failed to track course interaction:", error);
    },
  });

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  // Determine which data to use based on options
  const activeData = useMemo(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      return searchData?.searchCourses;
    } else if (category) {
      return categoryData?.getCoursesByCategory;
    } else if (instructorId) {
      return instructorData?.getCoursesByInstructor;
    } else {
      return coursesData?.getAllCourses;
    }
  }, [searchQuery, category, instructorId, searchData, categoryData, instructorData, coursesData]);

  // Process courses data with client-side filtering
  useEffect(() => {
    if (activeData?.courses) {
      const processedCourses = activeData.courses.map((course: any) => ({
        ...course,
        isBookmarked: savedCourses.includes(course.id),
        // Add any additional processing here
      }));

      setCourses(processedCourses);

      // Apply client-side filtering only for non-search queries
      // If we have a search query, the server has already filtered the results
      let filteredResults;
      if (searchQuery && searchQuery.trim().length > 0) {
        // For search queries, use the server-filtered results directly
        filteredResults = processedCourses;
      } else {
        // For non-search queries, apply client-side filtering
        filteredResults = applyClientSideFilters(
          processedCourses, 
          storeFilters, 
          ""
        );
      }

      setFilteredCourses(filteredResults);

      // Update pagination
      if (activeData.pagination) {
        setCurrentPage(activeData.pagination.currentPage);
        setItemsPerPage(activeData.pagination.itemsPerPage);
        // totalPages and totalItems are handled by the store
      }
    }
  }, [activeData, savedCourses, storeFilters, searchQuery, setCourses, setFilteredCourses, setCurrentPage, setItemsPerPage]);

  // Process featured courses
  useEffect(() => {
    if (featuredData?.getFeaturedCourses) {
      const processedFeatured = featuredData.getFeaturedCourses.map((course: any) => ({
        ...course,
        isBookmarked: savedCourses.includes(course.id),
      }));
      setFeaturedCourses(processedFeatured);
    }
  }, [featuredData, savedCourses, setFeaturedCourses]);

  // Process trending courses
  useEffect(() => {
    if (trendingData?.getTrendingCourses) {
      const processedTrending = trendingData.getTrendingCourses.map((course: any) => ({
        ...course,
        isBookmarked: savedCourses.includes(course.id),
      }));
      setTrendingCourses(processedTrending);
    }
  }, [trendingData, savedCourses, setTrendingCourses]);

  // Set static categories and levels with calculated counts
  useEffect(() => {
    // Use the store's courses (unfiltered) for accurate category counts
    const allCourses = useCoursesStore.getState().courses;
    
    // Only calculate counts when courses are available
    if (allCourses.length > 0) {
      // Calculate course counts for each category
      const categoriesWithCounts = staticCategories.map(category => {
        const count = allCourses.filter(course => {
          const courseCategory = course.category?.toLowerCase().trim();
          const categoryId = category.id.toLowerCase().trim();
          
          // Normalize category names for comparison
          const normalizedCourseCategory = courseCategory?.replace(/-/g, ' ').replace(/\s+/g, ' ');
          const normalizedCategoryId = categoryId?.replace(/-/g, ' ').replace(/\s+/g, ' ');
          
          return normalizedCourseCategory === normalizedCategoryId;
        }).length;
        
        return {
          ...category,
          count
        };
      });

      setCategories(categoriesWithCounts);
    } else {
      // Set categories without counts when courses are not yet loaded
      setCategories(staticCategories);
    }
    
    setLevels(staticLevels);
  }, [courses, setCategories, setLevels]);

  // Update loading states
  useEffect(() => {
    setLoading(coursesLoading || searchLoading || categoryLoading || instructorLoading);
    setFiltering(searchLoading || categoryLoading || instructorLoading);
  }, [coursesLoading, searchLoading, categoryLoading, instructorLoading, setLoading, setFiltering]);

  // Update error state
  useEffect(() => {
    const error = coursesError || searchError || categoryError || instructorError;
    setError(error?.message || null);
  }, [coursesError, searchError, categoryError, instructorError, setError]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleBookmarkCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark courses");
      return;
    }

    const isCurrentlySaved = isCourseSaved(courseId);
    
    try {
      if (isCurrentlySaved) {
        await removeBookmark({ variables: { courseId } });
      } else {
        await bookmarkCourse({ variables: { courseId } });
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to enroll in courses");
      return;
    }

    try {
      await enrollCourse({ variables: { courseId } });
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleUnenrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage enrollments");
      return;
    }

    try {
      await unenrollCourse({ variables: { courseId } });
    } catch (error) {
      console.error("Unenrollment failed:", error);
    }
  };

  const handleUpdateProgress = async (courseId: string, progress: number) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await updateProgress({ variables: { courseId, progress } });
    } catch (error) {
      console.error("Progress update failed:", error);
    }
  };

  const handleRateCourse = async (courseId: string, rating: number, comment?: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to rate courses");
      return;
    }

    try {
      await rateCourse({ variables: { courseId, rating, comment } });
    } catch (error) {
      console.error("Rating failed:", error);
    }
  };

  const handleUpdateReview = async (reviewId: string, rating: number, comment?: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to update reviews");
      return;
    }

    try {
      await updateReview({ variables: { reviewId, rating, comment } });
    } catch (error) {
      console.error("Review update failed:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete reviews");
      return;
    }

    try {
      await deleteReview({ variables: { reviewId } });
    } catch (error) {
      console.error("Review deletion failed:", error);
    }
  };

  const handleTrackView = async (courseId: string) => {
    try {
      await trackView({ variables: { courseId } });
    } catch (error) {
      console.error("View tracking failed:", error);
    }
  };

  const handleTrackInteraction = async (courseId: string, interactionType: string, metadata?: any) => {
    try {
      await trackInteraction({ 
        variables: { 
          courseId, 
          interactionType, 
          metadata: metadata ? JSON.stringify(metadata) : null 
        } 
      });
    } catch (error) {
      console.error("Interaction tracking failed:", error);
    }
  };

  // ============================================================================
  // FILTERING AND SEARCH
  // ============================================================================

  const applyFilters = (newFilters: Partial<CourseFilters>) => {
    updateFilters(newFilters);
  };

  const clearAllFilters = () => {
    resetFilters();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // Data
    courses: filteredCourses,
    featuredCourses,
    trendingCourses,
    categories,
    levels,
    
    // Loading states
    isLoading: isLoading || featuredLoading || trendingLoading,
    isFiltering,
    isSearching: searchLoading,
    isCategoryLoading: categoryLoading,
    isInstructorLoading: instructorLoading,
    
    // Error states
    error: error || featuredError?.message || trendingError?.message,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: activeData?.pagination?.hasNextPage || false,
    hasPreviousPage: activeData?.pagination?.hasPreviousPage || false,
    
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
    getCourseById: (id: string) => filteredCourses.find(course => course.id === id),
  };
}; 