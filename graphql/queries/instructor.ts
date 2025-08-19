import { gql } from "@apollo/client";

export const GET_INSTRUCTOR_PROFILE = gql`
  query GetInstructorProfile($userId: String!) {
    getInstructorProfile(userId: $userId) {
      id
      userId
      title
      shortBio
      bio
      experience
      expertise
      qualifications
      socialLinks
      personalWebsite
      linkedinProfile
      subjectsTeaching
      teachingCategories
      languagesSpoken
      teachingStyle
      targetAudience
      isAcceptingStudents
      maxStudentsPerCourse
      preferredSchedule
      availableTimeSlots
      revenueSharing
      payoutSettings
      taxInformation
      paymentPreferences
      isVerified
      verificationLevel
      lastVerificationDate
      complianceStatus
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFreq
      isPromotionEligible
      marketingConsent
      featuredInstructor
      badgesEarned
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        profileImage
      }
    }
  }
`;

export const GET_MY_INSTRUCTOR_PROFILE = gql`
  query GetMyInstructorProfile {
    getMyInstructorProfile {
      id
      userId
      title
      shortBio
      bio
      experience
      expertise
      qualifications
      socialLinks
      personalWebsite
      linkedinProfile
      subjectsTeaching
      teachingCategories
      languagesSpoken
      teachingStyle
      targetAudience
      isAcceptingStudents
      maxStudentsPerCourse
      preferredSchedule
      availableTimeSlots
      revenueSharing
      payoutSettings
      taxInformation
      paymentPreferences
      isVerified
      verificationLevel
      lastVerificationDate
      complianceStatus
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFreq
      isPromotionEligible
      marketingConsent
      featuredInstructor
      badgesEarned
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      createdAt
      updatedAt
      user {
        id
        email
        firstName
        lastName
        profileImage
      }
    }
  }
`;

export const GET_INSTRUCTOR_STATS = gql`
  query GetInstructorStats($userId: String!) {
    getInstructorStats(userId: $userId) {
      totalRevenue
      totalStudents
      totalCourses
      averageRating
      courseCompletionRate
      studentRetentionRate
      studentSatisfactionRate
      averageResponseTime
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFrequency
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      verificationStatus
      complianceStatus
    }
  }
`;

export const GET_MY_INSTRUCTOR_STATS = gql`
  query GetMyInstructorStats {
    getMyInstructorStats {
      totalRevenue
      totalStudents
      totalCourses
      averageRating
      courseCompletionRate
      studentRetentionRate
      studentSatisfactionRate
      averageResponseTime
      totalLectures
      totalVideoHours
      totalQuizzes
      totalAssignments
      contentUpdateFrequency
      lastCourseUpdate
      lastStudentReply
      lastContentCreation
      verificationStatus
      complianceStatus
    }
  }
`;

export const SEARCH_INSTRUCTORS = gql`
  query SearchInstructors($filters: InstructorSearchFilters!) {
    searchInstructors(filters: $filters) {
      instructors {
        id
        userId
        title
        shortBio
        experience
        expertise
        subjectsTeaching
        teachingCategories
        languagesSpoken
        averageCourseRating
        totalStudents
        totalCourses
        isVerified
        verificationLevel
        complianceStatus
        user {
          id
          firstName
          lastName
          profileImage
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_VERIFICATION_STATUS = gql`
  query GetVerificationStatus {
    getVerificationStatus {
      isVerified
      verificationLevel
      documentsSubmitted
      documentsApproved
      documentsRejected
      lastUpdated
      nextReviewDate
    }
  }
`;
