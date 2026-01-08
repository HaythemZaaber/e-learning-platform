"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, Award } from "lucide-react";
import { useCoursesStore } from "@/stores/courses.store";

// Define banner animation variants
const bannerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const CoursesBanner = () => {
  const { courses, featuredCourses, isLoading } = useCoursesStore();

  // Calculate course statistics from real data
  const courseStats = useMemo(() => {
    if (isLoading || courses.length === 0) {
      return {
        totalCourses: 0,
        totalStudents: 0,
        avgRating: "0.0",
        featuredCount: 0,
      };
    }

    const totalStudents = courses.reduce(
      (sum: number, course: any) => sum + (course.currentEnrollments || 0),
      0
    );
    const avgRating =
      courses.reduce(
        (sum: number, course: any) => sum + (course.avgRating || 0),
        0
      ) / courses.length;
    const featuredCount = courses.filter(
      (course: any) => course.isFeatured
    ).length;

    return {
      totalCourses: courses.length,
      totalStudents,
      avgRating: avgRating.toFixed(1),
      featuredCount,
    };
  }, [courses, isLoading]);

  return (
    <div>
      <motion.div
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Your Next
              <br />
              <span className="text-yellow-300">Learning Journey</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Explore thousands of courses taught by industry experts and
              transform your career today
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">
                  {courseStats.totalCourses}+
                </div>
                <div className="text-blue-200 text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">
                  {courseStats.totalStudents.toLocaleString()}+
                </div>
                <div className="text-blue-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">
                  {courseStats.avgRating}
                </div>
                <div className="text-blue-200 text-sm">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold">
                  {courseStats.featuredCount}
                </div>
                <div className="text-blue-200 text-sm">Featured</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-lg"></div>
      </motion.div>
    </div>
  );
};

export default CoursesBanner;
