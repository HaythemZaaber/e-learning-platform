"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/stores/auth.store";
import { useAuth } from "@/hooks/useAuth";

export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

// Define route permissions
export const ROUTE_PERMISSIONS: RouteConfig[] = [
  // Public routes (no auth required)
  { path: "/", allowedRoles: [], requireAuth: false },
  { path: "/courses", allowedRoles: [], requireAuth: false },
  { path: "/instructors", allowedRoles: [], requireAuth: false },
  { path: "/how-it-works", allowedRoles: [], requireAuth: false },
  { path: "/become-instructor", allowedRoles: [], requireAuth: false },

  // Student routes - Only students can access
  {
    path: "/student",
    allowedRoles: [UserRole.STUDENT],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Instructor routes - Only instructors can access
  {
    path: "/instructor",
    allowedRoles: [UserRole.INSTRUCTOR],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Parent routes - Only parents can access
  {
    path: "/parent",
    allowedRoles: [UserRole.PARENT],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Admin routes - Only admins can access
  {
    path: "/admin",
    allowedRoles: [UserRole.ADMIN],
    requireAuth: true,
    redirectTo: "/unauthorized",
  },

  // Profile and settings (authenticated users only)
  {
    path: "/profile",
    allowedRoles: [
      UserRole.STUDENT,
      UserRole.INSTRUCTOR,
      UserRole.PARENT,
      UserRole.ADMIN,
    ],
    requireAuth: true,
    redirectTo: "/sign-in",
  },
  {
    path: "/settings",
    allowedRoles: [
      UserRole.STUDENT,
      UserRole.INSTRUCTOR,
      UserRole.PARENT,
      UserRole.ADMIN,
    ],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Auth routes (public)
  { path: "/sign-in", allowedRoles: [], requireAuth: false },
  { path: "/sign-up", allowedRoles: [], requireAuth: false },
  { path: "/sso-callback", allowedRoles: [], requireAuth: false },
  { path: "/unauthorized", allowedRoles: [], requireAuth: false },
];

interface RouteGuardProps {
  children: React.ReactNode;
}

// Helper function to get default dashboard path for each role
export const getDefaultDashboardPath = (role: UserRole): string => {
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

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything until the store is hydrated and loading is complete
    if (!isHydrated || isLoading) {
      console.log('RouteGuard: Waiting for hydration/loading to complete', {
        isHydrated,
        isLoading,
        pathname
      });
      return;
    }

    // Debug logging
    console.log('RouteGuard Debug:', {
      pathname,
      isAuthenticated,
      userRole: user?.role,
      userId: user?.id,
      isLoading,
      isHydrated
    });

    // Find matching route configuration
    const routeConfig = ROUTE_PERMISSIONS.find(
      (config) => pathname.startsWith(config.path) && config.path !== "/"
    );

    // If no specific route config found, check if it's a public route
    if (!routeConfig) {
      // Check if it's a known public route or auth route
      const isPublicRoute = pathname === "/" || 
                           pathname.startsWith("/sign-in") || 
                           pathname.startsWith("/sign-up") || 
                           pathname.startsWith("/sso-callback") ||
                           pathname === "/unauthorized" ||
                           pathname === "/404";
      
      if (!isPublicRoute) {
        // This is an unknown route - redirect to 404
        console.warn(`Unknown route accessed: ${pathname}`);
        router.push("/404");
        return;
      }
      return;
    }

    // Check authentication requirement
    if (routeConfig.requireAuth && !isAuthenticated) {
      console.log(`Authentication required for ${pathname}, redirecting to ${routeConfig.redirectTo}`);
      router.push(routeConfig.redirectTo || "/sign-in");
      return;
    }

    // If route allows all roles (empty array), allow access
    if (routeConfig.allowedRoles.length === 0) {
      return;
    }

    // Check role permissions
    if (
      isAuthenticated &&
      user?.role &&
      !routeConfig.allowedRoles.includes(user.role)
    ) {
      // User doesn't have permission for this route
      console.log(`Access denied for ${pathname}. User role: ${user.role}, Required roles: ${routeConfig.allowedRoles.join(', ')}`);
      
      // Redirect based on user role
      const redirectPath = getDefaultDashboardPath(user.role);
      router.push(redirectPath);
      return;
    }
  }, [pathname, user, isAuthenticated, isLoading, isHydrated, router]);

  // Show loading while the store is being hydrated or loading
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-gray-600">
            {!isHydrated ? "Loading..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};


