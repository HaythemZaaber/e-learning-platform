"use client";
import React from "react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Course } from "@/features/courses/types/courseTypes";
import { StaticImageData } from "next/image";
import placeholderImage from "@/public/images/courses/course.jpg";

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

  const courses: Course[] = [
    {
      id: "1",
      title: "React Front To Back",
      description: "Learn React from scratch and build real-world applications",
      image: placeholderImage,
      teacher: instructorName,
      rating: 4.8,
      ratingCount: 320,
      price: 69.99,
      originalPrice: 14.99,
      category: "Development",
      level: "Intermediate",
      duration: "12 hours",
      lessons: 45,
      students: 1200,
      teacherRole: "Senior Developer",
      teacherAvatar: placeholderImage,
      badge: "Bestseller",
      badgeColor: "primary",
      featured: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      id: "2",
      title: "PHP Beginner Advanced",
      description: "Master PHP programming from basics to advanced concepts",
      image: placeholderImage,
      teacher: instructorName,
      rating: 4.6,
      ratingCount: 215,
      price: 59.99,
      originalPrice: 12.99,
      category: "Development",
      level: "Beginner",
      duration: "15 hours",
      lessons: 52,
      students: 850,
      teacherRole: "PHP Expert",
      teacherAvatar: placeholderImage,
      badge: "Hot & New",
      badgeColor: "warning",
      featured: false,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-03-10"),
    },
    {
      id: "3",
      title: "Angular Zero to Mastery",
      description: "Complete Angular course for modern web development",
      image: placeholderImage,
      teacher: instructorName,
      rating: 4.7,
      ratingCount: 189,
      price: 79.99,
      originalPrice: 15.99,
      category: "Development",
      level: "Advanced",
      duration: "18 hours",
      lessons: 60,
      students: 950,
      teacherRole: "Angular Specialist",
      teacherAvatar: placeholderImage,
      badge: "Bestseller",
      badgeColor: "primary",
      featured: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-03-05"),
    },
  ];

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
        {courses.slice(0, 2).map((course) => (
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
          {courses.map((course) => (
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
