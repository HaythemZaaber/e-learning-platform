// layouts/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/features/mainPage/components/Footer";
import { Toaster } from "sonner";
import { useState } from "react";
import { AiAssistant } from "@/components/shared/AiAssistant";
// import { getUserRole, getUserInfo } from "@/lib/auth"; // Utility functions
import Navbar from "@/components/layout/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Determine layout type based on pathname
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage =
    pathname?.includes("/dashboard") ||
    // pathname?.includes("/instructor") ||
    pathname?.includes("/student") ||
    pathname?.includes("/parent");
  const isLandingPage = pathname === "/";

  // Get user info
  // const userRole = getUserRole();
  // const userInfo = getUserInfo();

  // Don't show navbar on auth pages or dashboard pages (they have their own)
  const showNavbar = !isAuthPage && !isDashboardPage;
  const showFooter = !isAuthPage && !isDashboardPage;

  return (
    <>
      {showNavbar && (
        <Navbar
          // userRole={userRole}
          // userName={userInfo?.name}
          // userInitials={userInfo?.initials}
          // notificationCount={userInfo?.notificationCount || 0}
          onAiAssistantToggle={() => setShowAiAssistant(!showAiAssistant)}
          // showAiAssistant={showAiAssistant}
          // setShowAiAssistant={setShowAiAssistant}
          // isDashboard={false}
        />
      )}

      {/* AI Assistant - Global */}
      <div className="fixed bottom-4 right-4 z-50">
        {showAiAssistant && (
          <AiAssistant onClose={() => setShowAiAssistant(false)} />
        )}
      </div>

      {children}

      <Toaster position="top-center" richColors />

      {showFooter && <Footer />}
    </>
  );
}
