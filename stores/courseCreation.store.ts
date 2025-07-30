/**
 * Course Creation Store
 * 
 * This store manages the course creation process including file uploads and course submission.
 * 
 * Authorization Setup:
 * The store methods accept an optional `authToken` parameter that should be obtained
 * from Clerk within React components using the `useAuth()` hook.
 * 
 * Example usage in a React component:
 * ```typescript
 * import { useAuth } from "@clerk/nextjs";
 * 
 * const { getToken } = useAuth();
 * const authToken = await getToken({ template: "expiration" });
 * await uploadFile(file, type, metadata, authToken);
 * ```
 * 
 * The authToken will be included in the Authorization header for all API requests.
 */

import { create } from "zustand";
import { CourseData, StepValidation } from "../features/course-creation/types";
import { CourseCreationService } from "../features/course-creation/services/graphql/courseCreationService";

// Enhanced interfaces
export interface TempUploadedFile {
  id: string; // temp upload ID from backend
  tempId: string; // frontend generated ID
  name: string;
  size: number;
  type: string;
  url: string;
  title: string;
  description?: string;
  contentType: string; // ContentType enum value
  section?: string;
  lecture?: string;
  uploadedAt: Date;
  status: 'uploading' | 'uploaded' | 'converting' | 'permanent' | 'error';
  serverData?: any;
}

interface PermanentUploadedFile extends TempUploadedFile {
  contentItemId?: string;
  order?: number;
  isPublished: boolean;
}

interface UploadProgress {
  [fileId: string]: {
    progress: number;
    status: "uploading" | "complete" | "error";
    fileName: string;
    fileSize: number;
  };
}

