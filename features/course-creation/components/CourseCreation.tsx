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
Settings,
RefreshCw,
Zap,
Shield,
PlayCircle,
Edit,
Plus,
XCircle,
} from "lucide-react";
import { CoursePreview } from "./CoursePreview";
import { CourseInformation } from "./steps/CourseInformation";
import { CourseStructure } from "./steps/CourseStructure";
import { ContentUpload } from "./steps/ContentUpload";
import { SmartAssistant } from "./SmartAssistant";
import { CourseSettings } from "./steps/CourseSettings";
import { ValidationComponent } from "./ValidationComponent";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";
import { useCourseCreationWithGraphQL } from "../hooks/useCourseCreationWithGraphQL";
import { useCourseEditing } from "../hooks/useCourseEditing";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { CourseSection } from "../types";

const steps = [
{
id: "information",
title: "Course Information",
description: "Basic details about your course",
icon: BookOpen,
color: "text-blue-600",
bgColor: "bg-blue-50",
},
{
id: "structure",
title: "Course Structure",
description: "Organization and curriculum",
icon: Target,
color: "text-green-600",
bgColor: "bg-green-50",
},
{
id: "content",
title: "Content Upload",
description: "Add your course materials",
icon: Users,
color: "text-purple-600",
bgColor: "bg-purple-50",
},
{
id: "settings",
title: "Settings & Publishing",
description: "Final configuration",
icon: Sparkles,
color: "text-orange-600",
bgColor: "bg-orange-50",
},
];

export default function CourseCreation() {
const topRef = useRef<HTMLDivElement>(null);
const [mounted, setMounted] = useState(false);
const [showValidation, setShowValidation] = useState(false);
const [showPublishModal, setShowPublishModal] = useState(false);

// Course editing functionality
const { isEditMode, isDuplicateMode, isLoadingCourse, courseId, resetToNewCourse } = useCourseEditing();

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
contentByLecture,
navigationMode,

// Actions
updateCourseData,
setCurrentStep,
setNavigationMode,
setShowPreview,
setShowAssistant,
validateCurrentStep,
validateAllSteps,
canNavigateToStep,
calculateProgress,
saveDraft,
loadDraft,
submitCourse,
updateCourse,
publishCourse,
unpublishCourse,
addGlobalError,
removeGlobalError,
addGlobalWarning,
removeGlobalWarning,
clearGlobalMessages,
clearStepValidationWarnings,
validateStepsForCompletion,
} = useCourseCreationStore();

const { getToken } = useAuth();
const { isServiceInitialized } = useCourseCreationWithGraphQL();

// Initialize component
useEffect(() => {
setMounted(true);
}, []);

// Load draft when service is initialized
useEffect(() => {
if (mounted && isServiceInitialized && !isLoading) {
  console.log("Service initialized, loading draft...");
  loadDraft().catch((error) => {
    console.error("Failed to load draft:", error);
  });
}
}, [mounted, isServiceInitialized]);

// Validate all steps when draft is loaded
useEffect(() => {
if (mounted && isServiceInitialized && !isLoading && courseData) {
  validateAllSteps();
}
}, [mounted, isServiceInitialized, isLoading, courseData, validateAllSteps]);

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
  // Clear the warning after displaying it to prevent duplicates
  removeGlobalWarning(warning);
});
}, [globalWarnings, removeGlobalWarning]);

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
const validation = validateCurrentStep();

if (!validation.isValid && navigationMode === 'strict') {
  toast.error("Please fix all errors before proceeding");
  return;
}

if (currentStep < steps.length - 1) {
  setCurrentStep(currentStep + 1);
  topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}
}, [currentStep, setCurrentStep, validateCurrentStep, navigationMode]);

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
  } else if (navigationMode === 'strict') {
    toast.warning("Complete previous steps to unlock this section, or enable flexible navigation.");
  }
},
[canNavigateToStep, setCurrentStep, navigationMode]
);

const handleSubmitCourse = useCallback(async () => {
// Check for errors (not warnings)
const hasErrors = stepValidations.some(validation => validation.errors.length > 0);

if (hasErrors) {
  toast.error("Please fix all errors before creating the course. Warnings are acceptable.");
  return;
}

try {
  const authToken = await getToken({ template: "expiration" });
  
  if (courseData.id) {
    // Update existing course
    await updateCourse(courseData.id, authToken || undefined);
    // Success notification is handled by the store
  } else {
    // Create new course
    await submitCourse(authToken || undefined);
    toast.success("Course created successfully!");
  }
  
  clearGlobalMessages();
} catch (error) {
  console.error("Course submission failed:", error);
}
}, [stepValidations, submitCourse, updateCourse, courseData.id, clearGlobalMessages, getToken]);

