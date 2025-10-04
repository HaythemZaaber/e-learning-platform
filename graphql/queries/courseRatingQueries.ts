import { gql } from "@apollo/client";

export const GET_COURSE_RATINGS = gql`
  query GetCourseRatings(
    $courseId: String!
    $rating: Int
    $limit: Int
    $offset: Int
  ) {
    getCourseRatings(
      courseId: $courseId
      rating: $rating
      limit: $limit
      offset: $offset
    ) {
      success
      message
      ratings {
        id
        courseId
        userId
        rating
        comment
        isVerified
        helpfulCount
        courseQuality
        instructorRating
        difficultyRating
        valueForMoney
        status
        flaggedCount
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
          profileImage
        }
      }
      totalCount
      totalPages
      currentPage
      limit
      errors
    }
  }
`;

export const GET_COURSE_RATING_STATS = gql`
  query GetCourseRatingStats($courseId: String!) {
    getCourseRatingStats(courseId: $courseId) {
      totalRatings
      averageRating
      ratingDistribution
      averageCourseQuality
      averageInstructorRating
      averageDifficultyRating
      averageValueForMoney
    }
  }
`;

export const GET_USER_COURSE_RATING = gql`
  query GetUserCourseRating($courseId: String!) {
    getUserCourseRating(courseId: $courseId) {
      success
      message
      rating {
        id
        courseId
        userId
        rating
        comment
        isVerified
        helpfulCount
        courseQuality
        instructorRating
        difficultyRating
        valueForMoney
        status
        flaggedCount
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
          profileImage
        }
      }
      errors
    }
  }
`;
