"use client";

import { useRef } from "react";
import { FadeIn } from "../animations/testimonialsAnimations";
import { Testimonial } from "../../types/testimonialsTypes";
import TestimonialCard from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  onTestimonialClick: (testimonial: Testimonial) => void;
  inView: boolean;
}

export default function TestimonialCarousel({
  testimonials,
  currentSlide,
  setCurrentSlide,
  onTestimonialClick,
  inView,
}: TestimonialCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <FadeIn className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          All Testimonials
        </h3>
      </FadeIn>

      <div
        ref={carouselRef}
        className="overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-w-full">
            {testimonials.map((testimonial, idx) => (
              <FadeIn
                key={testimonial.id}
                delay={idx * 0.1 + 0.3}
                direction="up"
                className="h-full"
                threshold={0.1}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  onClick={() => onTestimonialClick(testimonial)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
