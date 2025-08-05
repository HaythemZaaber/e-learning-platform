import { gql } from "@apollo/client";

export const GET_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses {
    getMyCourses {
      id
      title
      description
      category
      level
      price
      originalPrice
      thumbnail
      status
    
     
      
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseForEditing($courseId: String!) {
    getCourse(courseId: $courseId) {
      id
      title
      description
      shortDescription
      category
      subcategory
      level
      thumbnail
      trailer
      galleryImages
      price
      originalPrice
      currency
      status
      enrollmentType
      language
      certificate
      estimatedHours
      estimatedMinutes
      difficulty
      intensityLevel
      hasAITutor
      hasAIQuizzes
      hasInteractiveElements
      hasLiveSessions
      hasProjectWork
      hasDiscussions
      hasAssignments
      hasQuizzes
      downloadableResources
      offlineAccess
      mobileOptimized
      maxStudents
      waitlistEnabled
      seoTitle
      seoDescription
      seoTags
      marketingTags
      targetAudience
      objectives
      prerequisites
      whatYouLearn
      requirements
      settings
      metadata
      accessibility
      
      sections {
        id
        title
        description
        order
        
        lessons {
          id
          title
          description
          type
          content
          videoUrl
          duration
          order
          isPreview
          settings
          
          contentItem {
            id
            title
            type
            fileUrl
            fileName
            fileSize
            mimeType
            order
          }
        }
      }
    }
  }
`;

export const GET_COURSE_ANALYTICS = gql`
  query GetCourseAnalytics($courseId: ID!) {
    courseAnalytics(courseId: $courseId) {
      totalEnrollments
      totalRevenue
      averageRating
      totalReviews
      completionRate
      averageProgress
      monthlyEnrollments {
        month
        count
      }
      monthlyRevenue {
        month
        amount
      }
    }
  }
`; 