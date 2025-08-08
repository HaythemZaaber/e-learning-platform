/**
 * Enhanced Course Creation Store with Improved File Management
 * Features: Flexible navigation, better content organization, publishing workflow
 */

import { create } from "zustand";
import { CourseData, StepValidation } from "../features/course-creation/types";
import { CourseCreationService } from "../features/course-creation/services/courseCreationService";
import { UploadedFile } from "../features/course-creation/services/uploadService";
import { toast } from "sonner";

// Enhanced interfaces for better organization
interface ContentByLecture {
  [lectureId: string]: {
    videos: UploadedFile[];
    documents: UploadedFile[];
    images: UploadedFile[];
    audio: UploadedFile[];
    archives: UploadedFile[];
    text: any[];
    assignments: any[];
    resources: any[];
    quizzes: any[];
  };
}

interface UploadProgress {
  [fileId: string]: {
    progress: number;
    status: "uploading" | "complete" | "error";
    fileName: string;
    fileSize: number;
  };
}

interface CourseCreationState {
  // Course data
  courseData: CourseData;
  draftId: string | null;

  // UI state
  currentStep: number;
  isLoading: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;

  // Enhanced validation with flexible navigation
  stepValidations: StepValidation[];
  globalErrors: string[];
  globalWarnings: string[];
  navigationMode: 'strict' | 'flexible'; // New: Allow flexible navigation

  // Organized upload state
  uploadProgress: UploadProgress;
  contentByLecture: ContentByLecture;
  isUploading: boolean;

  // Preview state
  showPreview: boolean;
  showAssistant: boolean;

  // Service
  service: CourseCreationService | null;

  // Enhanced actions with better error handling
  updateCourseData: (data: Partial<CourseData>) => void;
  setCurrentStep: (step: number) => void;
  setNavigationMode: (mode: 'strict' | 'flexible') => void;
  setStepValidation: (stepIndex: number, validation: StepValidation) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setLastSaved: (date: Date) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Global message actions
  addGlobalError: (error: string) => void;
  removeGlobalError: (error: string) => void;
  addGlobalWarning: (warning: string) => void;
  removeGlobalWarning: (warning: string) => void;
  clearGlobalMessages: () => void;

