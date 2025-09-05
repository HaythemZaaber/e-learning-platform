"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { StudentBookingDashboard } from "@/features/sessions/components/student/StudentBookingDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function StudentSessionsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
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
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your sessions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 ">
    
      
      <StudentBookingDashboard studentId={user.id} />
    </div>
  );
}
