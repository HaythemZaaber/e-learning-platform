"use client";

import { useAuth } from "@/hooks/useAuth";
import { useStudentProfile } from "@/features/sessions/hooks/useLiveSessions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { StudentDashboard } from "@/features/sessions/components/student/StudentDashboard";

export default function StudentSessionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: studentProfile, isLoading: profileLoading } = useStudentProfile(user?.id || "");

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access your student dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <StudentDashboard user={user} studentProfile={studentProfile} />
    </ErrorBoundary>
  );
}
