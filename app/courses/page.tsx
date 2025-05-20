'use client';

import { motion } from 'framer-motion';

import CoursesGrid from '@/features/courses/components/CourseGrid';
import { courses } from '@/features/courses/data/courses';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight sm:text-4xl mb-3"
        >
          Explore Our Courses
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground"
        >
          Discover a wide range of courses taught by expert instructors
        </motion.p>
      </div>
      
      <CoursesGrid courses={courses} />
    </div>
  );
}