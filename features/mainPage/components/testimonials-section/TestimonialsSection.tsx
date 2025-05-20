"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SectionHead from "@/components/shared/SectionHead";
import {
  testimonials,
  getFeaturedTestimonials,
} from "../../data/testimonialsData";
import FeaturedTestimonial from "./FeaturedTestimonial";
import TestimonialCarousel from "./TestimonialsCarousel";
import TestimonialModal from "./TestimonialsModal";
import { Testimonial } from "../../types/testimonialsTypes";

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] =
    useState<Testimonial | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const featuredTestimonials = getFeaturedTestimonials();

  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-primary/10"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionHead
            tag="TESTIMONIALS"
            title="What Our Students Say"
            subTitle="Hear from our valued learners"
            desc="Discover why our students choose us for their learning journey."
          />
        </motion.div>

        {/* Featured Testimonial */}
        <FeaturedTestimonial
          featuredTestimonials={featuredTestimonials}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* All Testimonials Carousel */}
        <TestimonialCarousel
          testimonials={testimonials}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          onTestimonialClick={setActiveTestimonial}
          inView={inView}
        />

        {/* Testimonial Modal */}
        <TestimonialModal
          testimonial={activeTestimonial}
          onClose={() => setActiveTestimonial(null)}
        />
      </div>
    </section>
  );
}
