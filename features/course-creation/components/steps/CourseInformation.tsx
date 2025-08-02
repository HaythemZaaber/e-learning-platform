"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Upload, X, Plus, Loader2, ImageIcon, AlertCircle, AlertTriangle } from "lucide-react";
import {
  CourseData,
  StepValidation,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
} from "../../types";
import { useCourseCreationStore } from "../../../../stores/courseCreation.store";
import { useAuth } from "@clerk/nextjs";
import { useCourseCreationWithGraphQL } from "../../hooks/useCourseCreationWithGraphQL";

import { useNotifications } from "../../hooks/useNotifications";
import Image from "next/image";

interface CourseInformationProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
  validation: StepValidation;
}

export const CourseInformation: React.FC<CourseInformationProps> = ({
  data,
  updateData,
  validation,
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    data.thumbnail
  );
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const notifications = useNotifications();
  const { getToken } = useAuth();
  const { isServiceInitialized } = useCourseCreationWithGraphQL();

  const { addGlobalError, removeGlobalError, uploadThumbnail, deleteThumbnail } = useCourseCreationStore();

  // Update thumbnail preview when data.thumbnail changes
  useEffect(() => {
    console.log("Setting thumbnail preview from data.thumbnail:", data.thumbnail);
    setThumbnailPreview(data.thumbnail);
    setImageLoadError(false);
  }, [data.thumbnail]);

  // check the validation errors and remove them when the fields contain values
  useEffect(() => {
    if (data.title && data.title.trim()) {
      removeGlobalError("Course title is required");
    }
    if (data.description && data.description.trim()) {
      removeGlobalError("Course description is required");
    }
    
    // Clear validation warnings when required fields are filled
    if (data.title && data.title.trim() && data.description && data.description.trim()) {
      // Clear step validation warnings and validate all steps
      const { clearStepValidationWarnings, validateStepsForCompletion } = useCourseCreationStore.getState();
      clearStepValidationWarnings();
      validateStepsForCompletion();
    }
  }, [data.title, data.description, removeGlobalError]);

  const handleThumbnailChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check if service is initialized
      if (!isServiceInitialized) {
        notifications.error("Service is not ready. Please wait a moment and try again.");
        return;
      }

      // Validate file
      if (!file.type.startsWith("image/")) {
        notifications.error("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        notifications.error("Image file size must be less than 10MB");
        return;
      }

      try {
        setUploadingThumbnail(true);

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          
          const dataUrl = reader.result as string;
          setThumbnailPreview(dataUrl);
          setImageLoadError(false); // Reset error state when new preview is set
          
          // Test if the data URL is valid
          if (dataUrl && dataUrl.startsWith('data:image/')) {
            console.log("Valid image data URL created");
          } else {
            console.error("Invalid image data URL:", dataUrl);
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          notifications.error("Failed to read image file");
        };
        reader.readAsDataURL(file);

        // Upload to server
        const authToken = await getToken({ template: "expiration" });
        const result = await uploadThumbnail(file, data.id, {
          title: data.title || "Course thumbnail",
          description: "Course thumbnail image"
        }, authToken || undefined);

        console.log("Upload result:", result);

        // Update the thumbnail URL - prioritize server URL if available
        const thumbnailUrl = result?.fileInfo?.file_url;
        updateData({ thumbnail: thumbnailUrl });
        notifications.success("Thumbnail uploaded successfully");
      } catch (error) {
        console.error("Thumbnail upload failed:", error);
        addGlobalError("Failed to upload thumbnail");
        // Reset preview on error
        setThumbnailPreview(data.thumbnail);
        notifications.error("Failed to upload thumbnail. Please try again.");
      } finally {
        setUploadingThumbnail(false);
      }
    },
    [
      data.id,
      data.thumbnail,
      data.title,
      updateData,
      uploadThumbnail,
      notifications,
      addGlobalError,
      getToken,
      isServiceInitialized,
    ]
  );
   

  const handleRemoveThumbnail = useCallback(async () => {
    // Check if service is initialized
    if (!isServiceInitialized) {
      notifications.error("Service is not ready. Please wait a moment and try again.");
      return;
    }

    try {
      // If course exists, delete thumbnail from server
      if (data.id) {
        const authToken = await getToken({ template: "expiration" });
        await deleteThumbnail(data.id, authToken || undefined);
      }
      
      setThumbnailPreview(undefined);
      setImageLoadError(false);
      updateData({ thumbnail: undefined });
      notifications.success("Thumbnail removed");
    } catch (error) {
      console.error("Failed to remove thumbnail:", error);
      notifications.error("Failed to remove thumbnail. Please try again.");
    }
  }, [data.id, updateData, notifications, deleteThumbnail, isServiceInitialized, getToken]);

  const handleObjectiveAdd = useCallback(() => {
    updateData({
      objectives: [...(data.objectives || []), ""],
    });
  }, [data.objectives, updateData]);

  const handleObjectiveChange = useCallback(
    (index: number, value: string) => {
      const newObjectives = [...(data.objectives || [])];
      newObjectives[index] = value;
      updateData({ objectives: newObjectives });
    },
    [data.objectives, updateData]
  );

  const handleObjectiveRemove = useCallback(
    (index: number) => {
      const newObjectives = [...(data.objectives || [])];
      newObjectives.splice(index, 1);
      updateData({ objectives: newObjectives });
    },
    [data.objectives, updateData]
  );

  const handlePrerequisiteAdd = useCallback(() => {
    updateData({
      prerequisites: [...(data.prerequisites || []), ""],
    });
  }, [data.prerequisites, updateData]);

  const handlePrerequisiteChange = useCallback(
    (index: number, value: string) => {
      const newPrerequisites = [...(data.prerequisites || [])];
      newPrerequisites[index] = value;
      updateData({ prerequisites: newPrerequisites });
    },
    [data.prerequisites, updateData]
  );

  const handlePrerequisiteRemove = useCallback(
    (index: number) => {
      const newPrerequisites = [...(data.prerequisites || [])];
      newPrerequisites.splice(index, 1);
      updateData({ prerequisites: newPrerequisites });
    },
    [data.prerequisites, updateData]
  );

  const getFieldError = (fieldName: string) => {
    return validation.errors.find((error: string) => 
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  const getFieldWarning = (fieldName: string) => {
    return validation.warnings.find((warning: string) => 
      warning.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  const isFieldRequired = (fieldName: string) => {
    const requiredFields = ['title', 'description'];
    return requiredFields.includes(fieldName);
  };

  const getFieldClassName = (fieldName: string) => {
    const hasError = getFieldError(fieldName);
    const hasWarning = getFieldWarning(fieldName);
    const isEmpty = !data[fieldName as keyof CourseData] || 
                   (typeof data[fieldName as keyof CourseData] === 'string' && 
                    (data[fieldName as keyof CourseData] as string).trim() === '');
    
    let baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    
    if (hasError) {
      baseClass += " border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50";
    } else if (hasWarning) {
      baseClass += " border-amber-300 focus:border-amber-500 focus:ring-amber-200 bg-amber-50";
    } else if (isEmpty && isFieldRequired(fieldName)) {
      baseClass += " border-gray-300 bg-gray-50";
    } else {
      baseClass += " border-gray-300";
    }
    
    return baseClass;
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Information
          </h3>
          <p className="text-sm text-gray-600">
            Provide essential details about your course that will help students
            understand what they'll learn.
          </p>
        </div>

        <div className="space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="Enter your course title"
              className={getFieldClassName('title')}
            />
            {getFieldError('title') && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('title')}
              </p>
            )}
            {getFieldWarning('title') && (
              <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {getFieldWarning('title')}
              </p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-500 text-sm">
                Keep it clear and descriptive. This is what students will see
                first.
              </p>
              <span className="text-xs text-gray-400">
                {data.title?.length || 0}/100
              </span>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              value={data.description || ""}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Describe what students will learn in this course"
              rows={4}
              className={getFieldClassName('description')}
            />
            {getFieldError('description') && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('description')}
              </p>
            )}
            {getFieldWarning('description') && (
              <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {getFieldWarning('description')}
              </p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-500 text-sm">
                Provide a compelling description that highlights the value of
                your course.
              </p>
              <span className="text-xs text-gray-400">
                {data.description?.length || 0}/1000
              </span>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              value={data.shortDescription || ""}
              onChange={(e) => updateData({ shortDescription: e.target.value })}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
              placeholder="Brief summary for course cards and search results..."
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-500 text-sm">
                A concise summary that appears in course listings.
              </p>
              <span className="text-xs text-gray-400">
                {data.shortDescription?.length || 0}/200
              </span>
            </div>
          </div>

          {/* Category, Level, and Price Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={data.category}
                onChange={(e) => updateData({ category: e.target.value })}
                className={`w-full p-3 border rounded-lg transition-colors ${
                  getFieldError("category")
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">Select category</option>
                {COURSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() +
                      category.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
              {getFieldError("category") && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a category
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <select
                value={data.level}
                onChange={(e) => updateData({ level: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                {COURSE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) =>
                    updateData({ price: Number(e.target.value) })
                  }
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Set to 0 for free courses
              </p>
              {data.settings?.enrollmentType === "FREE" && data.price > 0 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-700">
                      Free courses should have a price of 0. The price will be automatically set to 0 when you save.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Thumbnail Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Course Thumbnail
          </h3>
          <p className="text-sm text-gray-600">
            Upload an eye-catching thumbnail that represents your course
            content.
          </p>
        </div>

        <div>
          {!isServiceInitialized && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Service is initializing. Please wait a moment before uploading thumbnails.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="thumbnail"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors group ${
                uploadingThumbnail
                  ? "border-blue-300 bg-blue-50"
                  : !isServiceInitialized
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {uploadingThumbnail ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-sm text-blue-600 font-medium">
                    Uploading thumbnail...
                  </p>
                </div>
              ) : thumbnailPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={thumbnailPreview}
                    alt="Course thumbnail preview"
                    className="w-full h-full object-contain rounded-xl"
                    width={100}
                    height={100}
                  />
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200  bg-black/20 backdrop-blur-sm rounded-full w-fit h-fit p-5 ">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleRemoveThumbnail();
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 mb-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-600">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or JPEG (Recommended: 1280x720px, Max: 10MB)
                  </p>
                </div>
              )}
              <input
                id="thumbnail"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={uploadingThumbnail || !isServiceInitialized}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Learning Objectives Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Learning Objectives
              </h3>
              <p className="text-sm text-gray-600">
                What will students achieve after completing this course?
              </p>
            </div>
            <button
              type="button"
              onClick={handleObjectiveAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Objective
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {data.objectives?.length > 0 ? (
            data.objectives.map((objective: string, index: number) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-2">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="e.g., Build responsive websites using HTML, CSS, and JavaScript"
                    maxLength={200}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-400">
                      {objective.length}/200
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleObjectiveRemove(index)}
                  className="flex-shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors mt-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">
                No learning objectives added yet
              </p>
              <button
                type="button"
                onClick={handleObjectiveAdd}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Objective
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prerequisites Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Prerequisites
              </h3>
              <p className="text-sm text-gray-600">
                What should students know or have before taking this course?
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrerequisiteAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Prerequisite
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {data.prerequisites?.length > 0 ? (
            data.prerequisites.map((prerequisite: string, index: number) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-2">
                  ✓
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) =>
                      handlePrerequisiteChange(index, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="e.g., Basic computer skills and internet familiarity"
                    maxLength={200}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-400">
                      {prerequisite.length}/200
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePrerequisiteRemove(index)}
                  className="flex-shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors mt-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No prerequisites specified</p>
              <button
                type="button"
                onClick={handlePrerequisiteAdd}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Prerequisite
              </button>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            💡 <strong>Tip:</strong> If your course is suitable for complete
            beginners, you can leave prerequisites empty or mention "No prior
            experience required."
          </p>
        </div>
      </div>
    </div>
  );
};
