import { gql } from '@apollo/client';

export const START_APPLICATION_REVIEW = gql`
  mutation StartApplicationReview($input: StartReviewInput!) {
    startApplicationReview(input: $input) {
      success
      message
      data {
        id
        status
        submittedAt
        lastSavedAt
      }
      errors
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($applicationId: String!, $status: ApplicationStatus!, $reason: String) {
    updateApplicationStatus(applicationId: $applicationId, status: $status, reason: $reason) {
      success
      message
      data {
        id
        status
        submittedAt
        lastSavedAt
      }
      errors
    }
  }
`;

export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($input: ApproveApplicationInput!) {
    approveApplication(input: $input) {
      success
      message
      data {
        id
        status
        submittedAt
        lastSavedAt
      }
      errors
    }
  }
`;

export const REJECT_APPLICATION = gql`
  mutation RejectApplication($input: RejectApplicationInput!) {
    rejectApplication(input: $input) {
      success
      message
      data {
        id
        status
        submittedAt
        lastSavedAt
      }
      errors
    }
  }
`;

export const REQUEST_MORE_INFORMATION = gql`
  mutation RequestMoreInformation($input: RequestMoreInfoInput!) {
    requestMoreInformation(input: $input) {
      success
      message
      data {
        id
        status
        submittedAt
        lastSavedAt
      }
      errors
    }
  }
`;

export const REVIEW_DOCUMENT = gql`
  mutation ReviewDocument($input: ReviewDocumentInput!) {
    reviewDocument(input: $input) {
      id
      documentType
      fileName
      fileUrl
      fileSize
      uploadDate
      verificationStatus
      metadata
    }
  }
`;
