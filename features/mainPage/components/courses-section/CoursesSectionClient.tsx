"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Grid3X3,
  List,
  Navigation,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { CourseCard } from "../../../courses/shared/CourseCard";
import { cn } from "@/lib/utils";
import {
  CourseContainer,
  CourseCardWrapper,
  EmptyStateWrapper,
  BrowseButtonWrapper,
} from "../animations/courseAnimations";
import { Course, CourseCategory } from "@/types/courseTypes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuickPayment } from "@/features/payments/hooks/usePayment";
import { usePaymentStore } from "@/stores/payment.store";

import { toast } from "sonner";

interface CoursesSectionClientProps {
  categories: CourseCategory[];
  courses: Course[];
  initialShowFeatured: boolean;
  initialSelectedCategory: string;
  isLoading?: boolean;
}

type CategoryLayoutType = "tabs" | "dropdown" | "grid";

const layoutIcons = {
  tabs: <Navigation className="h-4 w-4" />,
  dropdown: <List className="h-4 w-4" />,
  grid: <Grid3X3 className="h-4 w-4" />,
};

const layoutNames = {
  tabs: "Horizontal Tabs",
  dropdown: "Dropdown",
  grid: "Grid Layout",
};

// Color classes for grid layout
const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "text-blue-600",
    active: "bg-blue-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    icon: "text-green-600",
    active: "bg-green-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "text-purple-600",
    active: "bg-purple-600",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    icon: "text-pink-600",
    active: "bg-pink-600",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: "text-orange-600",
    active: "bg-orange-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    icon: "text-cyan-600",
    active: "bg-cyan-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    icon: "text-yellow-600",
    active: "bg-yellow-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    icon: "text-indigo-600",
    active: "bg-indigo-600",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "text-red-600",
    active: "bg-red-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "text-emerald-600",
    active: "bg-emerald-600",
  },
};

