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

interface CoursesSectionClientProps {
  categories: CourseCategory[];
  courses: Course[];
  initialShowFeatured: boolean;
  initialSelectedCategory: string;
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
}) => {
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFeatured, setShowFeatured] = useState(initialShowFeatured);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );
  const [categoryLayout, setCategoryLayout] =
    useState<CategoryLayoutType>("tabs");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Scroll functionality for horizontal tabs
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (categoryLayout === "tabs") {
      checkScrollButtons();
      window.addEventListener("resize", checkScrollButtons);
      return () => window.removeEventListener("resize", checkScrollButtons);
    }
  }, [categoryLayout, categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleSavedCourse = (id: string) => {
    setSavedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleFeaturedToggle = () => {
    setShowFeatured(!showFeatured);
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
  const filteredCourses =
    showFeatured && selectedCategory === "All"
      ? courses.filter((course) => course.featured)
      : selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

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
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const scrollAmount = 200; // Adjust this value to control scroll distance
        const newScrollPosition =
          direction === "left"
            ? Math.max(0, scrollPosition - scrollAmount)
            : Math.min(maxScroll, scrollPosition + scrollAmount);

        scrollContainerRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      }
    };

    useEffect(() => {
      checkScrollButtons();
      window.addEventListener("resize", checkScrollButtons);
      return () => window.removeEventListener("resize", checkScrollButtons);
    }, []);

    const showLeftArrow = scrollPosition > 0;
    const showRightArrow = scrollPosition < maxScroll;

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
          onScroll={checkScrollButtons}
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
                "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit",
                selectedCategory === cat.name
                  ? "bg-accent text-white shadow-lg"
                  : "bg-white/70 hover:bg-white text-gray-700 hover:shadow-md border border-gray-100"
              )}
            >
              {cat.icon}
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Gradient Overlays */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        )}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
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
              >
                <div className="flex items-center gap-2 flex-1">
                  {category.icon}
                  <div>
                    <div className="font-medium text-gray-800">
                      {category.name}
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
            <h5
              className={cn(
                "font-semibold",
                isSelected ? "text-white" : colors.text
              )}
            >
              {category.name}
            </h5>
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
        <div className="flex flex-col   gap-2">
          <div className="w-full">
            {categoryLayout === "tabs" && <TabsLayout />}
            {categoryLayout === "dropdown" && <DropdownLayout />}
            {categoryLayout === "grid" && <GridLayout />}
          </div>

          {/* Featured Toggle */}
          {selectedCategory === "All" && (
            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-sm border border-gray-200 whitespace-nowrap",
                  showFeatured ? "bg-accent/10 text-accent" : "bg-white"
                )}
                onClick={handleFeaturedToggle}
              >
                <Star
                  className={cn(
                    "h-4 w-4 mr-1",
                    showFeatured ? "fill-accent" : ""
                  )}
                />
                {showFeatured ? "Featured Courses" : "All Courses"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Courses Display */}
      <CourseContainer
        key={selectedCategory + (showFeatured ? "-featured" : "")}
        isLoaded={isLoaded}
      >
        {filteredCourses.map((course) => (
          <CourseCardWrapper key={course.id} course={course}>
            <CourseCard
              course={course}
              isSaved={savedCourses.includes(course.id)}
              onToggleSave={toggleSavedCourse}
              viewMode="grid"
              userRole="student"
            />
          </CourseCardWrapper>
        ))}
      </CourseContainer>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <EmptyStateWrapper>
          <h3 className="text-xl font-medium text-gray-600">
            No courses found
          </h3>
          <p className="text-gray-500 mt-2">
            Try selecting a different category
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
