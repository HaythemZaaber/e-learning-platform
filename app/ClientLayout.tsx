// layouts/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";
import { AiAssistant } from "@/components/shared/AiAssistant";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore, useAuthSelectors } from "@/stores/auth.store";
import { AuthWrapper } from "@/features/auth/components/AuthWrapper";
import { RouteGuard } from "@/features/auth/components/RouteGuard";

import { Loader2 } from "lucide-react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get auth data from your custom auth system
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { userInitials, userFullName, userRole } = useAuthSelectors();

  // Determine layout type based on pathname
  const isAuthPage =
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/sso-callback");

  const isDashboardPage =
    pathname?.includes("/dashboard") ||
    pathname?.includes("/student") ||
    pathname?.includes("/instructor") ||
    pathname?.includes("/parent") ||
    pathname?.includes("/admin");

  const isLandingPage = pathname === "/";
  const isUnauthorizedPage = pathname === "/unauthorized";

  // Don't show navbar on auth pages
  const showNavbar = !isAuthPage;
  const showFooter = !isAuthPage && !isDashboardPage && !isUnauthorizedPage;

  // Handle loading state
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  // Show loading spinner while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate notification count (you can implement this based on your needs)
  const notificationCount = 0; // TODO: Implement real notification system

  return (
    <RouteGuard>
      {showNavbar && (
        <Navbar
          notificationCount={notificationCount}
          onAiAssistantToggle={() => setShowAiAssistant(!showAiAssistant)}
          isDashboard={isDashboardPage}
        />
      )}

      {/* AI Assistant - Global (except auth pages) */}
      {!isAuthPage && (
        <div className="fixed bottom-4 right-4 z-50">
          {showAiAssistant && (
            <AiAssistant onClose={() => setShowAiAssistant(false)} />
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />

      {/* Footer */}
      {showFooter && <Footer />}
    </RouteGuard>
  );
}
