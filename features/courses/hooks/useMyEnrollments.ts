"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UseMyEnrollmentsReturn {
  enrollments: any[];
  courses: any[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
  
  // Computed values
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  notStartedCourses: number;
  
  // Filtered data
  getEnrollmentByCourseId: (courseId: string) => any | null;
  getCoursesByStatus: (status: 'completed' | 'in-progress' | 'not-started') => any[];
  getCoursesByCategory: (category: string) => any[];
  getCoursesByLevel: (level: string) => any[];
  
  // Progress calculations
  getAverageProgress: () => number;
  getTotalTimeSpent: () => number; // in minutes
  getTotalStreakDays: () => number;
  getCertificatesEarned: () => number;
}

export const useMyEnrollments = (): UseMyEnrollmentsReturn => {
  const { user, isAuthenticated, getToken } = useAuth();
  
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchEnrollments = async () => {
    if (!isAuthenticated || !user) {
      setEnrollments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnrollments(data || []);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch enrollments when authentication state changes
  useEffect(() => {
    fetchEnrollments();
  }, [isAuthenticated, user]);

  const courses = useMemo(() => {
    return enrollments.map(enrollment => enrollment.course).filter(Boolean);
  }, [enrollments]);

  // Computed values
  const totalEnrollments = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progress >= 100).length;
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const notStartedCourses = enrollments.filter(e => e.progress === 0).length;

  // Helper functions
  const getEnrollmentByCourseId = (courseId: string) => {
    return enrollments.find(e => e.courseId === courseId) || null;
  };

  const getCoursesByStatus = (status: 'completed' | 'in-progress' | 'not-started') => {
    switch (status) {
      case 'completed':
        return enrollments.filter(e => e.progress >= 100).map(e => e.course);
      case 'in-progress':
        return enrollments.filter(e => e.progress > 0 && e.progress < 100).map(e => e.course);
      case 'not-started':
        return enrollments.filter(e => e.progress === 0).map(e => e.course);
      default:
        return [];
    }
  };

  const getCoursesByCategory = (category: string) => {
    return courses.filter(course => course.category === category);
  };

  const getCoursesByLevel = (level: string) => {
    return courses.filter(course => course.level === level);
  };

  // Progress calculations
  const getAverageProgress = () => {
    if (enrollments.length === 0) return 0;
    const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
    return Math.round(totalProgress / enrollments.length);
  };

  const getTotalTimeSpent = () => {
    return enrollments.reduce((sum, e) => sum + (e.totalTimeSpent || 0), 0);
  };

  const getTotalStreakDays = () => {
    return enrollments.reduce((sum, e) => sum + (e.streakDays || 0), 0);
  };

  const getCertificatesEarned = () => {
    return enrollments.filter(e => e.certificateEarned).length;
  };

  return {
    enrollments,
    courses,
    isLoading,
    error,
    refetch: fetchEnrollments,
    
    // Computed values
    totalEnrollments,
    completedCourses,
    inProgressCourses,
    notStartedCourses,
    
    // Filtered data
    getEnrollmentByCourseId,
    getCoursesByStatus,
    getCoursesByCategory,
    getCoursesByLevel,
    
    // Progress calculations
    getAverageProgress,
    getTotalTimeSpent,
    getTotalStreakDays,
    getCertificatesEarned,
  };
};
