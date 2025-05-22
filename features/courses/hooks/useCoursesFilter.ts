"use client";

import { useState, useEffect, useMemo } from "react";
import { Course, CourseFilters } from "../types/courseTypes";

export const useCoursesFilter = (courses: Course[]) => {
  const [filters, setFilters] = useState<CourseFilters>({
    categories: [],
    priceRange: [0, 200],
    levels: [],
    durations: [],
    ratings: [],
    showFeatured: false,
    search: "",
    sortBy: "newest",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const categoryMap = courses.reduce((acc, course) => {
      const category = course.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: "all", name: "All", count: courses.length },
      ...Object.entries(categoryMap).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        count,
      })),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      // If "All" is selected, don't filter by category
      if (!filters.categories.includes("All")) {
        result = result.filter((course) =>
          filters.categories!.includes(course.category)
        );
      }
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(
        (course) =>
          course.price >= filters.priceRange![0] &&
          course.price <= filters.priceRange![1]
      );
    }

    // Level filter
    if (filters.levels && filters.levels.length > 0) {
      result = result.filter((course) =>
        filters.levels!.includes(course.level)
      );
    }

    // Duration filter
    if (filters.durations && filters.durations.length > 0) {
      result = result.filter((course) => {
        const duration = parseInt(course.duration.split(" ")[0]);
        return filters.durations!.some((d) => {
          if (d === "any") return true;
          if (d === "10+") return duration >= 10;
          const [min, max] = d.split("-").map(Number);
          return duration >= min && duration <= max;
        });
      });
    }

    // Rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      result = result.filter((course) =>
        filters.ratings!.some((rating) => course.rating >= rating)
      );
    }

    // Featured filter
    if (filters.showFeatured) {
      result = result.filter((course) => course.featured);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.teacher.toLowerCase().includes(searchLower) ||
          course.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case "popular":
          result.sort((a, b) => b.students - a.students);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return result;
  }, [courses, filters]);

  const updateFilter = (newFilters: Partial<CourseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      levels: [],
      durations: [],
      ratings: [],
      showFeatured: false,
      search: "",
      sortBy: "newest",
    });
  };

  return {
    filters,
    categories,
    filteredCourses,
    updateFilter,
    resetFilters,
    isLoaded,
  };
};
