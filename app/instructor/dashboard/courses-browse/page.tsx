"use client";

import { useSearchParams } from "next/navigation";
import CoursesGrid from "@/features/courses/components/CourseGrid";
import CoursesBanner from "@/features/courses/components/CoursesBanner";
import { useAuth } from "@/hooks/useAuth";
import { useAuthSelectors } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstructorCoursesBrowsePage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userRole, isInstructor } = useAuthSelectors();
  const router = useRouter();

  // Route protection for instructors only
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/authentification/login");
        return;
      }
      if (!isInstructor) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [isAuthenticated, isInstructor, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated or not an instructor
  if (!isAuthenticated || !isInstructor) {
    return null;
  }

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
