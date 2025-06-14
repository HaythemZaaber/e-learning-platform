"use client";

import { motion } from "framer-motion";

import CoursesGrid from "@/features/courses/components/CourseGrid";
// import { courses } from "@/features/courses/data/coursesData";
import CoursesBanner from "@/features/courses/components/CoursesBanner";

export default function CoursesPage() {
  return (
    <div>
      <CoursesBanner />

      <div className=" w-[90%] mx-auto">
        <CoursesGrid />
      </div>
    </div>
  );
}
