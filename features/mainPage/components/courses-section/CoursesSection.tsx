import React from "react";
import { CoursesSectionProps } from "../../types/courses";
import { coursesData, categories } from "../../data/courses";
import SectionHead from "@/components/shared/SectionHead";
import { CoursesSectionClient } from "./CoursesSectionClient";

const CoursesSection: React.FC<CoursesSectionProps> = ({
  showFeatured: initialShowFeatured = true,
  selectedCategory: initialSelectedCategory = "All",
}) => {
  // Filter courses on the server side
  //   const filteredCourses =
  //     initialShowFeatured && initialSelectedCategory === "All"
  //       ? coursesData.filter((course) => course.featured)
  //       : initialSelectedCategory === "All"
  //       ? coursesData
  //       : coursesData.filter(
  //           (course) => course.category === initialSelectedCategory
  //         );

  return (
    <section className="py-10 bg-gradient-to-br from-white to-gray-50">
      <div className="container w-[90vw]">
        <SectionHead
          tag="DISCOVER YOUR NEXT SKILL"
          title="Explore Our Courses"
          subTitle="Learn from top educators in various fields"
          desc="Choose from thousands of courses designed to help you master new skills, advance your career, or explore new passions."
        />

        <CoursesSectionClient
          categories={categories}
          //   courses={filteredCourses}
          courses={coursesData}
          initialShowFeatured={initialShowFeatured}
          initialSelectedCategory={initialSelectedCategory}
        />
      </div>
    </section>
  );
};

export default CoursesSection;
