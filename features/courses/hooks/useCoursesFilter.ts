'use client';

import { useState, useEffect, useMemo } from 'react';
import { Course, CourseFilters } from '../types/course';

export const useCoursesFilter = (courses: Course[]) => {
  const [filters, setFilters] = useState<CourseFilters>({
    categories: [],
    priceRange: [0, 200],
    level: 'All Levels',
    duration: 'any',
    rating: 0,
    showFeatured: false,
    search: '',
    sortBy: 'newest',
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
      { id: 'all', name: 'All', count: courses.length },
      ...Object.entries(categoryMap).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count,
      })),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(course => filters.categories!.includes(course.category));
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(
        course => 
          course.price >= filters.priceRange![0] && 
          course.price <= filters.priceRange![1]
      );
    }

    // Level filter
    if (filters.level && filters.level !== 'All Levels') {
      result = result.filter(course => course.level === filters.level);
    }

    // Duration filter
    if (filters.duration && filters.duration !== 'any') {
      const [min, max] = filters.duration.split('-').map(Number);
      result = result.filter(course => {
        const duration = parseInt(course.duration.split(' ')[0]);
        if (filters.duration === '10+') return duration >= 10;
        return duration >= min && duration <= max;
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(course => course.rating >= filters.rating);
    }

    // Featured filter
    if (filters.showFeatured) {
      result = result.filter(course => course.featured);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        course =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.teacher.toLowerCase().includes(searchLower) ||
          course.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'popular':
          result.sort((a, b) => b.students - a.students);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return result;
  }, [courses, filters]);

  const updateFilter = (newFilters: Partial<CourseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      level: 'All Levels',
      duration: 'any',
      rating: 0,
      showFeatured: false,
      search: '',
      sortBy: 'newest',
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