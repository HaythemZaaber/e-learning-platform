"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";
import { Course, Category } from "../../types/coursesTypes";
import { CourseCard } from "../../../../components/shared/CourseCard";
import { cn } from "@/lib/utils";
import {
  CourseContainer,
  CourseCardWrapper,
  EmptyStateWrapper,
  BrowseButtonWrapper,
} from "../animations/courseAnimations";

interface CoursesSectionClientProps {
  categories: Category[];
  courses: Course[];
  initialShowFeatured: boolean;
  initialSelectedCategory: string;
}

export const CoursesSectionClient: React.FC<CoursesSectionClientProps> = ({
  categories,
  courses,
  initialShowFeatured,
  initialSelectedCategory,
}) => {
  const [savedCourses, setSavedCourses] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFeatured, setShowFeatured] = useState(initialShowFeatured);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleSavedCourse = (id: number) => {
    setSavedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleFeaturedToggle = () => {
    setShowFeatured(!showFeatured);
  };

  // Filter courses on the client side based on current state
  const filteredCourses =
    showFeatured && selectedCategory === "All"
      ? courses.filter((course) => course.featured)
      : selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  console.log("filteredCourses", filteredCourses);
  console.log("selectedCategory", selectedCategory);
  console.log("showFeatured", showFeatured);
  console.log("courses", courses);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-6">
        <Tabs
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex flex-wrap h-auto bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-100 shadow-sm">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.name}
                value={cat.name}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-white rounded-lg transition-all",
                  "data-[state=active]:shadow-md"
                )}
              >
                {cat.icon}
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {selectedCategory === "All" && (
          <div className="flex items-center mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-sm border border-gray-200",
                showFeatured ? "bg-accent/10 text-accent" : "bg-white"
              )}
              onClick={handleFeaturedToggle}
            >
              <Star
                className={`h-4 w-4 mr-1 ${showFeatured ? "fill-accent" : ""}`}
              />
              {showFeatured ? "Featured Courses" : "All Courses"}
            </Button>
          </div>
        )}
      </div>

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
            />
          </CourseCardWrapper>
        ))}
      </CourseContainer>

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

      <BrowseButtonWrapper>
        <Button size="lg" className="bg-accent hover:bg-accent/90 px-8">
          Browse All Courses
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </BrowseButtonWrapper>
    </>
  );
};
