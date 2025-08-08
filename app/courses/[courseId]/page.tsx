"use client";

import { CourseContent } from "@/features/courses/components/courseDetails/CourseContent";
import { CourseDescription } from "@/features/courses/components/courseDetails/CourseDescription";
import { CourseHeader } from "@/features/courses/components/courseDetails/CourseHeader";
import { CourseNavigation } from "@/features/courses/components/courseDetails/CourseNavigation";
import { CourseRequirements } from "@/features/courses/components/courseDetails/CourseRequirements";
import { InstructorCard } from "@/features/courses/components/courseDetails/InstructorCard";
import { PriceCard } from "@/features/courses/components/courseDetails/PriceCard";
import { RelatedCourses } from "@/features/courses/components/courseDetails/RelatedCourses";
import { ReviewSection } from "@/features/courses/components/courseDetails/ReviewSection";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useState } from "react";

export default function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [activeSection, setActiveSection] = useState("overview");
  
  const {
    course: courseData,
    isLoading,
    error,
    isEnrolled,
    isAuthenticated,
  } = useCoursePreview({ courseId: params.courseId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Course Not Found
          </h1>
          <p className="text-gray-600">
            The course you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseHeader course={courseData} />
      
      <CourseNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div id="overview-section">
              <CourseDescription course={courseData} />
            </div>

            <div id="content-section">
              <CourseContent 
                sections={courseData.sections} 
                courseId={params.courseId} 
              />
            </div>

            <div id="details-section">
              <CourseRequirements course={courseData} />
            </div>

            <div id="instructor-section">
              <InstructorCard instructor={courseData.instructor} />
            </div>

            <div id="review-section">
              <ReviewSection course={courseData} />
            </div>

            <RelatedCourses 
              course={courseData}
              userRole={isAuthenticated ? "STUDENT" : "VISITOR"}
            />
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <PriceCard
              course={courseData}
              isEnrolled={isEnrolled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