interface UploadedFiles {
  // Temporary uploads (during course creation)
  temp: {
    videos: TempUploadedFile[];
    documents: TempUploadedFile[];
    images: TempUploadedFile[];
    audio: TempUploadedFile[];
    archives: TempUploadedFile[];
    text: any[]; // Keep as is for text content
    assignments: any[]; // Keep as is for assignments
    resources: any[]; // Keep as is for resources
    quizzes: any[]; // Keep as is for quizzes
  };
  // Permanent uploads (after course creation)
  permanent: {
    videos: PermanentUploadedFile[];
    documents: PermanentUploadedFile[];
    images: PermanentUploadedFile[];
    audio: PermanentUploadedFile[];
    archives: PermanentUploadedFile[];
    text: any[];
    assignments: any[];
    resources: any[];
    quizzes: any[];
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

  // Validation
  stepValidations: StepValidation[];
  globalErrors: string[];
  globalWarnings: string[];

  // Enhanced upload state
  uploadProgress: UploadProgress;
  uploadedFiles: UploadedFiles;
  isUploading: boolean;

  // Preview state
  showPreview: boolean;
  showAssistant: boolean;

  // Service
  service: CourseCreationService | null;

  // Basic actions
  updateCourseData: (data: Partial<CourseData>) => void;
  setCurrentStep: (step: number) => void;
  setStepValidation: (stepIndex: number, validation: StepValidation) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setLastSaved: (date: Date) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  addGlobalError: (error: string) => void;
  removeGlobalError: (error: string) => void;
  addGlobalWarning: (warning: string) => void;
  removeGlobalWarning: (warning: string) => void;
  clearGlobalMessages: () => void;
  clearStepValidationWarnings: () => void;

  // Enhanced upload actions
  setUploadProgress: (fileId: string, progress: Partial<UploadProgress[string]>) => void;
  removeUpload: (fileId: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  
  // Temporary upload actions
  addTempUploadedFile: (type: string, file: TempUploadedFile) => void;
  removeTempUploadedFile: (type: string, fileId: string) => void;
  updateTempUploadedFile: (type: string, fileId: string, updates: Partial<TempUploadedFile>) => void;
  
  // Permanent upload actions
  addPermanentUploadedFile: (type: string, file: PermanentUploadedFile) => void;
  removePermanentUploadedFile: (type: string, fileId: string) => void;
  
  // Legacy upload actions (for backward compatibility)
  addUploadedFile: (type: string, file: any) => void;
  removeUploadedFile: (type: string, fileId: string) => void;
  
  // Convert temp to permanent
  convertTempToPermanent: (tempFileId: string, courseId: string, lessonId?: string, authToken?: string) => Promise<void>;
  
  // Batch operations
  convertAllTempToPermanent: (courseId: string, authToken?: string) => Promise<void>;
  clearAllTempUploads: () => void;
  
  // File upload methods
  uploadFile: (file: File, type: string, metadata: {
    title: string;
    description?: string;
    section?: string;
    lecture?: string;
  }, authToken?: string) => Promise<void>;
  
  // Non-file content methods
  createTextContent: (data: {
    title: string;
    content: string;
    description?: string;
    section: string;
    lecture: string;
  }) => void;
  
  createAssignment: (data: {
    title: string;
    description: string;
    instructions?: string;
    dueDate?: string;
    points?: number;
    section: string;
    lecture: string;
  }) => void;
  
  createResource: (data: {
    title: string;
    description?: string;
    url: string;
    resourceType: string;
    section: string;
    lecture: string;
  }) => void;

  // Preview actions
  setShowPreview: (show: boolean) => void;
  setShowAssistant: (show: boolean) => void;

  // Service actions
  setService: (service: CourseCreationService) => void;

  // Draft actions
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  submitCourse: (authToken?: string) => Promise<void>;
  publishCourse: () => Promise<void>;

  // Utility actions
  reset: () => void;
  canNavigateToStep: (stepIndex: number) => boolean;
  calculateProgress: () => number;
  validateCurrentStep: () => StepValidation;
  validateAllSteps: () => boolean;
  
  // Validate all steps without changing current step
  validateAllStepsWithoutChangingStep: () => void;
  
  // Validate steps based on actual completion status (for draft loading)
  validateStepsForCompletion: () => void;
  
  // Cleanup actions
  cleanupTempUploads: () => Promise<void>;
  restoreTempUploadsFromDraft: (tempUploads: any[]) => void;
}

const initialCourseData: CourseData = {
  title: "",
  description: "",
  category: "",
  level: "beginner",
  thumbnail: undefined,
  price: 0,
  objectives: [""],
  prerequisites: [""],
  sections: [],
  settings: {
    isPublic: true,
    enrollmentType: "free",
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
  { isValid: false, errors: ["title", "description"], warnings: [] }, // Course Information
  { isValid: false, errors: ["sections"], warnings: [] }, // Course Structure
  { isValid: false, errors: ["content"], warnings: [] }, // Content Upload
  { isValid: true, errors: [], warnings: [] }, // Settings & Publishing
];

const initialUploadedFiles: UploadedFiles = {
  temp: {
    videos: [],
    documents: [],
    images: [],
    audio: [],
    archives: [],
    text: [],
    assignments: [],
    resources: [],
    quizzes: [],
  },
  permanent: {
    videos: [],
    documents: [],
    images: [],
    audio: [],
    archives: [],
    text: [],
    assignments: [],
    resources: [],
    quizzes: [],
  }
};

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
    uploadedFiles: initialUploadedFiles,
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

    setCurrentStep: (step) => {
      set({ currentStep: step });
    },

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
    setHasUnsavedChanges: (hasChanges) =>
      set({ hasUnsavedChanges: hasChanges }),

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
        globalWarnings: [
          ...state.globalWarnings.filter((w) => w !== warning),
          warning,
        ],
      }));
    },

    removeGlobalWarning: (warning) => {
      set((state) => ({
        globalWarnings: state.globalWarnings.filter((w) => w !== warning),
      }));
    },

    clearGlobalMessages: () => {
      set({ globalErrors: [], globalWarnings: [] });
    },

    // Clear all step validation warnings
    clearStepValidationWarnings: () => {
      set((state) => {
        const newValidations = state.stepValidations.map(validation => ({
          ...validation,
          warnings: []
        }));
        return { stepValidations: newValidations };
      });
    },

    // Enhanced upload actions
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

    // Temporary upload actions
    addTempUploadedFile: (type, file) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          temp: {
            ...state.uploadedFiles.temp,
            [type]: [...state.uploadedFiles.temp[type as keyof typeof state.uploadedFiles.temp], file],
          },
        },
        hasUnsavedChanges: true,
      }));
    },

    removeTempUploadedFile: (type, fileId) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          temp: {
            ...state.uploadedFiles.temp,
            [type]: state.uploadedFiles.temp[type as keyof typeof state.uploadedFiles.temp]
              .filter((file: any) => file.id !== fileId && file.tempId !== fileId),
          },
        },
        hasUnsavedChanges: true,
      }));
    },

    updateTempUploadedFile: (type, fileId, updates) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          temp: {
            ...state.uploadedFiles.temp,
            [type]: state.uploadedFiles.temp[type as keyof typeof state.uploadedFiles.temp]
              .map((file: any) => 
                file.id === fileId || file.tempId === fileId 
                  ? { ...file, ...updates }
                  : file
              ),
          },
        },
      }));
    },

    // Permanent upload actions
    addPermanentUploadedFile: (type, file) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          permanent: {
            ...state.uploadedFiles.permanent,
            [type]: [...state.uploadedFiles.permanent[type as keyof typeof state.uploadedFiles.permanent], file],
          },
        },
      }));
    },

    removePermanentUploadedFile: (type, fileId) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          permanent: {
            ...state.uploadedFiles.permanent,
            [type]: state.uploadedFiles.permanent[type as keyof typeof state.uploadedFiles.permanent]
              .filter((file: any) => file.id !== fileId),
          },
        },
      }));
    },

    // Legacy upload actions (for backward compatibility)
    addUploadedFile: (type, file) => {
      // Delegate to temp uploads for now
      get().addTempUploadedFile(type, file);
    },

    removeUploadedFile: (type, fileId) => {
      // Remove from both temp and permanent
      get().removeTempUploadedFile(type, fileId);
      get().removePermanentUploadedFile(type, fileId);
    },

    // File upload method
    uploadFile: async (file, type, metadata, authToken?: string) => {
      const tempId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("authToken", authToken)
      try {
        // Initialize upload progress
        get().setUploadProgress(tempId, {
          progress: 0,
          status: "uploading",
          fileName: file.name,
          fileSize: file.size,
        });

      console.log("file",file)
      console.log("type", type)
        
        get().setIsUploading(true);

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', metadata.title);
        formData.append('tempId', tempId);
        if (metadata.section) {
          formData.append('section', metadata.section);
        }
        if (metadata.lecture) {
          formData.append('lecture', metadata.lecture);
        }
        if (metadata.description) {
          formData.append('description', metadata.description);
        }

        // Determine endpoint based on type
        let endpoint = '';
        switch (type) {
          case 'videos':
            endpoint = '/upload/temp/video';
            break;
          case 'documents':
            endpoint = '/upload/temp/document';
            break;
          case 'images':
            endpoint = '/upload/temp/image';
            break;
          case 'audio':
            endpoint = '/upload/temp/audio';
            break;
          case 'archives':
            endpoint = '/upload/temp/archive';
            break;
          default:
            endpoint = '/upload/temp/batch';
            formData.append('contentType', type.toUpperCase().slice(0, -1)); // Remove 's' and uppercase
        }

        // Upload file
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers: Record<string, string> = {};
        
        // Add authorization header if token is provided
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          body: formData,
          headers,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Update progress to complete
        get().setUploadProgress(tempId, {
          progress: 100,
          status: "complete",
        });

        // Add to temp uploaded files
        const tempUploadedFile: TempUploadedFile = {
          id: result.tempUpload.id,
          tempId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.file_url,
          title: metadata.title,
          description: metadata.description,
          contentType: type.toUpperCase().slice(0, -1), // Remove 's' and uppercase
          section: metadata.section,
          lecture: metadata.lecture,
          uploadedAt: new Date(),
          status: 'uploaded',
          serverData: result,
        };

        get().addTempUploadedFile(type, tempUploadedFile);

        console.log("tempUploadedFile", get().uploadedFiles.temp)

        // Remove from progress after delay
        setTimeout(() => {
          get().removeUpload(tempId);
        }, 3000);

      } catch (error) {
        console.error('Upload failed:', error);
        get().setUploadProgress(tempId, {
          progress: 0,
          status: "error",
        });
        get().addGlobalError(`Failed to upload ${file.name}`);

        // Remove failed upload after delay
        setTimeout(() => {
          get().removeUpload(tempId);
        }, 5000);
      } finally {
        get().setIsUploading(false);
      }
    },

    // Convert temp to permanent
    convertTempToPermanent: async (tempFileId, courseId, lessonId, authToken?: string) => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add authorization header if token is provided
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`/upload/convert/${tempFileId}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            courseId,
            lessonId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to convert temporary upload');
        }

        const result = await response.json();
        
        // Find and update the temp file
        const state = get();
        for (const [type, files] of Object.entries(state.uploadedFiles.temp)) {
          const fileIndex = files.findIndex((f: any) => f.id === tempFileId);
          if (fileIndex !== -1) {
            const tempFile = files[fileIndex];
            
            // Update temp file status
            get().updateTempUploadedFile(type, tempFileId, {
              status: 'permanent',
            });

            // Add to permanent files
            const permanentFile: PermanentUploadedFile = {
              ...tempFile,
              contentItemId: result.contentItem.id,
              isPublished: true,
              status: 'permanent',
            };

            get().addPermanentUploadedFile(type, permanentFile);
            break;
          }
        }

      } catch (error) {
        console.error('Failed to convert temp upload:', error);
        get().addGlobalError('Failed to convert temporary upload');
      }
    },

    // Convert all temp to permanent
    convertAllTempToPermanent: async (courseId, authToken?: string) => {
      const state = get();
      const allTempFiles: Array<{ file: TempUploadedFile; type: string }> = [];

      // Collect all temp files
      for (const [type, files] of Object.entries(state.uploadedFiles.temp)) {
        files.forEach((file: any) => {
          if (file.status === 'uploaded') {
            allTempFiles.push({ file, type });
          }
        });
      }

      console.log("Converting temp files to permanent:", allTempFiles);

      // Group files by lecture for better organization
      const filesByLecture: Record<string, Array<{ file: TempUploadedFile; type: string }>> = {};
      
      allTempFiles.forEach(({ file, type }) => {
        const lectureKey = `${file.section}-${file.lecture}`;
        if (!filesByLecture[lectureKey]) {
          filesByLecture[lectureKey] = [];
        }
        filesByLecture[lectureKey].push({ file, type });
      });

      // Convert files for each lecture
      for (const [lectureKey, files] of Object.entries(filesByLecture)) {
        const [sectionId, lectureId] = lectureKey.split('-');
        
        // Find the actual lecture in the course structure
        const section = state.courseData.sections?.find(s => s.id === sectionId);
        const lecture = section?.lectures?.find(l => l.id === lectureId);
        
        if (!lecture) {
          console.warn(`Lecture not found for key: ${lectureKey}`);
          continue;
        }

        console.log(`Converting files for lecture: ${lecture.title}`);

        // Convert each file for this lecture
        for (const { file, type } of files) {
          try {
            await get().convertTempToPermanent(file.id, courseId, lecture.id, authToken);
            console.log(`Successfully converted ${type} file: ${file.title}`);
          } catch (error) {
            console.error(`Failed to convert ${type} file: ${file.title}`, error);
            get().addGlobalError(`Failed to convert ${file.title}`);
          }
        }
      }

      console.log("Finished converting all temp files to permanent");
    },

    // Non-file content methods
    createTextContent: (data) => {
      const textId = `text-${Date.now()}`;
      const textContent = {
        id: textId,
        title: data.title,
        content: data.content,
        description: data.description,
        section: data.section,
        lecture: data.lecture,
        createdAt: new Date(),
        type: "text",
      };

      get().addTempUploadedFile("text", textContent as any);
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
        section: data.section,
        lecture: data.lecture,
        createdAt: new Date(),
        type: "assignment",
      };

      get().addTempUploadedFile("assignments", assignment as any);
    },

    createResource: (data) => {
      const resourceId = `resource-${Date.now()}`;
      const resource = {
        id: resourceId,
        title: data.title,
        description: data.description,
        url: data.url,
        resourceType: data.resourceType,
        section: data.section,
        lecture: data.lecture,
        createdAt: new Date(),
        type: "resource",
      };

      get().addTempUploadedFile("resources", resource as any);
    },

    // Cleanup actions
    clearAllTempUploads: () => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          temp: initialUploadedFiles.temp,
        },
      }));
    },

    cleanupTempUploads: async () => {
      try {
        await fetch('/upload/temp/cleanup', {
          method: 'DELETE',
        });
        get().clearAllTempUploads();
      } catch (error) {
        console.error('Failed to cleanup temp uploads:', error);
      }
    },

    // Preview actions
    setShowPreview: (show) => set({ showPreview: show }),
    setShowAssistant: (show) => set({ showAssistant: show }),

    // Service actions
    setService: (service) => set({ service }),

    // Validation utilities
    validateCurrentStep: () => {
      const { currentStep, courseData } = get();
      const validation: StepValidation = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      switch (currentStep) {
        case 0: // Course Information
          if (!courseData.title?.trim()) {
            validation.errors.push("title");
            validation.isValid = false;
          }
          if (!courseData.description?.trim()) {
            validation.errors.push("description");
            validation.isValid = false;
          }
          
          // Only show warnings if user has started filling the form
          const hasStartedFilling = courseData.title?.trim() || courseData.description?.trim();
          
          if (hasStartedFilling) {
            if (!courseData.category) {
              validation.warnings.push("Category selection recommended");
            }
            if (
              courseData.title &&
              courseData.title.length > 0 &&
              courseData.title.length < 10
            ) {
              validation.warnings.push("Consider a more descriptive title");
            }
          }
          break;

        case 1: // Course Structure
          // Check if user has started creating sections
          const hasStartedStructure = courseData.sections && courseData.sections.length > 0;
          
          // For step 1, we consider it valid if user has started working on it
          // but we'll show warnings for incomplete sections
          if (!courseData.sections || courseData.sections.length === 0) {
            // If user is on step 1 but hasn't created any sections, show warning
            if (currentStep === 1) {
              validation.warnings.push(
                "Add at least one section to organize your content"
              );
            }
          } else {
            // Check if sections have lectures
            const totalLectures = courseData.sections.reduce(
              (total, section) => total + (section.lectures?.length || 0),
              0
            );
            if (totalLectures === 0) {
              validation.warnings.push("Add lectures to your sections");
            }
          }
          
          // Step 1 is considered valid if user has started working on it
          // (has sections) or if they haven't reached this step yet
          if (currentStep === 1 && (!courseData.sections || courseData.sections.length === 0)) {
            // Only mark as invalid if user is actively on step 1 and has no sections
            validation.isValid = false;
            validation.errors.push("sections");
          }
          break;

        case 2: // Content Upload
          const { uploadedFiles } = get();
          const totalTempContent = Object.values(uploadedFiles.temp).reduce(
            (total, files) => total + files.length,
            0
          );
          const totalPermanentContent = Object.values(uploadedFiles.permanent).reduce(
            (total, files) => total + files.length,
            0
          );
          
          // Check if user has started the upload process
          const hasStartedUpload = totalTempContent > 0 || totalPermanentContent > 0;
          
          if (totalTempContent === 0 && totalPermanentContent === 0) {
            // If user is on step 2 but hasn't uploaded any content, show warning
            if (currentStep === 2) {
              validation.warnings.push("Upload some content for your course");
            }
          }
          
          // Step 2 is considered valid if user has started working on it
          // (has uploaded content) or if they haven't reached this step yet
          if (currentStep === 2 && totalTempContent === 0 && totalPermanentContent === 0) {
            // Only mark as invalid if user is actively on step 2 and has no content
            validation.isValid = false;
            validation.errors.push("content");
          }
          break;

        case 3: // Settings & Publishing
          if (
            courseData.settings?.enrollmentType === "paid" &&
            courseData.price <= 0
          ) {
            validation.errors.push("pricing");
            validation.isValid = false;
          }
          break;
      }

      // Update the validation in store
      get().setStepValidation(currentStep, validation);
      return validation;
    },

    validateAllSteps: () => {
      const { stepValidations } = get();
      return stepValidations.every((validation) => validation.isValid);
    },

    // Validate all steps without changing current step
    validateAllStepsWithoutChangingStep: () => {
      const { currentStep } = get();
      const originalStep = currentStep;
      
      // Validate all steps
      for (let i = 0; i < 4; i++) {
        get().setCurrentStep(i);
        get().validateCurrentStep();
      }
      
      // Restore original step
      get().setCurrentStep(originalStep);
    },

    // Validate steps based on actual completion status (for draft loading)
    validateStepsForCompletion: () => {
      const { courseData, currentStep } = get();
      
      // Step 0: Course Information - valid if title and description exist
      const step0Valid = !!(courseData.title?.trim() && courseData.description?.trim());
      get().setStepValidation(0, {
        isValid: step0Valid,
        errors: step0Valid ? [] : ["title", "description"],
        warnings: []
      });
      
      // Step 1: Course Structure - valid if sections exist AND user has reached this step
      const step1Valid = !!(courseData.sections && courseData.sections.length > 0);
      get().setStepValidation(1, {
        isValid: step1Valid,
        errors: step1Valid ? [] : ["sections"],
        warnings: []
      });
      
      // Step 2: Content Upload - valid if content exists AND user has reached this step
      const { uploadedFiles } = get();
      const totalContent = Object.values(uploadedFiles.temp).reduce(
        (total, files) => total + files.length,
        0
      ) + Object.values(uploadedFiles.permanent).reduce(
        (total, files) => total + files.length,
        0
      );
      const step2Valid = totalContent > 0;
      get().setStepValidation(2, {
        isValid: step2Valid,
        errors: step2Valid ? [] : ["content"],
        warnings: []
      });
      
      // Step 3: Settings - always valid (no required fields)
      get().setStepValidation(3, {
        isValid: true,
        errors: [],
        warnings: []
      });
    },

    canNavigateToStep: (stepIndex) => {
      const { currentStep, stepValidations } = get();

      // Can always go to current step or previous steps
      if (stepIndex <= currentStep) return true;

      // Can go to next step only if current step is valid
      if (stepIndex === currentStep + 1) {
        return stepValidations[currentStep]?.isValid !== false;
      }

      return false;
    },

    calculateProgress: () => {
      const { courseData, uploadedFiles } = get();
      let totalFields = 0;
      let completedFields = 0;

      // Course Information (40% weight)
      totalFields += 6;
      if (courseData.title?.trim()) completedFields++;
      if (courseData.description?.trim()) completedFields++;
      if (courseData.category) completedFields++;
      if (courseData.level) completedFields++;
      if (courseData.objectives?.some((obj) => obj.trim())) completedFields++;
      if (courseData.thumbnail) completedFields++;

      // Course Structure (25% weight)
      totalFields += 2;
      if (courseData.sections?.length > 0) completedFields++;
      const totalLectures =
        courseData.sections?.reduce(
          (total, section) => total + (section.lectures?.length || 0),
          0
        ) || 0;
      if (totalLectures > 0) completedFields++;

      // Content Upload (25% weight)
      totalFields += 2;
      const totalTempContent = Object.values(uploadedFiles.temp).reduce(
        (total, files) => total + files.length,
        0
      );
      const totalPermanentContent = Object.values(uploadedFiles.permanent).reduce(
        (total, files) => total + files.length,
        0
      );
      if (totalTempContent > 0 || totalPermanentContent > 0) completedFields += 2;

      // Settings (10% weight)
      totalFields += 1;
      if (
        courseData.settings?.enrollmentType === "free" ||
        (courseData.settings?.enrollmentType === "paid" && courseData.price > 0)
      ) {
        completedFields++;
      }

      return Math.round((completedFields / totalFields) * 100);
    },

    // API actions (implemented with GraphQL)
    saveDraft: async () => {
      const {
        courseData,
        currentStep,
        calculateProgress,
        setSaving,
        setLastSaved,
        service,
        uploadedFiles,
      } = get();

      console.log("saveDraft called");
      console.log("Service in saveDraft:", service);
      console.log("Service type:", typeof service);

      if (!service) {
        console.error("Service not initialized in saveDraft");
        get().addGlobalError("Service not initialized. Please try again.");
        return;
      }

      try {
        setSaving(true);
        console.log("Saving draft with service:", service);

        // Collect all temporary uploads for saving with draft
        const allTempUploads: any[] = [];
        Object.entries(uploadedFiles.temp).forEach(([type, files]) => {
          files.forEach((file: any) => {
            allTempUploads.push({
              ...file,
              type: type, // Add the type for restoration
              uploadedAt: file.uploadedAt instanceof Date ? file.uploadedAt.toISOString() : file.uploadedAt,
            });
          });
        });

        const result = await service.saveDraft(
          courseData,
          currentStep,
          calculateProgress(),
          allTempUploads // Pass temp uploads to service
        );

        if (result.success) {
          set({
            draftId: result.draftId || null,
            hasUnsavedChanges: false,
          });
          setLastSaved(new Date());
          console.log("Draft saved successfully");
        } else {
          throw new Error(result.message || "Failed to save draft");
        }
      } catch (error) {
        console.error("Failed to save draft:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save draft";
        get().addGlobalError(errorMessage);
      } finally {
        setSaving(false);
      }
    },

    loadDraft: async () => {
      const { setLoading, service } = get();

      console.log("loadDraft called, service:", service);

      if (!service) {
        console.error("Service not initialized in loadDraft");
        get().addGlobalError("Service not initialized. Please try again.");
        return;
      }

      try {
        setLoading(true);
        console.log("Loading draft...");

        const result = await service.loadDraft();
        console.log("Draft load result:", result);

        if (result.success) {
          // Extract temp uploads from draft data if available
          const { _tempUploads, _uploadSummary, ...courseData } = result.draftData;
          
          set({
            courseData: courseData,
            currentStep: result.currentStep || 0,
            draftId: result.draftId || null,
            hasUnsavedChanges: false,
            lastSaved: result.lastSaved,
          });

          // Restore temporary uploaded files if they exist in draft
          if (_tempUploads && Array.isArray(_tempUploads)) {
            get().restoreTempUploadsFromDraft(_tempUploads);
          }

          console.log("Draft loaded successfully");
          
          // Clear validation warnings if the loaded draft has valid data
          const hasValidData = courseData.title?.trim() && courseData.description?.trim();
          if (hasValidData) {
            get().clearStepValidationWarnings();
            
            // Trigger validation for all steps after loading draft to clear warnings if data is valid
            setTimeout(() => {
              get().validateStepsForCompletion();
            }, 100);
          } else {
            // If no valid draft data, reset all step validations to incomplete
            get().clearStepValidationWarnings();
            for (let i = 0; i < 4; i++) {
              get().setStepValidation(i, {
                isValid: false,
                errors: i === 0 ? ["title", "description"] : i === 1 ? ["sections"] : i === 2 ? ["content"] : [],
                warnings: []
              });
            }
          }
        } else {
          throw new Error("Failed to load draft");
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load draft";
        // Don't show error for empty drafts
        if (errorMessage !== "No draft found") {
          get().addGlobalError("Failed to load draft. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },

    submitCourse: async (authToken?: string) => {
      const { courseData, setSubmitting, validateAllSteps, service, convertAllTempToPermanent, cleanupTempUploads } = get();

      if (!service) {
        get().addGlobalError("Service not initialized. Please try again.");
        return;
      }

      if (!validateAllSteps()) {
        get().addGlobalError(
          "Please complete all required fields before submitting."
        );
        return;
      }

      try {
        setSubmitting(true);

        const result = await service.submitCourse(courseData);

        if (result.success) {
          // Convert all temporary uploads to permanent if course was created successfully
          if (result.course?.id) {
            await convertAllTempToPermanent(result.course.id, authToken);
          }

          // Clear draft after successful submission
          set({
            draftId: null,
            hasUnsavedChanges: false,
            lastSaved: new Date(),
          });

          get().addGlobalWarning("Course created successfully!");

          // Clean up temporary uploads
          await cleanupTempUploads();

          // Optionally delete the draft after successful course creation
          try {
            await service.deleteDraft();
          } catch (draftDeleteError) {
            console.warn(
              "Failed to delete draft after course creation:",
              draftDeleteError
            );
          }
        } else {
          // Handle errors and warnings from the response
          result.errors?.forEach((error: string) =>
            get().addGlobalError(error)
          );
          result.warnings?.forEach((warning: string) =>
            get().addGlobalWarning(warning)
          );

          throw new Error(result.message || "Failed to create course");
        }
      } catch (error) {
        console.error("Failed to submit course:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to submit course";
        if (!errorMessage.includes("Failed to create course")) {
          get().addGlobalError("Failed to create course. Please try again.");
        }
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

          // Update course data with published status
          set((state) => ({
            courseData: {
              ...state.courseData,
              status: "published",
              publishedAt: new Date(),
            },
          }));
        } else {
          // Handle errors and warnings from the response
          result.errors?.forEach((error: string) =>
            get().addGlobalError(error)
          );
          result.warnings?.forEach((warning: string) =>
            get().addGlobalWarning(warning)
          );

          throw new Error(result.message || "Failed to publish course");
        }
      } catch (error) {
        console.error("Failed to publish course:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to publish course";
        if (!errorMessage.includes("Failed to publish course")) {
          get().addGlobalError("Failed to publish course. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },

    // Reset everything
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
        uploadedFiles: initialUploadedFiles,
        showPreview: false,
        showAssistant: false,
        service: null,
        isUploading: false,
      });
    },

    restoreTempUploadsFromDraft: (tempUploads: any[]) => {
      console.log("Restoring temp uploads from draft:", tempUploads);
      
      tempUploads.forEach(tempFile => {
        try {
          // Use the type field that was added when saving the draft
          const type = tempFile.type?.toLowerCase();
          
          if (!type) {
            console.warn("Temp file missing type field:", tempFile);
            return;
          }

          const file: TempUploadedFile = {
            id: tempFile.id,
            tempId: tempFile.tempId,
            name: tempFile.name,
            size: tempFile.size,
            type: tempFile.mimeType || tempFile.type, // Use mimeType if available
            url: tempFile.url,
            title: tempFile.title,
            description: tempFile.description,
            contentType: tempFile.contentType,
            section: tempFile.section,
            lecture: tempFile.lecture,
            uploadedAt: new Date(tempFile.uploadedAt),
            status: tempFile.status || 'uploaded',
            serverData: tempFile,
          };

          console.log(`Restoring ${type} file:`, file.title);
          get().addTempUploadedFile(type, file);
        } catch (error) {
          console.error("Error restoring temp file:", tempFile, error);
        }
      });
      
      console.log("Finished restoring temp uploads");
    }
  })
);

// Auto-save functionality - disabled to prevent infinite loops
// useCourseCreationStore.subscribe(
//   (state) => state.hasUnsavedChanges,
//   (hasUnsavedChanges, previousHasUnsavedChanges) => {
//     if (hasUnsavedChanges && !previousHasUnsavedChanges) {
//       // Start auto-save timer
//       setTimeout(() => {
//         const state = useCourseCreationStore.getState();
//         if (state.hasUnsavedChanges && !state.isSaving) {
//           state.saveDraft();
//         }
//       }, 30000); // Auto-save every 30 seconds
//     }
//   }
// );

// Validate current step when course data changes - disabled to prevent infinite loops
// useCourseCreationStore.subscribe(
//   (state) => state.courseData,
//   () => {
//     const state = useCourseCreationStore.getState();
//     state.validateCurrentStep();
//   }
// );