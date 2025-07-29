import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CourseData, StepValidation } from "../features/course-creation/types";
import { CourseCreationService } from "../features/course-creation/services/graphql/courseCreationService";

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

  // Validation
  stepValidations: StepValidation[];
  globalErrors: string[];
  globalWarnings: string[];

  // Upload state
  uploadProgress: UploadProgress;
  uploadedFiles: {
    videos: any[];
    documents: any[];
    images: any[];
    text: any[];
    assignments: any[];
    resources: any[];
    quizzes: any[];
  };

  // Preview state
  showPreview: boolean;
  showAssistant: boolean;

  // Service
  service: CourseCreationService | null;

  // Actions
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

  // Upload actions
  setUploadProgress: (
    fileId: string,
    progress: Partial<UploadProgress[string]>
  ) => void;
  removeUpload: (fileId: string) => void;
  addUploadedFile: (type: string, file: any) => void;
  removeUploadedFile: (type: string, fileId: string) => void;

  // Preview actions
  setShowPreview: (show: boolean) => void;
  setShowAssistant: (show: boolean) => void;

  // Service actions
  setService: (service: CourseCreationService) => void;

  // Draft actions
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  submitCourse: () => Promise<void>;
  publishCourse: () => Promise<void>;

  // Utility actions
  reset: () => void;
  canNavigateToStep: (stepIndex: number) => boolean;
  calculateProgress: () => number;
  validateCurrentStep: () => StepValidation;
  validateAllSteps: () => boolean;
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
  { isValid: false, errors: [], warnings: [] }, // Course Information
  { isValid: true, errors: [], warnings: [] }, // Course Structure
  { isValid: true, errors: [], warnings: [] }, // Content Upload
  { isValid: true, errors: [], warnings: [] }, // Settings & Publishing
];

export const useCourseCreationStore = create<CourseCreationState>()(
  subscribeWithSelector((set, get) => ({
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
    uploadedFiles: {
      videos: [],
      documents: [],
      images: [],
      text: [],
      assignments: [],
      resources: [],
      quizzes: [],
    },
    showPreview: false,
    showAssistant: false,
    service: null,

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

    addUploadedFile: (type, file) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          [type]: [
            ...state.uploadedFiles[type as keyof typeof state.uploadedFiles],
            file,
          ],
        },
        hasUnsavedChanges: true,
      }));
    },

    removeUploadedFile: (type, fileId) => {
      set((state) => ({
        uploadedFiles: {
          ...state.uploadedFiles,
          [type]: state.uploadedFiles[
            type as keyof typeof state.uploadedFiles
          ].filter((file: any) => file.id !== fileId),
        },
        hasUnsavedChanges: true,
      }));
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
          break;

        case 1: // Course Structure
          if (!courseData.sections || courseData.sections.length === 0) {
            validation.warnings.push(
              "Add at least one section to organize your content"
            );
          } else {
            const totalLectures = courseData.sections.reduce(
              (total, section) => total + (section.lectures?.length || 0),
              0
            );
            if (totalLectures === 0) {
              validation.warnings.push("Add lectures to your sections");
            }
          }
          break;

        case 2: // Content Upload
          const { uploadedFiles } = get();
          const totalContent = Object.values(uploadedFiles).reduce(
            (total, files) => total + files.length,
            0
          );
          if (totalContent === 0) {
            validation.warnings.push("Upload some content for your course");
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
      const totalContent = Object.values(uploadedFiles).reduce(
        (total, files) => total + files.length,
        0
      );
      if (totalContent > 0) completedFields += 2;

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
      } = get();

      if (!service) {
        get().addGlobalError("Service not initialized. Please try again.");
        return;
      }

      try {
        setSaving(true);

        const result = await service.saveDraft(
          courseData,
          currentStep,
          calculateProgress()
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
          set({
            courseData: result.draftData,
            currentStep: result.currentStep || 0,
            draftId: result.draftId || null,
            hasUnsavedChanges: false,
            lastSaved: result.lastSaved,
          });
          console.log("Draft loaded successfully");
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

    submitCourse: async () => {
      const { courseData, setSubmitting, validateAllSteps, service } = get();

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
          // Clear draft after successful submission
          set({
            draftId: null,
            hasUnsavedChanges: false,
            lastSaved: new Date(),
          });

          get().addGlobalWarning("Course created successfully!");

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
        uploadedFiles: {
          videos: [],
          documents: [],
          images: [],
          text: [],
          assignments: [],
          resources: [],
          quizzes: [],
        },
        showPreview: false,
        showAssistant: false,
        service: null,
      });
    },
  }))
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
