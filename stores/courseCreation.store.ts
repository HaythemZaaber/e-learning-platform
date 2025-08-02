/**
 * Enhanced Course Creation Store
 * 
 * This store manages the course creation process with improved file organization
 * and better validation logic for each step.
 */

import { create } from "zustand";
import { CourseData, StepValidation } from "../features/course-creation/types";
import { CourseCreationService } from "../features/course-creation/services/graphql/courseCreationService";
import { UploadedFile } from "../features/course-creation/services/graphql/uploadService";

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

  // Enhanced validation
  stepValidations: StepValidation[];
  globalErrors: string[];
  globalWarnings: string[];

  // Organized upload state
  uploadProgress: UploadProgress;
  contentByLecture: ContentByLecture;
  isUploading: boolean;

  // Preview state
  showPreview: boolean;
  showAssistant: boolean;

  // Service
  service: CourseCreationService | null;

  // Enhanced actions
  updateCourseData: (data: Partial<CourseData>) => void;
  setCurrentStep: (step: number) => void;
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
  clearGlobalMessages: () => void;

  // Enhanced upload actions
  setUploadProgress: (fileId: string, progress: Partial<UploadProgress[string]>) => void;
  removeUpload: (fileId: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  
  // Content management by lecture
  addContentToLecture: (lectureId: string, type: string, content: any) => void;
  removeContentFromLecture: (lectureId: string, type: string, contentId: string) => void;
  deleteContentFromLecture: (lectureId: string, type: string, contentId: string, authToken?: string) => Promise<{ success: boolean }>;
  getContentForLecture: (lectureId: string) => any;
  getLectureContentCounts: (lectureId: string) => Record<string, number>;
  
  // File upload method
  uploadFile: (file: File, type: string, metadata: {
    title: string;
    description?: string;
    sectionId: string;
    lectureId: string;
  }, authToken?: string) => Promise<void>;
  
  // Thumbnail management
  uploadThumbnail: (file: File, courseId?: string, metadata?: { title?: string; description?: string }, authToken?: string) => Promise<any>;
  deleteThumbnail: (courseId: string, authToken?: string) => Promise<any>;
  
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

  // Enhanced validation methods
  validateCurrentStep: () => StepValidation;
  validateAllSteps: () => boolean;
  canNavigateToStep: (stepIndex: number) => boolean;
  calculateProgress: () => number;
  
  // Additional validation methods
  clearStepValidationWarnings: () => void;
  validateStepsForCompletion: () => boolean;
  
  // Service actions
  setService: (service: CourseCreationService) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  submitCourse: (authToken?: string) => Promise<void>;
  publishCourse: () => Promise<void>;

  // Utility actions
  reset: () => void;
  setShowPreview: (show: boolean) => void;
  setShowAssistant: (show: boolean) => void;
}

