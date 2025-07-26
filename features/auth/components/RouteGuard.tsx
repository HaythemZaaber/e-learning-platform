"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, UserRole } from "@/stores/auth.store";


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

  // Student routes
  {
    path: "/student",
    allowedRoles: [UserRole.STUDENT, UserRole.ADMIN],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Instructor routes
  {
    path: "/instructor",
    allowedRoles: [UserRole.INSTRUCTOR, UserRole.ADMIN],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Parent routes
  {
    path: "/parent",
    allowedRoles: [UserRole.PARENT, UserRole.ADMIN],
    requireAuth: true,
    redirectTo: "/sign-in",
  },

  // Admin routes
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
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Find matching route configuration
    const routeConfig = ROUTE_PERMISSIONS.find(
      (config) => pathname.startsWith(config.path) && config.path !== "/"
    );

    // If no specific route config found, check if it's a public route
    if (!routeConfig) {
      // Allow access to public routes and unknown routes
      return;
    }

    // Check authentication requirement
    if (routeConfig.requireAuth && !isAuthenticated) {
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
      // Redirect based on user role
      const redirectPath = getDefaultDashboardPath(user.role);
      router.push(redirectPath);
      return;
    }
  }, [pathname, user, isAuthenticated, router]);

  return <>{children}</>;
};


