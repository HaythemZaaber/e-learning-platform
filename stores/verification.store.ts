import { UploadApiService } from '@/features/course-creation/services/uploadService';
import { ContentType } from '@/features/course-creation/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { VerificationService } from '@/features/becomeInstructor/verification/services/verificationService';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/utils/toast';

// Create an instance of UploadApiService
const uploadService = new UploadApiService();

// Types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  timezone: string;
  primaryLanguage: string;
  languagesSpoken: Array<{
    language: string;
    proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    canTeachIn: boolean;
  }>;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  };
}

export interface ProfessionalBackground {
  currentJobTitle?: string;
  currentEmployer?: string;
  employmentType: 'full_time' | 'part_time' | 'freelance' | 'self_employed' | 'unemployed' | 'student';
  workLocation: string;
  yearsOfExperience: number;
  
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    honors?: string;
    description: string;
    isVerified?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'failed';
  }>;
  
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    employmentType?: string;
    description: string;
    achievements?: string[];
    isVerified?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'failed';
  }>;
  
  references: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
    yearsKnown?: string;
    notes?: string;
    contactPermission?: boolean;
    isVerified?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'failed';
  }>;
}

export interface TeachingInformation {
  subjectsToTeach: Array<{
    subject: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
    experienceYears: number;
    confidence: 1 | 2 | 3 | 4 | 5;
  }>;
  
  hasTeachingExperience: boolean;
  teachingExperience: Array<{
    id: string;
    role: string;
    institution: string;
    subject: string;
    level: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    studentsCount?: number;
    achievements?: string[];
  }>;
  
  teachingMotivation: string;
  teachingPhilosophy: string;
  targetAudience: string[];
  teachingStyle: string;
  teachingMethodology: string;
  
  preferredFormats: string[];
  preferredClassSize: string;
  
  weeklyAvailability: {
    [key: string]: {
      available: boolean;
      timeSlots: Array<{ start: string; end: string }>;
    };
  };
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl?: string;
  
  dataUrl?: string;
  mimeType?: string;
  uploadDate: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  aiAnalysis?: {
    confidence: number;
    extractedText?: string;
    validationChecks: Record<string, boolean>;
    issues?: string[];
    suggestions?: string[];
  };
}

export interface ApplicationStep {
  id: string;
  title: string;
  isCompleted: boolean;
  isValid: boolean;
  completionPercentage: number;
  errors: string[];
  warnings: string[];
  lastUpdated?: string;
}

export interface InstructorApplicationState {
  // Application Data
  personalInfo: PersonalInfo;
  professionalBackground: ProfessionalBackground;
  teachingInformation: TeachingInformation;
  
  // Documents
  documents: {
    identityDocument: DocumentUpload | null;
    educationCertificates: DocumentUpload[];
    professionalCertifications: DocumentUpload[];
    employmentVerification: DocumentUpload[];
    profilePhoto: DocumentUpload | null;
    videoIntroduction: DocumentUpload | null;
    teachingDemo: DocumentUpload | null;
    resume: DocumentUpload | null;
  };
  
  // Application Progress
  currentStep: number;
  steps: ApplicationStep[];
  overallProgress: number;
  
  // Verification Status
  verificationStatus: {
    identity: 'pending' | 'in_progress' | 'completed' | 'rejected';
    professional: 'pending' | 'in_progress' | 'completed' | 'rejected';
    teaching: 'pending' | 'in_progress' | 'completed' | 'rejected';
    background: 'pending' | 'in_progress' | 'completed' | 'rejected';
  };
  
  // UI State
  ui: {
    isLoading: boolean;
    isSaving: boolean;
    isSubmitting: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    successMessages: string[];
    notifications: Array<{
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      title: string;
      message: string;
      timestamp: string;
      read: boolean;
    }>;
    autoSaveEnabled: boolean;
    lastAutoSave?: string;
    hasUnsavedChanges: boolean;
  };
  
  // Consent and Agreements
  consents: {
    backgroundCheck: boolean;
    dataProcessing: boolean;
    termOfService: boolean;
    privacyPolicy: boolean;
    contentGuidelines: boolean;
    codeOfConduct: boolean;
  };
  
  // Application Settings
  settings: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };

  verificationId: string | null;
}

interface InstructorApplicationActions {
  // Personal Info Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  validatePersonalInfo: () => boolean;
  
