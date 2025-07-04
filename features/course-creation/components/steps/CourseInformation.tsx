import React, { useState } from "react";
import { Upload, X, Plus } from "lucide-react";

// Types
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface CourseData {
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  price: number;
  objectives: string[];
  prerequisites: string[];
}

interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        updateData({ thumbnail: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleObjectiveAdd = () => {
    updateData({
      objectives: [...(data.objectives || []), ""],
    });
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...(data.objectives || [])];
    newObjectives[index] = value;
    updateData({ objectives: newObjectives });
  };

  const handleObjectiveRemove = (index: number) => {
    const newObjectives = [...(data.objectives || [])];
    newObjectives.splice(index, 1);
    updateData({ objectives: newObjectives });
  };

  const handlePrerequisiteAdd = () => {
    updateData({
      prerequisites: [...(data.prerequisites || []), ""],
    });
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    const newPrerequisites = [...(data.prerequisites || [])];
    newPrerequisites[index] = value;
    updateData({ prerequisites: newPrerequisites });
  };

  const handlePrerequisiteRemove = (index: number) => {
    const newPrerequisites = [...(data.prerequisites || [])];
    newPrerequisites.splice(index, 1);
    updateData({ prerequisites: newPrerequisites });
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className={`w-full p-3 border rounded-lg transition-colors ${
                validation.errors.includes("title")
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
              placeholder="e.g., Complete Web Development Bootcamp"
            />
            {validation.errors.includes("title") && (
              <p className="text-red-500 text-sm mt-1">
                Course title is required
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Keep it clear and descriptive. This is what students will see
              first.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={5}
              className={`w-full p-3 border rounded-lg transition-colors resize-none ${
                validation.errors.includes("description")
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
              placeholder="Describe what students will learn, the skills they'll gain, and how this course will help them achieve their goals..."
            />
            {validation.errors.includes("description") && (
              <p className="text-red-500 text-sm mt-1">
                Course description is required
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={data.category}
                onChange={(e) => updateData({ category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">Select category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="programming">Programming</option>
                <option value="data-science">Data Science</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="health">Health & Fitness</option>
                <option value="language">Language</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={data.level}
                onChange={(e) =>
                  updateData({ level: e.target.value as CourseLevel })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
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
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="thumbnail"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={thumbnailPreview}
                    alt="Course thumbnail preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-600">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or JPEG (Recommended: 1280x720px)
                  </p>
                </div>
              )}
              <input
                id="thumbnail"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailChange}
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
                  />
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
                  />
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
