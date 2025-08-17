import { gql } from "@apollo/client";

export const CREATE_INSTRUCTOR_VERIFICATION = gql`
  mutation CreateInstructorVerification($input: CreateInstructorVerificationInput!) {
    createInstructorVerification(input: $input) {
      success
      message
      data {
        id
        userId
        overallStatus
        currentStage
        completionPercentage
        createdAt
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_INSTRUCTOR_VERIFICATION = gql`
  mutation UpdateInstructorVerification($id: String!, $input: UpdateInstructorVerificationInput!) {
    updateInstructorVerification(id: $id, input: $input) {
      success
      message
      data {
        id
        userId
        overallStatus
        currentStage
        completionPercentage
        updatedAt
      }
      errors
      warnings
    }
  }
`;

export const SUBMIT_INSTRUCTOR_VERIFICATION = gql`
  mutation SubmitInstructorVerification($id: String!) {
    submitInstructorVerification(id: $id) {
      success
      message
      data {
        id
        userId
        overallStatus
        submittedAt
        validationErrors
        warnings
      }
      errors
      warnings
    }
  }
`;

export const SAVE_VERIFICATION_DRAFT = gql`
  mutation SaveVerificationDraft($id: String!, $input: SaveVerificationDraftInput!) {
    saveVerificationDraft(id: $id, input: $input) {
      success
      message
      data {
        id
        userId
        lastSaved
        hasUnsavedChanges
      }
      errors
      warnings
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
        name
        type
        size
        mimeType
        url
        thumbnailUrl
        uploadDate
        verificationStatus
        aiAnalysis {
          confidence
          extractedText
          documentType
          validationChecks
          issues
          suggestions
        }
        metadata {
          originalName
          checksum
          version
          uploadedBy
        }
      }
      errors
      uploadProgress
    }
  }
`;

export const DELETE_VERIFICATION_DOCUMENT = gql`
  mutation DeleteVerificationDocument($documentId: String!) {
    deleteVerificationDocument(documentId: $documentId) {
      success
      message
      errors
    }
  }
`;

export const VERIFY_PHONE_NUMBER = gql`
  mutation VerifyPhoneNumber($phone: String!, $otp: String!) {
    verifyPhoneNumber(phone: $phone, otp: $otp) {
      success
      message
      verified
      errors
    }
  }
`;

export const VERIFY_EMAIL_ADDRESS = gql`
  mutation VerifyEmailAddress($email: String!, $otp: String!) {
    verifyEmailAddress(email: $email, otp: $otp) {
      success
      message
      verified
      errors
    }
  }
