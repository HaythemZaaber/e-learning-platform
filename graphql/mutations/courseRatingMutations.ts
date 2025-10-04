import { gql } from "@apollo/client";

export const CREATE_COURSE_RATING = gql`
  mutation CreateCourseRating(
    $courseId: String!
    $rating: Int!
    $comment: String
    $courseQuality: Int
    $instructorRating: Int
    $difficultyRating: Int
    $valueForMoney: Int
  ) {
    createCourseRating(
      courseId: $courseId
      rating: $rating
      comment: $comment
      courseQuality: $courseQuality
      instructorRating: $instructorRating
      difficultyRating: $difficultyRating
      valueForMoney: $valueForMoney
    ) {
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

export const UPDATE_COURSE_RATING = gql`
  mutation UpdateCourseRating(
    $ratingId: String!
    $rating: Int
    $comment: String
    $courseQuality: Int
    $instructorRating: Int
    $difficultyRating: Int
    $valueForMoney: Int
  ) {
    updateCourseRating(
      ratingId: $ratingId
      rating: $rating
      comment: $comment
      courseQuality: $courseQuality
      instructorRating: $instructorRating
      difficultyRating: $difficultyRating
      valueForMoney: $valueForMoney
    ) {
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

export const DELETE_COURSE_RATING = gql`
  mutation DeleteCourseRating($ratingId: String!) {
    deleteCourseRating(ratingId: $ratingId) {
      success
      message
      errors
    }
  }
`;
