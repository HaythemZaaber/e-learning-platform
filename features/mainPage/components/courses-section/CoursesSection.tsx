import React from "react";
import { CoursesSectionProps } from "../../types/coursesTypes";
import SectionHead from "@/components/shared/SectionHead";
import { CoursesSectionClient } from "./CoursesSectionClient";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { CourseCategory } from "@/types/courseTypes";
import { BookOpen } from "lucide-react";

const CoursesSection: React.FC<CoursesSectionProps> = ({
  showFeatured: initialShowFeatured = false,
  selectedCategory: initialSelectedCategory = "All",
}) => {
  // Fetch courses data using the hook
  const {
    courses,
    featuredCourses,
    trendingCourses,
    categories,
    isLoading,
    error,
  } = useCourses({
    featured: true,
    trending: true,
    limit: 6,
  });

  // Transform categories to match CourseCategory interface
  const transformedCategories: CourseCategory[] = React.useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.id,
      icon: <BookOpen className="h-4 w-4" />,
      description: `${category.count} courses available`,
      courseCount: category.count,
    }));
  }, [categories]);

  return (
    <section className="py-10 bg-gradient-to-b from-white to-primary/5">
      <div className="container w-[90vw]">
        <SectionHead
          tag="DISCOVER YOUR NEXT SKILL"
          title="Explore Our Courses"
          subTitle="Learn from top educators in various fields"
          desc="Choose from thousands of courses designed to help you master new skills, advance your career, or explore new passions."
        />

        <CoursesSectionClient
          categories={transformedCategories}
          courses={courses}
          initialShowFeatured={initialShowFeatured}
          initialSelectedCategory={initialSelectedCategory}
        />
      </div>
    </section>
  );
};

export default CoursesSection;
