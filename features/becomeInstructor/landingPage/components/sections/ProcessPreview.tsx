"use client";

import { ProcessStep } from "../ui/ProcessStep";
import { VERIFICATION_STEPS } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container } from "../../layout/Container";
import SectionHead from "@/components/shared/SectionHead";

export function ProcessPreview() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="process"
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
            title="Simple 4-Step Verification Process"
            desc="Get verified in just 2-3 days with our streamlined process"
            tag="Process"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VERIFICATION_STEPS.map((step, index) => (
            <ProcessStep
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              stepNumber={index + 1}
              delay={index * 0.1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
