"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/types/courseTypes";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

interface CourseContainerProps {
  children: React.ReactNode;
  key: string;
  isLoaded: boolean;
}

export const CourseContainer: React.FC<CourseContainerProps> = ({
  children,
  key,
  isLoaded,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface CourseCardWrapperProps {
  children: React.ReactNode;
  course: Course;
}

export const CourseCardWrapper: React.FC<CourseCardWrapperProps> = ({
  children,
  course,
}) => {
  return (
    <motion.div key={course.id} variants={cardVariants} layout>
      {children}
    </motion.div>
  );
};

interface EmptyStateWrapperProps {
  children: React.ReactNode;
}

export const EmptyStateWrapper: React.FC<EmptyStateWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      {children}
    </motion.div>
  );
};

interface BrowseButtonWrapperProps {
  children: React.ReactNode;
}

export const BrowseButtonWrapper: React.FC<BrowseButtonWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-center mt-10"
    >
      {children}
    </motion.div>
  );
};
