import { gql } from "@apollo/client";



export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      category
      level
      price
      originalPrice
      thumbnail
      status
      objectives
      prerequisites
      requirements
      whatYoullLearn
      targetAudience
      language
      hasSubtitles
      subtitleLanguages
      hasCertificate
      hasLifetimeAccess
      hasMobileAccess
      downloadableResources
      codingExercises
      articles
      quizzes
      assignments
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
          status
          videoUrl
          articleContent
          resources {
            name
            url
            type
          }
          quiz {
            questions {
              id
              question
              options
              correctAnswer
            }
          }
        }
      }
      settings {
        isPublic
        enrollmentType
        language
        certificate
        seoDescription
        seoTags
        accessibility {
          captions
          transcripts
          audioDescription
        }
      }
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
      title
    }
  }
`;

export const PUBLISH_COURSE = gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`;

export const UNPUBLISH_COURSE = gql`
  mutation UnpublishCourse($id: ID!) {
    unpublishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`; 