import { gql } from '@apollo/client';

// =============================================================================
// GRAPHQL TYPES
// =============================================================================

export const INSTRUCTOR_VERIFICATION_TYPES = gql`
  # Enums
  enum VerificationStatus {
    DRAFT
    SUBMITTED
    UNDER_REVIEW
    APPROVED
    REJECTED
    WITHDRAWN
  }

  enum DocumentType {
    IDENTITY_DOCUMENT
    EDUCATION_CERTIFICATE
    PROFESSIONAL_CERTIFICATE
    EMPLOYMENT_VERIFICATION
    PROFILE_PHOTO
    VIDEO_INTRODUCTION
    TEACHING_DEMO
    RESUME
    PORTFOLIO
    OTHER
  }

  # Core Types
  type InstructorVerification {
    id: ID!
    userId: String!
    status: VerificationStatus!
    
    personalInfo: JSON
    professionalBackground: JSON
    teachingInformation: JSON
    documents: JSON
    consents: JSON
    
    submittedAt: DateTime
    lastSavedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ApplicationDocument {
    id: ID!
    verificationId: String!
    documentType: DocumentType!
    fileName: String!
    originalName: String!
    fileSize: Int!
    mimeType: String!
    fileUrl: String!
    thumbnailUrl: String
    
    verificationStatus: VerificationStatus!
    uploadedAt: DateTime!
  }

  # Response Types
  type VerificationResponse {
    success: Boolean!
    message: String!
    data: InstructorVerification
    errors: [String!]
  }

  type DocumentUploadResponse {
    success: Boolean!
    message: String!
    document: ApplicationDocument
    errors: [String!]
  }

  # Input Types
  input CreateInstructorVerificationInput {
    userId: String!
    metadata: JSON
  }

  input UpdateInstructorVerificationInput {
    id: ID!
    personalInfo: JSON
    professionalBackground: JSON
    teachingInformation: JSON
    documents: JSON
    consents: JSON
    metadata: JSON
  }

  input SubmitInstructorVerificationInput {
    id: ID!
    consents: JSON!
    metadata: JSON
  }

  input SaveVerificationDraftInput {
    id: ID!
    draftData: JSON!
    metadata: JSON
  }

  input UploadVerificationDocumentInput {
    verificationId: ID!
    documentType: DocumentType!
    file: Upload!
    metadata: JSON
  }

  input DeleteVerificationDocumentInput {
    verificationId: ID!
    documentId: ID!
  }

  input UpdatePersonalInfoInput {
    verificationId: ID!
    personalInfo: JSON!
  }
`;

// =============================================================================
// GRAPHQL QUERIES
// =============================================================================

export const GET_INSTRUCTOR_VERIFICATION = gql`
  query GetInstructorVerification($userId: String!) {
    getInstructorVerification(userId: $userId) {
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
        manualReview {
          decision
          decisionReason
          reviewedAt
          conditionalRequirements
        }
      }
      errors
    }
  }
`;

export const GET_VERIFICATION_STATUS = gql`
  query GetVerificationStatus($userId: String!) {
    getVerificationStatus(userId: $userId) {
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

// =============================================================================
// GRAPHQL MUTATIONS
// =============================================================================

export const CREATE_INSTRUCTOR_VERIFICATION = gql`
  mutation CreateInstructorVerification($input: CreateInstructorVerificationInput!) {
    createInstructorVerification(input: $input) {
      success
      message
      data {
        id
        userId
        status
        createdAt
      }
      errors
    }
  }
`;

export const UPDATE_INSTRUCTOR_VERIFICATION = gql`
  mutation UpdateInstructorVerification($input: UpdateInstructorVerificationInput!) {
    updateInstructorVerification(input: $input) {
      success
      message
      data {
        id
        status
        lastSavedAt
        updatedAt
      }
      errors
    }
  }
`;

export const SUBMIT_INSTRUCTOR_VERIFICATION = gql`
  mutation SubmitInstructorVerification($input: SubmitInstructorVerificationInput!) {
    submitInstructorVerification(input: $input) {
      success
      message
      data {
        id
        status
        submittedAt
      }
      errors
    }
  }
`;

export const SAVE_VERIFICATION_DRAFT = gql`
  mutation SaveVerificationDraft($input: SaveVerificationDraftInput!) {
    saveVerificationDraft(input: $input) {
      success
      message
      data {
        id
        lastSavedAt
      }
      errors
    }
  }
`;

export const UPLOAD_VERIFICATION_DOCUMENT = gql`
  mutation UploadVerificationDocument($input: UploadVerificationDocumentInput!) {
    uploadVerificationDocument(input: $input) {
      success
      message
      document {
        id
        fileName
        fileUrl
        thumbnailUrl
        documentType
        verificationStatus
        uploadedAt
      }
      errors
    }
  }
`;

export const DELETE_VERIFICATION_DOCUMENT = gql`
  mutation DeleteVerificationDocument($input: DeleteVerificationDocumentInput!) {
    deleteVerificationDocument(input: $input) {
      success
      message
      errors
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
  mutation UpdatePersonalInfo($input: UpdatePersonalInfoInput!) {
    updatePersonalInfo(input: $input) {
      success
      message
      data {
        id
        personalInfo
        lastSavedAt
      }
      errors
    }
  }
`;

// =============================================================================
// TYPE DEFINITIONS FOR TYPESCRIPT
// =============================================================================

export interface CreateInstructorVerificationInput {
  userId: string;
  metadata?: any;
}

export interface UpdateInstructorVerificationInput {
  id: string;
  personalInfo?: any;
  professionalBackground?: any;
  teachingInformation?: any;
  documents?: any;
  consents?: any;
  metadata?: any;
}

export interface SubmitInstructorVerificationInput {
  id: string;
  consents: {
    backgroundCheck: boolean;
    dataProcessing: boolean;
    termOfService: boolean;
    privacyPolicy: boolean;
    contentGuidelines: boolean;
    codeOfConduct: boolean;
  };
  metadata?: any;
}

export interface SaveVerificationDraftInput {
  id: string;
  draftData: any;
  metadata?: any;
}

export interface UploadVerificationDocumentInput {
  verificationId: string;
  documentType: 'IDENTITY_DOCUMENT' | 'EDUCATION_CERTIFICATE' | 'PROFESSIONAL_CERTIFICATE' | 'EMPLOYMENT_VERIFICATION' | 'PROFILE_PHOTO' | 'VIDEO_INTRODUCTION' | 'TEACHING_DEMO' | 'RESUME' | 'PORTFOLIO' | 'OTHER';
  file: File;
  metadata?: any;
}

export interface DeleteVerificationDocumentInput {
  verificationId: string;
  documentId: string;
}

export interface UpdatePersonalInfoInput {
  verificationId: string;
  personalInfo: any;
}

export interface InstructorVerification {
  id: string;
  userId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  personalInfo?: any;
  professionalBackground?: any;
  teachingInformation?: any;
  documents?: any;
  consents?: any;
  submittedAt?: string;
  lastSavedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  verificationId: string;
  documentType: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  verificationStatus: string;
  uploadedAt: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: InstructorVerification;
  errors?: string[];
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document?: ApplicationDocument;
  errors?: string[];
}