"use client";

import type { ProcessStepProps } from "../../types/landing.types";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export function ProcessStep({
  title,
  description,
  icon: Icon,
  stepNumber,
  delay = 0,
}: ProcessStepProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center space-y-4"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {stepNumber}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
