import { gql } from "@apollo/client";

export const GET_COURSE_ANALYTICS = gql`
  query GetCourseAnalytics($courseId: String!, $filters: AnalyticsFilters) {
    courseAnalytics(courseId: $courseId, filters: $filters) {
      success
      message
      errors
      analytics {
        courseId
        courseTitle
        courseStatus
        createdAt

        # Enrollment Analytics
        totalEnrollments
        activeStudents
        completedStudents
        enrollmentTrend {
          date
          enrollments
          cumulative
        }
        completionStats {
          totalEnrollments
          completedEnrollments
          completionRate
          averageCompletionTime
        }

        # Rating & Review Analytics
        averageRating
        totalRatings
        ratingDistribution {
          one
          two
          three
          four
          five
        }
        recentReviews {
          id
          userId
          userName
          userProfileImage
          rating
          comment
          courseQuality
          instructorRating
          difficultyRating
          valueForMoney
          createdAt
          updatedAt
        }

        # Engagement Analytics
        engagementMetrics {
          totalViews
          uniqueViewers
          averageSessionDuration
          averageProgressRate
          totalInteractions
        }
        popularContent {
          id
          title
          type
          views
          completionRate
          averageRating
        }

        # Revenue Analytics
        revenueStats {
          totalRevenue
          averageRevenuePerStudent
          totalPaidEnrollments
          conversionRate
        }

        # Student Progress
        studentProgress {
          userId
          userName
          userProfileImage
          progressPercentage
          lecturesCompleted
          totalLectures
          timeSpent
          enrolledAt
          lastAccessedAt
          status
        }

        # Performance Metrics
        courseQualityScore
        instructorRating
        totalRevenue
        currency

        # Additional metrics
        additionalMetrics
      }
    }
  }
`;

export const GET_COURSE_ANALYTICS_SUMMARY = gql`
  query GetCourseAnalyticsSummary($courseId: String!) {
    courseAnalytics(courseId: $courseId, filters: { timeRange: "30d" }) {
      success
      analytics {
        courseId
        courseTitle
        totalEnrollments
        averageRating
        totalRevenue
        currency
        completionStats {
          completionRate
        }
        engagementMetrics {
          totalViews
          uniqueViewers
        }
      }
    }
  }
`;
