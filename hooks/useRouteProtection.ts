import { getDefaultDashboardPath, ROUTE_PERMISSIONS, RouteConfig } from "@/features/auth/components/RouteGuard";
import { useAuthStore, UserRole } from "@/stores/auth.store";
import { usePathname } from "next/navigation";

export const useRouteProtection = () => {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    if (requiredRoles.length === 0) return true;
    if (!isAuthenticated || !user?.role) return false;
    return requiredRoles.includes(user.role);
  };

  const canAccessRoute = (route: string): boolean => {
    const routeConfig = ROUTE_PERMISSIONS.find(
      (config) => route.startsWith(config.path) && config.path !== "/"
    );

    if (!routeConfig) return true; // Allow access to unprotected routes

    if (routeConfig.requireAuth && !isAuthenticated) return false;

    return hasAccess(routeConfig.allowedRoles);
  };

  const getAccessibleRoutes = (): RouteConfig[] => {
    return ROUTE_PERMISSIONS.filter((route) => canAccessRoute(route.path));
  };

  const redirectToAppropriateRoute = (): string => {
    if (!isAuthenticated) return "/sign-in";
    if (!user?.role) return "/";

    return getDefaultDashboardPath(user.role);
  };

  return {
    hasAccess,
    canAccessRoute,
    getAccessibleRoutes,
    redirectToAppropriateRoute,
    isAuthenticated,
    userRole: user?.role,
  };
};
