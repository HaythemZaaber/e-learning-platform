import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  FileText,
  Users,
  Upload,
  Settings,
  X,
} from 'lucide-react';

interface ValidationRule {
  id: string;
  label: string;
  description: string;
  type: 'error' | 'warning' | 'success';
  category: 'basic' | 'structure' | 'content' | 'settings';
  action?: () => void;
  actionLabel?: string;
}

interface ValidationComponentProps {
  stepValidations: Array<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  currentStep: number;
  courseData: any;
  contentByLecture: any;
  onNavigateToStep: (step: number) => void;
  onTakeAction?: (actionId: string) => void;
}

export const ValidationComponent: React.FC<ValidationComponentProps> = ({
  stepValidations,
  currentStep,
  courseData,
  contentByLecture,
  onNavigateToStep,
  onTakeAction,
}) => {
  const generateValidationRules = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Step 0: Course Information Validation
    const step0 = stepValidations[0] || { isValid: true, errors: [], warnings: [] };
    
    // Title validation
    if (!courseData.title?.trim()) {
      rules.push({
        id: 'title-missing',
        label: 'Course Title Required',
        description: 'Add a compelling title that describes your course',
        type: 'error',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Add Title',
      });
    } else if (courseData.title.length < 10) {
      rules.push({
        id: 'title-short',
        label: 'Title Too Short',
        description: 'Consider a more descriptive title (at least 10 characters)',
        type: 'warning',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Improve Title',
      });
    } else {
      rules.push({
        id: 'title-good',
        label: 'Course Title Complete',
        description: 'Your course has a good descriptive title',
        type: 'success',
        category: 'basic',
      });
    }

    // Description validation
    if (!courseData.description?.trim()) {
      rules.push({
        id: 'description-missing',
        label: 'Course Description Required',
        description: 'Add a detailed description of what students will learn',
        type: 'error',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Add Description',
      });
    } else if (courseData.description.length < 50) {
      rules.push({
        id: 'description-short',
        label: 'Description Too Brief',
        description: 'Expand your description to better explain your course value',
        type: 'warning',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Improve Description',
      });
    } else {
      rules.push({
        id: 'description-good',
        label: 'Course Description Complete',
        description: 'Your description provides good context for students',
        type: 'success',
        category: 'basic',
      });
    }

    // Category validation
    if (!courseData.category) {
      rules.push({
        id: 'category-missing',
        label: 'Category Recommended',
        description: 'Select a category to help students find your course',
        type: 'warning',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Select Category',
      });
    } else {
      rules.push({
        id: 'category-good',
        label: 'Category Selected',
        description: `Course categorized as ${courseData.category}`,
        type: 'success',
        category: 'basic',
      });
    }


    if (!courseData.thumbnail) {
      rules.push({
        id: 'thumbnail-missing',
        label: 'Course Thumbnail Recommended',
        description: 'Add a thumbnail to attract students',
        type: 'warning',
        category: 'settings',
        action: () => onNavigateToStep(0),
        actionLabel: 'Add Thumbnail',
      });
    } else {
      rules.push({
        id: 'thumbnail-good',
        label: 'Course Thumbnail Added',
        description: 'Thumbnail uploaded successfully',
        type: 'success',
        category: 'settings',
      });
    }

    // Objectives validation
    if (!courseData.objectives?.some((obj: string) => obj.trim())) {
      rules.push({
        id: 'objectives-missing',
        label: 'Learning Objectives Recommended',
        description: 'Add learning objectives to clarify what students will achieve',
        type: 'warning',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Add Objectives',
      });
    } else {
      rules.push({
        id: 'objectives-good',
        label: 'Learning Objectives Added',
        description: `${courseData.objectives.filter((obj: string) => obj.trim()).length} objective(s) defined`,
        type: 'success',
        category: 'basic',
      });
    }

    // What You Will Learn validation
    if (!courseData.whatYouLearn?.some((item: string) => item.trim())) {
      rules.push({
        id: 'whatYouLearn-missing',
        label: 'What You Will Learn Recommended',
        description: 'Add specific topics students will learn to attract enrollments',
        type: 'warning',
        category: 'basic',
        action: () => onNavigateToStep(0),
        actionLabel: 'Add Topics',
      });
    } else {
      rules.push({
        id: 'whatYouLearn-good',
        label: 'What You Will Learn Added',
        description: `${courseData.whatYouLearn.filter((item: string) => item.trim()).length} topic(s) defined`,
        type: 'success',
        category: 'basic',
      });
    }

    // Step 1: Course Structure Validation
    const step1 = stepValidations[1] || { isValid: true, errors: [], warnings: [] };
    
    if (!courseData.sections || courseData.sections.length === 0) {
      rules.push({
        id: 'sections-missing',
        label: 'Course Sections Required',
        description: 'Add at least one section to organize your content',
        type: 'error',
        category: 'structure',
        action: () => onNavigateToStep(1),
        actionLabel: 'Add Sections',
      });
    } else {
      rules.push({
        id: 'sections-good',
        label: 'Course Structure Complete',
        description: `${courseData.sections.length} section(s) created`,
        type: 'success',
        category: 'structure',
      });

      const totalLectures = courseData.sections.reduce(
        (total: number, section: any) => total + (section.lectures?.length || 0),
        0
      );

      if (totalLectures === 0) {
        rules.push({
          id: 'lectures-missing',
          label: 'Lectures Required',
          description: 'Add at least one lecture to your sections',
          type: 'error',
          category: 'structure',
          action: () => onNavigateToStep(1),
          actionLabel: 'Add Lectures',
        });
      } else if (totalLectures < 3) {
        rules.push({
          id: 'lectures-few',
          label: 'More Lectures Recommended',
          description: `Consider adding more lectures (currently ${totalLectures})`,
          type: 'warning',
          category: 'structure',
          action: () => onNavigateToStep(1),
          actionLabel: 'Add More',
        });
      } else {
        rules.push({
          id: 'lectures-good',
          label: 'Lectures Added',
          description: `${totalLectures} lecture(s) created`,
          type: 'success',
          category: 'structure',
        });
      }
    }

    // Step 2: Content Upload Validation
    const step2 = stepValidations[2] || { isValid: true, errors: [], warnings: [] };
    
    const totalContent = Object.values(contentByLecture).reduce((total: number, lectureContent: any) => {
      return total + Object.values(lectureContent).reduce((lectureTotal: number, contentArray: any) => {
        return lectureTotal + (Array.isArray(contentArray) ? contentArray.length : 0);
      }, 0);
    }, 0);

    if (totalContent === 0) {
      rules.push({
        id: 'content-missing',
        label: 'Course Content Required',
        description: 'Upload content for your lectures',
        type: 'error',
        category: 'content',
        action: () => onNavigateToStep(2),
        actionLabel: 'Upload Content',
      });
    } else if (totalContent < 5) {
      rules.push({
        id: 'content-few',
        label: 'More Content Recommended',
        description: `Consider adding more content (currently ${totalContent} items)`,
        type: 'warning',
        category: 'content',
        action: () => onNavigateToStep(2),
        actionLabel: 'Add More',
      });
    } else {
      rules.push({
        id: 'content-good',
        label: 'Content Uploaded',
        description: `${totalContent} content item(s) uploaded`,
        type: 'success',
        category: 'content',
      });
    }

    // Step 3: Settings Validation
    const step3 = stepValidations[3] || { isValid: true, errors: [], warnings: [] };
    
    if (courseData.settings?.enrollmentType === "paid" && (courseData.price || 0) <= 0) {
      rules.push({
        id: 'price-missing',
        label: 'Price Required for Paid Course',
        description: 'Set a price for your paid course',
        type: 'error',
        category: 'settings',
        action: () => onNavigateToStep(3),
        actionLabel: 'Set Price',
      });
    } else if (courseData.settings?.enrollmentType === "paid") {
      rules.push({
        id: 'price-set',
        label: 'Price Configured',
        description: `Course price set to $${courseData.price}`,
        type: 'success',
        category: 'settings',
      });
    }

   

    return rules;
  };

  const validationRules = generateValidationRules();
  const errorRules = validationRules.filter(rule => rule.type === 'error');
  const warningRules = validationRules.filter(rule => rule.type === 'warning');
  const successRules = validationRules.filter(rule => rule.type === 'success');

  const getIconForType = (type: 'error' | 'warning' | 'success') => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic':
        return <FileText className="h-4 w-4" />;
      case 'structure':
        return <Users className="h-4 w-4" />;
      case 'content':
        return <Upload className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'structure':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'content':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'settings':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-md flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {errorRules.length > 0 ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : warningRules.length > 0 ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <span className="font-semibold text-gray-900">
              {errorRules.length > 0 
                ? `${errorRules.length} issue(s) to fix`
                : warningRules.length > 0
                ? `${warningRules.length} recommendation(s)`
                : 'All validations passed!'
              }
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {successRules.length} completed
        </div>
      </div>

      {/* Errors */}
      {errorRules.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Required Actions ({errorRules.length})
          </h4>
          <div className="space-y-2">
            {errorRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start justify-between flex-col gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getIconForType('error')}
                      <span className="font-medium text-red-800">{rule.label}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(rule.category)}`}>
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-sm text-red-700">{rule.description}</p>
                  </div>
                  {rule.action && (
                    <button
                      onClick={rule.action}
                      className="ml-3 px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      {rule.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warningRules.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-amber-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Recommendations ({warningRules.length})
          </h4>
          <div className="space-y-2">
            {warningRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-start justify-between flex-col gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getIconForType('warning')}
                      <span className="font-medium text-amber-800">{rule.label}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(rule.category)}`}>
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-sm text-amber-700">{rule.description}</p>
                  </div>
                  {rule.action && (
                    <button
                      onClick={rule.action}
                      className="ml-3 px-3 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors cursor-pointer "
                    >
                      {rule.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Items */}
      {successRules.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({successRules.length})
          </h4>
          <div className="space-y-2">
            {successRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getIconForType('success')}
                  <span className="font-medium text-green-800">{rule.label}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(rule.category)}`}>
                    {rule.category}
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {successRules.length}/{validationRules.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(successRules.length / validationRules.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 