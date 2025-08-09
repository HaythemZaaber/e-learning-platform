import { Course } from "@/types/courseTypes";
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Globe, 
  Clock,
  BookOpen,
  Award,
  Download,
  Monitor,
  Smartphone,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CourseRequirementsProps {
  course: Course | null;
}

export function CourseRequirements({ course }: CourseRequirementsProps) {
  if (!course) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Course Details</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const requirements = course.requirements || [];
  const skills = course.whatYouLearn || [];

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Course Details</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Requirements
            </h3>
            {requirements.length > 0 ? (
              <ul className="space-y-2">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                No specific requirements - suitable for all levels
              </div>
            )}
          </div>

          {/* What You'll Learn */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                What You'll Learn
              </h3>
              <div className="space-y-2">
                {skills.map((skill: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Course Features
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  {course.estimatedHours || 0}h {course.estimatedMinutes || 0}m total length
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span>{course.totalLectures || 0} lectures</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{(course.currentEnrollments || 0).toLocaleString()} students enrolled</span>
              </div>
              {course.hasCertificate && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>Certificate of completion</span>
                </div>
              )}
              {course.downloadableResources && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Download className="w-4 h-4 text-indigo-500" />
                  <span>
                    {typeof course.downloadableResources === 'number' 
                      ? course.downloadableResources 
                      : 'Multiple'} downloadable resources
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Course Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Course Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium">{course.language || 'English'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Level:</span>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{course.category}</span>
              </div>
              {course.lastMajorUpdate && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last updated:</span>
                  <span className="font-medium">
                    {new Date(course.lastMajorUpdate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {course.avgRating !== null && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{course.avgRating?.toFixed(1) || 0}</span>
                    <span className="text-gray-500">({course.totalRatings || 0} reviews)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-500" />
              Access Information
            </h3>
            <div className="space-y-2">
              {course.hasMobileAccess !== false && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Mobile and tablet access</span>
                </div>
              )}
              {course.hasLifetimeAccess && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-700">
                <Monitor className="w-4 h-4 text-purple-500" />
                <span>Access on desktop and TV</span>
              </div>
              {course.subtitleLanguages !== null && course.subtitleLanguages !== undefined && course.subtitleLanguages?.length > 0 && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>Subtitles in {course.subtitleLanguages?.length || 0} languages</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {course.completionRate !== null && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Outcomes
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Completion rate:</span>
                  <span className="font-medium text-green-600">{course.completionRate?.toFixed(1) || 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Prerequisites if they exist */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Prerequisites
            </h3>
            <div className="bg-orange-50 rounded-lg p-4">
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-orange-600 mt-1">•</span>
                    <span className="text-gray-700">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
