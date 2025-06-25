"use client";

import { Container } from "../../layout/Container";
import { TestimonialCard } from "../ui/TestimonialCard";
import { TESTIMONIALS_DATA } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHead from "@/components/shared/SectionHead";

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="success-stories"
      className="py-20 bg-gradient-to-b from-white to-primary/5"
    >
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionHead
            title="Success Stories"
            desc="Hear from instructors who transformed their careers"
            tag="Testimonials"
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              subject={testimonial.subject}
              earnings={testimonial.earnings}
              quote={testimonial.quote}
              image={testimonial.image}
              rating={testimonial.rating}
              delay={index * 0.1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