const handlePublishCourse = useCallback(async () => {
if (!courseData.id) {
  toast.error("Please create the course first before publishing");
  return;
}

// Show publish confirmation modal
setShowPublishModal(true);
}, [courseData.id]);

const confirmPublishCourse = useCallback(async () => {
try {
  await publishCourse();
  setShowPublishModal(false);
} catch (error) {
  toast.error("Failed to publish course");
  console.error("Course publishing failed:", error);
}
}, [publishCourse]);

const handleUnpublishCourse = useCallback(async () => {
if (!courseData.id) {
  toast.error("Please create the course first before unpublishing");
  return;
}

try {
  await unpublishCourse();
} catch (error) {
  toast.error("Failed to unpublish course");
  console.error("Course unpublishing failed:", error);
}
}, [unpublishCourse, courseData.id]);

const toggleNavigationMode = useCallback(() => {
const newMode = navigationMode === 'strict' ? 'flexible' : 'strict';
setNavigationMode(newMode);
toast.success(`Navigation mode: ${newMode === 'flexible' ? 'Flexible (can skip steps)' : 'Strict (complete in order)'}`);
}, [navigationMode, setNavigationMode]);

const progress = calculateProgress();
const currentValidation = stepValidations[currentStep] || {
isValid: true,
errors: [],
warnings: [],
};

const hasErrors = stepValidations.some(validation => validation.errors.length > 0);
const canCreateCourse = !hasErrors;
const canPublish = courseData.id && courseData.status === "DRAFT";

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

// Show loading state while loading draft or course for editing
if (isLoading || isLoadingCourse) {
return (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-gray-600">
        {isLoadingCourse 
          ? isEditMode 
            ? "Loading course for editing..." 
            : "Loading course for duplication..."
          : "Loading your draft..."
        }
      </p>
    </div>
  </div>
);
}

