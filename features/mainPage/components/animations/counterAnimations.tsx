"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const counterItemVariants: Variants = {
  hidden: (top: boolean) => ({
    opacity: 0,
    y: top ? 30 : -30,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const counterValueVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 200,
    },
  },
};

const counterTextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.5 },
  },
};

const pulseAnimation = {
  initial: { scale: 0.8, opacity: 0.5 },
  animate: {
    scale: [0.8, 1.2, 0.8],
    opacity: [0.5, 0.2, 0.5],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

// Wrapper Components
interface CounterContainerProps {
  children: ReactNode;
  className?: string;
  controls: any;
}

export const CounterContainer: React.FC<CounterContainerProps> = ({
  children,
  className = "",
  controls,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CounterHeadingProps {
  children: ReactNode;
  className?: string;
  controls: any;
}

export const CounterHeading: React.FC<CounterHeadingProps> = ({
  children,
  className = "",
  controls,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={headingVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CounterItemProps {
  children: ReactNode;
  className?: string;
  top: boolean;
}

export const CounterItem: React.FC<CounterItemProps> = ({
  children,
  className = "",
  top,
}) => {
  return (
    <motion.div
      custom={top}
      variants={counterItemVariants}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CounterValueProps {
  children: ReactNode;
  className?: string;
}

export const CounterValueWrapper: React.FC<CounterValueProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      variants={counterValueVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CounterTextProps {
  children: ReactNode;
  className?: string;
}

export const CounterText: React.FC<CounterTextProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.span variants={counterTextVariants} className={className}>
      {children}
    </motion.span>
  );
};

interface PulseWrapperProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PulseWrapper: React.FC<PulseWrapperProps> = ({
  children,
  className = "",
  style,
}) => {
  return (
    <motion.div className={className} style={style} {...pulseAnimation}>
      {children}
    </motion.div>
  );
};
