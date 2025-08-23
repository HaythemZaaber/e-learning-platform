"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useInstructorProfile, useSessionStats, useAIInsights } from "@/features/sessions/hooks/useLiveSessions";
import { InstructorDashboard } from "@/features/sessions/components/instructor/InstructorDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { toast } from "sonner";

export default function InstructorSessionsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isProfileEnabled, setIsProfileEnabled] = useState(false);

  // Fetch instructor profile
  const {
    data: instructorProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useInstructorProfile(user?.id || "");

  // Fetch session stats
  const {
    data: sessionStats,
    isLoading: statsLoading,
    error: statsError,
  } = useSessionStats(user?.id || "");

  // Fetch AI insights
  // const {
  //   data: aiInsights,
  //   isLoading: insightsLoading,
  //   error: insightsError,
  // } = useAIInsights(user?.id || "");

  // Check if live sessions are enabled
  useEffect(() => {
    if (instructorProfile) {
      setIsProfileEnabled(instructorProfile.liveSessionsEnabled);
    }
  }, [instructorProfile]);

  // Handle errors
  useEffect(() => {
    if (profileError) {
      toast.error("Failed to load instructor profile");
    }
    if (statsError) {
      toast.error("Failed to load session statistics");
    }
    // if (insightsError) {
    //   toast.error("Failed to load AI insights");
    // }
  }, [profileError, statsError]);

  // Loading states
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to access the instructor dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Check if user is an instructor
  if (user.role !== "INSTRUCTOR") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Instructor Access Required</h2>
          <p className="text-muted-foreground">
            You need instructor privileges to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <InstructorDashboard
          user={user}
          instructorProfile={instructorProfile}
          sessionStats={sessionStats}
          // aiInsights={aiInsights}
          isProfileEnabled={isProfileEnabled}
          isLoading={{
            profile: profileLoading,
            stats: statsLoading,
            insights: false,
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}