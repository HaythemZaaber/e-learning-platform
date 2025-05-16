"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import banner from "@/public/images/banner.png";
import { useDispatch } from "react-redux";
import { setShowNavbarSearch } from "@/redux/slices/search.slice";

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch(setShowNavbarSearch(!entry.isIntersecting));
      },
      { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [setShowNavbarSearch]);

  return (
    <section className="w-full bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
      <div className="container w-[90vw] ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium w-fit"
            >
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-accent"></span>
              Now offering 2000+ new courses!
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
            >
              Find Expert Teachers Worldwide for{" "}
              <span className="text-accent">Every Passion</span> and School
              Subject
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg text-gray-600 max-w-lg leading-relaxed"
            >
              From academic excellence to creative mastery, our AI helps match
              you with the right mentor—live or on your schedule.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <div ref={observerRef} className="relative flex-grow max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  placeholder="Search for courses or subjects..."
                  className="pl-10 pr-4 py-6 w-full rounded-lg border border-gray-200 focus:border-accent focus:ring-accent"
                />
              </div>
              <Button
                className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-accent/25"
                size="lg"
              >
                Explore Courses
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-4 mt-4"
            >
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
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              animate={
                isLoaded
                  ? {
                      y: [0, -10, 0],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <div className="relative rounded-2xl overflow-hidden ">
                <Image
                  src={banner}
                  alt="Learning platform banner"
                  className="w-full object-cover"
                  priority
                />
                <div className="absolute inset-0  mix-blend-overlay" />
              </div>
            </motion.div>

            {/* Floating elements for decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
