"use client";

import { motion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className = "",
  once = false,
  threshold = 0.1,
}) => {
  const getInitialDirection = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 40 };
      case "down":
        return { opacity: 0, y: -40 };
      case "left":
        return { opacity: 0, x: 40 };
      case "right":
        return { opacity: 0, x: -40 };
      default:
        return { opacity: 0, y: 40 };
    }
  };

  const getFinalDirection = () => {
    return direction === "left" || direction === "right"
      ? { opacity: 1, x: 0 }
      : { opacity: 1, y: 0 };
  };

  return (
    <motion.div
      initial={getInitialDirection()}
      whileInView={getFinalDirection()}
      viewport={{ once, amount: threshold }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  once = false,
  threshold = 0.1,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "right",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "right" ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === "right" ? -20 : 20 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface HoverAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
