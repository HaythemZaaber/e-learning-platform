// Course Analytics Types based on backend DTOs

export interface EnrollmentTrend {
  date: string;
  enrollments: number;
  cumulative: number;
}

export interface CourseRatingDistribution {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}

export interface CompletionStats {
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  averageCompletionTime: number; // in days
}

export interface EngagementMetrics {
  totalViews: number;
  uniqueViewers: number;
  averageSessionDuration: number; // in minutes
  averageProgressRate: number; // percentage
  totalInteractions: number;
}

export interface RevenueStats {
  totalRevenue: number;
  averageRevenuePerStudent: number;
  totalPaidEnrollments: number;
  conversionRate: number; // free to paid conversion
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  rating: number;
  comment?: string;
  courseQuality?: number;
  instructorRating?: number;
  difficultyRating?: number;
  valueForMoney?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PopularContent {
  id: string;
  title: string;
  type: string;
  views: number;
  completionRate: number;
  averageRating: number;
}

export interface StudentProgress {
  userId: string;
  userName: string;
  userProfileImage?: string;
  progressPercentage: number;
  lecturesCompleted: number;
  totalLectures: number;
  timeSpent: number; // in minutes
  enrolledAt: string;
  lastAccessedAt?: string;
  status: string; // 'active', 'completed', 'inactive'
}

export interface CourseAnalyticsData {
  // Basic Course Info
  courseId: string;
  courseTitle: string;
  courseStatus: string;
  createdAt: string;

  // Enrollment Analytics
  totalEnrollments: number;
  activeStudents: number;
  completedStudents: number;
  enrollmentTrend: EnrollmentTrend[];
  completionStats: CompletionStats;

  // Rating & Review Analytics
  averageRating: number;
  totalRatings: number;
  ratingDistribution: CourseRatingDistribution;
  recentReviews: CourseReview[];

  // Engagement Analytics
  engagementMetrics: EngagementMetrics;
  popularContent: PopularContent[];

  // Revenue Analytics (if applicable)
  revenueStats?: RevenueStats;

  // Student Progress
  studentProgress: StudentProgress[];

  // Performance Metrics
  courseQualityScore: number;
  instructorRating: number;
  totalRevenue: number;
  currency: string;

  // Additional metrics
  additionalMetrics: {
    totalViews: number;
    uniqueViews: number;
    difficulty: string;
    estimatedHours: number;
    language: string;
    isPublic: boolean;
    certificate: boolean;
  };
}

export interface CourseAnalyticsResponse {
  success: boolean;
  message: string;
  analytics?: CourseAnalyticsData;
  errors?: string[];
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  timeRange?: string; // '7d', '30d', '90d', '1y', 'all'
}

// Chart data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  cumulative?: number;
}

export interface ProgressDataPoint {
  label: string;
  value: number;
  max: number;
  color: string;
  percentage: number;
}
