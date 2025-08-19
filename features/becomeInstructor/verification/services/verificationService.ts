import { ApolloClient, InMemoryCache, useApolloClient } from '@apollo/client';
import {
  CREATE_INSTRUCTOR_VERIFICATION,
  UPDATE_INSTRUCTOR_VERIFICATION,
  SUBMIT_INSTRUCTOR_VERIFICATION,
  SAVE_VERIFICATION_DRAFT,
  GET_INSTRUCTOR_VERIFICATION,
  GET_VERIFICATION_STATUS,
  type CreateInstructorVerificationInput,
  type UpdateInstructorVerificationInput,
  type SubmitInstructorVerificationInput,
  type SaveVerificationDraftInput,
} from '@/features/becomeInstructor/verification/graphql/instructor-application';

// ============================================================================
// CORE VERIFICATION SERVICE - FOCUSED AND EFFICIENT
// ============================================================================

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  warnings?: string[];
  validationErrors?: Record<string, string[]>;
  metadata?: {
    processingTime: number;
    timestamp: string;
    version: string;
  };
}

export interface VerificationData {
  id?: string;
  userId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  personalInfo?: any;
  professionalBackground?: any;
  teachingInformation?: any;
  documents?: any;
  consents?: any;
  submittedAt?: string;
  lastSavedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string[]>;
  stepValidation: {
    personalInfo: { isValid: boolean; errors: string[]; warnings: string[] };
    professionalBackground: { isValid: boolean; errors: string[]; warnings: string[] };
    teachingInformation: { isValid: boolean; errors: string[]; warnings: string[] };
    documents: { isValid: boolean; errors: string[]; warnings: string[] };
    consents: { isValid: boolean; errors: string[]; warnings: string[] };
  };
}

// ============================================================================
// COMPREHENSIVE VERIFICATION SERVICE
// ============================================================================

export class VerificationService {
  private static client: ApolloClient<any>;

