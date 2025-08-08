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
      whatYouLearn
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
      publishedAt
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: String!) {
    deleteCourse(courseId: $courseId) {
      message
      success
      course {
        id
        title
      }
      errors
    }
  }
`;

export const PUBLISH_COURSE = gql`
  mutation PublishCourse($courseId: String!) {
    publishCourse(courseId: $courseId) {
      message
      success
      course {
        id
        status
      }
      errors
    }
  }
`;

export const UNPUBLISH_COURSE = gql`
  mutation UnpublishCourse($courseId: String!) {
    unpublishCourse(courseId: $courseId) {
      message
      success
      course {
        id
        status
      }
      errors
    }
  }
`; 
export const DUPLICATE_COURSE = gql`
  mutation DuplicateCourse($courseId: String!) {
    duplicateCourse(courseId: $courseId) {
      message
      success
      course {
        id
        title
      }
      errors
    }
  }
`; 

// ============================================================================
// USER INTERACTION MUTATIONS
// ============================================================================

export const BOOKMARK_COURSE = gql`
  mutation BookmarkCourse($courseId: String!) {
    bookmarkCourse(courseId: $courseId) {
      success
      message
      errors
    }
  }
`;

export const REMOVE_BOOKMARK = gql`
  mutation RemoveBookmark($courseId: String!) {
    removeBookmark(courseId: $courseId) {
      success
      message
      errors
    }
  }
`;

export const ENROLL_COURSE = gql`
  mutation EnrollCourse($courseId: String!) {
    enrollCourse(courseId: $courseId) {
      success
      message
      enrollment {
        id
        courseId
        userId
        status
        enrolledAt
        progress
      }
      errors
    }
  }
`;

export const UNENROLL_COURSE = gql`
  mutation UnenrollCourse($courseId: String!) {
    unenrollCourse(courseId: $courseId) {
      success
      message
      errors
    }
  }
`;

export const UPDATE_COURSE_PROGRESS = gql`
  mutation UpdateCourseProgress($courseId: String!, $progress: Float!) {
    updateCourseProgress(courseId: $courseId, progress: $progress) {
      success
      message
      progress
      errors
    }
  }
`;

export const RATE_COURSE = gql`
  mutation RateCourse($courseId: String!, $rating: Int!, $comment: String) {
    rateCourse(courseId: $courseId, rating: $rating, comment: $comment) {
      success
      message
              review {
          id
          rating
          comment
          user {
            id
            name
            avatar
          }
        }
      errors
    }
  }
`;

export const UPDATE_COURSE_REVIEW = gql`
  mutation UpdateCourseReview($reviewId: String!, $rating: Int!, $comment: String) {
    updateCourseReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      success
      message
              review {
          id
          rating
          comment
        }
      errors
    }
  }
`;

export const DELETE_COURSE_REVIEW = gql`
  mutation DeleteCourseReview($reviewId: String!) {
    deleteCourseReview(reviewId: $reviewId) {
      success
      message
      errors
    }
  }
`;

// ============================================================================
// COURSE ANALYTICS MUTATIONS
// ============================================================================

export const TRACK_COURSE_VIEW = gql`
  mutation TrackCourseView($courseId: String!) {
    trackCourseView(courseId: $courseId) {
      success
      message
      errors
    }
  }
`;

export const TRACK_COURSE_INTERACTION = gql`
  mutation TrackCourseInteraction($courseId: String!, $interactionType: String!, $metadata: JSON) {
    trackCourseInteraction(courseId: $courseId, interactionType: $interactionType, metadata: $metadata) {
      success
      message
      errors
    }
  }
`;

// ============================================================================
// COURSE PREVIEW AND LECTURE MUTATIONS
// ============================================================================

export const TRACK_LECTURE_VIEW = gql`
  mutation TrackLectureView($lectureId: String!, $courseId: String!) {
    trackLectureView(lectureId: $lectureId, courseId: $courseId) {
      success
      message
      errors
    }
  }
`;

export const MARK_LECTURE_COMPLETE = gql`
  mutation MarkLectureComplete($lectureId: String!, $courseId: String!, $progress: Float!) {
    markLectureComplete(lectureId: $lectureId, courseId: $courseId, progress: $progress) {
      success
      message
      progress {
        completedLectures
        totalLectures
        completionPercentage
        lastWatchedLecture
        timeSpent
        streakDays
      }
      errors
    }
  }
