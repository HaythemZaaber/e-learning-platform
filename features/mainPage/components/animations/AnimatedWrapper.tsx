"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedWrapperProps {
  children?: ReactNode;
  animation: {
    initial: any;
    animate: any;
    transition?: any;
  };
  className?: string;
}

export function AnimatedWrapper({
  children,
  animation,
  className = "",
}: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.7, ease: "easeOut" },
};
