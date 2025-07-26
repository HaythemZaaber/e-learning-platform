// components/auth/AuthWrapper.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthSelectors } from "@/stores/auth.store";
import LoadingSpinner from "@/components/ui/loadingSpinner";

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: string[];
  fallback?: ReactNode;
}

export function AuthWrapper({
  children,
  requireAuth = false,
  requiredRole = [],
  fallback,
}: AuthWrapperProps) {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const { userRole } = useAuthSelectors();

  // Show loading while checking auth
//   if (isLoading) {
//     return fallback || <LoadingSpinner />;
//   }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in to access this page.
          </p>
          <a
            href="/sign-in"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Check role permissions
  if (requiredRole.length > 0 && userRole && !requiredRole.includes(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

