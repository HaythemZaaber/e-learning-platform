import { useAuthStore, UserRole } from "@/stores/auth.store";
import { UnauthorizedPage } from "./UnauthorizedPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const RoleBasedWrapper: React.FC<RoleBasedWrapperProps> = ({
  children,
  allowedRoles,
  fallback,
  requireAuth = true,
  redirectTo,
}) => {
  const { user, isAuthenticated, isLoading, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything until the store is hydrated and loading is complete
    if (!isHydrated || isLoading) {
      console.log('RoleBasedWrapper: Waiting for hydration/loading to complete', {
        isHydrated,
        isLoading
      });
      return;
    }

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      console.log('RoleBasedWrapper: Authentication required, redirecting to sign-in');
      router.push(redirectTo || '/sign-in');
      return;
    }

    // If user is authenticated but doesn't have the required role
    if (isAuthenticated && user?.role && !allowedRoles.includes(user.role)) {
      console.log(`RoleBasedWrapper: Access denied. User role: ${user.role}, Required roles: ${allowedRoles.join(', ')}`);
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case UserRole.ADMIN:
          router.push('/admin/dashboard');
          break;
        case UserRole.INSTRUCTOR:
          router.push('/instructor/dashboard');
          break;
        case UserRole.STUDENT:
          router.push('/student/dashboard');
          break;
        case UserRole.PARENT:
          router.push('/parent/dashboard');
          break;
        default:
          router.push('/unauthorized');
      }
    }
  }, [user, isAuthenticated, isLoading, isHydrated, allowedRoles, requireAuth, redirectTo, router]);

  // Show loading while the store is being hydrated or loading
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600">
            {!isHydrated ? "Loading..." : "Checking permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but doesn't have the required role
  if (isAuthenticated && user?.role && !allowedRoles.includes(user.role)) {
    return fallback || <UnauthorizedPage showHomeButton={false} />;
  }

  // If no authentication required or user has proper permissions
  return <>{children}</>;
};