return (
<div
  ref={topRef}
  className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
>
  <div className="">
    {/* Enhanced Header */}
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Course" : isDuplicateMode ? "Duplicate Course" : "Create New Course"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditMode 
            ? "Update your course information and content"
            : isDuplicateMode
            ? "Create a copy of an existing course"
            : "Complete all steps to create and publish your course"
          }
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

        {/* Navigation Mode Toggle */}
        <button
          onClick={toggleNavigationMode}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            navigationMode === 'flexible'
              ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
          }`}
        >
          {navigationMode === 'flexible' ? (
            <Zap className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          {navigationMode === 'flexible' ? 'Flexible' : 'Strict'} Mode
        </button>

        {/* Validation Panel */}
        <button
          onClick={() => setShowValidation(!showValidation)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showValidation
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : hasErrors
              ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
              : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
          }`}
        >
          {hasErrors ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Validation
          {hasErrors && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
              {stepValidations.filter(validation => validation.errors.length > 0).length}
            </span>
          )}
        </button>

        {/* AI Assistant */}
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Bot className="h-4 w-4" />
          AI Assistant
        </button>

        {/* New Course Button (when in edit mode) */}
        {(isEditMode || isDuplicateMode) && (
          <button
            onClick={resetToNewCourse}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Course
          </button>
        )}

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

        {/* Create/Edit/Publish Buttons */}
        <div className="flex gap-2">
          {canCreateCourse && !courseData.id && (
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
          )}

          {courseData.id && courseData.status === "DRAFT" && (
            <button
              onClick={handleSubmitCourse}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Update Course
                </>
              )}
            </button>
          )}

          {canPublish && (
            <button
              onClick={handlePublishCourse}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Globe className="h-4 w-4" />
              Publish Course
            </button>
          )}

          {courseData.status === "PUBLISHED" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-300 rounded-lg text-green-700">
                <CheckCircle className="h-4 w-4" />
                Published
              </div>
              <button
                onClick={handleUnpublishCourse}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Unpublishing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Unpublish
                  </>
                )}
              </button>
            </div>
          )}
        </div>
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
        {/* Enhanced Step Indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = stepValidations[index]?.isValid && stepValidations[index]?.errors.length === 0;
              const isClickable = canNavigateToStep(index);
              const hasError = stepValidations[index]?.errors.length > 0;
              const hasWarning = stepValidations[index]?.warnings.length > 0;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(index)}
                      disabled={!isClickable && navigationMode === 'strict'}
                      className={`
                        w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 relative
                        ${
                          isActive
                            ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-110"
                            : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : hasError
                            ? "border-red-500 bg-red-50 text-red-500"
                            : hasWarning
                            ? "border-amber-500 bg-amber-50 text-amber-500"
                            : "border-gray-300 bg-gray-50 text-gray-400"
                        }
                        ${
                          isClickable || navigationMode === 'flexible'
                            ? "cursor-pointer hover:scale-105"
                            : "cursor-not-allowed"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : hasError ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : hasWarning ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                      
                      {/* Warning/Error indicator */}
                      {(hasError || hasWarning) && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          hasError ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
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
                    <ul className="text-red-700 text-sm mt-2 space-y-1">
                      {currentValidation.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
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

          {/* Enhanced Navigation */}
          <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500">
                {canCreateCourse ? (
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {courseData.status === "PUBLISHED" 
                      ? 'Course Published' 
                      : courseData.id 
                        ? 'Ready to Update' 
                        : 'Ready to Create'
                    }
                  </span>
                ) : (
                  `Step ${currentStep + 1} of ${steps.length}`
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {navigationMode === 'flexible' ? 'Flexible navigation enabled' : 'Complete steps in order'}
              </div>
            </div>

            <button
              onClick={canCreateCourse ? handleSubmitCourse : handleNext}
              disabled={
                courseData.status === "PUBLISHED" ||
                (!canCreateCourse && navigationMode === 'strict' && 
                (currentStep === steps.length - 1 || currentValidation.errors.length > 0))
              }
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                canCreateCourse && courseData.status !== "PUBLISHED"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                  : courseData.status === "PUBLISHED"
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {courseData.status === "PUBLISHED" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Course Published
                </>
              ) : canCreateCourse ? (
                <>
                  <Check className="h-4 w-4" />
                  {courseData.id ? 'Update Course' : 'Create Course'}
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  <Settings className="h-4 w-4" />
                  Review Settings
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Validation Panel */}
        {showValidation && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Course Validation
            </h3>
            <ValidationComponent
              stepValidations={stepValidations}
              currentStep={currentStep}
              courseData={courseData}
              contentByLecture={contentByLecture}
              onNavigateToStep={handleStepClick}
            />
          </div>
        )}

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
                const hasErrors = validation?.errors.length > 0;
                const hasWarnings = validation?.warnings.length > 0;
                return (
                  <div
                    key={step.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{step.title}</span>
                    <span
                      className={`font-medium ${
                        !hasErrors && !hasWarnings
                          ? "text-green-600"
                          : index === currentStep
                          ? "text-blue-600"
                          : hasErrors
                          ? "text-red-600"
                          : hasWarnings
                          ? "text-amber-600"
                          : "text-gray-400"
                      }`}
                    >
                      {!hasErrors && !hasWarnings
                        ? "Complete"
                        : index === currentStep
                        ? "In Progress"
                        : hasErrors
                        ? "Has Errors"
                        : hasWarnings
                        ? "Has Warnings"
                        : "Not Started"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Course Status */}
        {courseData.status && (
          <div className={`rounded-xl border p-6 ${
            courseData.status === "PUBLISHED" 
              ? "bg-green-50 border-green-200" 
              : courseData.status === "DRAFT"
              ? "bg-blue-50 border-blue-200"
              : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {courseData.status === "PUBLISHED" ? (
                <Globe className="h-6 w-6 text-green-600" />
              ) : courseData.status === "DRAFT" ? (
                <Edit className="h-6 w-6 text-blue-600" />
              ) : (
                <Clock className="h-6 w-6 text-gray-600" />
              )}
              <h3 className={`font-semibold ${
                courseData.status === "PUBLISHED" 
                  ? "text-green-800" 
                  : courseData.status === "DRAFT"
                  ? "text-blue-800"
                  : "text-gray-800"
              }`}>
                {courseData.status === "PUBLISHED" ? "Published Course" : 
                 courseData.status === "DRAFT" ? "Draft Course" : "Course Status"}
              </h3>
            </div>
            <p className={`text-sm ${
              courseData.status === "PUBLISHED" 
                ? "text-green-700" 
                : courseData.status === "DRAFT"
                ? "text-blue-700"
                : "text-gray-700"
            }`}>
              {courseData.status === "PUBLISHED" 
                ? "Your course is live and visible to students. You can continue editing and updates will be reflected immediately."
                : courseData.status === "DRAFT"
                ? "Your course is saved as a draft. Publish it to make it available to students."
                : "Complete all steps to create your course."
              }
            </p>
            {courseData.publishedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Published: {new Date(courseData.publishedAt).toLocaleDateString()}
              </p>
            )}
            {courseData.status === "PUBLISHED" && (
              <button
                onClick={handleUnpublishCourse}
                disabled={isSubmitting}
                className="w-full mt-3 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Unpublishing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Unpublish Course
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Completion Status */}
        {canCreateCourse && (
          <div className={`rounded-xl border p-6 ${
            courseData.status === "PUBLISHED" 
              ? "bg-green-50 border-green-200" 
              : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-800">
                {courseData.status === "PUBLISHED" ? "Course Published!" : "Course Ready!"}
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              {courseData.status === "PUBLISHED" 
                ? "Your course is live and students can enroll. You can continue editing and updates will be reflected immediately."
                : "All required fields are complete. You can now create and publish your course."
              }
            </p>
          </div>
        )}

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

            <button
              onClick={() => setShowValidation(!showValidation)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              {showValidation ? 'Hide Validation' : 'Show Validation'}
            </button>

            <button
              onClick={toggleNavigationMode}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                navigationMode === 'flexible'
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {navigationMode === 'flexible' ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              Toggle to {navigationMode === 'flexible' ? 'Strict' : 'Flexible'} Mode
            </button>

            {canCreateCourse && (
              <button
                onClick={handleSubmitCourse}
                disabled={isSubmitting}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {courseData.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {courseData.id ? 'Update Course' : 'Create Course'}
                  </>
                )}
              </button>
            )}

            {canPublish && (
              <button
                onClick={handlePublishCourse}
                disabled={isSubmitting}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Globe className="h-4 w-4" />
                Publish Course
              </button>
            )}

            {courseData.status === "PUBLISHED" && (
              <button
                onClick={handleUnpublishCourse}
                disabled={isSubmitting}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Unpublishing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Unpublish Course
                  </>
                )}
              </button>
            )}
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
                  (total: number, section: CourseSection) =>
                    total + (section.lectures?.length || 0),
                  0
                ) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Content Items</span>
              <span className="font-medium">
                {Object.values(contentByLecture).reduce((total, lectureContent) => {
                  return total + Object.values(lectureContent).reduce((lectureTotal, contentArray) => {
                    return lectureTotal + contentArray.length;
                  }, 0);
                }, 0)}
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
            {courseData.price !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">
                  {courseData.price === 0 ? 'Free' : `${courseData.price}`}
                </span>
              </div>
            )}
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

    {/* Publish Confirmation Modal */}
    <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <Globe className="h-6 w-6 text-green-600" />
            Publish Course
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Ready to Publish</h4>
            <p className="text-green-700 text-sm">
              Your course "{courseData.title}" is ready to be published. Once published:
            </p>
            <ul className="text-green-700 text-sm mt-2 space-y-1">
              <li>• Students can discover and enroll in your course</li>
              <li>• Your course will be visible in course listings</li>
              <li>• You can continue editing (changes reflect immediately)</li>
              <li>• You'll be able to track enrollments and engagement</li>
            </ul>
          </div>

          {/* Course Summary */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Course Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sections:</span>
                <span>{courseData.sections?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lectures:</span>
                <span>
                  {courseData.sections?.reduce(
                    (total: number, section: CourseSection) =>
                      total + (section.lectures?.length || 0),
                    0
                  ) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span>{courseData.price === 0 ? 'Free' : `${courseData.price}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="capitalize">{courseData.level}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end pt-4">
            <button
              onClick={() => setShowPublishModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmPublishCourse}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish Course
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {showAssistant && (
  <SmartAssistant
    data={courseData}
    updateData={updateCourseData}
    onClose={() => setShowAssistant(false)}
    contentByLecture={contentByLecture}
    currentStep={currentStep}
  />
)}
  </div>
</div>
);
}