  // Enhanced upload actions with better error handling
  setUploadProgress: (fileId: string, progress: Partial<UploadProgress[string]>) => void;
  removeUpload: (fileId: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  
  // Content management by lecture with deletion support
  addContentToLecture: (lectureId: string, type: string, content: any) => void;
  removeContentFromLecture: (lectureId: string, type: string, contentId: string) => void;
  deleteContentFromLecture: (lectureId: string, type: string, contentId: string, authToken?: string) => Promise<{ success: boolean }>;
  getContentForLecture: (lectureId: string) => any;
  getLectureContentCounts: (lectureId: string) => Record<string, number>;
  setContentByLecture: (contentByLecture: ContentByLecture) => void;
  
  // Enhanced file upload with cleanup
  uploadFile: (file: File, type: string, metadata: {
    title: string;
    description?: string;
    sectionId: string;
    lectureId: string;
  }, authToken?: string) => Promise<void>;
  
  // Thumbnail management with preview
  uploadThumbnail: (file: File, courseId?: string, metadata?: { title?: string; description?: string }, authToken?: string) => Promise<any>;
  deleteThumbnail: (courseId: string, authToken?: string) => Promise<any>;
  deleteThumbnailByType: (thumbnailUrl: string, courseId?: string, authToken?: string) => Promise<any>;
  
  // Non-file content methods
  createTextContent: (data: {
    title: string;
    content: string;
    description?: string;
    sectionId: string;
    lectureId: string;
  }) => void;
  
  createAssignment: (data: {
    title: string;
    description: string;
    instructions?: string;
    dueDate?: string;
    points?: number;
    sectionId: string;
    lectureId: string;
  }) => void;
  
  createResource: (data: {
    title: string;
    description?: string;
    url: string;
    resourceType: string;
    sectionId: string;
    lectureId: string;
  }) => void;

  createQuiz: (data: {
    title: string;
    description?: string;
    questions: any[];
    timeLimit?: number;
    attempts?: number;
    passingScore?: number;
    sectionId: string;
    lectureId: string;
  }) => void;

  // Enhanced validation methods with flexible navigation
  validateCurrentStep: () => StepValidation;
  validateAllSteps: () => boolean;
  canNavigateToStep: (stepIndex: number) => boolean;
  calculateProgress: () => number;
  
  // Helper validation methods
  validateCourseInformationStep: (courseData: CourseData) => StepValidation;
  validateCourseStructureStep: (courseData: CourseData) => StepValidation;
  validateContentUploadStep: (courseData: CourseData, contentByLecture: ContentByLecture) => StepValidation;
  validateSettingsStep: (courseData: CourseData) => StepValidation;
  
  // Additional validation methods
  clearStepValidationWarnings: () => void;
  validateStepsForCompletion: () => boolean;
  skipStepValidation: (stepIndex: number) => void;
  continueToNextStep: () => void;
  enableFlexibleNavigation: () => void;
  
  // Service actions with better error handling
  setService: (service: CourseCreationService) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  submitCourse: (authToken?: string) => Promise<void>;
  updateCourse: (courseId: string, authToken?: string) => Promise<void>;
  publishCourse: () => Promise<void>;
  unpublishCourse: () => Promise<void>;
  deleteDraft: () => Promise<void>;

  // Utility actions
  reset: () => void;
  setShowPreview: (show: boolean) => void;
  setShowAssistant: (show: boolean) => void;
}

const initialCourseData: CourseData = {
  title: "",
  description: "",
  category: "",
  level: "BEGINNER",
  thumbnail: undefined,
  trailer: undefined,
  price: 0,
  objectives: [""],
  prerequisites: [""],
  sections: [],
  status: "DRAFT", // Add initial status
  settings: {
    isPublic: true,
    enrollmentType: "FREE",
    language: "en",
    certificate: false,
    seoDescription: "",
    seoTags: [],
    accessibility: {
      captions: false,
      transcripts: false,
      audioDescription: false,
    },
  },
};

const initialStepValidations: StepValidation[] = [
  { isValid: false, errors: ["title", "description"], warnings: [] },
  { isValid: false, errors: ["sections"], warnings: [] },
  { isValid: false, errors: ["content"], warnings: [] },
  { isValid: true, errors: [], warnings: [] },
];

export const useCourseCreationStore = create<CourseCreationState>()((set, get) => ({
  // Initial state
  courseData: initialCourseData,
  draftId: null,
  currentStep: 0,
  isLoading: false,
  isSaving: false,
  isSubmitting: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  stepValidations: initialStepValidations,
  globalErrors: [],
  globalWarnings: [],
  navigationMode: 'flexible', // Default to flexible navigation
  uploadProgress: {},
  contentByLecture: {},
  showPreview: false,
  showAssistant: false,
  service: null,
  isUploading: false,

  // Basic actions with enhanced error handling
  updateCourseData: (data) => {
    set((state) => {
      const newCourseData = { ...state.courseData, ...data };
      
      // Handle pricing logic for FREE courses
      if (data.settings?.enrollmentType === "FREE") {
        newCourseData.price = 0;
        newCourseData.originalPrice = 0;
      }
      
      // Check if sections or lectures have changed
      const sectionsChanged = JSON.stringify(state.courseData.sections) !== JSON.stringify(newCourseData.sections);
      
      // If sections changed, update content upload step validation
      let newStepValidations = [...state.stepValidations];
      if (sectionsChanged) {
        // Re-validate content upload step based on new structure
        const contentValidation = get().validateContentUploadStep(newCourseData, state.contentByLecture);
        newStepValidations[2] = contentValidation;
      }
      
      return {
        courseData: newCourseData,
        hasUnsavedChanges: true,
        stepValidations: newStepValidations,
      };
    });
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  setNavigationMode: (mode) => set({ navigationMode: mode }),
  setStepValidation: (stepIndex, validation) => {
    set((state) => {
      const newValidations = [...state.stepValidations];
      newValidations[stepIndex] = validation;
      return { stepValidations: newValidations };
    });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setLastSaved: (date) => set({ lastSaved: date, hasUnsavedChanges: false }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  // Global message actions
  addGlobalError: (error) => {
    set((state) => ({
      globalErrors: [...state.globalErrors.filter((e) => e !== error), error],
    }));
  },
  removeGlobalError: (error) => {
    set((state) => ({
      globalErrors: state.globalErrors.filter((e) => e !== error),
    }));
  },
  addGlobalWarning: (warning) => {
    set((state) => ({
      globalWarnings: [...state.globalWarnings.filter((w) => w !== warning), warning],
    }));
  },
  removeGlobalWarning: (warning) => {
    set((state) => ({
      globalWarnings: state.globalWarnings.filter((w) => w !== warning),
    }));
  },
  clearGlobalMessages: () => set({ globalErrors: [], globalWarnings: [] }),

  // Upload actions
  setUploadProgress: (fileId, progress) => {
    set((state) => ({
      uploadProgress: {
        ...state.uploadProgress,
        [fileId]: { ...state.uploadProgress[fileId], ...progress },
      },
    }));
  },
  removeUpload: (fileId) => {
    set((state) => {
      const newProgress = { ...state.uploadProgress };
      delete newProgress[fileId];
      return { uploadProgress: newProgress };
    });
  },
  setIsUploading: (isUploading) => set({ isUploading }),

  // Enhanced content management by lecture
  addContentToLecture: (lectureId, type, content) => {
    set((state) => {
      const newContentByLecture = { ...state.contentByLecture };
      
      if (!newContentByLecture[lectureId]) {
        newContentByLecture[lectureId] = {
          videos: [],
          documents: [],
          images: [],
          audio: [],
          archives: [],
          text: [],
          assignments: [],
          resources: [],
          quizzes: [],
        };
      }
      
      const contentKey = type as keyof typeof newContentByLecture[typeof lectureId];
      
      // For most content types, only allow one item per lecture
      // But keep arrays for potential future expansion
      if (['text', 'assignments', 'resources', 'quizzes'].includes(type)) {
        newContentByLecture[lectureId][contentKey] = [content];
      } else {
        // For file types, allow multiple but warn if replacing
        newContentByLecture[lectureId][contentKey] = [content];
      }
      
      // Re-validate content upload step after adding content
      const contentValidation = get().validateContentUploadStep(state.courseData, newContentByLecture);
      const newStepValidations = [...state.stepValidations];
      newStepValidations[2] = contentValidation;
      
      return {
        contentByLecture: newContentByLecture,
        hasUnsavedChanges: true,
        stepValidations: newStepValidations,
      };
    });
  },

  removeContentFromLecture: (lectureId, type, contentId) => {
    set((state) => {
      const newContentByLecture = { ...state.contentByLecture };
      
      if (newContentByLecture[lectureId]) {
        const contentKey = type as keyof typeof newContentByLecture[typeof lectureId];
        newContentByLecture[lectureId][contentKey] = 
          newContentByLecture[lectureId][contentKey]
            .filter((content: any) => content.id !== contentId);
      }
      
      // Re-validate content upload step after removing content
      const contentValidation = get().validateContentUploadStep(state.courseData, newContentByLecture);
      const newStepValidations = [...state.stepValidations];
      newStepValidations[2] = contentValidation;
      
      return {
        contentByLecture: newContentByLecture,
        hasUnsavedChanges: true,
        stepValidations: newStepValidations,
      };
    });
  },

  // Enhanced delete content with server-side deletion and cleanup
  deleteContentFromLecture: async (lectureId: string, type: string, contentId: string, authToken?: string) => {
    try {
      console.log("deleteContentFromLecture", lectureId, type, contentId);
      const state = get();
      const serviceToUse = state.service;
      
      if (!serviceToUse) {
        throw new Error('Service not initialized. Please wait a moment and try again.');
      }

      // Delete from server if it's a file
      const content = state.contentByLecture[lectureId]?.[type as keyof typeof state.contentByLecture[typeof lectureId]]
        ?.find((item: any) => item.id === contentId);
      if (content && content.url) {
        
          await serviceToUse.deleteFile(content.url, authToken);
      
      }

      // Remove from local state
      get().removeContentFromLecture(lectureId, type, contentId);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw error;
    }
  },

  // Thumbnail management with better error handling
  uploadThumbnail: async (file: File, courseId?: string, metadata?: { title?: string; description?: string }, authToken?: string) => {
    const state = get();
    if (!state.service) {
      // Wait for service initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedState = get();
      if (!updatedState.service) {
        throw new Error('Service not initialized. Please wait a moment and try again.');
      }
    }

    try {
      const serviceToUse = state.service || get().service;
      if (!serviceToUse) {
        throw new Error('Service not initialized. Please wait a moment and try again.');
      }
      
      const result = await serviceToUse.uploadThumbnail(file, courseId, metadata, authToken);
      return result;
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      get().addGlobalError('Failed to upload thumbnail. Please try again.');
      throw error;
    }
  },

  deleteThumbnail: async (courseId: string, authToken?: string) => {
    const state = get();
    if (!state.service) {
      throw new Error('Service not initialized. Please wait a moment and try again.');
    }

    try {
      const result = await state.service.deleteThumbnail(courseId, authToken);
      return result;
    } catch (error) {
      console.error('Failed to delete thumbnail:', error);
      get().addGlobalError('Failed to delete thumbnail. Please try again.');
      throw error;
    }
  },

  deleteThumbnailByType: async (thumbnailUrl: string, courseId?: string, authToken?: string) => {
    const state = get();
    if (!state.service) {
      throw new Error('Service not initialized. Please wait a moment and try again.');
    }

    try {
      let result;
      
                          // Determine which deletion method to use based on course state
                    if (!courseId) {
                      // Unsaved thumbnail (no course ID yet)
                      result = await state.service.deleteUnsavedThumbnail(thumbnailUrl, authToken);
                    } else if (state.courseData.status === 'DRAFT' || !state.courseData.status) {
                      // Draft course or no status set yet
                      result = await state.service.deleteDraftThumbnail(courseId, thumbnailUrl, authToken);
                    } else {
                      // Published course
                      result = await state.service.deleteCourseThumbnail(courseId, thumbnailUrl, authToken);
                    }
      
      return result;
    } catch (error) {
      console.error('Failed to delete thumbnail:', error);
      get().addGlobalError('Failed to delete thumbnail. Please try again.');
      throw error;
    }
  },

  getContentForLecture: (lectureId) => {
    const state = get();
    return state.contentByLecture[lectureId] || {
      videos: [],
      documents: [],
      images: [],
      audio: [],
      archives: [],
      text: [],
      assignments: [],
      resources: [],
      quizzes: [],
    };
  },

  getLectureContentCounts: (lectureId) => {
    const content = get().getContentForLecture(lectureId);
    return {
      videos: content.videos.length,
      documents: content.documents.length,
      images: content.images.length,
      audio: content.audio.length,
      archives: content.archives.length,
      text: content.text.length,
      assignments: content.assignments.length,
      resources: content.resources.length,
      quizzes: content.quizzes.length,
    };
  },

  setContentByLecture: (contentByLecture) => set({ contentByLecture }),

  // Enhanced file upload method with better progress tracking
  uploadFile: async (file, type, metadata, authToken?: string) => {
    const fileId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      get().setUploadProgress(fileId, {
        progress: 0,
        status: "uploading",
        fileName: file.name,
        fileSize: file.size,
      });
      
      get().setIsUploading(true);

      const serviceToUse = get().service;
      if (!serviceToUse) {
        throw new Error('Service not initialized. Please wait a moment and try again.');
      }

      // Map frontend type to ContentType
      const contentTypeMap: Record<string, string> = {
        videos: 'video',
        documents: 'document',
        images: 'image',
        audio: 'audio',
        archives: 'archive',
      };

      const contentType = contentTypeMap[type] as any;
      if (!contentType) {
        throw new Error(`Invalid content type: ${type}`);
      }

      const uploadedFile = await serviceToUse.uploadFile(file, contentType, {
        title: metadata.title,
        description: metadata.description,
        sectionId: metadata.sectionId,
        lectureId: metadata.lectureId,
      }, authToken);

      get().setUploadProgress(fileId, {
        progress: 100,
        status: "complete",
      });

      // Add to lecture-specific content
      get().addContentToLecture(metadata.lectureId, type, uploadedFile);

      // Auto-remove upload progress after success
      setTimeout(() => {
        get().removeUpload(fileId);
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      get().setUploadProgress(fileId, {
        progress: 0,
        status: "error",
      });
      get().addGlobalError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Keep error visible longer
      setTimeout(() => {
        get().removeUpload(fileId);
      }, 10000);
      
      throw error;
    } finally {
      get().setIsUploading(false);
    }
  },

  // Non-file content methods
  createTextContent: (data) => {
    const textId = `text-${Date.now()}`;
    const textContent = {
      id: textId,
      title: data.title,
      content: data.content,
      description: data.description,
      sectionId: data.sectionId,
      lectureId: data.lectureId,
      createdAt: new Date(),
      type: "text",
    };

    get().addContentToLecture(data.lectureId, "text", textContent);
  },

  createAssignment: (data) => {
    const assignmentId = `assignment-${Date.now()}`;
    const assignment = {
      id: assignmentId,
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      dueDate: data.dueDate,
      points: data.points,
      sectionId: data.sectionId,
      lectureId: data.lectureId,
      createdAt: new Date(),
      type: "assignment",
    };

    get().addContentToLecture(data.lectureId, "assignments", assignment);
  },

  createResource: (data) => {
    const resourceId = `resource-${Date.now()}`;
    const resource = {
      id: resourceId,
      title: data.title,
      description: data.description,
      url: data.url,
      resourceType: data.resourceType,
      sectionId: data.sectionId,
      lectureId: data.lectureId,
      createdAt: new Date(),
      type: "resource",
    };

    get().addContentToLecture(data.lectureId, "resources", resource);
  },

  createQuiz: (data) => {
    const quizId = `quiz-${Date.now()}`;
    const quiz = {
      id: quizId,
      title: data.title,
      description: data.description,
      questions: data.questions,
      timeLimit: data.timeLimit,
      attempts: data.attempts,
      passingScore: data.passingScore,
      sectionId: data.sectionId,
      lectureId: data.lectureId,
      createdAt: new Date(),
      type: "quiz",
    };

    get().addContentToLecture(data.lectureId, "quizzes", quiz);
  },

  // Enhanced validation methods with flexible navigation
  validateCurrentStep: () => {
    const { currentStep, courseData, contentByLecture } = get();
    
    switch (currentStep) {
      case 0:
        return get().validateCourseInformationStep(courseData);
      case 1:
        return get().validateCourseStructureStep(courseData);
      case 2:
        return get().validateContentUploadStep(courseData, contentByLecture);
      case 3:
        return get().validateSettingsStep(courseData);
      default:
        return { isValid: true, errors: [], warnings: [] };
    }
  },

  // Helper validation methods
  validateCourseInformationStep: (courseData: CourseData): StepValidation => {
    const validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!courseData.title?.trim()) {
      validation.errors.push("Course title is required");
      validation.isValid = false;
    } else if (courseData.title.length < 10) {
      validation.warnings.push("Consider a more descriptive title (at least 10 characters)");
    }

    if (!courseData.description?.trim()) {
      validation.errors.push("Course description is required");
      validation.isValid = false;
    } else if (courseData.description.length < 50) {
      validation.warnings.push("Description should be at least 50 characters for better clarity");
    }

    if (!courseData.category) {
      validation.warnings.push("Select a category to help students find your course");
    }

    if (!courseData.objectives?.some(obj => obj.trim())) {
      validation.warnings.push("Add learning objectives to clarify what students will achieve");
    }

    if (!courseData.whatYouLearn?.some(item => item.trim())) {
      validation.warnings.push("Add 'What You Will Learn' topics to help students understand the course value");
    }

    return validation;
  },

  validateCourseStructureStep: (courseData: CourseData): StepValidation => {
    const validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!courseData.sections || courseData.sections.length === 0) {
      validation.errors.push("Add at least one section to organize your content");
      validation.isValid = false;
    } else {
      const totalLectures = courseData.sections.reduce(
        (total, section) => total + (section.lectures?.length || 0),
        0
      );
      
      if (totalLectures === 0) {
        validation.errors.push("Add at least one lecture to your sections");
        validation.isValid = false;
      } else if (totalLectures < 3) {
        validation.warnings.push("Consider adding more lectures for a comprehensive course");
      }

      // Check for empty sections
      const emptySections = courseData.sections.filter(s => !s.lectures || s.lectures.length === 0);
      if (emptySections.length > 0) {
        validation.warnings.push(`${emptySections.length} section(s) have no lectures`);
      }
    }

    return validation;
  },

  validateContentUploadStep: (courseData: CourseData, contentByLecture: ContentByLecture): StepValidation => {
    const validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    const totalContent = Object.values(contentByLecture).reduce((total: number, lectureContent: any) => {
      return total + Object.values(lectureContent).reduce((lectureTotal: number, contentArray: any) => {
        return lectureTotal + (Array.isArray(contentArray) ? contentArray.length : 0);
      }, 0);
    }, 0);

    // Check lectures without content - only count lectures that exist in courseData
    const lecturesWithoutContent = courseData.sections?.reduce((count: number, section: any) => {
      return count + (section.lectures?.filter((lecture: any) => {
        const content = contentByLecture[lecture.id];
        return !content || Object.values(content).every((arr: any) => 
          Array.isArray(arr) ? arr.length === 0 : true
        );
      }).length || 0);
    }, 0) || 0;

    if (lecturesWithoutContent > 0) {
      validation.warnings.push(`${lecturesWithoutContent} lecture(s) need content`);
    }

    // Allow progression with warnings but no hard requirement for content
    // This makes the flow more flexible while still providing guidance

    return validation;
  },

  validateSettingsStep: (courseData: CourseData): StepValidation => {
    const validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (courseData.settings?.enrollmentType === "PAID" && (courseData.price || 0) <= 0) {
      validation.errors.push("Set a price for paid courses");
      validation.isValid = false;
    }

    if (courseData.settings?.enrollmentType === "FREE" && (courseData.price || 0) > 0) {
      validation.errors.push("Free courses cannot have a price greater than 0");
      validation.isValid = false;
    }

    if (!courseData.thumbnail) {
      validation.warnings.push("Add a course thumbnail to attract students");
    }

    return validation;
  },

  validateAllSteps: () => {
    const { courseData, contentByLecture } = get();
    const validations: StepValidation[] = [];

    // Validate all steps
    validations.push(get().validateCourseInformationStep(courseData));
    validations.push(get().validateCourseStructureStep(courseData));
    validations.push(get().validateContentUploadStep(courseData, contentByLecture));
    validations.push(get().validateSettingsStep(courseData));

    // Update all step validations
    set({ stepValidations: validations });

    return validations.every(validation => validation.isValid);
  },

  canNavigateToStep: (stepIndex) => {
    const { currentStep, navigationMode, stepValidations } = get();
    
    // If flexible navigation is enabled, allow navigation to any step
    if (navigationMode === 'flexible') {
      return true;
    }
    
    // Strict mode: can only navigate to completed steps or next step
    if (stepIndex <= currentStep) return true;
    
    // Can navigate to next step if current step is valid
    if (stepIndex === currentStep + 1) {
      return stepValidations[currentStep]?.isValid || false;
    }
    
    return false;
  },

  calculateProgress: () => {
    const { courseData, contentByLecture } = get();
    let completedFields = 0;
    let totalFields = 10; // Base fields to track

    // Course Information (30%)
    if (courseData.title?.trim()) completedFields++;
    if (courseData.description?.trim()) completedFields++;
    if (courseData.category) completedFields++;
    if (courseData.objectives?.some(obj => obj.trim())) completedFields++;

    // Course Structure (30%)
    if (courseData.sections?.length > 0) completedFields++;
    const totalLectures = courseData.sections?.reduce(
      (total, section) => total + (section.lectures?.length || 0),
      0
    ) || 0;
    if (totalLectures > 0) completedFields += 2;

    // Content Upload (30%)
    const totalContent = Object.values(contentByLecture).reduce((total, lectureContent) => {
      return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
        return lectureTotal + contentArray.length;
      }, 0);
    }, 0);
    if (totalContent > 0) completedFields++;

    // Settings (10%)
    if (courseData.settings?.enrollmentType === "FREE" || 
        (courseData.settings?.enrollmentType === "PAID" && (courseData.price || 0) > 0)) {
      completedFields++;
    }
    if (courseData.thumbnail) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  },

  // Additional validation methods
  clearStepValidationWarnings: () => {
    set((state) => {
      const newValidations = state.stepValidations.map(validation => ({
        ...validation,
        warnings: []
      }));
      return { stepValidations: newValidations };
    });
  },

  validateStepsForCompletion: () => {
    const { stepValidations } = get();
    const allValid = stepValidations.every(validation => validation.isValid);
    return allValid;
  },

  skipStepValidation: (stepIndex) => {
    set((state) => {
      const newValidations = [...state.stepValidations];
      if (newValidations[stepIndex]) {
        newValidations[stepIndex] = {
          isValid: true,
          errors: [],
          warnings: [],
        };
      }
      return { stepValidations: newValidations };
    });
  },

  continueToNextStep: () => {
    const { currentStep } = get();
    const nextStep = currentStep + 1;
    
    // Skip validation for current step and move to next step
    get().skipStepValidation(currentStep);
    get().setCurrentStep(nextStep);
    
    // Add a warning that the step was skipped
    get().addGlobalWarning(`Step ${currentStep + 1} was marked as complete. You can return to it later to add more content.`);
  },

  enableFlexibleNavigation: () => {
    set({ navigationMode: 'flexible' });
    get().addGlobalWarning("Flexible navigation enabled. You can work on steps in any order.");
  },

  // Service actions with enhanced error handling
  setService: (service) => set({ service }),

  saveDraft: async () => {
    const { courseData, currentStep, calculateProgress, setSaving, setLastSaved, service, contentByLecture } = get();
    
    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    try {
      setSaving(true);
      
      // Organize content data for saving
      const organizedContent = {
        contentByLecture,
        totalContent: Object.values(contentByLecture).reduce((total, lectureContent) => {
          return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
            return lectureTotal + contentArray.length;
          }, 0);
        }, 0)
      };

      const result = await service.saveDraft(
        courseData,
        currentStep,
        calculateProgress(),
        organizedContent
      );

      if (result.success) {
        set({
          draftId: result.draftId || null,
          hasUnsavedChanges: false,
        });
        setLastSaved(new Date());
      } else {
        throw new Error(result.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      get().addGlobalError(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  },

  loadDraft: async () => {
    const { setLoading, service } = get();
    
    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    try {
      setLoading(true);
      
      const result = await service.loadDraft();
      
      if (result.success) {
        const { _contentByLecture, _organizedContent, ...courseData } = result.draftData;
        
        set({
          courseData: courseData,
          currentStep: result.currentStep || 0,
          draftId: result.draftId || null,
          hasUnsavedChanges: false,
          lastSaved: result.lastSaved,
          contentByLecture: _contentByLecture || {},
        });

        // Validate all steps after loading draft
        setTimeout(() => {
          get().validateAllSteps();
        }, 100);
      } else {
        console.log("No draft found, starting fresh");
      }
    } catch (error) {
      toast.warning(error instanceof Error ? error.message : "Failed to load draft. Please try again.");
      // if (error instanceof Error && error.message !== "No draft found") {
      //   get().addGlobalWarning("Failed to load draft. Please try again.");
      // }
    } finally {
      setLoading(false);
    }
  },

  submitCourse: async (authToken?: string) => {
    const { courseData, setSubmitting, validateAllSteps, service, contentByLecture } = get();

    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    // Validate all steps before submission - but allow submission even with warnings
    const validations = get().stepValidations;
    const hasErrors = validations.some(validation => validation.errors.length > 0);
    
    if (hasErrors) {
      get().addGlobalError("Please fix all errors before submitting. Warnings are acceptable.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("Store: Preparing course data for submission...");

      // Prepare course data with organized content and set status to draft
      const courseWithContent = {
        ...courseData,
        status: "DRAFT", // Set initial status to draft
        organizedContent: {
          contentByLecture,
          totalContent: Object.values(contentByLecture).reduce((total, lectureContent) => {
            return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
              return lectureTotal + contentArray.length;
            }, 0);
          }, 0)
        }
      };

      const result = await service.submitCourse(courseWithContent);

      // Clear draft after successful submission
      try {
        await service.deleteDraft();
      } catch (draftError) {
        console.warn("Failed to delete draft:", draftError);
      }

      set({
        draftId: null,
        hasUnsavedChanges: false,
        lastSaved: new Date(),
        courseData: {
          ...courseData,
          status: "DRAFT",
          id: result.course?.id || courseData.id,
        },
      });

      get().clearGlobalMessages();
      get().addGlobalWarning("Course created successfully! You can now publish it to make it visible to students.");
    
    } catch (error) {
      console.error("Failed to submit course:", error);
      get().addGlobalError("Failed to create course. Please try again.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  },

  updateCourse: async (courseId: string, authToken?: string) => {
    const { courseData, setSubmitting, validateAllSteps, service, contentByLecture } = get();

    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    // Validate all steps before updating - but allow update even with warnings
    const validations = get().stepValidations;
    const hasErrors = validations.some(validation => validation.errors.length > 0);
    
    if (hasErrors) {
      get().addGlobalError("Please fix all errors before updating. Warnings are acceptable.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("Store: Preparing course data for update...");

      // Prepare course data with organized content
      const courseWithContent = {
        ...courseData,
        id: courseId, // Use the provided courseId for update
        status: "DRAFT", // Ensure status is draft for update
        organizedContent: {
          contentByLecture,
          totalContent: Object.values(contentByLecture).reduce((total, lectureContent) => {
            return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
              return lectureTotal + contentArray.length;
            }, 0);
          }, 0)
        }
      };

      const result = await service.updateCourse(courseId, courseWithContent);

      

     if(result.success){

       set({
         draftId: null,
         hasUnsavedChanges: false,
         lastSaved: new Date(),
          courseData: {
            ...courseData,
            id: courseId,
            status: "DRAFT",
          },
        });
        get().clearGlobalMessages();
        get().addGlobalWarning("Course updated successfully!");
      }else{
        result.errors?.forEach((error: string) => get().addGlobalError(error));
        // Handle warnings if they exist in the result
       
        throw new Error(result.message || "Failed to update course");
      }
     
    } catch (error) {
      console.error("Failed to update course:", error);
      get().addGlobalError("Failed to update course. Please try again.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  },

  publishCourse: async () => {
    const { courseData, setSubmitting, service } = get();

    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    if (!courseData.id) {
      get().addGlobalError("Course ID is required to publish");
      return;
    }

    try {
      setSubmitting(true);

      const result = await service.publishCourse(courseData.id);

      if (result.success) {
        get().addGlobalWarning("Course published successfully! Students can now enroll.");
        set((state) => ({
          courseData: {
            ...state.courseData,
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        }));
      } else {
        result.errors?.forEach((error: string) => get().addGlobalError(error));
        // Handle warnings if they exist in the result
        if (result.warnings && Array.isArray(result.warnings)) {
          result.warnings.forEach((warning: string) => get().addGlobalWarning(warning));
        }
        throw new Error(result.message || "Failed to update course");
      }
    } catch (error) {
      console.error("Failed to publish course:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to publish course";
      get().addGlobalError(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  },

  unpublishCourse: async () => {
    const { courseData, setSubmitting, service } = get();

    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    if (!courseData.id) {
      get().addGlobalError("Course ID is required to unpublish");
      return;
    }

    try {
      setSubmitting(true);

      const result = await service.unpublishCourse(courseData.id);

      if (result.success) {
        get().addGlobalWarning("Course unpublished successfully! Students can no longer enroll.");
        set((state) => ({
          courseData: {
            ...state.courseData,
            status: "DRAFT",
            publishedAt: undefined,
          },
        }));
      } else {
        result.errors?.forEach((error: string) => get().addGlobalError(error));
        // Handle warnings if they exist in the result
        if (result.warnings && Array.isArray(result.warnings)) {
          result.warnings.forEach((warning: string) => get().addGlobalWarning(warning));
        }
        throw new Error(result.message || "Failed to unpublish course");
      }
    } catch (error) {
      console.error("Failed to unpublish course:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to unpublish course";
      get().addGlobalError(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  },

  deleteDraft: async () => {
    const { service } = get();
    
    if (!service) {
      get().addGlobalError("Service not initialized. Please try again.");
      return;
    }

    try {
      await service.deleteDraft();
      set({
        draftId: null,
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error("Failed to delete draft:", error);
      get().addGlobalError("Failed to delete draft. Please try again.");
    }
  },

  // Utility actions
  reset: () => {
    set({
      courseData: initialCourseData,
      draftId: null,
      currentStep: 0,
      isLoading: false,
      isSaving: false,
      isSubmitting: false,
      lastSaved: null,
      hasUnsavedChanges: false,
      stepValidations: initialStepValidations,
      globalErrors: [],
      globalWarnings: [],
      navigationMode: 'flexible',
      uploadProgress: {},
      contentByLecture: {},
      showPreview: false,
      showAssistant: false,
      service: null,
      isUploading: false,
    });
  },

  setShowPreview: (show) => set({ showPreview: show }),
  setShowAssistant: (show) => set({ showAssistant: show }),
}));