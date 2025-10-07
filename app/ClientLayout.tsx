// layouts/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/navbar";
import { useAuthStore, useAuthSelectors } from "@/stores/auth.store";
import { AuthWrapper } from "@/features/auth/components/AuthWrapper";
import { RouteGuard } from "@/features/auth/components/RouteGuard";
import { useAuth } from "@/hooks/useAuth";
import {
  AIChatModal,
  FloatingChatButton,
  MinimizedChat,
} from "@/components/ai-chat/AIChatModal";
import { useAIChatStore } from "@/stores/aiChat.store";
import { AIChatProvider } from "@/providers/AIChatProvider";

// Import the new loader
import { PageLoader } from "@/components/ui/loaders";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Get auth data from the integrated auth hook
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    isHydrated,
  } = useAuth();
  const { userInitials, userFullName, userRole } = useAuthSelectors();

  // AI Chat store
  const {
    isOpen: isAIChatOpen,
    isMinimized: isAIChatMinimized,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
  } = useAIChatStore();

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
  const showNavbar = !isAuthPage && !pathname?.startsWith("/sessions");
  const showFooter =
    !isAuthPage &&
    !isDashboardPage &&
    !isUnauthorizedPage &&
    !pathname?.startsWith("/sessions");

  // Handle loading state
  useEffect(() => {
    // Only set loading to false when both auth loading is complete and store is hydrated
    if (!authLoading && isHydrated) {
      console.log("ClientLayout: Auth state ready", {
        isAuthenticated,
        userRole: user?.role,
        isHydrated,
        authLoading,
      });
      setIsLoading(false);
    }
  }, [authLoading, isHydrated, isAuthenticated, user?.role]);

  // Show enhanced loading screen while auth is being determined
  if (isLoading || !isHydrated) {
    return (
      <PageLoader
        message={!isHydrated ? "Initializing..." : "Verifying your session..."}
      />
    );
  }

  // Calculate notification count (you can implement this based on your needs)
  const notificationCount = 0; // TODO: Implement real notification system

  return (
    <RouteGuard>
      <AIChatProvider>
        {showNavbar && (
          <Navbar
            notificationCount={notificationCount}
            isDashboard={isDashboardPage}
          />
        )}

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* AI Chat Components - Global (except auth pages) */}
        {!isAuthPage && (
          <>
            {/* AI Chat Modal */}
            <AIChatModal
              isOpen={isAIChatOpen}
              onClose={closeChat}
              onToggleMinimize={isAIChatMinimized ? maximizeChat : minimizeChat}
              isMinimized={isAIChatMinimized}
            />

            {/* Floating Chat Button */}
            <FloatingChatButton />

            {/* Minimized Chat */}
            <MinimizedChat />
          </>
        )}

        {/* Toast Notifications */}
        <Toaster position="top-center" richColors />

        {/* Footer */}
        {showFooter && <Footer />}
      </AIChatProvider>
    </RouteGuard>
  );
}
