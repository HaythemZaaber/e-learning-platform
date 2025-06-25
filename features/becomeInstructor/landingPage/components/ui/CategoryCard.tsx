"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CategoryCardProps } from "../../types/landing.types";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export function CategoryCard({
  name,
  description,
  icon: Icon,
  delay = 0,
}: CategoryCardProps) {
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
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white group">
        <CardContent className="space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
