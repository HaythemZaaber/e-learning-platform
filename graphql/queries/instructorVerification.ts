import { gql } from "@apollo/client";

export const GET_INSTRUCTOR_VERIFICATION = gql`
  query GetInstructorVerification($userId: String!) {
    getInstructorVerification(userId: $userId) {
      id
      userId
      
      identity {
        personalInfo {
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
        documents {
          id
          name
          type
          size
          mimeType
          url
          thumbnailUrl
          uploadDate
          verificationStatus
          verificationDate
          rejectionReason
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
        verificationStatus
        aiVerificationScore
        lastUpdated
        phoneVerified
        emailVerified
        otpVerification {
          phone {
            verified
            verifiedAt
          }
          email {
            verified
            verifiedAt
          }
        }
      }
      
      professional {
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
          verificationDate
          documents
        }
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
          verificationDate
          documents
        }
        references {
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
          verificationDate
        }
        documents {
          id
          name
          type
          size
          mimeType
          url
          thumbnailUrl
          uploadDate
          verificationStatus
          verificationDate
          rejectionReason
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
        verificationStatus
        aiVerificationScore
        lastUpdated
      }
      
      skills {
        categories {
          id
          categoryId
          subcategory
          level
          verified
          aiScore
          lastUpdated
          assessmentScore
          assessmentCompleted
        }
        assessments {
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
        demonstrations {
          id
          name
          type
          size
          mimeType
          url
          thumbnailUrl
          uploadDate
          verificationStatus
          verificationDate
          rejectionReason
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
        lessonPlans {
          id
          name
          type
          size
          mimeType
          url
          thumbnailUrl
          uploadDate
          verificationStatus
          verificationDate
          rejectionReason
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
        verificationStatus
        aiVerificationScore
        lastUpdated
      }
      
      background {
        checks {
          id
          name
          type
          size
          mimeType
          url
          thumbnailUrl
          uploadDate
          verificationStatus
          verificationDate
          rejectionReason
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
        agreements {
          termsOfService
          privacyPolicy
          codeOfConduct
          backgroundCheckConsent
          dataProcessingConsent
          signedAt
        }
        verificationStatus
        aiVerificationScore
        lastUpdated
      }
      
      progress {
        overallProgress
        stageProgress
        completedStages
        currentStage
        estimatedTimeRemaining
        lastUpdated
      }
      
      overallStatus
      createdAt
      updatedAt
      submittedAt
      approvedAt
      rejectedAt
      
      adminReview {
        reviewedBy
        reviewedAt
        comments
        decision
        requiredActions
      }
      
      version
      completionPercentage
      isComplete
      canSubmit
      validationErrors
      warnings
    }
  }
`;

export const GET_VERIFICATION_PROGRESS = gql`
  query GetVerificationProgress($userId: String!) {
    getVerificationProgress(userId: $userId) {
      overallProgress
      stageProgress
      completedStages
      currentStage
      estimatedTimeRemaining
      lastUpdated
      completionPercentage
      nextSteps
    }
  }
`;

export const GET_VERIFICATION_STATUS = gql`
  query GetVerificationStatus($userId: String!) {
    getVerificationStatus(userId: $userId) {
      overallStatus
      currentStage
      completionPercentage
      isComplete
      canSubmit
      validationErrors
      warnings
      lastUpdated
    }
  }
`;

export const GET_SKILLS_ASSESSMENT = gql`
  query GetSkillsAssessment($categoryId: String!, $subcategory: String!) {
    getSkillsAssessment(categoryId: $categoryId, subcategory: $subcategory) {
      id
      categoryId
      subcategory
      questions {
        id
        question
        type
        options
        correctAnswer
        explanation
        points
      }
      timeLimit
      totalQuestions
      passingScore
    }
  }
`;

export const GET_TEACHING_CATEGORIES = gql`
  query GetTeachingCategories {
    getTeachingCategories {
      id
      name
      description
      icon
      color
      subcategories {
        name
        popularity
        demand
        description
      }
    }
  }
`;

export const GET_VERIFICATION_HISTORY = gql`
  query GetVerificationHistory($userId: String!) {
    getVerificationHistory(userId: $userId) {
      id
      stage
      action
      status
      timestamp
      details
      adminReview {
        reviewedBy
        reviewedAt
        comments
        decision
      }
    }
  }
`;

export const GET_DOCUMENT_REQUIREMENTS = gql`
  query GetDocumentRequirements($documentType: DocumentType!) {
    getDocumentRequirements(documentType: $documentType) {
      id
      title
      description
      required
      maxSize
      allowedTypes
      requirements
      examples
    }
  }
`;

export const GET_VERIFICATION_NOTIFICATIONS = gql`
  query GetVerificationNotifications($userId: String!) {
    getVerificationNotifications(userId: $userId) {
      id
      type
      title
      message
      priority
      read
      createdAt
      actionRequired
      actionUrl
      metadata
    }
  }
`;
