"use client";

import { DashboardSidebar } from "@/features/dashboard";
import Navbar from "@/components/layout/navbar";
import Footer from "@/features/mainPage/components/Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { UserRole } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, isHydrated } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Don't do anything until the store is hydrated and loading is complete
    if (!isHydrated || isLoading) {
      console.log('Admin layout: Waiting for hydration/loading to complete', {
        isHydrated,
        isLoading
      });
      return;
    }

    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      console.log('Admin layout: User not authenticated, redirecting to sign-in');
      router.push('/sign-in');
      return;
    }

    if (user?.role !== UserRole.ADMIN) {
      console.log(`Admin layout: User role is ${user?.role}, redirecting to unauthorized`);
      router.push('/unauthorized');
      return;
    }
  }, [user, isAuthenticated, isLoading, isHydrated, router]);

  // Show loading while the store is being hydrated or loading
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600">
            {!isHydrated ? "Loading..." : "Checking admin permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or not an admin, don't render the layout
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <div className="flex relative">
        <div className="relative h-[calc(100vh-4rem)]">
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-all duration-300 ease-in-out ",
              isSidebarOpen || isHovering ? "w-64" : "w-0"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <DashboardSidebar userRole={UserRole.ADMIN} isOpen={isSidebarOpen || isHovering} />
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-r-lg p-2 shadow-md transition-all duration-300",
              isSidebarOpen || isHovering ? "translate-x-64" : "translate-x-0"
            )}
            aria-label="Toggle sidebar"
          >
            <MdArrowForwardIos
              size={20}
              className={cn(
                "transition-transform duration-300",
                isSidebarOpen || isHovering ? "rotate-180" : ""
              )}
            />
          </button>
        </div>
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            isSidebarOpen || isHovering ? "ml-64" : "ml-0"
          )}
        >
          <div className="p-4 sm:p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            {children}
          </div>
        </main>
      </div>
   
    </div>
  );
}
