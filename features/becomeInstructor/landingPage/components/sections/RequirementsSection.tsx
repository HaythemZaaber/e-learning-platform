"use client";

import { Container } from "../../layout/Container";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHead from "@/components/shared/SectionHead";

export function RequirementsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const requiredItems = [
    "Government-issued ID",
    "Teaching experience or relevant degree",
    "Reliable internet connection",
  ];

  const recommendedItems = [
    "Professional headshot",
    "Sample lesson plan or portfolio",
    "Teaching certifications",
  ];

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
            title="What You'll Need"
            desc="Simple requirements to get started"
            tag="Requirements"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 h-full">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  Required
                </h3>
                <ul className="space-y-3">
                  {requiredItems.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 h-full">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 text-blue-500 mr-2" />
                  Recommended
                </h3>
                <ul className="space-y-3">
                  {recommendedItems.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Star className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
