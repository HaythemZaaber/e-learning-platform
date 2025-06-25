"use client";

import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Container } from "../../layout/Container";
import Link from "next/link";

export function CTASection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <Container>
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-xl opacity-90">
            Join our community of passionate educators making a real impact
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/become-instructor/verification">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Begin Verification Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Schedule a Call with Our Team
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-8 text-sm opacity-75 flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.75 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span>✓ No upfront costs</span>
            <span>✓ 94% success rate</span>
            <span>✓ 2-3 day verification</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
