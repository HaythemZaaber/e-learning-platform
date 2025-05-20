"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TestimonialStars from "./TestimonialsStars";
import { Testimonial } from "../../types/testimonialsTypes";

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
}

export default function TestimonialModal({
  testimonial,
  onClose,
}: TestimonialModalProps) {
  if (!testimonial) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-lg w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="flex items-center mb-6">
            <Avatar className="w-16 h-16 border-2 border-blue-100">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {testimonial.fallback}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-bold text-lg">{testimonial.name}</div>
              <div className="text-blue-600">{testimonial.course}</div>
              <TestimonialStars rating={testimonial.rating} className="mt-1" />
            </div>
          </div>

          <div className="mb-4">
            <Quote size={24} className="text-blue-400 opacity-50 mb-2" />
            <p className="text-gray-700 leading-relaxed">
              "{testimonial.review}"
            </p>
          </div>

          {testimonial.date && (
            <div className="text-sm text-gray-500 mt-6 text-right">
              Published on {testimonial.date}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