const initialCourseData: CourseData = {
  title: "",
  description: "",
  category: "",
  level: "beginner",
  thumbnail: undefined,
  trailer: undefined,
  price: 0,
  objectives: [""],
  prerequisites: [""],
  sections: [],
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
  uploadProgress: {},
  contentByLecture: {},
  showPreview: false,
  showAssistant: false,
  service: null,
  isUploading: false,

  // Basic actions
  updateCourseData: (data) => {
    set((state) => ({
      courseData: { ...state.courseData, ...data },
      hasUnsavedChanges: true,
    }));
  },

  setCurrentStep: (step) => set({ currentStep: step }),
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
      
      // Each lecture can only have one content item - replace existing content
      newContentByLecture[lectureId][contentKey] = [content];
      
      return {
        contentByLecture: newContentByLecture,
        hasUnsavedChanges: true,
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
      
      return {
        contentByLecture: newContentByLecture,
        hasUnsavedChanges: true,
      };
    });
  },

  // Enhanced delete content with server-side deletion
  deleteContentFromLecture: async (lectureId: string, type: string, contentId: string, authToken?: string) => {
    const state = get();
    const content = state.getContentForLecture(lectureId);
    const contentKey = type as keyof typeof content;
    const contentItem = content[contentKey].find((item: any) => 
      item.id === contentId
    );

    if (!contentItem) {
      throw new Error('Content not found');
    }

    try {
      // If the content has an ID (was uploaded), delete it from server
      if (contentItem.id) {
        const serviceToUse = state.service || get().service;
        if (!serviceToUse) {
          throw new Error('Service not initialized. Please wait a moment and try again.');
        }
        // Pass the file path (stored as id) to delete the file
        await serviceToUse.deleteFile(contentItem.id, authToken);
      }

      // Remove from local state
      get().removeContentFromLecture(lectureId, type, contentId);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw error;
    }
  },

  // Thumbnail management
  uploadThumbnail: async (file: File, courseId?: string, metadata?: { title?: string; description?: string }, authToken?: string) => {
    const state = get();
    if (!state.service) {
      console.warn('Service not initialized, attempting to wait for initialization...');
      // Wait a bit for service to initialize
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
      throw error;
    }
  },

  deleteThumbnail: async (courseId: string, authToken?: string) => {
    const state = get();
    if (!state.service) {
      console.warn('Service not initialized, attempting to wait for initialization...');
      // Wait a bit for service to initialize
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
      const result = await serviceToUse.deleteThumbnail(courseId, authToken);
      return result;
    } catch (error) {
      console.error('Failed to delete thumbnail:', error);
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

  // Enhanced file upload method
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

      setTimeout(() => {
        get().removeUpload(fileId);
      }, 3000);

    } catch (error) {
      console.error('Upload failed:', error);
      get().setUploadProgress(fileId, {
        progress: 0,
        status: "error",
      });
      get().addGlobalError(`Failed to upload ${file.name}`);

      setTimeout(() => {
        get().removeUpload(fileId);
      }, 5000);
      throw new Error('Failed to upload file');
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

  // Enhanced validation methods
  validateCurrentStep: () => {
    const { currentStep, courseData, contentByLecture } = get();
    const validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    switch (currentStep) {
      case 0: // Course Information
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
        break;

      case 1: // Course Structure
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
        break;

      case 2: // Content Upload
        const totalContent = Object.values(contentByLecture).reduce((total: number, lectureContent: any) => {
          return total + Object.values(lectureContent).reduce((lectureTotal: number, contentArray: any) => {
            return lectureTotal + (Array.isArray(contentArray) ? contentArray.length : 0);
          }, 0);
        }, 0);

        if (totalContent === 0) {
          validation.errors.push("Add content to your lectures");
          validation.isValid = false;
        } else if (totalContent < courseData.sections?.reduce((total, section) => 
          total + (section.lectures?.length || 0), 0) || 0) {
          validation.warnings.push("Some lectures don't have content yet");
        }

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
        break;

      case 3: // Settings & Publishing
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
        break;
    }

    get().setStepValidation(currentStep, validation);
    return validation;
  },

  validateAllSteps: () => {
    const { courseData, contentByLecture } = get();
    const validations: StepValidation[] = [];

    // Validate step 0: Course Information
    const step0Validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    if (!courseData.title?.trim()) {
      step0Validation.errors.push("Course title is required");
      step0Validation.isValid = false;
    }
    if (!courseData.description?.trim()) {
      step0Validation.errors.push("Course description is required");
      step0Validation.isValid = false;
    }
    validations.push(step0Validation);

    // Validate step 1: Course Structure
    const step1Validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    if (!courseData.sections || courseData.sections.length === 0) {
      step1Validation.errors.push("Add at least one section");
      step1Validation.isValid = false;
    } else {
      const totalLectures = courseData.sections.reduce(
        (total, section) => total + (section.lectures?.length || 0),
        0
      );
      if (totalLectures === 0) {
        step1Validation.errors.push("Add at least one lecture");
        step1Validation.isValid = false;
      }
    }
    validations.push(step1Validation);

    // Validate step 2: Content Upload
    const step2Validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    const totalContent = Object.values(contentByLecture).reduce((total, lectureContent) => {
      return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
        return lectureTotal + contentArray.length;
      }, 0);
    }, 0);
    if (totalContent === 0) {
      step2Validation.errors.push("Upload some content for your course");
      step2Validation.isValid = false;
    }
    validations.push(step2Validation);

    // Validate step 3: Settings
    const step3Validation: StepValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };
    if (courseData.settings?.enrollmentType === "PAID" && (courseData.price || 0) <= 0) {
      step3Validation.errors.push("Set a price for paid courses");
      step3Validation.isValid = false;
    }
    if (courseData.settings?.enrollmentType === "FREE" && (courseData.price || 0) > 0) {
      step3Validation.errors.push("Free courses cannot have a price greater than 0");
      step3Validation.isValid = false;
    }
    validations.push(step3Validation);

    // Update all step validations
    set({ stepValidations: validations });

    return validations.every(validation => validation.isValid);
  },

  canNavigateToStep: (stepIndex) => {
    const { currentStep, stepValidations } = get();
    
    // Check if all steps are completed (all validations are true)
    const allStepsCompleted = stepValidations.every(validation => validation.isValid);
    
    // If all steps are completed, allow navigation to any step
    if (allStepsCompleted) {
      return true;
    }
    
    // Can always go to current step or previous steps
    if (stepIndex <= currentStep) return true;
    
    // Can go to next step only if current step is valid
    if (stepIndex === currentStep + 1) {
      return stepValidations[currentStep]?.isValid !== false;
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
    if (totalLectures > 0) completedFields++;

    // Content Upload (30%)
    const totalContent = Object.values(contentByLecture).reduce((total, lectureContent) => {
      return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
        return lectureTotal + contentArray.length;
      }, 0);
    }, 0);
    if (totalContent > 0) completedFields += 2;

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

  // Service actions
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
          // Validate each step to update validation state
          for (let i = 0; i <= 3; i++) {
            const state = get();
            const validation = state.validateCurrentStep();
            state.setStepValidation(i, validation);
          }
        }, 100);
      } else {
        console.log("No draft found, starting fresh");
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
      if (error instanceof Error && error.message !== "No draft found") {
        get().addGlobalError("Failed to load draft. Please try again.");
      }
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

    if (!validateAllSteps()) {
      get().addGlobalError("Please complete all required fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("Store: Preparing course data for submission...");
      console.log("Store: Course data:", courseData);
      console.log("Store: Content by lecture:", contentByLecture);

      // Prepare course data with organized content
      const courseWithContent = {
        ...courseData,
        organizedContent: {
          contentByLecture,
          totalContent: Object.values(contentByLecture).reduce((total, lectureContent) => {
            return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
              return lectureTotal + contentArray.length;
            }, 0);
          }, 0)
        }
      };

      console.log("Store: Course with content prepared:", courseWithContent);

      await service.submitCourse(courseWithContent);

     
        set({
          draftId: null,
          hasUnsavedChanges: false,
          lastSaved: new Date(),
        });

        get().addGlobalWarning("Course created successfully!");
        get().clearGlobalMessages();
    
    } catch (error) {
      console.error("Failed to submit course:", error);
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
        get().addGlobalWarning("Course published successfully!");
        set((state) => ({
          courseData: {
            ...state.courseData,
            status: "published",
            publishedAt: new Date(),
          },
        }));
      } else {
        result.errors?.forEach((error: string) => get().addGlobalError(error));
        result.warnings?.forEach((warning: string) => get().addGlobalWarning(warning));
        throw new Error(result.message || "Failed to publish course");
      }
    } catch (error) {
      console.error("Failed to publish course:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to publish course";
      if (!errorMessage.includes("Failed to publish course")) {
        get().addGlobalError("Failed to publish course. Please try again.");
      }
    } finally {
      setSubmitting(false);
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