`;

export const UPDATE_LECTURE_PROGRESS = gql`
  mutation UpdateLectureProgress($lectureId: String!, $courseId: String!, $progress: Float!, $timeSpent: Float!) {
    updateLectureProgress(lectureId: $lectureId, courseId: $courseId, progress: $progress, timeSpent: $timeSpent) {
      success
      message
      progress {
        completedLectures
        totalLectures
        completionPercentage
        lastWatchedLecture
        timeSpent
        streakDays
      }
      errors
    }
  }
`;

export const TRACK_LECTURE_INTERACTION = gql`
  mutation TrackLectureInteraction($lectureId: String!, $courseId: String!, $interactionType: String!, $metadata: JSON) {
    trackLectureInteraction(lectureId: $lectureId, courseId: $courseId, interactionType: $interactionType, metadata: $metadata) {
      success
      message
      errors
    }
  }
`;

export const SUBMIT_LECTURE_QUIZ = gql`
  mutation SubmitLectureQuiz($lectureId: String!, $courseId: String!, $answers: [QuizAnswerInput!]!) {
    submitLectureQuiz(lectureId: $lectureId, courseId: $courseId, answers: $answers) {
      success
      message
      score
      totalQuestions
      correctAnswers
      feedback
      errors
    }
  }
`;

export const DOWNLOAD_LECTURE_RESOURCE = gql`
  mutation DownloadLectureResource($resourceId: String!, $lectureId: String!) {
    downloadLectureResource(resourceId: $resourceId, lectureId: $lectureId) {
      success
      message
      downloadUrl
      expiresAt
      errors
    }
  }
`;

export const TOGGLE_LECTURE_BOOKMARK = gql`
  mutation ToggleLectureBookmark($lectureId: String!, $courseId: String!) {
    toggleLectureBookmark(lectureId: $lectureId, courseId: $courseId) {
      success
      message
      isBookmarked
      errors
    }
  }
`;

export const ADD_LECTURE_NOTE = gql`
  mutation AddLectureNote($lectureId: String!, $courseId: String!, $content: String!, $timestamp: Float) {
    addLectureNote(lectureId: $lectureId, courseId: $courseId, content: $content, timestamp: $timestamp) {
      success
      message
              note {
          id
          content
          timestamp
        }
      errors
    }
  }
`;

export const UPDATE_LECTURE_NOTE = gql`
  mutation UpdateLectureNote($noteId: String!, $content: String!) {
    updateLectureNote(noteId: $noteId, content: $content) {
      success
      message
              note {
          id
          content
          timestamp
        }
      errors
    }
  }
`;

export const DELETE_LECTURE_NOTE = gql`
  mutation DeleteLectureNote($noteId: String!) {
    deleteLectureNote(noteId: $noteId) {
      success
      message
      errors
    }
  }
`;

export const RATE_LECTURE = gql`
  mutation RateLecture($lectureId: String!, $courseId: String!, $rating: Int!, $feedback: String) {
    rateLecture(lectureId: $lectureId, courseId: $courseId, rating: $rating, feedback: $feedback) {
      success
      message
              rating {
          id
          rating
          feedback
        }
      errors
    }
  }
`;

export const REPORT_LECTURE_ISSUE = gql`
  mutation ReportLectureIssue($lectureId: String!, $courseId: String!, $issueType: String!, $description: String!) {
    reportLectureIssue(lectureId: $lectureId, courseId: $courseId, issueType: $issueType, description: $description) {
      success
      message
              report {
          id
          issueType
          description
          status
        }
      errors
    }
  }
`;

export const REQUEST_LECTURE_ACCESS = gql`
  mutation RequestLectureAccess($lectureId: String!, $courseId: String!, $reason: String) {
    requestLectureAccess(lectureId: $lectureId, courseId: $courseId, reason: $reason) {
      success
      message
              request {
          id
          status
          reason
        }
      errors
    }
  }
`;

export const SHARE_LECTURE = gql`
  mutation ShareLecture($lectureId: String!, $courseId: String!, $platform: String!, $message: String) {
    shareLecture(lectureId: $lectureId, courseId: $courseId, platform: $platform, message: $message) {
      success
      message
      shareUrl
      errors
    }
  }
