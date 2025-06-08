"use client";
import React from "react";
import { CourseCard } from "@/components/shared/CourseCard";

import { StaticImageData } from "next/image";
import placeholderImage from "@/public/images/courses/course.jpg";
import { coursesData } from "@/data/coursesData";

interface RelatedCoursesProps {
  instructorName: string;
}

export function RelatedCourses({ instructorName }: RelatedCoursesProps) {
  const [savedCourses, setSavedCourses] = React.useState<Set<string>>(
    new Set()
  );

  const handleToggleSave = (courseId: string) => {
    setSavedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          More Courses By{" "}
          <span className="text-blue-600">{instructorName}</span>
        </h2>
        <a href="#" className="text-sm text-blue-600">
          View All Courses
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.slice(0, 2).map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSaved={savedCourses.has(course.id)}
            onToggleSave={handleToggleSave}
            viewMode="grid"
          />
        ))}
      </div>

      <div className="mt-12 ">
        <h2 className="text-xl font-bold mb-4">Related Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSaved={savedCourses.has(course.id)}
              onToggleSave={handleToggleSave}
              viewMode="grid"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
