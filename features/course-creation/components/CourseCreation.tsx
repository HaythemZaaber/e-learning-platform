"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  AlertCircle,
  BookOpen,
  Users,
  Clock,
  Target,
  Sparkles,
  Eye,
  Bot,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Globe,
  X,
} from "lucide-react";
import { CoursePreview } from "./CoursePreview";
import { CourseInformation } from "./steps/CourseInformation";
import { CourseStructure } from "./steps/CourseStructure";
import { ContentUpload } from "./steps/ContentUpload";
import { SmartAssistant } from "./SmartAssistant";
import { CourseSettings } from "./steps/CourseSettings";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";
import { useCourseCreationWithGraphQL } from "../hooks/useCourseCreationWithGraphQL";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Section } from "../types";

const steps = [
  {
    id: "information",
    title: "Course Information",
    description: "Basic details about your course",
    icon: BookOpen,
  },
  {
    id: "structure",
    title: "Course Structure",
    description: "Organization and curriculum",
    icon: Target,
  },
  {
    id: "content",
    title: "Content Upload",
    description: "Add your course materials",
    icon: Users,
  },
  {
    id: "settings",
    title: "Settings & Publishing",
    description: "Final configuration",
    icon: Sparkles,
  },
];

export default function CourseCreation() {
  const topRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const {
    courseData,
    currentStep,
    isLoading,
    isSaving,
    isSubmitting,
    lastSaved,
    hasUnsavedChanges,
    stepValidations,
    globalErrors,
    globalWarnings,
    showPreview,
    showAssistant,

    // Actions
    updateCourseData,
    setCurrentStep,
    setShowPreview,
    setShowAssistant,
    validateCurrentStep,
    validateAllSteps,
    canNavigateToStep,
    calculateProgress,
    saveDraft,
    loadDraft,
    submitCourse,
    publishCourse,
    addGlobalError,
    removeGlobalError,
    clearGlobalMessages,
  } = useCourseCreationStore();

  const { getToken } = useAuth();

  // Get only the service initialization status from the custom hook
  const { isServiceInitialized } = useCourseCreationWithGraphQL();

  console.log("courseData", courseData);

  // Initialize component
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load draft when service is initialized - fixed to prevent infinite loops
  useEffect(() => {
    if (mounted && isServiceInitialized && !isLoading) {
      console.log("Service initialized, loading draft...");
      loadDraft().catch((error) => {
        console.error("Failed to load draft:", error);
      });
    }
  }, [mounted, isServiceInitialized]); // Removed loadDraft and isLoading from dependencies

  // Clear validation warnings when draft is loaded and has valid data
  useEffect(() => {
    if (mounted && isServiceInitialized && !isLoading && courseData) {
      // Clear validation warnings for step 0 (Course Information) if required fields are filled
      if (currentStep === 0) {
        const hasValidTitle = courseData.title && courseData.title.trim().length > 0;
        const hasValidDescription = courseData.description && courseData.description.trim().length > 0;
        
        if (hasValidTitle && hasValidDescription) {
          // Clear step validation warnings and validate all steps
          const { clearStepValidationWarnings, validateStepsForCompletion } = useCourseCreationStore.getState();
          clearStepValidationWarnings();
          validateStepsForCompletion();
        }
      }
    }
  }, [mounted, isServiceInitialized, isLoading, courseData, currentStep]);

  // Validate current step when course data changes
  useEffect(() => {
    if (mounted && isServiceInitialized) {
      validateCurrentStep();
    }
  }, [courseData, validateCurrentStep, mounted, isServiceInitialized]);

  // Handle notifications
  useEffect(() => {
    globalErrors.forEach((error: string) => {
      toast.error(error, {
        action: {
          label: "Dismiss",
          onClick: () => removeGlobalError(error),
        },
      });
    });
  }, [globalErrors, removeGlobalError]);

  useEffect(() => {
    globalWarnings.forEach((warning: string) => {
      toast.success(warning, {
        duration: 5000,
      });
    });
  }, [globalWarnings]);

  // const handleAutoSave = useCallback(async () => {
  //   try {
  //     await saveDraft();
  //     toast.success("Draft saved automatically", { duration: 2000 });
  //   } catch (error) {
  //     console.error("Auto-save failed:", error);
  //   }
  // }, [saveDraft]);

  const handleManualSave = useCallback(async () => {
    try {
      await saveDraft();
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Manual save failed:", error);
    }
  }, [saveDraft]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      toast.error("Please fix all errors before proceeding");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep, setCurrentStep, validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep, setCurrentStep]);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (canNavigateToStep(stepIndex)) {
        setCurrentStep(stepIndex);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [canNavigateToStep, setCurrentStep]
  );

  const handleSubmitCourse = useCallback(async () => {
    // Validate all steps before submission
    const isValid = await validateAllSteps();
    if (!isValid) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    try {
      const authToken = await getToken({ template: "expiration" });
      await submitCourse(authToken || undefined);
      toast.success("Course created successfully!");
      clearGlobalMessages();
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Course submission failed:", error);
    }
  }, [validateAllSteps, submitCourse, clearGlobalMessages, getToken]);

  const handlePublishCourse = useCallback(async () => {
    if (!courseData.id) {
      toast.error("Please save the course first before publishing");
      return;
    }

    try {
      await publishCourse();
      toast.success("Course published successfully!");
    } catch (error) {
      toast.error("Failed to publish course");
      console.error("Course publishing failed:", error);
    }
  }, [courseData.id, publishCourse]);

  const progress = calculateProgress();
  const currentValidation = stepValidations[currentStep] || {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Show loading state while initializing
  if (!mounted || !isServiceInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-gray-600">Initializing course creation...</p>
        </div>
      </div>
    );
  }

  // Show loading state while loading draft
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-gray-600">Loading your draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Course
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete all steps to publish your course
            </p>
            {lastSaved && (
              <p className="text-sm text-gray-500 mt-1">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end ml-auto flex-wrap items-center">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{progress}% Complete</span>
            </div>

            {/* AI Assistant */}
            <button
              onClick={() => setShowAssistant(!showAssistant)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </button>

            {/* Preview */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            {/* Save Draft */}
            <button
              onClick={handleManualSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </button>

            {/* Submit/Publish Buttons */}
            {currentStep === steps.length - 1 && (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitCourse}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Create Course
                    </>
                  )}
                </button>

                {courseData.id && (
                  <button
                    onClick={handlePublishCourse}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Globe className="h-4 w-4" />
                    Publish Course
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Global Messages */}
        {(globalErrors.length > 0 || globalWarnings.length > 0) && (
          <div className="mb-6 space-y-3">
            {globalErrors.map((error: string, index: number) => (
              <div
                key={`error-${index}`}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-800">{error}</span>
                </div>
                <button
                  onClick={() => removeGlobalError(error)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {globalWarnings.map((warning: string, index: number) => (
              <div
                key={`warning-${index}`}
                className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-amber-800">{warning}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Step Indicator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = stepValidations[index]?.isValid;
                  const isClickable = canNavigateToStep(index);
                  const hasError =
                    !stepValidations[index]?.isValid && index <= currentStep;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleStepClick(index)}
                          disabled={!isClickable}
                          className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${
                              isActive
                                ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-110"
                                : isCompleted
                                ? "border-green-500 bg-green-500 text-white"
                                : hasError
                                ? "border-red-500 bg-red-50 text-red-500"
                                : "border-gray-300 bg-gray-50 text-gray-400"
                            }
                            ${
                              isClickable
                                ? "cursor-pointer hover:scale-105"
                                : "cursor-not-allowed"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : hasError ? (
                            <AlertCircle className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </button>
                        <div className="mt-3 text-center">
                          <p
                            className={`text-sm font-medium ${
                              isActive ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 mx-4 ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Validation Messages */}
              {(currentValidation.errors.length > 0 ||
                currentValidation.warnings.length > 0) && (
                <div className="p-6 border-b border-gray-200">
                  {currentValidation.errors.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800">
                          Required fields missing
                        </h4>
                        <p className="text-red-700 text-sm mt-1">
                          Please fill in all required fields to continue.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentValidation.warnings.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Recommendations
                        </h4>
                        <ul className="text-amber-700 text-sm mt-1 space-y-1">
                          {currentValidation.warnings.map(
                            (warning: string, index: number) => (
                              <li key={index}>• {warning}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-8">
                {currentStep === 0 && (
                  <CourseInformation
                    data={courseData}
                    updateData={updateCourseData}
                    validation={currentValidation}
                  />
                )}
                {currentStep === 1 && (
                  <CourseStructure
                    data={courseData}
                    updateData={updateCourseData}
                  />
                )}
                {currentStep === 2 && (
                  <ContentUpload
                    data={courseData}
                    updateData={updateCourseData}
                  />
                )}
                {currentStep === 3 && (
                  <CourseSettings
                    data={courseData}
                    updateData={updateCourseData}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={
                    currentStep === steps.length - 1 ||
                    !currentValidation.isValid
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Course Progress
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold text-gray-900">
                    {progress}%
                  </span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {steps.map((step, index) => {
                    const validation = stepValidations[index];
                    return (
                      <div
                        key={step.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">{step.title}</span>
                        <span
                          className={`font-medium ${
                            validation?.isValid
                              ? "text-green-600"
                              : index === currentStep
                              ? "text-blue-600"
                              : !validation?.isValid && index <= currentStep
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        >
                          {validation?.isValid
                            ? "Complete"
                            : index === currentStep
                            ? "In Progress"
                            : !validation?.isValid && index <= currentStep
                            ? "Incomplete"
                            : "Not Started"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleManualSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save Progress
                </button>

                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Preview Course
                </button>

                <button
                  onClick={() => setShowAssistant(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  Get AI Help
                </button>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Course Overview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections</span>
                  <span className="font-medium">
                    {courseData.sections?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lectures</span>
                  <span className="font-medium">
                    {courseData.sections?.reduce(
                      (total: number, section: Section) =>
                        total + (section.lectures?.length || 0),
                      0
                    ) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objectives</span>
                  <span className="font-medium">
                    {courseData.objectives?.filter((obj: string) => obj.trim())
                      .length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prerequisites</span>
                  <span className="font-medium">
                    {courseData.prerequisites?.filter((req: string) =>
                      req.trim()
                    ).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto p-0">
            <DialogHeader className="p-6 border-b border-gray-200">
              <DialogTitle className="text-xl font-semibold">
                Course Preview
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <CoursePreview
                data={courseData}
                onClose={() => setShowPreview(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {showAssistant && (
          <SmartAssistant
            data={courseData}
            updateData={updateCourseData}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </div>
    </div>
  );
}