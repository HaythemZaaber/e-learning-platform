import { gql } from "@apollo/client";

export const SAVE_COURSE_DRAFT = gql`
  mutation SaveCourseDraft($input: SaveCourseDraftInput!) {
    saveCourseDraft(input: $input) {
      success
      message
      draftData
      currentStep
      completionScore
    }
  }
`;

export const DELETE_COURSE_DRAFT = gql`
  mutation DeleteCourseDraft {
    deleteCourseDraft {
      success
      message
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      success
      message
      course {
        id
        title
        description
        status
    
       
      }
      errors
    }
  }
`;

export const CREATE_COURSE_WITH_BASIC_INFO = gql`
  mutation CreateCourseWithBasicInfo(
    $title: String!
    $description: String!
    $category: String!
    $level: String!
  ) {
    createCourseWithBasicInfo(
      title: $title
      description: $description
      category: $category
      level: $level
    ) {
      success
      message
      course
      completionPercentage
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($courseId: String!, $input: UpdateCourseInput!) {
    updateCourse(courseId: $courseId, input: $input) {
      success
      message
      course {
        id
        title
        description
        status
      }
      errors
     
    }
  }
`;

export const PUBLISH_COURSE = gql`
  mutation PublishCourse($courseId: String!) {
    publishCourse(courseId: $courseId) {
      success
      message
     course {
        id
        title
        description
        status
      }
      errors
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: String!) {
    deleteCourse(courseId: $courseId) {
      success
      message
    }
  }
`;

export const CREATE_TEXT_CONTENT = gql`
  mutation CreateTextContent(
    $courseId: String!
    $title: String!
    $content: String!
    $description: String
    $lessonId: String
    $order: Int
  ) {
    createTextContent(
      courseId: $courseId
      title: $title
      content: $content
      description: $description
      lessonId: $lessonId
      order: $order
    ) {
      success
      message
      contentItem {
        id
        title
        type
        description
        contentData
      }
    }
  }
`;

export const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment(
    $courseId: String!
    $title: String!
    $description: String!
    $instructions: String
    $dueDate: String
    $points: Int
    $lessonId: String
    $order: Int
  ) {
    createAssignment(
      courseId: $courseId
      title: $title
      description: $description
      instructions: $instructions
      dueDate: $dueDate
      points: $points
      lessonId: $lessonId
      order: $order
    ) {
      success
      message
      contentItem {
        id
        title
        type
        description
        contentData
      }
    }
  }
`;

export const CREATE_RESOURCE_LINK = gql`
  mutation CreateResourceLink(
    $courseId: String!
    $title: String!
    $url: String!
    $resourceType: String!
    $description: String
    $lessonId: String
    $order: Int
  ) {
    createResourceLink(
      courseId: $courseId
      title: $title
      url: $url
      resourceType: $resourceType
      description: $description
      lessonId: $lessonId
      order: $order
    ) {
      success
      message
      contentItem {
        id
        title
        type
        description
        contentData
      }
    }
  }
`;

export const UPDATE_SECTION = gql`
  mutation UpdateSection(
    $sectionId: String!
    $courseId: String!
    $title: String
    $description: String
    $order: Int
  ) {
    updateSection(
      sectionId: $sectionId
      courseId: $courseId
      title: $title
      description: $description
      order: $order
    ) {
      success
      message
      section {
        id
        title
        description
        order
        lessons {
          id
          title
          type
          duration
          order
        }
      }
    }
  }
`;

export const DELETE_SECTION = gql`
  mutation DeleteSection($sectionId: String!, $courseId: String!) {
    deleteSection(sectionId: $sectionId, courseId: $courseId) {
      success
      message
    }
  }
`;

export const UPDATE_LESSON = gql`
  mutation UpdateLesson(
    $lessonId: String!
    $courseId: String!
    $title: String
    $description: String
    $type: LessonType
    $duration: Int
    $content: String
    $order: Int
    $settings: JSON
  ) {
    updateLesson(
      lessonId: $lessonId
      courseId: $courseId
      title: $title
      description: $description
      type: $type
      duration: $duration
      content: $content
      order: $order
      settings: $settings
    ) {
      success
      message
      lesson {
        id
        title
        description
        type
        duration
        content
        order
        contentItems {
          id
          title
          type
          order
        }
      }
    }
  }
`;

export const DELETE_LESSON = gql`
  mutation DeleteLesson($lessonId: String!, $courseId: String!) {
    deleteLesson(lessonId: $lessonId, courseId: $courseId) {
      success
      message
    }
  }
`;

export const DUPLICATE_COURSE = gql`
  mutation DuplicateCourse($courseId: String!, $newTitle: String) {
    duplicateCourse(courseId: $courseId, newTitle: $newTitle) {
      success
      message
      course
      completionPercentage
    }
  }
`;