`;

export const SEND_VERIFICATION_OTP = gql`
  mutation SendVerificationOTP($type: OTPType!, $contact: String!) {
    sendVerificationOTP(type: $type, contact: $contact) {
      success
      message
      expiresIn
      errors
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
  mutation UpdatePersonalInfo($verificationId: String!, $input: UpdatePersonalInfoInput!) {
    updatePersonalInfo(verificationId: $verificationId, input: $input) {
      success
      message
      data {
        firstName
        lastName
        dateOfBirth
        nationality
        address
        city
        postalCode
        country
        phone
        email
        alternateEmail
      }
      errors
      warnings
    }
  }
`;

export const ADD_EDUCATION = gql`
  mutation AddEducation($verificationId: String!, $input: AddEducationInput!) {
    addEducation(verificationId: $verificationId, input: $input) {
      success
      message
      education {
        id
        institution
        degree
        field
        startYear
        endYear
        gpa
        honors
        description
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_EDUCATION = gql`
  mutation UpdateEducation($educationId: String!, $input: UpdateEducationInput!) {
    updateEducation(educationId: $educationId, input: $input) {
      success
      message
      education {
        id
        institution
        degree
        field
        startYear
        endYear
        gpa
        honors
        description
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($educationId: String!) {
    deleteEducation(educationId: $educationId) {
      success
      message
      errors
    }
  }
`;

export const ADD_WORK_EXPERIENCE = gql`
  mutation AddWorkExperience($verificationId: String!, $input: AddWorkExperienceInput!) {
    addWorkExperience(verificationId: $verificationId, input: $input) {
      success
      message
      experience {
        id
        company
        position
        startDate
        endDate
        current
        location
        employmentType
        description
        achievements
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_WORK_EXPERIENCE = gql`
  mutation UpdateWorkExperience($experienceId: String!, $input: UpdateWorkExperienceInput!) {
    updateWorkExperience(experienceId: $experienceId, input: $input) {
      success
      message
      experience {
        id
        company
        position
        startDate
        endDate
        current
        location
        employmentType
        description
        achievements
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const DELETE_WORK_EXPERIENCE = gql`
  mutation DeleteWorkExperience($experienceId: String!) {
    deleteWorkExperience(experienceId: $experienceId) {
      success
      message
      errors
    }
  }
`;

export const ADD_PROFESSIONAL_REFERENCE = gql`
  mutation AddProfessionalReference($verificationId: String!, $input: AddProfessionalReferenceInput!) {
    addProfessionalReference(verificationId: $verificationId, input: $input) {
      success
      message
      reference {
        id
        name
        position
        company
        email
        phone
        relationship
        yearsKnown
        notes
        contactPermission
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_PROFESSIONAL_REFERENCE = gql`
  mutation UpdateProfessionalReference($referenceId: String!, $input: UpdateProfessionalReferenceInput!) {
    updateProfessionalReference(referenceId: $referenceId, input: $input) {
      success
      message
      reference {
        id
        name
        position
        company
        email
        phone
        relationship
        yearsKnown
        notes
        contactPermission
        isVerified
        verificationStatus
      }
      errors
      warnings
    }
  }
`;

export const DELETE_PROFESSIONAL_REFERENCE = gql`
  mutation DeleteProfessionalReference($referenceId: String!) {
    deleteProfessionalReference(referenceId: $referenceId) {
      success
      message
      errors
    }
  }
`;

export const ADD_TEACHING_CATEGORY = gql`
  mutation AddTeachingCategory($verificationId: String!, $input: AddTeachingCategoryInput!) {
    addTeachingCategory(verificationId: $verificationId, input: $input) {
      success
      message
      category {
        id
        categoryId
        subcategory
        level
        verified
        aiScore
        lastUpdated
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_TEACHING_CATEGORY = gql`
  mutation UpdateTeachingCategory($categoryId: String!, $input: UpdateTeachingCategoryInput!) {
    updateTeachingCategory(categoryId: $categoryId, input: $input) {
      success
      message
      category {
        id
        categoryId
        subcategory
        level
        verified
        aiScore
        lastUpdated
      }
      errors
      warnings
    }
  }
`;

export const DELETE_TEACHING_CATEGORY = gql`
  mutation DeleteTeachingCategory($categoryId: String!) {
    deleteTeachingCategory(categoryId: $categoryId) {
      success
      message
      errors
    }
  }
`;

export const SUBMIT_SKILLS_ASSESSMENT = gql`
  mutation SubmitSkillsAssessment($input: SubmitSkillsAssessmentInput!) {
    submitSkillsAssessment(input: $input) {
      success
      message
      assessment {
        id
        categoryId
        subcategory
        score
        totalQuestions
        correctAnswers
        timeSpent
        completedAt
        questions {
          id
          question
          type
          options
          correctAnswer
          userAnswer
          isCorrect
          explanation
          points
        }
        aiAnalysis {
          confidence
          strengths
          weaknesses
          recommendations
        }
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_BACKGROUND_AGREEMENTS = gql`
  mutation UpdateBackgroundAgreements($verificationId: String!, $input: UpdateBackgroundAgreementsInput!) {
    updateBackgroundAgreements(verificationId: $verificationId, input: $input) {
      success
      message
      agreements {
        termsOfService
        privacyPolicy
        codeOfConduct
        backgroundCheckConsent
        dataProcessingConsent
        signedAt
      }
      errors
      warnings
    }
  }
`;

export const UPDATE_BIOMETRIC_DATA = gql`
  mutation UpdateBiometricData($verificationId: String!, $input: UpdateBiometricDataInput!) {
    updateBiometricData(verificationId: $verificationId, input: $input) {
      success
      message
      biometricData {
        id
        photoUrl
        verificationStatus
        verificationDate
        aiAnalysis {
          faceDetected
          quality
          livenessScore
          matchScore
          issues
        }
      }
      errors
      warnings
    }
  }
`;

export const VALIDATE_VERIFICATION_STAGE = gql`
  mutation ValidateVerificationStage($verificationId: String!, $stage: VerificationStage!) {
    validateVerificationStage(verificationId: $verificationId, stage: $stage) {
      success
      isValid
      errors
      warnings
      completionPercentage
      missingRequirements
      recommendations
    }
  }
`;

export const VALIDATE_VERIFICATION_COMPLETE = gql`
  mutation ValidateVerificationComplete($verificationId: String!) {
    validateVerificationComplete(verificationId: $verificationId) {
      success
      isValid
      errors
      warnings
      completionPercentage
      missingRequirements
      recommendations
      canSubmit
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
      errors
    }
  }
`;

export const CLEAR_VERIFICATION_NOTIFICATIONS = gql`
  mutation ClearVerificationNotifications($userId: String!) {
    clearVerificationNotifications(userId: $userId) {
      success
      message
      errors
    }
  }
`;

export const RESET_VERIFICATION = gql`
  mutation ResetVerification($verificationId: String!) {
    resetVerification(verificationId: $verificationId) {
      success
      message
      data {
        id
        userId
        overallStatus
        currentStage
        completionPercentage
        updatedAt
      }
      errors
    }
  }
`;

export const CANCEL_VERIFICATION = gql`
  mutation CancelVerification($verificationId: String!) {
    cancelVerification(verificationId: $verificationId) {
      success
      message
      errors
    }
  }
`;
