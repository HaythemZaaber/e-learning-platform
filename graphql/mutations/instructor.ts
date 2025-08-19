import { gql } from "@apollo/client";

export const UPDATE_INSTRUCTOR_PROFILE = gql`
  mutation UpdateInstructorProfile($input: UpdateInstructorProfileInput!) {
    updateInstructorProfile(input: $input) {
      id
      userId
      title
      shortBio
      bio
      experience
      expertise
      qualifications
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

export const CREATE_INSTRUCTOR_PROFILE = gql`
  mutation CreateInstructorProfile($input: CreateInstructorProfileInput!) {
    createInstructorProfile(input: $input) {
      id
      userId
      title
      shortBio
      bio
      experience
      expertise
      qualifications
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

export const DELETE_INSTRUCTOR_PROFILE = gql`
  mutation DeleteInstructorProfile($userId: String!) {
    deleteInstructorProfile(userId: $userId) {
      success
      message
      deletedProfileId
    }
  }
`;

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfileImage($file: Upload!) {
    uploadProfileImage(file: $file) {
      success
      message
      imageUrl
      imageId
    }
  }
`;

export const REQUEST_VERIFICATION = gql`
  mutation RequestVerification($input: VerificationRequestInput!) {
    requestVerification(input: $input) {
      success
      message
      requestId
      estimatedReviewTime
    }
  }
`;

export const UPDATE_PROFILE_IMAGE = gql`
  mutation UpdateProfileImage($input: UpdateProfileImageInput!) {
    updateProfileImage(input: $input) {
      success
      message
      profileImage
    }
  }
`;
