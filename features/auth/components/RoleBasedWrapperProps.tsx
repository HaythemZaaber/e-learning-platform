import { useAuthStore, UserRole } from "@/stores/auth.store";
import { UnauthorizedPage } from "./UnauthorizedPage";

interface RoleBasedWrapperProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const RoleBasedWrapper: React.FC<RoleBasedWrapperProps> = ({
  children,
  allowedRoles,
  fallback,
  requireAuth = true,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || <div>Please sign in to access this content.</div>;
  }

  // If user is authenticated but doesn't have the required role
  if (isAuthenticated && user?.role && !allowedRoles.includes(user.role)) {
    return fallback || <UnauthorizedPage showHomeButton={false} />;
  }

  // If no authentication required or user has proper permissions
  return <>{children}</>;
};
