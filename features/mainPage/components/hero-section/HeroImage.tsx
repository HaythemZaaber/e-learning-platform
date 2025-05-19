"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedWrapper, scaleIn, fadeIn } from "../animations/AnimatedWrapper";
import banner from "@/public/images/banner.png";

export function HeroImage() {
  return (
    <AnimatedWrapper animation={scaleIn} className="relative">
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src={banner}
            alt="Learning platform banner"
            className="w-full object-cover"
            priority
          />
          <div className="absolute inset-0 mix-blend-overlay" />
        </div>
      </motion.div>

      {/* Floating elements for decoration */}
      <AnimatedWrapper
        animation={fadeIn}
        className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-xl"
      />
      <AnimatedWrapper
        animation={fadeIn}
        className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-lg"
      />
    </AnimatedWrapper>
  );
} 