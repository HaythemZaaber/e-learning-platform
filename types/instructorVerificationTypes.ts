// types/instructorVerificationTypes.ts

export type VerificationStatus = 
  | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" 
  | "UNDER_REVIEW" | "APPROVED" | "SUSPENDED";

export type VerificationStage = 
  | "IDENTITY" | "PROFESSIONAL" | "SKILLS" | "BACKGROUND" 
  | "DOCUMENTS" | "FINAL_REVIEW";

export type DocumentType = 
  | "GOVERNMENT_ID" | "PASSPORT" | "DRIVERS_LICENSE" 
  | "EDUCATION_CERTIFICATE" | "PROFESSIONAL_CERTIFICATION" 
  | "EMPLOYMENT_VERIFICATION" | "REFERENCE_LETTER" 
  | "BACKGROUND_CHECK" | "PROFILE_PHOTO" | "TEACHING_DEMO" 
  | "INTRODUCTION_VIDEO" | "PORTFOLIO" | "OTHER";

export type DocumentStatus = 
  | "PENDING" | "UPLOADING" | "PROCESSING" | "VERIFIED" 
  | "REJECTED" | "EXPIRED";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  alternateEmail?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  gpa?: number;
  honors?: string;
  description?: string;
  isVerified: boolean;
  verificationStatus: DocumentStatus;
  verificationDate?: string;
  documents?: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP";
  description?: string;
  achievements?: string[];
  isVerified: boolean;
  verificationStatus: DocumentStatus;
  verificationDate?: string;
  documents?: string[];
}

export interface ProfessionalReference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  relationship: "DIRECT_SUPERVISOR" | "MANAGER" | "COLLEAGUE" | "CLIENT" | "MENTOR" | "HR_REPRESENTATIVE" | "OTHER";
  yearsKnown?: number;
  notes?: string;
  contactPermission: boolean;
  isVerified: boolean;
  verificationStatus: DocumentStatus;
  verificationDate?: string;
}

export interface TeachingCategory {
  id: string;
  categoryId: string;
  subcategory: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | "ALL_LEVELS";
  verified: boolean;
  aiScore: number;
  lastUpdated: string;
  assessmentScore?: number;
  assessmentCompleted?: boolean;
}

export interface SkillsAssessment {
  id: string;
  categoryId: string;
  subcategory: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  questions: AssessmentQuestion[];
  aiAnalysis?: {
    confidence: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
  isCorrect?: boolean;
  explanation?: string;
  points: number;
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadDate: string;
  verificationStatus: DocumentStatus;
  verificationDate?: string;
  rejectionReason?: string;
  aiAnalysis?: {
    confidence: number;
    extractedText?: string;
    documentType?: string;
    validationChecks?: Record<string, boolean>;
    issues?: string[];
    suggestions?: string[];
  };
  metadata?: {
    originalName?: string;
    checksum?: string;
    version?: string;
    uploadedBy?: string;
  };
}

export interface BiometricData {
  id: string;
  photoUrl: string;
  verificationStatus: DocumentStatus;
  verificationDate?: string;
  aiAnalysis?: {
    faceDetected: boolean;
    quality: number;
    livenessScore: number;
    matchScore: number;
    issues?: string[];
  };
}

export interface VerificationProgress {
  overallProgress: number; // 0-100
  stageProgress: Record<VerificationStage, number>; // e.g., { IDENTITY: 75, PROFESSIONAL: 50 }
  completedStages: VerificationStage[];
  currentStage: VerificationStage;
  estimatedTimeRemaining: string;
  lastUpdated: string;
  completionPercentage?: number;
  nextSteps?: string[];
}

export interface InstructorVerification {
  id: string;
  userId: string;
  
  identity: {
    personalInfo: PersonalInfo;
    documents: DocumentUpload[];
    biometricData: BiometricData;
    verificationStatus: VerificationStatus;
    aiVerificationScore: number;
    lastUpdated: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    otpVerification: {
      phone: { verified: boolean; verifiedAt?: string };
      email: { verified: boolean; verifiedAt?: string };
    };
  };
  
  professional: {
    education: Education[];
    experience: WorkExperience[];
    references: ProfessionalReference[];
    documents: DocumentUpload[];
    verificationStatus: VerificationStatus;
    aiVerificationScore: number;
    lastUpdated: string;
  };
  
  skills: {
    categories: TeachingCategory[];
    assessments: SkillsAssessment[];
    demonstrations: DocumentUpload[]; // e.g., teaching demo video, introduction video
    lessonPlans: DocumentUpload[]; // e.g., uploaded lesson plans
    verificationStatus: VerificationStatus;
    aiVerificationScore: number;
    lastUpdated: string;
  };
  
  background: {
    checks: DocumentUpload[]; // e.g., background check report
    agreements: {
      termsOfService: boolean;
      privacyPolicy: boolean;
      codeOfConduct: boolean;
      backgroundCheckConsent: boolean;
      dataProcessingConsent: boolean;
      signedAt?: string;
    };
    verificationStatus: VerificationStatus;
    aiVerificationScore: number;
    lastUpdated: string;
  };
  
  progress: VerificationProgress;
  overallStatus: VerificationStatus;
  
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  
  adminReview?: {
    reviewedBy: string;
    reviewedAt: string;
    comments: string;
    decision: "APPROVED" | "REJECTED" | "PENDING_MORE_INFO";
    requiredActions?: string[];
  };
  
  version: string;
  completionPercentage: number;
  isComplete: boolean;
  canSubmit: boolean;
  validationErrors: string[];
  warnings: string[];
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: InstructorVerification;
  errors?: string[];
  warnings?: string[];
  validationErrors?: string[];
  uploadProgress?: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document?: DocumentUpload;
  errors?: string[];
  uploadProgress?: number;
}

export interface VerificationStoreState {
  verification: InstructorVerification | null;
  isLoading: boolean;
  isUploading: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  uploadProgress: Record<string, number>;
  saveProgress: number;
  errors: string[];
  warnings: string[];
  currentStage: VerificationStage;
  activeTab: string;
  showPreview: boolean;
  lastSaved: string | null;
  hasUnsavedChanges: boolean;
}

export interface VerificationStoreActions {
  setVerification: (verification: InstructorVerification) => void;
  updateVerification: (updates: Partial<InstructorVerification>) => void;
  resetVerification: () => void;
  setCurrentStage: (stage: VerificationStage) => void;
  setActiveTab: (tab: string) => void;
  uploadDocument: (file: File, type: DocumentType, metadata?: any) => Promise<DocumentUpload>;
  deleteDocument: (documentId: string) => Promise<void>;
  setUploadProgress: (documentId: string, progress: number) => void;
  autoSave: () => Promise<void>;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  validateStage: (stage: VerificationStage) => { isValid: boolean; errors: string[]; warnings: string[] };
  validateAll: () => { isValid: boolean; errors: string[]; warnings: string[] };
  submitVerification: () => Promise<VerificationResponse>;
  saveDraft: () => Promise<VerificationResponse>;
  setError: (error: string) => void;
  setWarning: (warning: string) => void;
  clearErrors: () => void;
  clearWarnings: () => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
}

export type VerificationStore = VerificationStoreState & VerificationStoreActions;
