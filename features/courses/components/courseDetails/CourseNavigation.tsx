"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  FaInfoCircle,
  FaListUl,
  FaClipboardList,
  FaUser,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { useEffect, useRef, useState, useCallback } from "react";
import { CourseProgress } from "@/types/courseTypes";

interface CourseNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  courseProgress?: CourseProgress | null;
}

interface NavSection {
  label: string;
  icon: React.ReactNode;
  key: string;
  id: string;
  completed?: boolean;
}

const sections: NavSection[] = [
  {
    label: "Overview",
    icon: <FaInfoCircle />,
    key: "overview",
    id: "overview-section",
  },
  {
    label: "Course Content",
    icon: <FaListUl />,
    key: "content",
    id: "content-section",
  },
  {
    label: "Details",
    icon: <FaClipboardList />,
    key: "details",
    id: "details-section",
  },
  {
    label: "Instructor",
    icon: <FaUser />,
    key: "instructor",
    id: "instructor-section",
  },
  {
    label: "Reviews",
    icon: <FaStar />,
    key: "review",
    id: "review-section",
  },
];

export function CourseNavigation({
  activeSection,
  onSectionChange,
  courseProgress,
}: CourseNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Calculate overall page scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle section click with smooth scroll
  const handleSectionClick = useCallback(
    (key: string, id: string) => {
      onSectionChange(key);
      const element = document.getElementById(id);
      if (element) {
        const navHeight = navRef.current?.offsetHeight || 0;
        const additionalOffset = 80; // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navHeight - additionalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [onSectionChange]
  );

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const navHeight = navRef.current?.offsetHeight || 0;
      const scrollPosition = window.scrollY + navHeight + 100;

      // Check if nav is sticky
      if (navRef.current) {
        const navTop = navRef.current.offsetTop;
        setIsSticky(window.scrollY > navTop - 64);
      }

      // Find active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;

          if (scrollPosition >= elementTop) {
            if (activeSection !== section.key) {
              onSectionChange(section.key);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, onSectionChange]);

  // Auto-scroll to active button in nav when section changes
  useEffect(() => {
    if (activeButtonRef.current && navContainerRef.current) {
      const button = activeButtonRef.current;
      const container = navContainerRef.current;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;
      const containerScrollLeft = container.scrollLeft;

      if (buttonLeft < containerScrollLeft) {
        container.scrollTo({
          left: buttonLeft - 20,
          behavior: "smooth",
        });
      } else if (
        buttonLeft + buttonWidth >
        containerScrollLeft + containerWidth
      ) {
        container.scrollTo({
          left: buttonLeft + buttonWidth - containerWidth + 20,
          behavior: "smooth",
        });
      }
    }
  }, [activeSection]);

  // Calculate section completion based on progress
  const getSectionCompletion = (sectionKey: string) => {
    if (!courseProgress) return false;

    // Mock logic - replace with actual progress tracking
    switch (sectionKey) {
      case "overview":
        return true; // Always marked as viewed
      case "content":
        return (courseProgress.completionPercentage || 0) > 0;
      default:
        return false;
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "sticky top-14 bg-white z-20 transition-all duration-300",
          isSticky && "shadow-lg"
        )}
        aria-label="Course sections"
      >
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="relative border-b">
          <div
            ref={navContainerRef}
            className="flex overflow-x-auto gap-1 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Gradient fade indicators */}
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

            {sections.map(({ label, icon, key, id }) => {
              const isActive = activeSection === key;
              const isCompleted = getSectionCompletion(key);

              return (
                <Button
                  key={key}
                  ref={isActive ? activeButtonRef : null}
                  variant="ghost"
                  className={cn(
                    "rounded-none relative px-6 py-5 transition-all whitespace-nowrap group",
                    "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isActive && "text-blue-600 font-bold bg-blue-50",
                    !isActive && "text-gray-600 hover:text-blue-600"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleSectionClick(key, id)}
                >
                  <span className="flex items-center gap-2 text-base">
                    {/* {isCompleted && !isActive && (
                      <FaCheckCircle className="text-green-500 w-3 h-3 absolute top-2 right-2" />
                    )} */}
                    <span
                      className={cn(
                        "transition-transform duration-200",
                        isActive && "scale-110"
                      )}
                    >
                      {icon}
                    </span>
                    {label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-pulse" />
                  )}

                  {/* Hover indicator */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 transition-transform duration-200 scale-x-0",
                      "group-hover:scale-x-100"
                    )}
                  />
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating progress indicator for mobile */}
      {isSticky && (
        <div className="lg:hidden fixed bottom-20 right-4 bg-white rounded-full shadow-lg p-3 z-20">
          <div className="relative w-12 h-12">
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${
                  2 * Math.PI * 20 * (1 - scrollProgress / 100)
                }`}
                className="text-blue-600 transition-all duration-150"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
}