export const CoursesSectionClient: React.FC<CoursesSectionClientProps> = ({
  categories,
  courses,
  initialShowFeatured,
  initialSelectedCategory,
  isLoading = false,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { handleEnrollFree, handleAddToCart, handleRemoveFromCart, handleBuyNow } = useQuickPayment();
  const { addToCheckout, removeFromCheckout, checkoutItems } = usePaymentStore();


  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [showFeatured, setShowFeatured] = useState(initialShowFeatured);
  const [showTrending, setShowTrending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );
  const [categoryLayout, setCategoryLayout] =
    useState<CategoryLayoutType>("tabs");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Check if user is enrolled in a course
  const isUserEnrolled = (course: any) => {
    if (!course.enrollments || !user?.id) return false;
    return course.enrollments.some((enrollment: any) => enrollment.userId === user.id);
  };

  // Get enrollment progress data
  const getEnrollmentData = (course: any) => {
    if (!course.enrollments || !user?.id) return null;
    
    // Find the specific enrollment for the current user
    const userEnrollment = course.enrollments.find((enrollment: any) => enrollment.userId === user.id);
    
    if (!userEnrollment) return null;
    
    return {
      progress: userEnrollment.progress || 0,
      timeSpent: userEnrollment.totalTimeSpent || 0,
      streakDays: userEnrollment.streakDays || 0,
      certificateEarned: userEnrollment.certificateEarned || false,
      lastWatchedLecture: userEnrollment.lastWatchedLecture,
      nextLessonId: userEnrollment.currentLessonId,
      completedLectures: userEnrollment.completedLectures || 0,
      totalLectures: userEnrollment.totalLectures || 0,
    };
  };

  // Action handlers for CourseCard
  const handleEnroll = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }

    try {
      const isFree = course.price === 0 || course.settings?.enrollmentType === "FREE";
      if (isFree) {
        await handleEnrollFree(course);
      } else {
        handleAddToCartAction(courseId);
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  const handleAddToCartAction = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }
    try {
      handleAddToCart(course);
    } catch (error) {
      console.error("Failed to add course to cart:", error);
      toast.error("Failed to add course to cart");
    }
  };

  const handleRemoveFromCartAction = async (courseId: string) => {
    try {
      handleRemoveFromCart(courseId);
    } catch (error) {
      console.error("Failed to remove course from cart:", error);
      toast.error("Failed to remove course from cart");
    }
  };

  const handleBuyNowAction = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }
    try {
      await handleBuyNow(course);
    } catch (error) {
      console.error("Failed to purchase course:", error);
      toast.error("Failed to purchase course");
    }
  };

  const handlePreview = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }
    router.push(`/courses/${courseId}`);
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/courses/${courseId}/learn`);
  };

  const handleShare = (course: Course) => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: `${window.location.origin}/courses/${course.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/courses/${course.id}`);
      toast.success("Course link copied to clipboard!");
    }
  };

  const handleTrackView = (courseId: string) => {
    // Track course view analytics here
    console.log("Course viewed:", courseId);
  };

  React.useEffect(() => {
    // Component is considered loaded when not in loading state
    if (!isLoading) {
      // Any initialization logic can go here
    }
  }, [isLoading]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Layout selector skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded mr-2"></div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded border"></div>
          ))}
        </div>
      </div>

      {/* Category tabs skeleton */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-200 min-w-fit flex-shrink-0">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex items-center justify-end gap-2 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded border"></div>
        ))}
      </div>

      {/* Course cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-0 h-[700px] flex flex-col">
              {/* Image skeleton */}
              <div className="relative h-64 w-full bg-gray-200 flex-shrink-0">
                <div className="absolute top-3 left-3">
                  <div className="h-6 w-16 bg-gray-300 rounded-full mb-2"></div>
                  <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <div className="space-y-1">
                    <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                    <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="h-5 w-12 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded ml-1"></div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center text-xs">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                      <div>
                        <div className="h-3 w-8 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              
              {/* Footer skeleton */}
              <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const toggleSavedCourse = (id: string) => {
    setSavedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const handleCategoryChange = (category: string) => {
    // If clicking the same category, toggle to "All" to show all courses
    if (selectedCategory === category) {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(category);
    }
    setIsDropdownOpen(false);
    // Keep the filters state and scroll position intact
  };

  const handleFeaturedToggle = () => {
    setShowFeatured(!showFeatured);
    if (showTrending) setShowTrending(false);
  };

  const handleTrendingToggle = () => {
    setShowTrending(!showTrending);
    if (showFeatured) setShowFeatured(false);
  };

  const handleShowAllCourses = () => {
    setShowFeatured(false);
    setShowTrending(false);
  };

  // Add color property to categories for grid layout
  const categoriesWithColors = categories.map((cat, index) => ({
    ...cat,
    color: Object.keys(colorClasses)[
      index % Object.keys(colorClasses).length
    ] as keyof typeof colorClasses,
  }));



  const selectedCategoryObj = categoriesWithColors.find(
    (cat) => cat.name === selectedCategory
  );
  const displayCategories = showAllCategories
    ? categoriesWithColors
    : categoriesWithColors.slice(0, 6);

  // Filter courses based on current state
  const filteredCourses = (() => {
    let filtered = courses;
    
    // First filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) => {
        // Normalize and compare categories (case-insensitive, trim whitespace)
        const courseCategory = course.category?.toLowerCase().trim();
        const selectedCategoryLower = selectedCategory?.toLowerCase().trim();
        
        // Handle different category formats
        const normalizedCourseCategory = courseCategory?.replace(/-/g, ' ').replace(/\s+/g, ' ');
        const normalizedSelectedCategory = selectedCategoryLower?.replace(/-/g, ' ').replace(/\s+/g, ' ');
        
        const matches = normalizedCourseCategory === normalizedSelectedCategory;
        

        
        return matches;
      });
    }
    
    // Then apply featured/trending filters
    if (showFeatured) {
      filtered = filtered.filter((course) => course.isFeatured);
    } else if (showTrending) {
      filtered = filtered.filter((course) => course.isTrending);
    }
    
    return filtered;
  })();

  // Layout Selector Component
  const LayoutSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 mr-2">Categories Layout:</span>
      {Object.entries(layoutIcons).map(([layout, icon]) => (
        <Button
          key={layout}
          variant="outline"
          size="sm"
          onClick={() => setCategoryLayout(layout as CategoryLayoutType)}
          className={cn(
            "p-2",
            categoryLayout === layout
              ? "bg-primary text-white border-primary"
              : "hover:bg-accent"
          )}
          title={layoutNames[layout as CategoryLayoutType]}
        >
          {icon}
        </Button>
      ))}
    </div>
  );

  // Horizontal Scrollable Tabs Layout
  const TabsLayout = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setScrollPosition(scrollLeft);
        setMaxScroll(Math.max(0, scrollWidth - clientWidth));
      }
    };

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const scrollAmount = 200;
        const currentScroll = scrollContainerRef.current.scrollLeft;
        const newScrollPosition =
          direction === "left"
            ? Math.max(0, currentScroll - scrollAmount)
            : Math.min(maxScroll, currentScroll + scrollAmount);

        scrollContainerRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
        
        // Update the stored position immediately
        scrollPositionRef.current = newScrollPosition;
      }
    };

    // Store scroll position when scrolling
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const currentScrollLeft = scrollContainerRef.current.scrollLeft;
        scrollPositionRef.current = currentScrollLeft;
        // Use requestAnimationFrame to avoid frequent state updates
        requestAnimationFrame(() => {
          setScrollPosition(currentScrollLeft);
          checkScrollButtons();
        });
      }
    };

    // Restore scroll position when tabs layout is selected or component mounts
    useEffect(() => {
      if (scrollContainerRef.current && categoryLayout === "tabs") {
        // Restore scroll position without triggering scroll events
        const container = scrollContainerRef.current;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = scrollPositionRef.current;
        
        // Re-enable smooth scrolling after position is set
        setTimeout(() => {
          if (container) {
            container.style.scrollBehavior = 'smooth';
          }
        }, 50);
        
        checkScrollButtons();
      }
    }, [categoryLayout]);

    useEffect(() => {
      checkScrollButtons();
      const handleResize = () => {
        checkScrollButtons();
        // Maintain scroll position on resize without smooth scrolling
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const currentBehavior = container.style.scrollBehavior;
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = scrollPositionRef.current;
          container.style.scrollBehavior = currentBehavior;
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const showLeftArrow = scrollPosition > 0;
    const showRightArrow = scrollPosition < maxScroll - 1; // Small buffer for precision

    return (
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-100 hover:bg-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-100 hover:bg-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit flex-shrink-0 relative",
                selectedCategory === cat.name
                  ? "bg-accent text-white shadow-lg"
                  : "bg-white/70 hover:bg-white text-gray-700 hover:shadow-md border border-gray-100"
              )}
              title={selectedCategory === cat.name ? `Click to show all courses` : `Filter by ${cat.name}`}
            >
              {cat.icon}
              <span className="font-medium">{cat.name}</span>
              {selectedCategory === cat.name && (
                <span className="ml-1 text-xs opacity-75">✕</span>
              )}
            </button>
          ))}
        </div>

        {/* Gradient Overlays */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-5" />
        )}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-5" />
        )}

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  };

  // Dropdown Layout
  const DropdownLayout = () => (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full sm:w-auto min-w-[200px] px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          {selectedCategoryObj?.icon}
          <span className="font-medium text-gray-800">{selectedCategory}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isDropdownOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isDropdownOpen && (
        <>
          <div className="absolute top-full left-0 right-0 sm:right-auto sm:min-w-[300px] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.name)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                title={selectedCategory === category.name ? `Click to show all courses` : `Filter by ${category.name}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {category.icon}
                  <div>
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {category.name}
                      {selectedCategory === category.name && (
                        <span className="text-xs text-gray-500">✕</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.description}
                    </div>
                  </div>
                </div>
                {selectedCategory === category.name && (
                  <Check className="h-4 w-4 text-accent" />
                )}
              </button>
            ))}
          </div>
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
          />
        </>
      )}
    </div>
  );

  // Grid Layout
  const GridLayout = () => {
    const CategoryCard = ({
      category,
      isSelected,
      onClick,
    }: {
      category: CourseCategory & { color: keyof typeof colorClasses };
      isSelected: boolean;
      onClick: () => void;
    }) => {
      const colors = colorClasses[category.color];

      return (
        <button
          onClick={onClick}
          className={cn(
            "relative p-3 rounded-xl border-2 transition-all duration-200 text-left group",
            isSelected
              ? `${colors.active} text-white shadow-lg transform -translate-y-1`
              : `${colors.bg} ${colors.border} hover:shadow-md hover:-translate-y-0.5`
          )}
          title={isSelected ? `Click to show all courses` : `Filter by ${category.name}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "p-2 rounded-lg",
                isSelected ? "bg-white/20" : "bg-white"
              )}
            >
              <div className={isSelected ? "text-white" : colors.icon}>
                {category.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h5
                className={cn(
                  "font-semibold",
                  isSelected ? "text-white" : colors.text
                )}
              >
                {category.name}
              </h5>
              {isSelected && (
                <span className="text-xs opacity-75">✕</span>
              )}
            </div>
          </div>
          <p
            className={cn(
              "text-sm",
              isSelected ? "text-white/90" : "text-gray-600"
            )}
          >
            {category.description}
          </p>
        </button>
      );
    };

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.name}
              onClick={() => handleCategoryChange(category.name)}
            />
          ))}
        </div>

        {categoriesWithColors.length > 6 && (
          <div className="text-center mb-4">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              {showAllCategories ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show More Categories ({categoriesWithColors.length - 6} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mt-8 mb-6">
        {/* Layout Selector */}
        <LayoutSelector />

        {/* Category Layouts */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            {categoryLayout === "tabs" && <TabsLayout />}
            {categoryLayout === "dropdown" && <DropdownLayout />}
            {categoryLayout === "grid" && <GridLayout />}
          </div>

          {/* Filter Buttons - Always visible and persistent */}
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-sm border border-gray-200 whitespace-nowrap transition-all duration-200",
                (!showFeatured && !showTrending) ? "bg-gray-100 text-gray-600" : "bg-white hover:bg-gray-50"
              )}
              onClick={handleShowAllCourses}
            >
              Show All Courses
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-sm border border-gray-200 whitespace-nowrap transition-all duration-200",
                showFeatured ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-white hover:bg-gray-50"
              )}
              onClick={handleFeaturedToggle}
            >
              <Star
                className={cn(
                  "h-4 w-4 mr-1",
                  showFeatured ? "fill-yellow-500 text-yellow-500" : "text-gray-500"
                )}
              />
              Featured
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-sm border border-gray-200 whitespace-nowrap transition-all duration-200",
                showTrending ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-white hover:bg-gray-50"
              )}
              onClick={handleTrendingToggle}
            >
              <TrendingUp
                className={cn(
                  "h-4 w-4 mr-1",
                  showTrending ? "fill-orange-500 text-orange-500" : "text-gray-500"
                )}
              />
              Trending
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      <CourseContainer
        key={selectedCategory + (showFeatured ? "-featured" : "") + (showTrending ? "-trending" : "")}
        isLoaded={!isLoading}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          filteredCourses.map((course) => {
            const isInCart = checkoutItems.some(item => item.courseId === course.id);
            const isEnrolled = isUserEnrolled(course);
            const enrollmentData = getEnrollmentData(course);
            
            return (
              <CourseCardWrapper key={course.id} course={course}>
                <CourseCard
                  course={course}
                  isSaved={savedCourses.includes(course.id)}
                  onToggleSave={toggleSavedCourse}
                  viewMode="grid"
                  isEnrolled={isEnrolled}
                  progress={enrollmentData?.progress || 0}
                  timeSpent={enrollmentData?.timeSpent || 0}
                  streakDays={enrollmentData?.streakDays || 0}
                  certificateEarned={enrollmentData?.certificateEarned || false}
                  lastWatchedLecture={enrollmentData?.lastWatchedLecture}
                  nextLessonId={enrollmentData?.nextLessonId}
                  completedLectures={enrollmentData?.completedLectures || 0}
                  totalLectures={enrollmentData?.totalLectures || 0}
                  onEnroll={handleEnroll}
                  onAddToCart={handleAddToCartAction}
                  onRemoveFromCart={handleRemoveFromCartAction}
                  onBuyNow={handleBuyNowAction}
                  onPreview={handlePreview}
                  onContinueLearning={handleContinueLearning}
                  onShare={handleShare}
                  onTrackView={handleTrackView}
                  isInCart={isInCart}
                />
              </CourseCardWrapper>
            );
          })
        )}
      </CourseContainer>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <EmptyStateWrapper>
          <h3 className="text-xl font-medium text-gray-600">
            No courses found
          </h3>
          <p className="text-gray-500 mt-2">
            {showFeatured || showTrending 
              ? `Try removing the ${showFeatured ? 'Featured' : 'Trending'} filter or selecting a different category`
              : "Try selecting a different category"
            }
          </p>
        </EmptyStateWrapper>
      )}

      {/* Browse All Button */}
      <BrowseButtonWrapper>
        <Link href="/courses" className="inline-block">
          <Button size="lg" className="bg-accent hover:bg-accent/90 px-8">
            Browse All Courses
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </BrowseButtonWrapper>
    </>
  );
};