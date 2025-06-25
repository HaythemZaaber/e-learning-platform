"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { BENEFITS_DATA } from "../../utils/constants";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container } from "../../layout/Container";
import SectionHead from "@/components/shared/SectionHead";

export function WhyVerifySection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="why-verify"
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
            title="Why Get Verified?"
            desc="Unlock your full earning potential and join our elite instructor community"
            tag="Verification"
          />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {BENEFITS_DATA.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 60 },
                animate: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
