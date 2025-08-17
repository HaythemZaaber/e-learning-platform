"use client";

import { useSearchParams } from "next/navigation";

import CoursesGrid from "@/features/courses/components/CourseGrid";
import CoursesBanner from "@/features/courses/components/CoursesBanner";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  return (
    <div>
      <CoursesBanner />

      <div className="w-[90%] mx-auto">
        <CoursesGrid 
          initialSearch={searchQuery}
          initialCategory={categoryQuery}
        />
      </div>
    </div>
  );
}
