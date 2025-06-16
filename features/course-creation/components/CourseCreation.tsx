"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { CoursePreview } from "./CoursePreview";
import { CourseData } from "../types";
import { CourseInformation } from "./steps/CourseInformation";
import { CourseStructure } from "./steps/CourseStructure";
import { ContentUpload } from "./steps/ContentUpload";
import { SmartAssistant } from "./SmartAssistant";
import { CourseSettings } from "./steps/CourseSettings";

// Mock types for demonstration
type CourseLevel = "beginner" | "intermediate" | "advanced";
type EnrollmentType = "free" | "paid" | "subscription";

// interface CourseData {
//   title: string;
//   description: string;
//   category: string;
//   level: CourseLevel;
//   thumbnail?: File;
//   price: number;
//   objectives: string[];
//   prerequisites: string[];
//   sections: any[];
//   settings: {
//     isPublic: boolean;
//     enrollmentType: EnrollmentType;
//     language: string;
//     certificate: boolean;
//     seoDescription: string;
//     seoTags: string[];
//     accessibility: {
//       captions: boolean;
//       transcripts: boolean;
//       audioDescription: boolean;
//     };
//   };
// }

interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

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

// Mock step components
// const CourseInformation = ({ data, updateData, validation }: any) => (
//   <div className="space-y-6">
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium mb-2">Course Title *</label>
//         <input
//           type="text"
//           value={data.title}
//           onChange={(e) => updateData({ title: e.target.value })}
//           className={`w-full p-3 border rounded-lg transition-colors ${
//             validation.errors.includes("title")
//               ? "border-red-500 bg-red-50"
//               : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           }`}
//           placeholder="Enter your course title"
//         />
//         {validation.errors.includes("title") && (
//           <p className="text-red-500 text-sm mt-1">Course title is required</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Description *</label>
//         <textarea
//           value={data.description}
//           onChange={(e) => updateData({ description: e.target.value })}
//           rows={4}
//           className={`w-full p-3 border rounded-lg transition-colors ${
//             validation.errors.includes("description")
//               ? "border-red-500 bg-red-50"
//               : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           }`}
//           placeholder="Describe what students will learn in this course"
//         />
//         {validation.errors.includes("description") && (
//           <p className="text-red-500 text-sm mt-1">
//             Course description is required
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Category *</label>
//           <select
//             value={data.category}
//             onChange={(e) => updateData({ category: e.target.value })}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
//           >
//             <option value="">Select category</option>
//             <option value="technology">Technology</option>
//             <option value="business">Business</option>
//             <option value="design">Design</option>
//             <option value="marketing">Marketing</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Level</label>
//           <select
//             value={data.level}
//             onChange={(e) =>
//               updateData({ level: e.target.value as CourseLevel })
//             }
//             className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
//           >
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const CourseStructure = ({ data, updateData }: any) => (
//   <div className="space-y-6">
//     <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
//       <h3 className="font-medium text-blue-900 mb-2">Course Structure</h3>
//       <p className="text-blue-700 text-sm">
//         Define your course sections and lessons. Each section should have a
//         clear learning objective.
//       </p>
//     </div>
//     <div className="text-center py-12 text-gray-500">
//       <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
//       <p>Course structure configuration would go here</p>
//     </div>
//   </div>
// );

// const ContentUpload = ({ data, updateData }: any) => (
//   <div className="space-y-6">
//     <div className="p-6 bg-green-50 rounded-lg border border-green-200">
//       <h3 className="font-medium text-green-900 mb-2">Content Upload</h3>
//       <p className="text-green-700 text-sm">
//         Upload your course materials including videos, documents, and resources.
//       </p>
//     </div>
//     <div className="text-center py-12 text-gray-500">
//       <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
//       <p>Content upload interface would go here</p>
//     </div>
//   </div>
// );

// const CourseSettings = ({ data, updateData }: any) => (
//   <div className="space-y-6">
//     <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
//       <h3 className="font-medium text-purple-900 mb-2">Final Settings</h3>
//       <p className="text-purple-700 text-sm">
//         Configure your course settings and prepare for publishing.
//       </p>
//     </div>
//     <div className="text-center py-12 text-gray-500">
//       <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
//       <p>Course settings configuration would go here</p>
//     </div>
//   </div>
// );

export default function CourseCreation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    category: "",
    level: "beginner" as const,
    thumbnail: undefined,
    price: 0,
    objectives: [""],
    prerequisites: [""],
    sections: [],
    settings: {
      isPublic: true,
      enrollmentType: "free" as const,
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
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stepValidations, setStepValidations] = useState<StepValidation[]>([
    { isValid: false, errors: [], warnings: [] },
    { isValid: true, errors: [], warnings: [] },
    { isValid: true, errors: [], warnings: [] },
    { isValid: true, errors: [], warnings: [] },
  ]);

  // Validation logic
  const validateStep = useCallback(
    (stepIndex: number, data: CourseData): StepValidation => {
      const validation: StepValidation = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      switch (stepIndex) {
        case 0: // Course Information
          if (!data.title.trim()) {
            validation.errors.push("title");
            validation.isValid = false;
          }
          if (!data.description.trim()) {
            validation.errors.push("description");
            validation.isValid = false;
          }
          if (!data.category) {
            validation.warnings.push("Category selection recommended");
          }
          if (data.title.length > 0 && data.title.length < 10) {
            validation.warnings.push("Consider a more descriptive title");
          }
          break;
        // Add validation for other steps as needed
      }

      return validation;
    },
    []
  );

  // Update validations when course data changes
  useEffect(() => {
    const newValidations = steps.map((_, index) =>
      validateStep(index, courseData)
    );
    setStepValidations(newValidations);
    setHasUnsavedChanges(true);
  }, [courseData, validateStep]);

  // Calculate overall progress
  const calculateProgress = useCallback(() => {
    let totalFields = 0;
    let completedFields = 0;

    // Course Information
    totalFields += 4;
    if (courseData.title.trim()) completedFields++;
    if (courseData.description.trim()) completedFields++;
    if (courseData.category) completedFields++;
    if (courseData.level) completedFields++;

    // Additional progress calculations for other steps would go here

    return Math.round((completedFields / totalFields) * 100);
  }, [courseData]);

  // Auto-save functionality
  const saveProgress = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      // Show success toast (would use actual toast in real app)
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, courseData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && !isSaving) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, isSaving, saveProgress]);

  const handleNext = () => {
    const currentValidation = stepValidations[currentStep];
    if (!currentValidation.isValid) {
      // Show validation errors
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    saveProgress();
  };

  const handlePublish = async () => {
    // Validate all steps before publishing
    const allValid = stepValidations.every((validation) => validation.isValid);
    if (!allValid) {
      // Show error message
      return;
    }

    try {
      setIsSaving(true);
      // Simulate publish API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      console.log("Course published successfully!");
    } catch (error) {
      console.error("Failed to publish course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }));
  };

  const canNavigateToStep = (stepIndex: number) => {
    // Can always go to current step or previous steps
    if (stepIndex <= currentStep) return true;

    // Can go to next step only if current step is valid
    if (stepIndex === currentStep + 1) {
      return stepValidations[currentStep]?.isValid;
    }

    return false;
  };

  const progress = calculateProgress();
  const currentValidation = stepValidations[currentStep];

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div>
      {/* <div className="container  w-[90vw] mx-auto"> */}
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        {/* <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"></h1>
          <p className="text-gray-600 mt-2 text-lg">
            Complete all steps to publish your course
          </p>
        </div> */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Course
          </h1>
          <p className="text-muted-foreground">
            Complete all steps to publish your course
          </p>
        </div>

        <div className="flex  gap-3 justify-end ml-auto flex-wrap">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </button>

          {currentStep === steps.length - 1 && (
            <button
              onClick={handlePublish}
              disabled={isSaving || !stepValidations.every((v) => v.isValid)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Check className="h-4 w-4" />
              Publish Course
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Step Indicator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted =
                  stepValidations[index]?.isValid && index < currentStep;
                const isClickable = canNavigateToStep(index);
                const hasError =
                  !stepValidations[index]?.isValid && index <= currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => isClickable && setCurrentStep(index)}
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
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800">
                        Recommendations
                      </h4>
                      <ul className="text-amber-700 text-sm mt-1 space-y-1">
                        {currentValidation.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
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

              <button
                onClick={handleNext}
                disabled={
                  currentStep === steps.length - 1 || !currentValidation.isValid
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
                <span className="font-semibold text-gray-900">{progress}%</span>
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
                          validation.isValid && index < currentStep
                            ? "text-green-600"
                            : index === currentStep
                            ? "text-blue-600"
                            : !validation.isValid && index <= currentStep
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {validation.isValid && index < currentStep
                          ? "Complete"
                          : index === currentStep
                          ? "In Progress"
                          : !validation.isValid && index <= currentStep
                          ? "Incomplete"
                          : "Not Started"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Course Analytics
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Duration</span>
                <span className="font-medium">4h 30m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Content Quality</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SEO Score</span>
                <span className="font-medium text-amber-600">72/100</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Content Distribution
                </h4>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500 w-[40%]" title="Video" />
                  <div className="h-full bg-green-500 w-[25%]" title="Text" />
                  <div className="h-full bg-amber-500 w-[20%]" title="Quiz" />
                  <div
                    className="h-full bg-purple-500 w-[15%]"
                    title="Assignment"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Video
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Text
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    Quiz
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Assignment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals would be rendered here */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Course Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <CoursePreview
                data={courseData}
                onClose={() => setShowPreview(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showAssistant && (
        <SmartAssistant
          data={courseData}
          updateData={updateCourseData}
          onClose={() => setShowAssistant(false)}
        />
      )}
    </div>
    // </div>
  );
}
