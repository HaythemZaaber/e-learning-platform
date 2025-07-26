"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole} from "@/stores/auth.store";
import {  Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Helper function to get default dashboard path for each role
const getDefaultDashboardPath = (role: UserRole): string => {
  switch (role) {
    case UserRole.STUDENT:
      return "/student/dashboard";
    case UserRole.INSTRUCTOR:
      return "/instructor/dashboard";
    case UserRole.PARENT:
      return "/parent/dashboard";
    case UserRole.ADMIN:
      return "/admin/dashboard";
    default:
      return "/";
  }
};

interface UnauthorizedPageProps {
  message?: string;
  showHomeButton?: boolean;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  message = "You don't have permission to access this page.",
  showHomeButton = true,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleGoHome = () => {
    if (user?.role) {
      const dashboardPath = getDefaultDashboardPath(user.role);
      router.push(dashboardPath);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-gray-500">
            {user?.role && (
              <p>
                Your current role:{" "}
                <span className="font-medium capitalize">
                  {user.role.toLowerCase()}
                </span>
              </p>
            )}
          </div>
          {showHomeButton && (
            <Button onClick={handleGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
