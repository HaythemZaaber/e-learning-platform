"use client";
import React from "react";
import { CourseCard } from "@/features/courses/shared/CourseCard";
import { Course } from "@/types/courseTypes";

interface RelatedCoursesProps {
  course: Course;
  userRole: string;
}

export function RelatedCourses({ course, userRole }: RelatedCoursesProps) {
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

  // Mock related courses - in a real app, this would come from the API
  const relatedCourses: Course[] = [
    {
      id: "related-1",
      title: "Advanced JavaScript Concepts",
      description: "Master advanced JavaScript concepts and patterns",
      shortDescription: "Advanced JavaScript concepts and patterns",
      category: course.category,
      level: course.level,
      price: 89.99,
      originalPrice: 129.99,
      currency: "USD",
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      sections: [],
      requirements: [],
      whatYouLearn: [],
      language: "English",
      hasSubtitles: true,
      hasCertificate: true,
      hasLifetimeAccess: true,
      hasMobileAccess: true,
      tags: [],
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 1500,
      avgRating: 4.8,
      totalRatings: 245,
      currentEnrollments: 1200,
      totalLectures: 45,
      totalSections: 8,
      completionRate: 85,
      ratingCount: 245,
      totalDuration: "8h 30m",
      reviews: [],
    },
    {
      id: "related-2",
      title: "React Development Masterclass",
      description: "Build modern React applications with best practices",
      shortDescription: "Build modern React applications",
      category: course.category,
      level: course.level,
      price: 79.99,
      originalPrice: 119.99,
      currency: "USD",
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      sections: [],
      requirements: [],
      whatYouLearn: [],
      language: "English",
      hasSubtitles: true,
      hasCertificate: true,
      hasLifetimeAccess: true,
      hasMobileAccess: true,
      tags: [],
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 2200,
      avgRating: 4.9,
      totalRatings: 312,
      currentEnrollments: 1800,
      totalLectures: 52,
      totalSections: 10,
      completionRate: 88,
      ratingCount: 312,
      totalDuration: "10h 15m",
      reviews: [],
    },
  ];

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          More Courses By{" "}
          <span className="text-blue-600">
            {course.instructor?.firstName} {course.instructor?.lastName}
          </span>
        </h2>
        <a href="#" className="text-sm text-blue-600">
          View All Courses
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCourses.slice(0, 2).map((relatedCourse) => (
          <CourseCard
            key={relatedCourse.id}
            course={relatedCourse}
            isSaved={savedCourses.has(relatedCourse.id)}
            onToggleSave={handleToggleSave}
            viewMode="grid"
          />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCourses.map((relatedCourse) => (
            <CourseCard
              key={relatedCourse.id}
              course={relatedCourse}
              isSaved={savedCourses.has(relatedCourse.id)}
              onToggleSave={handleToggleSave}
              viewMode="grid"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
