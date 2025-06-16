"use client";

import { DashboardSidebar } from "@/features/dashboard";
import Navbar from "@/components/layout/navbar";
import Footer from "@/features/mainPage/components/Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] relative">
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-all duration-300 ease-in-out",
            isSidebarOpen || isHovering ? "w-64" : "w-0"
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <DashboardSidebar isOpen={isSidebarOpen || isHovering} />
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
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            isSidebarOpen || isHovering ? "ml-64" : "ml-0"
          )}
        >
          <div className="p-4 sm:p-10">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
