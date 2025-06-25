"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { StatCardProps } from "../../types/landing.types";
import { AnimatedCounter } from "../interactive/AnimatedCounter";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
}: StatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const numericValue = Number.parseInt(value.replace(/[^\d]/g, ""));
  const suffix = value.replace(/[\d]/g, "");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {inView && (
              <AnimatedCounter
                end={numericValue}
                suffix={suffix}
                duration={2}
              />
            )}
          </div>
          <div className="text-sm text-gray-600">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
