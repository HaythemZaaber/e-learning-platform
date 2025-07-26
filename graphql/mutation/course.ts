import { gql } from "@apollo/client";

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      category
      level
      price
      thumbnail
      objectives
      prerequisites
      sections {
        id
        title
        lectures {
          id
          title
          type
          duration
          content
          description
          status
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
    }
  }
`; 