  // Initialize Apollo Client with token
  private static getClient(token?: string): ApolloClient<any> {
    if (!this.client || token) {
      this.client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
        cache: new InMemoryCache(),
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
        },
      });
    }
    return this.client;
  }

  // ============================================================================
  // CORE VERIFICATION OPERATIONS
  // ============================================================================

  /**
   * Load existing verification draft or create new one
   */
  static async loadOrCreateVerification(userId: string, token: string): Promise<VerificationResponse> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient(token);
      
      if (!userId) {
        return {
          success: false,
          message: 'User not authenticated',
          errors: ['User must be authenticated to access verification'],
        };
      }

      // First, try to get existing verification
      const { data: getData } = await client.query({
        query: GET_INSTRUCTOR_VERIFICATION,
        variables: { userId },
        fetchPolicy: 'network-only', // Always fetch fresh data
      });

      if (getData.getInstructorVerification.success && getData.getInstructorVerification.data) {
        // Existing verification found
        return {
          success: true,
          message: 'Existing verification loaded successfully',
          data: getData.getInstructorVerification.data,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      }

      // No existing verification, create new one
      const input: CreateInstructorVerificationInput = {
        userId: userId,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'web',
        }
      };

      const { data: createData } = await client.mutate({
        mutation: CREATE_INSTRUCTOR_VERIFICATION,
        variables: { input },
      });

      if (createData.createInstructorVerification.success) {
        return {
          success: true,
          message: 'New verification created successfully',
          data: createData.createInstructorVerification.data,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      } else {
        // Handle server error response
        const serverError = createData.createInstructorVerification.errors?.join(', ') || createData.createInstructorVerification.message || 'Failed to create verification';
        throw new Error(serverError);
      }

    } catch (error) {
      console.error('Error loading/creating verification:', error);
      return {
        success: false,
        message: 'Failed to load or create verification',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        metadata: {
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      };
    }
  }

  /**
   * Save verification as draft
   */
  static async saveDraft(verificationId: string, draftData: any, token: string): Promise<VerificationResponse> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient(token);
      
      const input: SaveVerificationDraftInput = {
        id: verificationId,
        draftData: {
          ...draftData,
          lastSavedAt: new Date().toISOString(),
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'web',
          action: 'save_draft',
        }
      };

      const { data } = await client.mutate({
        mutation: SAVE_VERIFICATION_DRAFT,
        variables: { input },
      });

      if (data.saveVerificationDraft.success) {
        return {
          success: true,
          message: 'Draft saved successfully',
          data: data.saveVerificationDraft.data,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      } else {
        // Handle server error response
        const serverError = data.saveVerificationDraft.errors?.join(', ') || data.saveVerificationDraft.message || 'Failed to save draft';
        throw new Error(serverError);
      }

    } catch (error) {
      console.error('Error saving draft:', error);
      return {
        success: false,
        message: 'Failed to save draft',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        metadata: {
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      };
    }
  }

  /**
   * Submit verification application
   */
  static async submitVerification(verificationId: string, consents: any, token: string): Promise<VerificationResponse> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient(token);
      
      const input: SubmitInstructorVerificationInput = {
        id: verificationId,
        consents: {
          backgroundCheck: consents.backgroundCheck || false,
          dataProcessing: consents.dataProcessing || false,
          termOfService: consents.termOfService || false,
          privacyPolicy: consents.privacyPolicy || false,
          contentGuidelines: consents.contentGuidelines || false,
          codeOfConduct: consents.codeOfConduct || false,
        },
        metadata: {
          submissionSource: 'web',
          timestamp: new Date().toISOString(),
          action: 'submit_application',
        }
      };

      const { data } = await client.mutate({
        mutation: SUBMIT_INSTRUCTOR_VERIFICATION,
        variables: { input },
      });

      if (data.submitInstructorVerification.success) {
        return {
          success: true,
          message: 'Application submitted successfully',
          data: data.submitInstructorVerification.data,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      } else {
        // Handle server error response
        const serverError = data.submitInstructorVerification.errors?.join(', ') || data.submitInstructorVerification.message || 'Failed to submit application';
        throw new Error(serverError);
      }

    } catch (error) {
      console.error('Error submitting verification:', error);
      return {
        success: false,
        message: 'Failed to submit application',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        metadata: {
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      };
    }
  }

  /**
   * Get verification status
   */
  static async getVerificationStatus(userId: string, token: string): Promise<VerificationResponse> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient(token);
      
      const { data } = await client.query({
        query: GET_VERIFICATION_STATUS,
        variables: { userId },
        fetchPolicy: 'network-only',
      });

      if (data.getVerificationStatus.success) {
        return {
          success: true,
          message: 'Verification status retrieved successfully',
          data: data.getVerificationStatus.data,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      } else {
        // Handle server error response
        const serverError = data.getVerificationStatus.errors?.join(', ') || data.getVerificationStatus.message || 'Failed to get verification status';
        throw new Error(serverError);
      }

    } catch (error) {
      console.error('Error getting verification status:', error);
      return {
        success: false,
        message: 'Failed to get verification status',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        metadata: {
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      };
    }
  }

  /**
   * Get instructor verification data for application status page
   */
  static async getInstructorVerificationData(userId: string, token: string): Promise<VerificationResponse> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient(token);
      
      if (!userId) {
        return {
          success: false,
          message: 'User not authenticated',
          errors: ['User must be authenticated to access verification data'],
        };
      }

      // Get verification data
      const { data: getData } = await client.query({
        query: GET_INSTRUCTOR_VERIFICATION,
        variables: { userId },
        context: {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
        fetchPolicy: 'network-only', // Always fetch fresh data
      });

      if (getData.getInstructorVerification.success && getData.getInstructorVerification.data) {
        const verificationData = getData.getInstructorVerification.data;
        
        // Transform the data to match the application status page format
        const transformedData = this.transformVerificationDataForStatus(verificationData);
        
        return {
          success: true,
          message: 'Verification data loaded successfully',
          data: transformedData,
          metadata: {
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            version: '1.0',
          },
        };
      } else {
        return {
          success: false,
          message: getData.getInstructorVerification.message || 'Failed to load verification data',
          errors: getData.getInstructorVerification.errors || ['Unknown error occurred'],
        };
      }
    } catch (error) {
      console.error('Error fetching instructor verification data:', error);
      return {
        success: false,
        message: 'Failed to fetch verification data',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      };
    }
  }

  /**
   * Transform verification data to match application status page format
   */
  private static transformVerificationDataForStatus(verificationData: any) {
    const personalInfo = verificationData.personalInfo || {};
    const professionalBackground = verificationData.professionalBackground || {};
    const teachingInformation = verificationData.teachingInformation || {};
    const documents = verificationData.documents || {};
    const consents = verificationData.consents || {};
    
    // Calculate overall progress
    const steps = [
      { id: 'personal-information', completed: !!personalInfo.firstName, weight: 20 },
      { id: 'professional-background', completed: !!(professionalBackground.education?.length > 0), weight: 25 },
      { id: 'teaching-information', completed: !!(teachingInformation.subjectsToTeach?.length > 0), weight: 25 },
      { id: 'documents', completed: !!(documents.identityDocument && documents.profilePhoto), weight: 20 },
      { id: 'review', completed: !!(consents.backgroundCheck && consents.termOfService && consents.privacyPolicy), weight: 10 },
    ];
    
    const overallProgress = steps.reduce((total, step) => {
      return total + (step.completed ? step.weight : 0);
    }, 0);

    // Transform steps for timeline
    const transformedSteps = [
      {
        id: 'personal-information',
        title: 'Personal Information',
        status: personalInfo.firstName ? 'completed' : 'pending',
        completionPercentage: personalInfo.firstName ? 100 : 0,
        lastUpdated: personalInfo.lastUpdated || verificationData.updatedAt,
      },
      {
        id: 'professional-background',
        title: 'Professional Background',
        status: professionalBackground.education?.length > 0 ? 'completed' : 'pending',
        completionPercentage: professionalBackground.education?.length > 0 ? 100 : 0,
        lastUpdated: professionalBackground.lastUpdated || verificationData.updatedAt,
      },
      {
        id: 'teaching-information',
        title: 'Teaching Information',
        status: teachingInformation.subjectsToTeach?.length > 0 ? 'completed' : 'pending',
        completionPercentage: teachingInformation.subjectsToTeach?.length > 0 ? 100 : 0,
        lastUpdated: teachingInformation.lastUpdated || verificationData.updatedAt,
      },
      {
        id: 'documents',
        title: 'Documents & Verification',
        status: (documents.identityDocument && documents.profilePhoto) ? 'completed' : 'pending',
        completionPercentage: (documents.identityDocument && documents.profilePhoto) ? 100 : 0,
        lastUpdated: documents.lastUpdated || verificationData.updatedAt,
      },
      {
        id: 'review',
        title: 'Review & Approval',
        status: verificationData.status === 'UNDER_REVIEW' ? 'in_progress' : 
               verificationData.status === 'APPROVED' ? 'completed' : 'pending',
        completionPercentage: verificationData.status === 'UNDER_REVIEW' ? 60 : 
                             verificationData.status === 'APPROVED' ? 100 : 0,
        lastUpdated: verificationData.submittedAt || verificationData.updatedAt,
        notes: verificationData.status === 'UNDER_REVIEW' ? 'Under team review' : undefined,
      },
    ];

    // Get status info
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'DRAFT':
          return {
            title: 'Draft',
            description: 'Your application is saved as a draft',
            actionText: 'Continue Application'
          };
        case 'SUBMITTED':
          return {
            title: 'Submitted',
            description: 'Your application has been submitted and is queued for review',
            actionText: 'View Application'
          };
        case 'UNDER_REVIEW':
          return {
            title: 'Under Review',
            description: 'Our team is carefully reviewing your application',
            actionText: 'Track Progress'
          };
        case 'APPROVED':
          return {
            title: 'Approved',
            description: 'Congratulations! You\'re now an approved instructor',
            actionText: 'Start Teaching'
          };
        case 'REJECTED':
          return {
            title: 'Needs Attention',
            description: 'Your application requires some updates',
            actionText: 'Review Feedback'
          };
        default:
          return {
            title: 'Unknown',
            description: 'Application status unknown',
            actionText: 'View Details'
          };
      }
    };

    const statusInfo = getStatusInfo(verificationData.status);

    return {
      id: verificationData.id,
      status: verificationData.status,
      submittedAt: verificationData.submittedAt,
      reviewedAt: verificationData.reviewedAt,
      estimatedReviewTime: '3-5 business days',
      overallProgress,
      reviewerNotes: verificationData.adminReview?.comments || 'Your application is progressing well through our review process. Our team is currently verifying your professional credentials and teaching qualifications.',
      nextSteps: verificationData.status === 'UNDER_REVIEW' ? [
        'Background check in progress',
        'Credential verification ongoing', 
        'Teaching demo evaluation',
        'Final interview scheduling'
      ] : [],
      personalInfo: {
        firstName: personalInfo.firstName || '',
        lastName: personalInfo.lastName || '',
        email: personalInfo.email || '',
        phoneNumber: personalInfo.phoneNumber || '',
        dateOfBirth: personalInfo.dateOfBirth || '',
        nationality: personalInfo.nationality || '',
        streetAddress: personalInfo.streetAddress || '',
        city: personalInfo.city || '',
        state: personalInfo.state || '',
        postalCode: personalInfo.postalCode || '',
        country: personalInfo.country || '',
        timezone: personalInfo.timezone || 'UTC',
        primaryLanguage: personalInfo.primaryLanguage || 'en',
        languagesSpoken: personalInfo.languagesSpoken || [],
        emergencyContact: personalInfo.emergencyContact || {
          name: '',
          relationship: '',
          phoneNumber: '',
          email: '',
        },
      },
      professionalBackground: {
        currentJobTitle: professionalBackground.currentJobTitle || '',
        currentEmployer: professionalBackground.currentEmployer || '',
        employmentType: professionalBackground.employmentType || 'full_time',
        workLocation: professionalBackground.workLocation || '',
        yearsOfExperience: professionalBackground.yearsOfExperience || 0,
        education: professionalBackground.education || [],
        experience: professionalBackground.experience || [],
        references: professionalBackground.references || [],
      },
      teachingInformation: {
        subjectsToTeach: teachingInformation.subjectsToTeach || [],
        hasTeachingExperience: teachingInformation.hasTeachingExperience || false,
        teachingExperience: teachingInformation.teachingExperience || [],
        teachingMotivation: teachingInformation.teachingMotivation || '',
        teachingPhilosophy: teachingInformation.teachingPhilosophy || '',
        targetAudience: teachingInformation.targetAudience || [],
        teachingStyle: teachingInformation.teachingStyle || '',
        teachingMethodology: teachingInformation.teachingMethodology || '',
        preferredFormats: teachingInformation.preferredFormats || [],
        preferredClassSize: teachingInformation.preferredClassSize || 'any',
      },
      documents: {
        identityDocument: documents.identityDocument || null,
        profilePhoto: documents.profilePhoto || null,
        resume: documents.resume || null,
        videoIntroduction: documents.videoIntroduction || null,
        teachingDemo: documents.teachingDemo || null,
        educationCertificates: documents.educationCertificates || [],
        professionalCertifications: documents.professionalCertifications || [],
      },
      consents: {
        backgroundCheck: consents.backgroundCheck || false,
        dataProcessing: consents.dataProcessing || false,
        termOfService: consents.termOfService || false,
        privacyPolicy: consents.privacyPolicy || false,
        contentGuidelines: consents.contentGuidelines || false,
        codeOfConduct: consents.codeOfConduct || false,
      },
      steps: transformedSteps,
      statusInfo,
    };
  }

  // ============================================================================
  // COMPREHENSIVE VALIDATION SYSTEM
  // ============================================================================

  /**
   * Comprehensive validation for all verification data
   */
  static validateVerificationData(data: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fieldErrors: {},
      stepValidation: {
        personalInfo: { isValid: true, errors: [], warnings: [] },
        professionalBackground: { isValid: true, errors: [], warnings: [] },
        teachingInformation: { isValid: true, errors: [], warnings: [] },
        documents: { isValid: true, errors: [], warnings: [] },
        consents: { isValid: true, errors: [], warnings: [] },
      }
    };

    // Personal Info Validation
    const personalInfoValidation = this.validatePersonalInfo(data.personalInfo);
    result.stepValidation.personalInfo = personalInfoValidation;
    if (!personalInfoValidation.isValid) {
      result.isValid = false;
      result.errors.push(...personalInfoValidation.errors);
      result.fieldErrors.personalInfo = personalInfoValidation.errors;
    }

    // Professional Background Validation
    const professionalValidation = this.validateProfessionalBackground(data.professionalBackground);
    result.stepValidation.professionalBackground = professionalValidation;
    if (!professionalValidation.isValid) {
      result.isValid = false;
      result.errors.push(...professionalValidation.errors);
      result.fieldErrors.professionalBackground = professionalValidation.errors;
    }

    // Teaching Information Validation
    const teachingValidation = this.validateTeachingInformation(data.teachingInformation);
    result.stepValidation.teachingInformation = teachingValidation;
    if (!teachingValidation.isValid) {
      result.isValid = false;
      result.errors.push(...teachingValidation.errors);
      result.fieldErrors.teachingInformation = teachingValidation.errors;
    }

    // Documents Validation
    const documentsValidation = this.validateDocuments(data.documents);
    result.stepValidation.documents = documentsValidation;
    if (!documentsValidation.isValid) {
      result.isValid = false;
      result.errors.push(...documentsValidation.errors);
      result.fieldErrors.documents = documentsValidation.errors;
    }

    // Consents Validation
    const consentsValidation = this.validateConsents(data.consents);
    result.stepValidation.consents = consentsValidation;
    if (!consentsValidation.isValid) {
      result.isValid = false;
      result.errors.push(...consentsValidation.errors);
      result.fieldErrors.consents = consentsValidation.errors;
    }

    return result;
  }

  /**
   * Validate Personal Information
   */
  private static validatePersonalInfo(personalInfo: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!personalInfo) {
      errors.push('Personal information is required');
      return { isValid: false, errors, warnings };
    }

    // Required fields
    if (!personalInfo.firstName?.trim()) errors.push('First name is required');
    if (!personalInfo.lastName?.trim()) errors.push('Last name is required');
    if (!personalInfo.email?.trim()) errors.push('Email address is required');
    if (!personalInfo.phoneNumber?.trim()) errors.push('Phone number is required');
    if (!personalInfo.dateOfBirth) errors.push('Date of birth is required');
    if (!personalInfo.nationality) errors.push('Nationality is required');
    if (!personalInfo.streetAddress?.trim()) errors.push('Street address is required');
    if (!personalInfo.city?.trim()) errors.push('City is required');
    if (!personalInfo.country) errors.push('Country is required');

    // Email validation
    if (personalInfo.email && !this.isValidEmail(personalInfo.email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation
    if (personalInfo.phoneNumber && !this.isValidPhone(personalInfo.phoneNumber)) {
      warnings.push('Please ensure your phone number is in international format');
    }

    // Age validation
    if (personalInfo.dateOfBirth) {
      const age = this.calculateAge(personalInfo.dateOfBirth);
      if (age < 18) {
        errors.push('You must be at least 18 years old to apply');
      } else if (age < 21) {
        warnings.push('Some institutions may require instructors to be 21 or older');
      }
    }

    // Emergency contact validation
    if (!personalInfo.emergencyContact?.name?.trim()) {
      errors.push('Emergency contact name is required');
    }
    if (!personalInfo.emergencyContact?.phoneNumber?.trim()) {
      errors.push('Emergency contact phone number is required');
    }

    // Language validation
    if (!personalInfo.languagesSpoken?.length) {
      warnings.push('Consider adding languages you can teach in');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate Professional Background
   */
  private static validateProfessionalBackground(background: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!background) {
      errors.push('Professional background is required');
      return { isValid: false, errors, warnings };
    }

    // Education validation
    if (!background.education?.length) {
      errors.push('At least one education entry is required');
    } else {
      background.education.forEach((edu: any, index: number) => {
        if (!edu.institution?.trim()) {
          errors.push(`Education ${index + 1}: Institution name is required`);
        }
        if (!edu.degree?.trim()) {
          errors.push(`Education ${index + 1}: Degree is required`);
        }
        if (!edu.field?.trim()) {
          errors.push(`Education ${index + 1}: Field of study is required`);
        }
        if (!edu.startYear) {
          errors.push(`Education ${index + 1}: Start year is required`);
        }
      });
    }

    // Experience validation
    if (!background.experience?.length) {
      errors.push('At least one work experience entry is required');
    } else {
      background.experience.forEach((exp: any, index: number) => {
        if (!exp.company?.trim()) {
          errors.push(`Experience ${index + 1}: Company name is required`);
        }
        if (!exp.position?.trim()) {
          errors.push(`Experience ${index + 1}: Job title is required`);
        }
        if (!exp.startDate) {
          errors.push(`Experience ${index + 1}: Start date is required`);
        }
        if (!exp.description?.trim()) {
          errors.push(`Experience ${index + 1}: Job description is required`);
        }
      });
    }

    // References validation
    if (!background.references?.length) {
      errors.push('At least two professional references are required');
    } else if (background.references.length < 2) {
      errors.push('At least two professional references are required');
    } else {
      background.references.forEach((ref: any, index: number) => {
        if (!ref.name?.trim()) {
          errors.push(`Reference ${index + 1}: Name is required`);
        }
        if (!ref.position?.trim()) {
          errors.push(`Reference ${index + 1}: Position is required`);
        }
        if (!ref.company?.trim()) {
          errors.push(`Reference ${index + 1}: Company is required`);
        }
        if (!ref.email?.trim()) {
          errors.push(`Reference ${index + 1}: Email is required`);
        }
        if (!ref.phone?.trim()) {
          errors.push(`Reference ${index + 1}: Phone number is required`);
        }
        if (!ref.relationship?.trim()) {
          errors.push(`Reference ${index + 1}: Relationship is required`);
        }
      });
    }

    // Years of experience validation
    if (background.yearsOfExperience < 1) {
      warnings.push('Consider adding more years of experience to strengthen your application');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate Teaching Information
   */
  private static validateTeachingInformation(teaching: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!teaching) {
      errors.push('Teaching information is required');
      return { isValid: false, errors, warnings };
    }

    // Subjects to teach validation
    if (!teaching.subjectsToTeach?.length) {
      errors.push('At least one subject to teach is required');
    } else {
      teaching.subjectsToTeach.forEach((subject: any, index: number) => {
        if (!subject.subject?.trim()) {
          errors.push(`Subject ${index + 1}: Subject name is required`);
        }
        if (!subject.level) {
          errors.push(`Subject ${index + 1}: Level is required`);
        }
        if (subject.experienceYears < 0) {
          errors.push(`Subject ${index + 1}: Experience years cannot be negative`);
        }
      });
    }

    // Teaching motivation validation
    if (!teaching.teachingMotivation?.trim()) {
      errors.push('Teaching motivation is required');
    } else if (teaching.teachingMotivation.length < 100) {
      errors.push('Teaching motivation must be at least 100 characters');
    } else if (teaching.teachingMotivation.length < 200) {
      warnings.push('Consider expanding your teaching motivation for a stronger application');
    }

    // Teaching philosophy validation
    if (!teaching.teachingPhilosophy?.trim()) {
      errors.push('Teaching philosophy is required');
    } else if (teaching.teachingPhilosophy.length < 100) {
      warnings.push('Consider expanding your teaching philosophy');
    }

    // Target audience validation
    if (!teaching.targetAudience?.length) {
      errors.push('At least one target audience must be selected');
    }

    // Teaching experience validation
    if (teaching.hasTeachingExperience && (!teaching.teachingExperience?.length)) {
      warnings.push('You indicated you have teaching experience but no details were provided');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate Documents
   */
  private static validateDocuments(documents: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!documents) {
      errors.push('Documents are required');
      return { isValid: false, errors, warnings };
    }

    // Required documents
    if (!documents.identityDocument) {
      errors.push('Government-issued ID is required for identity verification');
    }

    if (!documents.profilePhoto) {
      errors.push('Professional profile photo is required');
    }

    if (!documents.resume) {
      errors.push('Professional resume/CV is required');
    }

    if (!documents.educationCertificates?.length) {
      errors.push('At least one education certificate is required');
    }

    // Optional but recommended documents
    if (!documents.professionalCertifications?.length) {
      warnings.push('Professional certifications are recommended to strengthen your application');
    }

    if (!documents.employmentVerification?.length) {
      warnings.push('Employment verification documents are recommended');
    }

    // Document quality checks
    if (documents.identityDocument && documents.identityDocument.verificationStatus === 'failed') {
      errors.push('Identity document verification failed. Please upload a clearer copy.');
    }

    if (documents.profilePhoto && documents.profilePhoto.verificationStatus === 'failed') {
      errors.push('Profile photo verification failed. Please upload a better quality photo.');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate Consents
   */
  private static validateConsents(consents: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!consents) {
      errors.push('All agreements must be accepted');
      return { isValid: false, errors, warnings };
    }

    const requiredConsents = [
      { key: 'backgroundCheck', label: 'Background check authorization' },
      { key: 'dataProcessing', label: 'Data processing consent' },
      { key: 'termOfService', label: 'Terms of service agreement' },
      { key: 'privacyPolicy', label: 'Privacy policy agreement' },
      { key: 'contentGuidelines', label: 'Content guidelines agreement' },
      { key: 'codeOfConduct', label: 'Code of conduct agreement' },
    ];

    requiredConsents.forEach(({ key, label }) => {
      if (!consents[key]) {
        errors.push(`${label} must be accepted`);
      }
    });

    return { isValid: errors.length === 0, errors, warnings };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Calculate overall progress percentage
   */
  static calculateProgress(data: any): number {
    const steps = [
      { key: 'personalInfo', weight: 20 },
      { key: 'professionalBackground', weight: 25 },
      { key: 'teachingInformation', weight: 25 },
      { key: 'documents', weight: 20 },
      { key: 'consents', weight: 10 },
    ];

    let totalProgress = 0;
    let totalWeight = 0;

    steps.forEach(({ key, weight }) => {
      const stepData = data[key];
      const stepProgress = this.calculateStepProgress(key, stepData);
      totalProgress += (stepProgress * weight);
      totalWeight += weight;
    });

    return Math.round(totalProgress / totalWeight);
  }

  /**
   * Calculate progress for a specific step
   */
  private static calculateStepProgress(stepKey: string, stepData: any): number {
    if (!stepData) return 0;

    switch (stepKey) {
      case 'personalInfo':
        return this.calculatePersonalInfoProgress(stepData);
      case 'professionalBackground':
        return this.calculateProfessionalBackgroundProgress(stepData);
      case 'teachingInformation':
        return this.calculateTeachingInformationProgress(stepData);
      case 'documents':
        return this.calculateDocumentsProgress(stepData);
      case 'consents':
        return this.calculateConsentsProgress(stepData);
      default:
        return 0;
    }
  }

  private static calculatePersonalInfoProgress(data: any): number {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'nationality', 'streetAddress', 'city', 'country'];
    const optionalFields = ['state', 'postalCode', 'timezone', 'primaryLanguage', 'languagesSpoken', 'emergencyContact'];
    
    let completed = 0;
    const total = requiredFields.length + (optionalFields.length * 0.5);

    requiredFields.forEach(field => {
      if (data[field] && data[field].toString().trim()) completed++;
    });

    optionalFields.forEach(field => {
      if (data[field] && (Array.isArray(data[field]) ? data[field].length > 0 : data[field].toString().trim())) {
        completed += 0.5;
      }
    });

    return Math.min(100, Math.round((completed / total) * 100));
  }

  private static calculateProfessionalBackgroundProgress(data: any): number {
    let completed = 0;
    const total = 3; // education, experience, references

    if (data.education?.length > 0) completed++;
    if (data.experience?.length > 0) completed++;
    if (data.references?.length >= 2) completed++;

    return Math.round((completed / total) * 100);
  }

  private static calculateTeachingInformationProgress(data: any): number {
    let completed = 0;
    const total = 4; // subjects, motivation, philosophy, audience

    if (data.subjectsToTeach?.length > 0) completed++;
    if (data.teachingMotivation?.trim()) completed++;
    if (data.teachingPhilosophy?.trim()) completed++;
    if (data.targetAudience?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }

  private static calculateDocumentsProgress(data: any): number {
    let completed = 0;
    const total = 4; // identity, photo, resume, education certificates

    if (data.identityDocument) completed++;
    if (data.profilePhoto) completed++;
    if (data.resume) completed++;
    if (data.educationCertificates?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }

  private static calculateConsentsProgress(data: any): number {
    const requiredConsents = ['backgroundCheck', 'dataProcessing', 'termOfService', 'privacyPolicy', 'contentGuidelines', 'codeOfConduct'];
    const completed = requiredConsents.filter(consent => data[consent]).length;
    return Math.round((completed / requiredConsents.length) * 100);
  }

  /**
   * Email validation
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation
   */
  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Calculate age from date of birth
   */
  private static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

// ============================================================================
// REACT HOOK FOR VERIFICATION SERVICE
// ============================================================================

export const useVerificationService = () => {
  return {
    // Core operations
    loadOrCreateVerification: VerificationService.loadOrCreateVerification,
    saveDraft: VerificationService.saveDraft,
    submitVerification: VerificationService.submitVerification,
    getVerificationStatus: VerificationService.getVerificationStatus,
    getInstructorVerificationData: VerificationService.getInstructorVerificationData,
    
    // Validation
    validateVerificationData: VerificationService.validateVerificationData,
    calculateProgress: VerificationService.calculateProgress,
  };
};
