"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { TestimonialCardProps } from "../../types/landing.types";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Image from "next/image";

export function TestimonialCard({
  name,
  subject,
  earnings,
  quote,
  image,
  rating,
  delay = 0,
}: TestimonialCardProps) {
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
      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-600">{subject}</p>
              <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                {earnings}
              </Badge>
            </div>
          </div>
          <p className="text-gray-700 italic">"{quote}"</p>
          <div className="flex text-yellow-400">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
