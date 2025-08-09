import { Course } from "@/types/courseTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  Target, 
  BookOpen, 
  Users, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Award,
  Info
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CourseDescriptionProps {
  course: Course | null;
}

export function CourseDescription({ course }: CourseDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "objectives" | "outcomes">("overview");

  if (!course) {
    return (
      <div className="mt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const description = course.description || "";
  const shortDescription = course.shortDescription || "";
  const isLongDescription = description.length > 500;
  const displayDescription = showFullDescription ? description : description.slice(0, 500);

  const whatYouLearn = course.whatYouLearn || [];
  const objectives = course.objectives || [];
  const prerequisites = course.prerequisites || [];
  const targetAudience = course.targetAudience || [];

  // Key highlights of the course
  const highlights = [
    course.isBestseller && { label: "Bestseller", icon: <TrendingUp className="w-4 h-4" />, color: "text-orange-600 bg-orange-50" },
    course.isFeatured && { label: "Featured", icon: <Sparkles className="w-4 h-4" />, color: "text-purple-600 bg-purple-50" },
    course.hasCertificate && { label: "Certificate", icon: <Award className="w-4 h-4" />, color: "text-green-600 bg-green-50" },
    course.hasLifetimeAccess && { label: "Lifetime Access", icon: <CheckCircle className="w-4 h-4" />, color: "text-blue-600 bg-blue-50" },
  ].filter(Boolean);

  return (
    <div className="mt-8">
      {/* Section Header with Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">About This Course</h2>
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight: any, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn("flex items-center gap-1", highlight.color)}
              >
                {highlight.icon}
                {highlight.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors relative",
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Overview
          </span>
        </button>
        <button
          onClick={() => setActiveTab("objectives")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors relative",
            activeTab === "objectives"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Learning Objectives
          </span>
        </button>
        <button
          onClick={() => setActiveTab("outcomes")}
          className={cn(
            "px-4 py-2 font-medium text-sm transition-colors relative",
            activeTab === "outcomes"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            What You'll Learn
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Short Description Highlight */}
            {shortDescription && shortDescription !== description && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-900 font-medium">{shortDescription}</p>
              </div>
            )}

            {/* Main Description */}
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {displayDescription}
                {isLongDescription && !showFullDescription && "..."}
              </div>
              
              {isLongDescription && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3"
                >
                  {showFullDescription ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Target Audience */}
            {targetAudience.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Who This Course Is For
                </h3>
                <ul className="space-y-2">
                  {targetAudience.map((audience, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-yellow-600">•</span>
                      <span className="text-gray-700">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Learning Objectives Tab */}
        {activeTab === "objectives" && (
          <div className="space-y-6 animate-fadeIn">
            {objectives.length > 0 ? (
              <>
                <p className="text-gray-600">
                  By the end of this course, you will be able to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {objectives.map((objective, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-blue-600">
                          {idx + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No specific objectives listed for this course.</p>
              </div>
            )}
          </div>
        )}

        {/* What You'll Learn Tab */}
        {activeTab === "outcomes" && (
          <div className="space-y-6 animate-fadeIn">
            {whatYouLearn.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {whatYouLearn.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No learning outcomes specified for this course.</p>
              </div>
            )}

            {/* Additional Course Benefits */}
            {(course.hasCertificate || course.hasLifetimeAccess || course.downloadableResources) && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Benefits</h4>
                <div className="space-y-2">
                  {course.hasCertificate && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="w-4 h-4 text-green-600" />
                      <span>Earn a certificate of completion</span>
                    </div>
                  )}
                  {course.hasLifetimeAccess && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Lifetime access to course materials</span>
                    </div>
                  )}
                  {course.downloadableResources && (typeof course.downloadableResources === 'number' ? course.downloadableResources > 0 : Boolean(course.downloadableResources)) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span>{course.downloadableResources} downloadable resources</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}