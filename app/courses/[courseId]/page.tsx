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
import { useState } from "react";
import { coursesData } from "@/data/coursesData";

export default function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [activeSection, setActiveSection] = useState("overview");
  // In a real app, you would fetch course data based on courseId
  const courseData = coursesData.find((course) => course.id === params.courseId);
  if (!courseData) {
    return <div>Course not found</div>;
  }
 

  return (
    <div className="bg-gray-50 min-h-screen">
      <CourseHeader course={courseData} />

      <div className="container pt-5 w-[90%] grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CourseNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div id="overview-section">
              <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>
                    Become an advanced, confident, and modern Python programmer
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>
                    Build 100+ projects including a portfolio of Python projects
                  </span>
                </li>
              </ul>
            </div>

            <div id="content-section">
              <CourseContent sections={courseData.sections} courseId={params.courseId} />
            </div>

            <div id="details-section">
              <CourseRequirements />
              <CourseDescription />
            </div>
          </div>

          <div id="instructor-section">
            <InstructorCard instructor={courseData.instructor} />
          </div>

          <div id="review-section">
            <ReviewSection rating={courseData.rating} />
          </div>

          <RelatedCourses instructorName={courseData.instructor.name} />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <PriceCard
            price={courseData.price}
            discountPrice={courseData.discountPrice || 0}
          />
        </div>
      </div>
    </div>
  );
}
