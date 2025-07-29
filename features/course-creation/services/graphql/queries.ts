import { gql } from "@apollo/client";

export const GET_COURSE_DRAFT = gql`
  query GetCourseDraft {
    getCourseDraft {
      success
      message
      draftData
      currentStep
      completionScore
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($courseId: String!) {
    getCourse(courseId: $courseId) {
      id
      title
      description
      shortDescription
      category
      level
      thumbnail
      trailer
      price
      originalPrice
      currency
      objectives
      prerequisites
      whatYouLearn
      seoTags
      marketingTags
      sections {
        id
        title
        description
        order
        lectures {
          id
          title
          description
          type
          duration
          content
          order
          isPreview
          isInteractive
          contentItems {
            id
            title
            description
            type
            fileUrl
            fileName
            fileSize
            mimeType
            order
          }
        }
      }
      settings
      status
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

export const GET_MY_COURSES = gql`
  query GetMyCourses {
    getMyCourses {
      id
      title
      description
      thumbnail
      status
      level
      price
      currency
      createdAt
      updatedAt
      publishedAt
      _count {
        enrollments
        reviews
      }
      sections {
        id
        lectures {
          id
          duration
        }
      }
    }
  }
`;

export const GET_COURSES = gql`
  query GetCourses($filters: CourseFiltersInput) {
    getCourses(filters: $filters) {
      id
      title
      description
      shortDescription
      thumbnail
      level
      price
      currency
      avgRating
      totalRatings
      instructor {
        id
        firstName
        lastName
        profileImage
      }
      _count {
        enrollments
      }
    }
  }
`;

export const GET_COURSE_ANALYTICS = gql`
  query GetCourseAnalytics($courseId: String!) {
    getCourseAnalytics(courseId: $courseId) {
      success
      analytics {
        totalEnrollments
        totalReviews
        averageRating
        completionRate
        totalRevenue
        recentEnrollments
        views
        enrollmentTrend {
          month
          enrollments
        }
        topReviews {
          id
          rating
          comment
          user {
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
`;