`;

export const GET_LECTURE_TRANSCRIPT = gql`
  mutation GetLectureTranscript($lectureId: String!, $courseId: String!) {
    getLectureTranscript(lectureId: $lectureId, courseId: $courseId) {
      success
      message
              transcript {
          id
          content
          language
          timestamps
          accuracy
        }
      errors
    }
  }
`;

export const GENERATE_LECTURE_SUMMARY = gql`
  mutation GenerateLectureSummary($lectureId: String!, $courseId: String!) {
    generateLectureSummary(lectureId: $lectureId, courseId: $courseId) {
      success
      message
              summary {
          id
          content
          keyPoints
          difficulty
          estimatedReadingTime
        }
      errors
    }
  }
`;

export const CREATE_LECTURE_DISCUSSION = gql`
  mutation CreateLectureDiscussion($lectureId: String!, $courseId: String!, $title: String!, $content: String!) {
    createLectureDiscussion(lectureId: $lectureId, courseId: $courseId, title: $title, content: $content) {
      success
      message
              discussion {
          id
          title
          content
          author {
            id
            username
            profileImage
          }
        }
      errors
    }
  }
`;

export const REPLY_TO_LECTURE_DISCUSSION = gql`
  mutation ReplyToLectureDiscussion($discussionId: String!, $content: String!) {
    replyToLectureDiscussion(discussionId: $discussionId, content: $content) {
      success
      message
              reply {
          id
          content
          author {
            id
            username
            profileImage
          }
        }
      errors
    }
  }
`;

// ============================================================================
// COURSE CONTENT MUTATIONS
// ============================================================================

export const ADD_COURSE_SECTION = gql`
  mutation AddCourseSection($courseId: String!, $input: CreateSectionInput!) {
    addCourseSection(courseId: $courseId, input: $input) {
      success
      message
      section {
        id
        title
        description
        order
        courseId
      }
      errors
    }
  }
`;

export const UPDATE_COURSE_SECTION = gql`
  mutation UpdateCourseSection($sectionId: String!, $input: UpdateSectionInput!) {
    updateCourseSection(sectionId: $sectionId, input: $input) {
      success
      message
      section {
        id
        title
        description
        order
      }
      errors
    }
  }
`;

export const DELETE_COURSE_SECTION = gql`
  mutation DeleteCourseSection($sectionId: String!) {
    deleteCourseSection(sectionId: $sectionId) {
      success
      message
      errors
    }
  }
`;

export const ADD_COURSE_LECTURE = gql`
  mutation AddCourseLecture($sectionId: String!, $input: CreateLectureInput!) {
    addCourseLecture(sectionId: $sectionId, input: $input) {
      success
      message
      lecture {
        id
        title
        description
        type
        duration
        order
        isPreview
      }
      errors
    }
  }
`;

export const UPDATE_COURSE_LECTURE = gql`
  mutation UpdateCourseLecture($lectureId: String!, $input: UpdateLectureInput!) {
    updateCourseLecture(lectureId: $lectureId, input: $input) {
      success
      message
      lecture {
        id
        title
        description
        type
        duration
        order
        isPreview
      }
      errors
    }
  }
`;

export const DELETE_COURSE_LECTURE = gql`
  mutation DeleteCourseLecture($lectureId: String!) {
    deleteCourseLecture(lectureId: $lectureId) {
      success
      message
      errors
    }
  }
`;

// ============================================================================
// COURSE SETTINGS MUTATIONS
// ============================================================================

export const UPDATE_COURSE_SETTINGS = gql`
  mutation UpdateCourseSettings($courseId: String!, $settings: CourseSettingsInput!) {
    updateCourseSettings(courseId: $courseId, settings: $settings) {
      success
      message
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
      errors
    }
  }
`;

export const UPDATE_COURSE_ACCESSIBILITY = gql`
  mutation UpdateCourseAccessibility($courseId: String!, $accessibility: AccessibilitySettingsInput!) {
    updateCourseAccessibility(courseId: $courseId, accessibility: $accessibility) {
      success
      message
      accessibility {
        captions
        transcripts
        audioDescription
        screenReader
        keyboardNavigation
      }
      errors
    }
  }
