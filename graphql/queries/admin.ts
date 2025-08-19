import { gql } from '@apollo/client';

export const GET_SUBMITTED_APPLICATIONS = gql`
  query GetSubmittedApplications($filters: ApplicationFiltersInput) {
    getSubmittedApplications(filters: $filters) {
      id
      status
      fullName
      phoneNumber
      currentJobTitle
      yearsOfExperience
      subjectsToTeach
      teachingMotivation
      personalInfo
      professionalBackground
      teachingInformation
      documents
      consents
        submittedAt
        lastSavedAt
        createdAt
        updatedAt
      aiVerification {
        id
        overallScore
        verificationResults
        reviewedAt
      }
      manualReview {
        id
        reviewerId
        decision
        decisionReason
        reviewedAt
        conditionalRequirements
      }
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

export const GET_APPLICATION_DETAILS = gql`
  query GetApplicationDetails($applicationId: String!) {
     getInstructorVerification(applicationId: $applicationId) {
      success
      message
      data {
        id
        userId
        status
        personalInfo
        professionalBackground
        teachingInformation
        documents
        consents
        submittedAt
        lastSavedAt
        createdAt
        updatedAt
        aiVerification {
          id
          overallScore
          verificationResults
          reviewedAt
        }
        manualReview {
          id
          reviewerId
          decision
          decisionReason
          reviewedAt
          conditionalRequirements
        }
        user {
          id
          email
          firstName
          lastName
          profileImage
        }
      }
      errors
    }
  }
`;

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    getAdminStats {
      totalApplications
      pendingReview
      underReview
      approved
      rejected
      requiresMoreInfo
      averageReviewTime
      applicationsThisWeek
      applicationsThisMonth
    }
  }
`;