  // Professional Background Actions
  updateProfessionalBackground: (background: Partial<ProfessionalBackground>) => void;
  validateProfessionalBackground: () => boolean;
  addEducation: (education: Omit<ProfessionalBackground['education'][0], 'id'>) => void;
  updateEducation: (id: string, education: Partial<ProfessionalBackground['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<ProfessionalBackground['experience'][0], 'id'>) => void;
  updateExperience: (id: string, experience: Partial<ProfessionalBackground['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addReference: (reference: Omit<ProfessionalBackground['references'][0], 'id'>) => void;
  updateReference: (id: string, reference: Partial<ProfessionalBackground['references'][0]>) => void;
  removeReference: (id: string) => void;
  
  // Teaching Information Actions
  updateTeachingInfo: (info: Partial<TeachingInformation>) => void;
  validateTeachingInformation: () => boolean;
  addSubjectToTeach: (subject: TeachingInformation['subjectsToTeach'][0]) => void;
  removeSubjectToTeach: (index: number) => void;
  addTeachingExperience: (experience: Omit<TeachingInformation['teachingExperience'][0], 'id'>) => void;
  updateTeachingExperience: (id: string, experience: Partial<TeachingInformation['teachingExperience'][0]>) => void;
  removeTeachingExperience: (id: string) => void;
  
  // Document Actions
  uploadDocument: (type: keyof InstructorApplicationState['documents'], documentType: string, file: File, token: string) => Promise<void>;
  removeDocument: (type: keyof InstructorApplicationState['documents'], documentId?: string) => void;
  validateDocuments: () => boolean;
  updateDocumentVerification: (type: keyof InstructorApplicationState['documents'], documentId: string, status: DocumentUpload['verificationStatus'], analysis?: DocumentUpload['aiAnalysis']) => void;
  updateDocumentThumbnail: (type: keyof InstructorApplicationState['documents'], documentId: string, thumbnailUrl: string) => void;
  
  
  // Step Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  validateCurrentStep: () => boolean;
  updateStepCompletion: (stepId: string, isCompleted: boolean, errors?: string[], warnings?: string[]) => void;
  
  // Verification Actions
  updateVerificationStatus: (type: keyof InstructorApplicationState['verificationStatus'], status: InstructorApplicationState['verificationStatus'][keyof InstructorApplicationState['verificationStatus']]) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  addError: (field: string, error: string) => void;
  removeError: (field: string) => void;
  clearErrors: () => void;
  addWarning: (field: string, warning: string) => void;
  removeWarning: (field: string) => void;
  clearWarnings: () => void;
  addNotification: (notification: Omit<InstructorApplicationState['ui']['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Consent Actions
  updateConsent: (type: keyof InstructorApplicationState['consents'], value: boolean) => void;
  validateConsents: () => boolean;
  validateConsentsForSubmission: () => { isValid: boolean; missingConsents: string[]; errors: string[] };
  
  // Application Actions
  saveApplication: (userId?: string, token?: string) => Promise<void>;
  saveDraft: (userId?: string, token?: string) => Promise<void>;
  submitApplication: (userId?: string, token?: string) => Promise<boolean>;
  loadApplication: (userId?: string, token?: string) => Promise<void>;
  resetApplication: () => void;
  fixStepIds: () => void;
  
  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  triggerAutoSave: () => Promise<void>;
  
  // Validation
  validateAllSteps: () => boolean;
  getValidationErrors: () => Record<string, string[]>;
  
  // Progress Calculation
  calculateOverallProgress: () => number;
  getOverallProgress: () => number;
  calculateStepProgress: (stepId: string) => number;

  // Storage Management
  clearStorage: () => void;
  cleanupStorage: () => void;
  getStorageSize: () => string;
  handleStorageError: () => void;
}

const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  nationality: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  timezone: 'UTC',
  primaryLanguage: 'en',
  languagesSpoken: [],
  emergencyContact: {
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
  },
};

const initialProfessionalBackground: ProfessionalBackground = {
  currentJobTitle: '',
  currentEmployer: '',
  employmentType: 'full_time',
  workLocation: '',
  yearsOfExperience: 0,
    education: [],
    experience: [],
    references: [],
};

const initialTeachingInformation: TeachingInformation = {
  subjectsToTeach: [],
  hasTeachingExperience: false,
  teachingExperience: [],
  teachingMotivation: '',
  teachingPhilosophy: '',
  targetAudience: [],
  teachingStyle: '',
  teachingMethodology: '',
  preferredFormats: [],
  preferredClassSize: 'any',
  weeklyAvailability: {
    monday: { available: false, timeSlots: [] },
    tuesday: { available: false, timeSlots: [] },
    wednesday: { available: false, timeSlots: [] },
    thursday: { available: false, timeSlots: [] },
    friday: { available: false, timeSlots: [] },
    saturday: { available: false, timeSlots: [] },
    sunday: { available: false, timeSlots: [] },
  },
};

const initialSteps: ApplicationStep[] = [
  {
    id: 'personal-information',
    title: 'Personal Information',
    isCompleted: false,
    isValid: false,
    completionPercentage: 0,
    errors: [],
    warnings: [],
  },
  {
    id: 'professional-background',
    title: 'Professional Background',
    isCompleted: false,
    isValid: false,
    completionPercentage: 0,
    errors: [],
    warnings: [],
  },
  {
    id: 'teaching-information',
    title: 'Teaching Information',
    isCompleted: false,
    isValid: false,
    completionPercentage: 0,
    errors: [],
    warnings: [],
  },
  {
    id: 'documents',
    title: 'Documents & Verification',
    isCompleted: false,
    isValid: false,
    completionPercentage: 0,
    errors: [],
    warnings: [],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    isCompleted: false,
    isValid: false,
    completionPercentage: 0,
    errors: [],
    warnings: [],
  },
];

export const useInstructorApplicationStore = create<InstructorApplicationState & InstructorApplicationActions>()(
    persist(
      immer((set, get) => ({
      // Initial State
      personalInfo: initialPersonalInfo,
      professionalBackground: initialProfessionalBackground,
      teachingInformation: initialTeachingInformation,
      
              documents: {
          identityDocument: null,
          educationCertificates: [],
          professionalCertifications: [],
          employmentVerification: [],
          profilePhoto: null,
          videoIntroduction: null,
          teachingDemo: null,
          resume: null,
        },
      
      currentStep: 0,
      steps: initialSteps,
      overallProgress: 0,
      
      verificationStatus: {
        identity: 'pending',
        professional: 'pending',
        teaching: 'pending',
        background: 'pending',
      },
      
      ui: {
        isLoading: false,
        isSaving: false,
        isSubmitting: false,
        errors: {},
        warnings: {},
        successMessages: [],
        notifications: [],
        autoSaveEnabled: true,
        hasUnsavedChanges: false,
      },
      
      consents: {
        backgroundCheck: false,
        dataProcessing: false,
        termOfService: false,
        privacyPolicy: false,
        contentGuidelines: false,
        codeOfConduct: false,
      },
      
      settings: {
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },

      verificationId: null,

      // Personal Info Actions
      updatePersonalInfo: (info) => {
          set((state) => {
          Object.assign(state.personalInfo, info);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validatePersonalInfo(), 100);
      },

      validatePersonalInfo: () => {
        const { personalInfo } = get();
        const errors: string[] = [];
        
        if (!personalInfo.firstName || !personalInfo.firstName.trim()) errors.push('First name is required');
        if (!personalInfo.lastName || !personalInfo.lastName.trim()) errors.push('Last name is required');
        if (!personalInfo.email || !personalInfo.email.trim()) errors.push('Email is required');
        if (!personalInfo.phoneNumber || !personalInfo.phoneNumber.trim()) errors.push('Phone number is required');
        if (!personalInfo.dateOfBirth) errors.push('Date of birth is required');
        if (!personalInfo.nationality) errors.push('Nationality is required');
        if (!personalInfo.streetAddress || !personalInfo.streetAddress.trim()) errors.push('Street address is required');
        if (!personalInfo.city || !personalInfo.city.trim()) errors.push('City is required');
        if (!personalInfo.country) errors.push('Country is required');

        get().updateStepCompletion('personal-information', errors.length === 0, errors);
        return errors.length === 0;
      },

      validateProfessionalBackground: () => {
        const { professionalBackground } = get();
        const errors: string[] = [];
        
        if (!professionalBackground.education || professionalBackground.education.length === 0) {
          errors.push('At least one education entry is required');
        }
        if (!professionalBackground.experience || professionalBackground.experience.length === 0) {
          errors.push('At least one work experience entry is required');
        }
        if (!professionalBackground.references || professionalBackground.references.length < 2) {
          errors.push('At least two professional references are required');
        }

        get().updateStepCompletion('professional-background', errors.length === 0, errors);
        return errors.length === 0;
      },

      validateTeachingInformation: () => {
        const { teachingInformation } = get();
        const errors: string[] = [];
        
        if (!teachingInformation.subjectsToTeach || teachingInformation.subjectsToTeach.length === 0) {
          errors.push('At least one subject to teach is required');
        }
        if (!teachingInformation.teachingMotivation || !teachingInformation.teachingMotivation.trim()) {
          errors.push('Teaching motivation is required');
        }
        if (!teachingInformation.teachingMotivation || teachingInformation.teachingMotivation.length < 100) {
          errors.push('Teaching motivation must be at least 100 characters');
        }
        if (!teachingInformation.teachingPhilosophy || !teachingInformation.teachingPhilosophy.trim()) {
          errors.push('Teaching philosophy is required');
        }
        if (!teachingInformation.targetAudience || teachingInformation.targetAudience.length === 0) {
          errors.push('At least one target audience is required');
        }

        get().updateStepCompletion('teaching-information', errors.length === 0, errors);
        return errors.length === 0;
      },

      validateDocuments: () => {
        const { documents } = get();
        const errors: string[] = [];
        
        if (!documents.identityDocument) {
          errors.push('Identity document is required');
        }
        if (!documents.profilePhoto) {
          errors.push('Profile photo is required');
        }
        if (!documents.resume) {
          errors.push('Professional resume/CV is required');
        }
        // Make education certificates optional - user can add them if they want
        // if (documents.educationCertificates.length === 0) {
        //   errors.push('At least one education certificate is required');
        // }

        get().updateStepCompletion('documents', errors.length === 0, errors);
        return errors.length === 0;
      },

      validateConsents: () => {
        const { consents } = get();
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Only check the three main required consents
        if (!consents.termOfService) {
          errors.push('Terms of service must be accepted');
        }
        if (!consents.privacyPolicy) {
          errors.push('Privacy policy must be accepted');
        }
        if (!consents.backgroundCheck) {
          errors.push('Background check authorization must be accepted');
        }

        // Step is complete if all three main consents are accepted
        const isValid = consents.termOfService && consents.privacyPolicy && consents.backgroundCheck;
        get().updateStepCompletion('review', isValid, errors, warnings);
        return isValid;
      },

      // Professional Background Actions
      updateProfessionalBackground: (background) => {
          set((state) => {
          Object.assign(state.professionalBackground, background);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      addEducation: (education) => {
          set((state) => {
          // Ensure education array exists
          if (!Array.isArray(state.professionalBackground.education)) {
            state.professionalBackground.education = [];
          }
          state.professionalBackground.education.push({
            ...education,
            id: Date.now().toString(),
          });
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      updateEducation: (id, education) => {
          set((state) => {
          // Ensure education array exists
          if (!Array.isArray(state.professionalBackground.education)) {
            state.professionalBackground.education = [];
          }
          const index = state.professionalBackground.education.findIndex(e => e.id === id);
          if (index !== -1) {
            Object.assign(state.professionalBackground.education[index], education);
            state.ui.hasUnsavedChanges = true;
          }
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      removeEducation: (id) => {
          set((state) => {
          // Ensure education array exists
          if (!Array.isArray(state.professionalBackground.education)) {
            state.professionalBackground.education = [];
          }
          state.professionalBackground.education = state.professionalBackground.education.filter(e => e.id !== id);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      addExperience: (experience) => {
          set((state) => {
          // Ensure experience array exists
          if (!Array.isArray(state.professionalBackground.experience)) {
            state.professionalBackground.experience = [];
          }
          state.professionalBackground.experience.push({
            ...experience,
            id: Date.now().toString(),
          });
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      updateExperience: (id, experience) => {
              set((state) => {
          // Ensure experience array exists
          if (!Array.isArray(state.professionalBackground.experience)) {
            state.professionalBackground.experience = [];
          }
          const index = state.professionalBackground.experience.findIndex(e => e.id === id);
          if (index !== -1) {
            Object.assign(state.professionalBackground.experience[index], experience);
            state.ui.hasUnsavedChanges = true;
          }
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      removeExperience: (id) => {
            set((state) => {
          // Ensure experience array exists
          if (!Array.isArray(state.professionalBackground.experience)) {
            state.professionalBackground.experience = [];
          }
          state.professionalBackground.experience = state.professionalBackground.experience.filter(e => e.id !== id);
          state.ui.hasUnsavedChanges = true;
            });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      addReference: (reference) => {
            set((state) => {
          // Ensure references array exists
          if (!Array.isArray(state.professionalBackground.references)) {
            state.professionalBackground.references = [];
          }
          state.professionalBackground.references.push({
            ...reference,
            id: Date.now().toString(),
          });
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      updateReference: (id, reference) => {
        set((state) => {
          // Ensure references array exists
          if (!Array.isArray(state.professionalBackground.references)) {
            state.professionalBackground.references = [];
          }
          const index = state.professionalBackground.references.findIndex(r => r.id === id);
          if (index !== -1) {
            Object.assign(state.professionalBackground.references[index], reference);
            state.ui.hasUnsavedChanges = true;
          }
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      removeReference: (id) => {
          set((state) => {
          // Ensure references array exists
          if (!Array.isArray(state.professionalBackground.references)) {
            state.professionalBackground.references = [];
          }
          state.professionalBackground.references = state.professionalBackground.references.filter(r => r.id !== id);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateProfessionalBackground(), 100);
      },

      // Teaching Information Actions
      updateTeachingInfo: (info) => {
        set((state) => {
          Object.assign(state.teachingInformation, info);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
      },

      addSubjectToTeach: (subject) => {
              set((state) => {
          // Ensure subjectsToTeach array exists
          if (!Array.isArray(state.teachingInformation.subjectsToTeach)) {
            state.teachingInformation.subjectsToTeach = [];
          }
          state.teachingInformation.subjectsToTeach.push(subject);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
      },

      removeSubjectToTeach: (index) => {
            set((state) => {
          // Ensure subjectsToTeach array exists
          if (!Array.isArray(state.teachingInformation.subjectsToTeach)) {
            state.teachingInformation.subjectsToTeach = [];
          }
          state.teachingInformation.subjectsToTeach.splice(index, 1);
          state.ui.hasUnsavedChanges = true;
            });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
      },

      addTeachingExperience: (experience) => {
            set((state) => {
          // Ensure teachingExperience array exists
          if (!Array.isArray(state.teachingInformation.teachingExperience)) {
            state.teachingInformation.teachingExperience = [];
          }
          state.teachingInformation.teachingExperience.push({
            ...experience,
            id: Date.now().toString(),
            });
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
        },

      updateTeachingExperience: (id, experience) => {
          set((state) => {
          // Ensure teachingExperience array exists
          if (!Array.isArray(state.teachingInformation.teachingExperience)) {
            state.teachingInformation.teachingExperience = [];
          }
          const index = state.teachingInformation.teachingExperience.findIndex(e => e.id === id);
          if (index !== -1) {
            Object.assign(state.teachingInformation.teachingExperience[index], experience);
            state.ui.hasUnsavedChanges = true;
          }
        });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
      },

      removeTeachingExperience: (id) => {
          set((state) => {
          // Ensure teachingExperience array exists
          if (!Array.isArray(state.teachingInformation.teachingExperience)) {
            state.teachingInformation.teachingExperience = [];
          }
          state.teachingInformation.teachingExperience = state.teachingInformation.teachingExperience.filter(e => e.id !== id);
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateTeachingInformation(), 100);
      },

      // Document Actions
      uploadDocument: async (type, documentType, file, token) => {
        const state = get();
        state.setLoading(true);
        
        try {
          // Dynamic type detection if documentType is 'mixed'
          let finalDocumentType = documentType;
          if (documentType) {
            const mimeType = file.type.toLowerCase();
            if (mimeType.startsWith('image/')) {
              finalDocumentType = 'image';
            } else if (mimeType.startsWith('video/')) {
              finalDocumentType = 'video';
            } else {
              finalDocumentType = 'document';
            }
          }

          // Map frontend type to ContentType
          const contentTypeMap: Record<string, string> = {
            video: 'video',
            document: 'document',
            image: 'image',
            audio: 'audio',
            archive: 'archive',
          };

          const contentType = contentTypeMap[finalDocumentType] as any;
          if (!contentType) {
            throw new Error(`Invalid content type: ${finalDocumentType}`);
          }

          // Upload the file to the backend
          const uploadResult = await uploadService.uploadFile(file, contentType, {
            title: `${type}-${Date.now()}`,
          }, token);

          // Create preview URLs for better display
          let previewUrl = uploadResult.url;
         
          // Don't create data URLs for large files to save memory
          let dataUrl = null;
          const maxFileSizeForDataUrl = 1024 * 1024; // 1MB

          // For small images only, create data URL for better preview
          if (file.type.startsWith('image/') && file.size < maxFileSizeForDataUrl) {
            try {
              const reader = new FileReader();
              dataUrl = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
            } catch (error) {
              console.warn('Failed to create data URL for image:', error);
            }
          }

          const uploadedDocument: DocumentUpload = {
            id: uploadResult.id,
            name: uploadResult.name,
            type: uploadResult.type,
            size: uploadResult.size,
            url: uploadResult.url,
            previewUrl: previewUrl,
            dataUrl: dataUrl || undefined,
            mimeType: file.type,
            uploadDate: new Date().toISOString(),
            verificationStatus: 'pending',
          };

            set((state) => {
            if (type === 'educationCertificates' || type === 'professionalCertifications' || type === 'employmentVerification') {
              // Ensure the array exists before pushing
              if (!Array.isArray(state.documents[type])) {
                state.documents[type] = [];
              }
              state.documents[type].push(uploadedDocument);
            } else {
              state.documents[type] = uploadedDocument;
            }
            state.ui.hasUnsavedChanges = true;
          });

          // Auto-validate after upload
          setTimeout(() => get().validateDocuments(), 100);

          showToast('success', 'Document Uploaded', `${file.name} has been uploaded successfully.`);

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
          state.addError('documents', errorMessage);
          showToast('error', 'Upload Failed', errorMessage);
        } finally {
          state.setLoading(false);
        }
      },

      removeDocument: (type, documentId) => {
        set((state) => {
          if (type === 'educationCertificates' || type === 'professionalCertifications' || type === 'employmentVerification') {
            if (documentId) {
              // Ensure the array exists before filtering
              if (!Array.isArray(state.documents[type])) {
                state.documents[type] = [];
              }
              state.documents[type] = state.documents[type].filter(doc => doc.id !== documentId);
            }
          } else {
            state.documents[type] = null;
          }
          state.ui.hasUnsavedChanges = true;
        });
        // Auto-validate after update
        setTimeout(() => get().validateDocuments(), 100);
        
        showToast('success', 'Document Removed', 'Document has been removed from your application.');
      },

      updateDocumentVerification: (type, documentId, status, analysis) => {
        set((state) => {
          if (type === 'educationCertificates' || type === 'professionalCertifications' || type === 'employmentVerification') {
            const documents = state.documents[type] as DocumentUpload[];
            const document = documents.find(doc => doc.id === documentId);
            if (document) {
              document.verificationStatus = status;
              if (analysis) {
                document.aiAnalysis = analysis;
              }
            }
          } else {
            const document = state.documents[type] as DocumentUpload | null;
            if (document) {
              document.verificationStatus = status;
              if (analysis) {
                document.aiAnalysis = analysis;
              }
            }
          }
        });
      },

      updateDocumentThumbnail: (type, documentId, thumbnailUrl) => {
        set((state) => {
          if (type === 'educationCertificates' || type === 'professionalCertifications' || type === 'employmentVerification') {
            const documents = state.documents[type] as DocumentUpload[];
            const document = documents.find(doc => doc.id === documentId);
            if (document) {
              document.previewUrl = thumbnailUrl;
            }
          } else {
            const document = state.documents[type] as DocumentUpload | null;
            if (document) {
              document.previewUrl = thumbnailUrl;
            }
          }
        });
      },

      // Step Navigation
      setCurrentStep: (step) => {
          set((state) => {
          state.currentStep = step;
        });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          get().setCurrentStep(currentStep + 1);
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          get().setCurrentStep(currentStep - 1);
        }
      },

      validateCurrentStep: () => {
        const { currentStep, steps } = get();
        const stepId = steps[currentStep]?.id;
        
        switch (stepId) {
          case 'personal-information':
            return get().validatePersonalInfo();
          case 'professional-background':
            return get().validateProfessionalBackground();
          case 'teaching-information':
            return get().validateTeachingInformation();
          case 'documents':
            return get().validateDocuments();
          case 'review':
          case 'background-check': // Handle old step ID
            return get().validateConsents();
          default:
            return true;
        }
      },

      updateStepCompletion: (stepId, isCompleted, errors = [], warnings = []) => {
        set((state) => {
          // Handle old step ID
          const actualStepId = stepId === 'background-check' ? 'review' : stepId;
          
          const step = state.steps.find(s => s.id === actualStepId);
          if (step) {
            step.isCompleted = isCompleted;
            step.isValid = errors.length === 0;
            step.errors = errors;
            step.warnings = warnings;
            step.lastUpdated = new Date().toISOString();
            
            // Calculate completion percentage based on filled fields
            if (actualStepId === 'review') {
              // For review step, calculate based on the three main consents only
              const { consents } = state;
              const mainConsents = [consents.termOfService, consents.privacyPolicy, consents.backgroundCheck];
              const acceptedMainConsents = mainConsents.filter(Boolean).length;
              step.completionPercentage = Math.round((acceptedMainConsents / 3) * 100);
            } else {
              // For other steps, use the existing logic
              step.completionPercentage = isCompleted ? 100 : Math.max(0, 100 - (errors.length * 20));
            }
          }
        });
      },

      // Verification Actions
      updateVerificationStatus: (type, status) => {
        set((state) => {
          state.verificationStatus[type] = status;
        });
      },

      // UI Actions
      setLoading: (loading) => {
        set((state) => {
          state.ui.isLoading = loading;
        });
      },

      setSaving: (saving) => {
        set((state) => {
          state.ui.isSaving = saving;
        });
      },

      setSubmitting: (submitting) => {
        set((state) => {
          state.ui.isSubmitting = submitting;
        });
      },

      addError: (field, error) => {
        set((state) => {
          if (!state.ui.errors[field]) {
            state.ui.errors[field] = [];
          }
          if (!state.ui.errors[field].includes(error)) {
            state.ui.errors[field].push(error);
          }
        });
      },

      removeError: (field) => {
          set((state) => {
          delete state.ui.errors[field];
        });
      },

      clearErrors: () => {
        set((state) => {
          state.ui.errors = {};
        });
      },

      addWarning: (field, warning) => {
              set((state) => {
          if (!state.ui.warnings[field]) {
            state.ui.warnings[field] = [];
          }
          if (!state.ui.warnings[field].includes(warning)) {
            state.ui.warnings[field].push(warning);
          }
        });
      },

      removeWarning: (field) => {
            set((state) => {
          delete state.ui.warnings[field];
            });
      },

      clearWarnings: () => {
            set((state) => {
          state.ui.warnings = {};
        });
      },

      addNotification: (notification) => {
        set((state) => {
          state.ui.notifications.unshift({
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false,
          });
        });
      },

      markNotificationAsRead: (id) => {
        set((state) => {
          const notification = state.ui.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        });
      },

      clearNotifications: () => {
          set((state) => {
          state.ui.notifications = [];
        });
      },

      setHasUnsavedChanges: (hasChanges) => {
        set((state) => {
          state.ui.hasUnsavedChanges = hasChanges;
        });
      },

      // Consent Actions
      updateConsent: (type, value) => {
        set((state) => {
          state.consents[type] = value;
          state.ui.hasUnsavedChanges = true;
        });
      },

      validateConsentsForSubmission: () => {
        const { consents } = get();
        const requiredConsents: (keyof typeof consents)[] = [
          'backgroundCheck',
          'dataProcessing',
          'termOfService',
          'privacyPolicy',
          'contentGuidelines',
          'codeOfConduct'
        ];
        
        const missingConsents = requiredConsents.filter(consent => !consents[consent]);
        return {
          isValid: missingConsents.length === 0,
          missingConsents,
          errors: missingConsents.map(consent => `${consent.replace(/([A-Z])/g, ' $1').toLowerCase()} must be accepted`)
        };
      },

      // Application Actions
      saveApplication: async (userId?: string, token?: string) => {
        const state = get();
        state.setSaving(true);
        
        try {
          // Get current user ID from auth store if not provided
          let currentUserId = userId;
          if (!currentUserId) {
            const { user } = useAuthStore.getState();
            currentUserId = user?.id;
          }
          
          if (!currentUserId) {
            throw new Error('User not authenticated. Please sign in to save your application.');
          }
          
          // Get authentication token if not provided
          let authToken = token;
          if (!authToken) {
            try {
              const { getToken } = useAuth();
              const tokenResult = await getToken();
              if (!tokenResult) {
                throw new Error('Authentication token required. Please sign in again.');
              }
              authToken = tokenResult;
            } catch (error) {
              throw new Error('Authentication token required. Please sign in again.');
            }
          }
          
          // Ensure we have valid strings for the service calls
          if (!authToken || !currentUserId) {
            throw new Error('Authentication required. Please sign in again.');
          }
          
          // Type assertion after validation
          const verifiedToken = authToken as string;
          const verifiedUserId = currentUserId as string;
          
          // Check if verification already exists
          let verificationId = state.verificationId;
          
          if (!verificationId) {
            // Load or create verification
            const newVerification = await VerificationService.loadOrCreateVerification(verifiedUserId, verifiedToken);
            if (newVerification.success && newVerification.data?.id) {
              verificationId = newVerification.data.id;
              set((state) => {
                state.verificationId = verificationId;
              });
            } else {
              throw new Error(newVerification.message || 'Failed to create verification');
            }
          }
          
          // Save draft with current data
          const draftData = {
            personalInfo: state.personalInfo,
            professionalBackground: state.professionalBackground,
            teachingInformation: state.teachingInformation,
            documents: state.documents,
            verificationStatus: state.verificationStatus,
            consents: state.consents,
          };
          
          await VerificationService.saveDraft(verificationId!, draftData, verifiedToken);
          
          set((state) => {
            state.ui.hasUnsavedChanges = false;
            state.ui.lastAutoSave = new Date().toISOString();
          });

          state.addNotification({
            type: 'success',
            title: 'Application Saved',
            message: 'Your progress has been saved successfully.',
          });

        } catch (error) {
          state.addError('application', error instanceof Error ? error.message : 'Failed to save application');
          state.addNotification({
            type: 'error',
            title: 'Save Failed',
            message: error instanceof Error ? error.message : 'Failed to save application',
          });
        } finally {
          state.setSaving(false);
        }
      },

      saveDraft: async (userId?: string, token?: string) => {
        const state = get();
        state.setSaving(true);
        
        try {
          // Get current user ID from auth store if not provided
          let currentUserId = userId;
          if (!currentUserId) {
            const { user } = useAuthStore.getState();
            currentUserId = user?.id;
          }
          
          if (!currentUserId) {
            throw new Error('User not authenticated. Please sign in to save your draft.');
          }
          
          // Get authentication token if not provided
          let authToken = token;
          if (!authToken) {
            try {
              const { getToken } = useAuth();
              const tokenResult = await getToken();
              if (!tokenResult) {
                throw new Error('Authentication token required. Please sign in again.');
              }
              authToken = tokenResult;
            } catch (error) {
              throw new Error('Authentication token required. Please sign in again.');
            }
          }
          
          let verificationId = state.verificationId;
          
          if (!verificationId) {
            const newVerification = await VerificationService.loadOrCreateVerification(currentUserId, authToken);
            if (newVerification.success && newVerification.data?.id) {
              verificationId = newVerification.data.id;
              set((state) => {
                state.verificationId = verificationId;
              });
            } else {
              throw new Error(newVerification.message || 'Failed to create verification');
            }
          }
          
          // Save draft with current data
          const draftData = {
            personalInfo: state.personalInfo,
            professionalBackground: state.professionalBackground,
            teachingInformation: state.teachingInformation,
            documents: state.documents,
            verificationStatus: state.verificationStatus,
            consents: state.consents,
          };
          
          const saveResult = await VerificationService.saveDraft(verificationId!, draftData, authToken!);
          
          if (saveResult.success) {
            set((state) => {
              state.ui.hasUnsavedChanges = false;
              state.ui.lastAutoSave = new Date().toISOString();
            });

            showToast('success', 'Draft Saved', 'Your application draft has been saved.');
          } else {
            // Handle server error response
            const serverError = saveResult.errors?.join(', ') || saveResult.message || 'Failed to save draft';
            throw new Error(serverError);
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
          state.addError('application', errorMessage);
          showToast('error', 'Save Draft Failed', errorMessage);
        } finally {
          state.setSaving(false);
        }
      },

      loadApplication: async (userId?: string, token?: string) => {
        const state = get();
        state.setLoading(true);
        
        try {
          // Get current user ID from auth store if not provided
          let currentUserId = userId;
          if (!currentUserId) {
            const { user } = useAuthStore.getState();
            currentUserId = user?.id;
          }
          
          if (!currentUserId) {
            throw new Error('User not authenticated. Please sign in to load your application.');
          }
          
          // Get authentication token if not provided
          let authToken = token;
          if (!authToken) {
            try {
              const { getToken } = useAuth();
              const tokenResult = await getToken();
              if (!tokenResult) {
                throw new Error('Authentication token required. Please sign in again.');
              }
              authToken = tokenResult;
            } catch (error) {
              throw new Error('Authentication token required. Please sign in again.');
            }
          }
          
          // Load or create verification using the improved service
          const verification = await VerificationService.loadOrCreateVerification(currentUserId, authToken!);
          
          if (verification.success && verification.data) {
            const data = verification.data;
            
            // Check if application status is UNDER_REVIEW or SUBMITTED - don't load data in these cases
            if (data.status === 'UNDER_REVIEW' || data.status === 'SUBMITTED') {
              // Don't load the data, just set the verification ID and show appropriate message
              set((state) => {
                state.verificationId = data.id;
                state.ui.errors = {};
                state.ui.warnings = {};
                state.ui.successMessages = [];
              });
              
              showToast('info', 'Application Under Review', 'Your application is currently under review and cannot be modified.');
              return;
            }
            
            set((state) => {
              // Set verification ID
              state.verificationId = data.id;
              
              // Load personal info with proper fallbacks
              state.personalInfo = {
                ...initialPersonalInfo,
                ...data.personalInfo,
                languagesSpoken: data.personalInfo?.languagesSpoken || [],
              };
              
              // Load professional background with proper fallbacks
              state.professionalBackground = {
                ...initialProfessionalBackground,
                ...data.professionalBackground,
                education: data.professionalBackground?.education || [],
                experience: data.professionalBackground?.experience || [],
                references: data.professionalBackground?.references || [],
              };
              
              // Load teaching information with proper fallbacks
              state.teachingInformation = {
                ...initialTeachingInformation,
                ...data.teachingInformation,
                targetAudience: data.teachingInformation?.targetAudience || [],
                preferredFormats: data.teachingInformation?.preferredFormats || [],
                subjectsToTeach: data.teachingInformation?.subjectsToTeach || [],
                teachingExperience: data.teachingInformation?.teachingExperience || [],
              };
              
              // Load documents with proper fallbacks - ensure arrays are always arrays
              state.documents = {
                identityDocument: data.documents?.identityDocument || null,
                educationCertificates: Array.isArray(data.documents?.educationCertificates) ? data.documents.educationCertificates : [],
                professionalCertifications: Array.isArray(data.documents?.professionalCertifications) ? data.documents.professionalCertifications : [],
                employmentVerification: Array.isArray(data.documents?.employmentVerification) ? data.documents.employmentVerification : [],
                profilePhoto: data.documents?.profilePhoto || null,
                videoIntroduction: data.documents?.videoIntroduction || null,
                teachingDemo: data.documents?.teachingDemo || null,
                resume: data.documents?.resume || null,
              };
              
              // Load consents with proper fallbacks
              state.consents = {
                backgroundCheck: false,
                dataProcessing: false,
                termOfService: false,
                privacyPolicy: false,
                contentGuidelines: false,
                codeOfConduct: false,
                ...data.consents,
              };
              
              // Reset UI state
              state.ui.hasUnsavedChanges = false;
              state.ui.errors = {};
              state.ui.warnings = {};
              state.ui.successMessages = [];
              
              // Validate all steps and update completion status
              state.validateAllSteps();
            });
            
            showToast('success', 'Application Loaded', verification.message);
          } else {
            // Handle server error response
            const serverError = verification.errors?.join(', ') || verification.message || 'Failed to load application';
            throw new Error(serverError);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load application';
          state.addError('application', errorMessage);
          showToast('error', 'Load Failed', errorMessage);
        } finally {
          state.setLoading(false);
        }
      },

      resetApplication: () => {
          set((state) => {
          state.personalInfo = initialPersonalInfo;
          state.professionalBackground = initialProfessionalBackground;
          state.teachingInformation = initialTeachingInformation;
          state.documents = {
            identityDocument: null,
            educationCertificates: [],
            professionalCertifications: [],
            employmentVerification: [],
            profilePhoto: null,
            videoIntroduction: null,
            teachingDemo: null,
            resume: null,
          };
          state.currentStep = 0;
          state.steps = initialSteps;
          state.overallProgress = 0;
          state.verificationStatus = {
            identity: 'pending',
            professional: 'pending',
            teaching: 'pending',
            background: 'pending',
          };
          state.ui.errors = {};
          state.ui.warnings = {};
          state.ui.notifications = [];
          state.ui.hasUnsavedChanges = false;
          state.consents = {
            backgroundCheck: false,
            dataProcessing: false,
            termOfService: false,
            privacyPolicy: false,
            contentGuidelines: false,
            codeOfConduct: false,
          };
          state.verificationId = null;
        });
      },

      // Fix step IDs if they're incorrect
      fixStepIds: () => {
        set((state) => {
          // Ensure the last step has the correct ID
          if (state.steps[4] && state.steps[4].id !== 'review') {
            state.steps[4].id = 'review';
            state.steps[4].title = 'Review & Submit';
          }
        });
      },

      // Auto-save
      enableAutoSave: () => {
          set((state) => {
          state.ui.autoSaveEnabled = true;
        });
      },

      disableAutoSave: () => {
          set((state) => {
          state.ui.autoSaveEnabled = false;
        });
      },

      // Handle storage quota errors
      handleStorageError: () => {
        try {
          // Try to cleanup storage first
          const state = get();
          state.cleanupStorage();
          
          // If still having issues, clear storage completely
          if (state.getStorageSize() > '5000 KB') { // If larger than 5MB
            state.clearStorage();
            showToast('warning', 'Storage Reset', 'Storage was cleared due to space limitations. Your data has been saved to the server.');
          }
        } catch (error) {
          console.error('Failed to handle storage error:', error);
          // As a last resort, clear everything
          try {
            localStorage.clear();
          } catch (clearError) {
            console.error('Failed to clear localStorage:', clearError);
          }
        }
      },

      triggerAutoSave: async () => {
        const { ui, saveApplication } = get();
        if (ui.autoSaveEnabled && ui.hasUnsavedChanges && !ui.isSaving) {
          await saveApplication();
        }
      },

      // Validation
      validateAllSteps: () => {
        const state = get();
        
        // Validate each step using the new validation methods
        state.validatePersonalInfo();
        state.validateProfessionalBackground();
        state.validateTeachingInformation();
        state.validateDocuments();
        state.validateConsents();
        
        return state.steps.every(step => step.isValid);
      },

      getValidationErrors: () => {
        const { steps } = get();
        const errors: Record<string, string[]> = {};
        
        steps.forEach(step => {
          if (step.errors.length > 0) {
            errors[step.id] = step.errors;
          }
        });
        
        return errors;
      },

      // Progress Calculation
      calculateOverallProgress: () => {
        const { steps } = get();
        const totalProgress = steps.reduce((sum, step) => sum + step.completionPercentage, 0);
        return Math.round(totalProgress / steps.length);
      },

      getOverallProgress: () => {
        return get().calculateOverallProgress();
      },

      calculateStepProgress: (stepId) => {
        const { steps } = get();
        const step = steps.find(s => s.id === stepId);
        return step?.completionPercentage || 0;
      },

      // Storage Management
      clearStorage: () => {
        try {
          localStorage.removeItem('instructor-application-storage');
          console.log('Storage cleared successfully');
          showToast('success', 'Storage Cleared', 'Application storage has been cleared successfully.');
        } catch (error) {
          console.error('Failed to clear storage:', error);
          showToast('error', 'Storage Clear Failed', 'Failed to clear application storage.');
        }
      },

      cleanupStorage: () => {
        try {
          // Remove old notifications to save space
          set((state) => {
            // Keep only the last 10 notifications
            if (state.ui.notifications.length > 10) {
              state.ui.notifications = state.ui.notifications.slice(-10);
            }
            
            // Clear old errors and warnings
            state.ui.errors = {};
            state.ui.warnings = {};
            
            // Clear success messages
            state.ui.successMessages = [];
          });
          
          console.log('Storage cleaned up successfully');
          showToast('success', 'Storage Cleaned', 'Application storage has been cleaned up successfully.');
        } catch (error) {
          console.error('Failed to cleanup storage:', error);
          showToast('error', 'Storage Cleanup Failed', 'Failed to clean up application storage.');
        }
      },

      getStorageSize: () => {
        try {
          const data = localStorage.getItem('instructor-application-storage');
          if (data) {
            const sizeInBytes = new Blob([data]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            return `${sizeInKB} KB`;
          }
          return '0 KB';
        } catch (error) {
          console.error('Failed to get storage size:', error);
          return 'Unknown';
        }
      },

      // Submit Application
      submitApplication: async (userId?: string, token?: string) => {
        const state = get();
        
        // First validate all steps except consents
        state.validatePersonalInfo();
        state.validateProfessionalBackground();
        state.validateTeachingInformation();
        state.validateDocuments();
        
        // Check if all required steps are valid
        const requiredStepsValid = state.steps.slice(0, 4).every(step => step.isValid);
        
        if (!requiredStepsValid) {
          state.addError('application', 'Please complete all required fields before submitting');
          return false;
        }
        
        // Now validate consents specifically for submission
        const consentValidation = state.validateConsentsForSubmission();
        if (!consentValidation.isValid) {
          state.addError('application', `Please accept all required agreements: ${consentValidation.missingConsents.join(', ')}`);
          return false;
        }

        state.setSubmitting(true);
        
        try {
          // Get current user ID from auth store if not provided
          let currentUserId = userId;
          if (!currentUserId) {
            const { user } = useAuthStore.getState();
            currentUserId = user?.id;
          }
          
          if (!currentUserId) {
            throw new Error('User not authenticated. Please sign in to submit your application.');
          }
          
          // Get authentication token if not provided
          let authToken = token;
          if (!authToken) {
            try {
              const { getToken } = useAuth();
              const tokenResult = await getToken();
              if (!tokenResult) {
                throw new Error('Authentication token required. Please sign in again.');
              }
              authToken = tokenResult;
            } catch (error) {
              throw new Error('Authentication token required. Please sign in again.');
            }
          }
          
          let verificationId = state.verificationId;
          
          if (!verificationId) {
            const newVerification = await VerificationService.loadOrCreateVerification(currentUserId, authToken);
            if (newVerification.success && newVerification.data?.id) {
              verificationId = newVerification.data.id;
              set((state) => {
                state.verificationId = verificationId;
              });
            } else {
              throw new Error(newVerification.message || 'Failed to create verification');
            }
          }
          
          // Submit verification with consents
          const result = await VerificationService.submitVerification(verificationId!, state.consents, authToken);
          
          if (result.success) {
            // Clean up storage after successful submission
            state.cleanupStorage();
            
            showToast('success', 'Application Submitted', 'Your instructor application has been submitted for review.');
            return true;
          } else {
            // Handle server error response
            const serverError = result.errors?.join(', ') || result.message || 'Failed to submit application';
            throw new Error(serverError);
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
          state.addError('application', errorMessage);
          showToast('error', 'Submission Failed', errorMessage);
          return false;
        } finally {
          state.setSubmitting(false);
        }
      },
      })),
      {
      name: 'instructor-application-storage',
      storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
        personalInfo: state.personalInfo,
        professionalBackground: state.professionalBackground,
        teachingInformation: state.teachingInformation,
        // Store only essential document metadata, not the full file objects
        documents: {
          identityDocument: state.documents.identityDocument ? {
            id: state.documents.identityDocument.id,
            name: state.documents.identityDocument.name,
            type: state.documents.identityDocument.type,
            size: state.documents.identityDocument.size,
            url: state.documents.identityDocument.url,
            uploadDate: state.documents.identityDocument.uploadDate,
            verificationStatus: state.documents.identityDocument.verificationStatus,
          } : null,
          educationCertificates: state.documents.educationCertificates?.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: doc.url,
            uploadDate: doc.uploadDate,
            verificationStatus: doc.verificationStatus,
          })) || [],
          professionalCertifications: state.documents.professionalCertifications?.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: doc.url,
            uploadDate: doc.uploadDate,
            verificationStatus: doc.verificationStatus,
          })) || [],
          employmentVerification: state.documents.employmentVerification?.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: doc.url,
            uploadDate: doc.uploadDate,
            verificationStatus: doc.verificationStatus,
          })) || [],
          profilePhoto: state.documents.profilePhoto ? {
            id: state.documents.profilePhoto.id,
            name: state.documents.profilePhoto.name,
            type: state.documents.profilePhoto.type,
            size: state.documents.profilePhoto.size,
            url: state.documents.profilePhoto.url,
            uploadDate: state.documents.profilePhoto.uploadDate,
            verificationStatus: state.documents.profilePhoto.verificationStatus,
          } : null,
          videoIntroduction: state.documents.videoIntroduction ? {
            id: state.documents.videoIntroduction.id,
            name: state.documents.videoIntroduction.name,
            type: state.documents.videoIntroduction.type,
            size: state.documents.videoIntroduction.size,
            url: state.documents.videoIntroduction.url,
            uploadDate: state.documents.videoIntroduction.uploadDate,
            verificationStatus: state.documents.videoIntroduction.verificationStatus,
          } : null,
          teachingDemo: state.documents.teachingDemo ? {
            id: state.documents.teachingDemo.id,
            name: state.documents.teachingDemo.name,
            type: state.documents.teachingDemo.type,
            size: state.documents.teachingDemo.size,
            url: state.documents.teachingDemo.url,
            uploadDate: state.documents.teachingDemo.uploadDate,
            verificationStatus: state.documents.teachingDemo.verificationStatus,
          } : null,
          resume: state.documents.resume ? {
            id: state.documents.resume.id,
            name: state.documents.resume.name,
            type: state.documents.resume.type,
            size: state.documents.resume.size,
            url: state.documents.resume.url,
            uploadDate: state.documents.resume.uploadDate,
            verificationStatus: state.documents.resume.verificationStatus,
          } : null,
        },
        currentStep: state.currentStep,
        steps: state.steps,
        overallProgress: state.overallProgress,
        verificationStatus: state.verificationStatus,
        consents: state.consents,
        settings: state.settings,
        verificationId: state.verificationId,
      }),
    }
  )
);