`;

// ============================================================================
// COURSE MEDIA MUTATIONS
// ============================================================================

export const UPLOAD_COURSE_IMAGE = gql`
  mutation UploadCourseImage($courseId: String!, $file: Upload!) {
    uploadCourseImage(courseId: $courseId, file: $file) {
      success
      message
      imageUrl
      errors
    }
  }
`;

export const DELETE_COURSE_IMAGE = gql`
  mutation DeleteCourseImage($courseId: String!, $imageUrl: String!) {
    deleteCourseImage(courseId: $courseId, imageUrl: $imageUrl) {
      success
      message
      errors
    }
  }
`;

export const UPLOAD_COURSE_VIDEO = gql`
  mutation UploadCourseVideo($lectureId: String!, $file: Upload!) {
    uploadCourseVideo(lectureId: $lectureId, file: $file) {
      success
      message
      videoUrl
      duration
      errors
    }
  }
`;

export const DELETE_COURSE_VIDEO = gql`
  mutation DeleteCourseVideo($lectureId: String!, $videoUrl: String!) {
    deleteCourseVideo(lectureId: $lectureId, videoUrl: $videoUrl) {
      success
      message
      errors
    }
  }
`;

// ============================================================================
// COURSE CONTENT MUTATIONS
// ============================================================================

export const ADD_COURSE_RESOURCE = gql`
  mutation AddCourseResource($lectureId: String!, $input: CreateResourceInput!) {
    addCourseResource(lectureId: $lectureId, input: $input) {
      success
      message
      resource {
        id
        title
        description
        type
        url
        fileSize
        mimeType
      }
      errors
    }
  }
`;

export const UPDATE_COURSE_RESOURCE = gql`
  mutation UpdateCourseResource($resourceId: String!, $input: UpdateResourceInput!) {
    updateCourseResource(resourceId: $resourceId, input: $input) {
      success
      message
      resource {
        id
        title
        description
        type
        url
        fileSize
        mimeType
      }
      errors
    }
  }
`;

export const DELETE_COURSE_RESOURCE = gql`
  mutation DeleteCourseResource($resourceId: String!) {
    deleteCourseResource(resourceId: $resourceId) {
      success
      message
      errors
    }
  }
`;

export const ADD_COURSE_QUIZ = gql`
  mutation AddCourseQuiz($lectureId: String!, $input: CreateQuizInput!) {
    addCourseQuiz(lectureId: $lectureId, input: $input) {
      success
      message
      quiz {
        id
        title
        description
        questions {
          id
          question
          options
          correctAnswer
        }
        timeLimit
        attempts
        passingScore
      }
      errors
    }
  }
`;

export const UPDATE_COURSE_QUIZ = gql`
  mutation UpdateCourseQuiz($quizId: String!, $input: UpdateQuizInput!) {
    updateCourseQuiz(quizId: $quizId, input: $input) {
      success
      message
      quiz {
        id
        title
        description
        questions {
          id
          question
          options
          correctAnswer
        }
        timeLimit
        attempts
        passingScore
      }
      errors
    }
  }
`;

export const DELETE_COURSE_QUIZ = gql`
  mutation DeleteCourseQuiz($quizId: String!) {
    deleteCourseQuiz(quizId: $quizId) {
      success
      message
      errors
    }
  }
`;

export const ADD_COURSE_ASSIGNMENT = gql`
  mutation AddCourseAssignment($lectureId: String!, $input: CreateAssignmentInput!) {
    addCourseAssignment(lectureId: $lectureId, input: $input) {
      success
      message
      assignment {
        id
        title
        description
        instructions
        dueDate
        points
        maxAttempts
      }
      errors
    }
  }
`;

export const UPDATE_COURSE_ASSIGNMENT = gql`
  mutation UpdateCourseAssignment($assignmentId: String!, $input: UpdateAssignmentInput!) {
    updateCourseAssignment(assignmentId: $assignmentId, input: $input) {
      success
      message
      assignment {
        id
        title
        description
        instructions
        dueDate
        points
        maxAttempts
      }
      errors
    }
  }
`;

export const DELETE_COURSE_ASSIGNMENT = gql`
  mutation DeleteCourseAssignment($assignmentId: String!) {
    deleteCourseAssignment(assignmentId: $assignmentId) {
      success
      message
      errors
    }
  }
`; 
