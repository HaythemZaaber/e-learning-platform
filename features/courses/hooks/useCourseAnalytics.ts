import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_COURSE_ANALYTICS } from "@/graphql/queries/courseAnalyticsQueries";
import {
  CourseAnalyticsData,
  CourseAnalyticsResponse,
  AnalyticsFilters,
} from "@/types/courseAnalyticsTypes";

interface UseCourseAnalyticsProps {
  courseId: string;
  filters?: AnalyticsFilters;
  enabled?: boolean;
}

interface UseCourseAnalyticsReturn {
  analytics: CourseAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const useCourseAnalytics = ({
  courseId,
  filters,
  enabled = true,
}: UseCourseAnalyticsProps): UseCourseAnalyticsReturn => {
  const [timeRange, setTimeRange] = useState<string>("30d");

  const { data, loading, error, refetch } = useQuery(GET_COURSE_ANALYTICS, {
    variables: {
      courseId,
      filters: {
        ...filters,
        timeRange,
      },
    },
    skip: !enabled || !courseId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const analytics = data?.courseAnalytics?.analytics || null;
  const errorMessage =
    error?.message || data?.courseAnalytics?.errors?.[0] || null;

  // Refetch when timeRange changes
  useEffect(() => {
    if (enabled && courseId) {
      refetch({
        courseId,
        filters: {
          ...filters,
          timeRange,
        },
      });
    }
  }, [timeRange, courseId, enabled, refetch, filters]);

  return {
    analytics,
    loading,
    error: errorMessage,
    refetch,
    timeRange,
    setTimeRange,
  };
};

// Hook for analytics with automatic refresh
export const useCourseAnalyticsWithRefresh = ({
  courseId,
  filters,
  enabled = true,
  refreshInterval = 30000, // 30 seconds
}: UseCourseAnalyticsProps & {
  refreshInterval?: number;
}): UseCourseAnalyticsReturn => {
  const analytics = useCourseAnalytics({ courseId, filters, enabled });

  useEffect(() => {
    if (!enabled || !courseId) return;

    const interval = setInterval(() => {
      analytics.refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, courseId, refreshInterval, analytics.refetch]);

  return analytics;
};

// Hook for analytics comparison between different time ranges
export const useCourseAnalyticsComparison = ({
  courseId,
  filters,
  enabled = true,
}: UseCourseAnalyticsProps) => {
  const [comparisonTimeRange, setComparisonTimeRange] = useState<string>("30d");

  const currentAnalytics = useCourseAnalytics({
    courseId,
    filters: { ...filters, timeRange: "30d" },
    enabled,
  });

  const previousAnalytics = useCourseAnalytics({
    courseId,
    filters: {
      ...filters,
      timeRange: comparisonTimeRange,
      // Add logic to calculate previous period dates
    },
    enabled,
  });

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const comparison = {
    enrollments: {
      current: currentAnalytics.analytics?.totalEnrollments || 0,
      previous: previousAnalytics.analytics?.totalEnrollments || 0,
      growth: calculateGrowth(
        currentAnalytics.analytics?.totalEnrollments || 0,
        previousAnalytics.analytics?.totalEnrollments || 0
      ),
    },
    revenue: {
      current: currentAnalytics.analytics?.totalRevenue || 0,
      previous: previousAnalytics.analytics?.totalRevenue || 0,
      growth: calculateGrowth(
        currentAnalytics.analytics?.totalRevenue || 0,
        previousAnalytics.analytics?.totalRevenue || 0
      ),
    },
    rating: {
      current: currentAnalytics.analytics?.averageRating || 0,
      previous: previousAnalytics.analytics?.averageRating || 0,
      growth: calculateGrowth(
        currentAnalytics.analytics?.averageRating || 0,
        previousAnalytics.analytics?.averageRating || 0
      ),
    },
    completion: {
      current: currentAnalytics.analytics?.completionStats.completionRate || 0,
      previous:
        previousAnalytics.analytics?.completionStats.completionRate || 0,
      growth: calculateGrowth(
        currentAnalytics.analytics?.completionStats.completionRate || 0,
        previousAnalytics.analytics?.completionStats.completionRate || 0
      ),
    },
  };

  return {
    current: currentAnalytics,
    previous: previousAnalytics,
    comparison,
    setComparisonTimeRange,
    loading: currentAnalytics.loading || previousAnalytics.loading,
  };
};
