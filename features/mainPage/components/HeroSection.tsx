"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import banner from "@/public/images/banner.png";
import { useSearchStore } from "@/store/search.store";
import { HeroSearch } from "./search/HeroSearch";
import { HeroImage } from "./hero/HeroImage";
import { AnimatedWrapper, fadeInLeft, fadeIn } from "./animations/AnimatedWrapper";

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const setShowNavbarSearch = useSearchStore((state) => state.setShowNavbarSearch);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbarSearch(!entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [setShowNavbarSearch]);

  return (
    <section className="w-full bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
      <div className="container w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <AnimatedWrapper animation={fadeInLeft} className="flex flex-col gap-6">
            <AnimatedWrapper
              animation={fadeIn}
              className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium w-fit"
            >
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-accent"></span>
              Now offering 2000+ new courses!
            </AnimatedWrapper>

            <AnimatedWrapper animation={fadeIn}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Find Expert Teachers Worldwide for{" "}
                <span className="text-accent">Every Passion</span> and School
                Subject
              </h1>
            </AnimatedWrapper>

            <AnimatedWrapper animation={fadeIn}>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                From academic excellence to creative mastery, our AI helps match
                you with the right mentor—live or on your schedule.
              </p>
            </AnimatedWrapper>

            <HeroSearch />

            <AnimatedWrapper animation={fadeIn} className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${
                      i * 100
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">10,000+</span>{" "}
                students joined this month
              </p>
            </AnimatedWrapper>
          </AnimatedWrapper>

          {/* Right Column - Image */}
          <HeroImage />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
