"use client";

import { CategoryCard } from "../ui/CategoryCard";
import { TEACHING_CATEGORIES } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container } from "../../layout/Container";
import SectionHead from "@/components/shared/SectionHead";

export function TeachingCategories() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary/5">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionHead
            title="Teach Anything You're Passionate About"
            desc="From academic subjects to life skills - there's a place for every expertise"
            tag="Teaching Categories"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEACHING_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              description={category.description}
              icon={category.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
