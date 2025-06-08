"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { teachers } from "../../data/teachersData";
import { TeacherCard } from "./components/TeacherCard";
import { FeaturedTeacher } from "./components/FeaturedTeacher";
import { AnimatePresence } from "framer-motion";
import {
  MotionDiv,
  MotionSection,
  fadeInUp,
  fadeIn,
  slideIn,
  fadeInUpStagger,
} from "../animations/TeacherAnimations";
import SectionHead from "@/components/shared/SectionHead";
import Link from "next/link";

export default function TeachersHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teachers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSave = (id: number) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <MotionSection
      className="py-16 sm:py-24 bg-gradient-to-b from-white to-primary/5"
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ duration: 0.5 }}
      variants={fadeIn}
    >
      <div className="max-w-6xl mx-auto px-4">
        <MotionDiv
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* <Badge
            variant="outline"
            className="mb-4 py-1 px-4 bg-indigo-100 text-indigo-800 border-indigo-200"
          >
            <Sparkles size={14} className="mr-1" /> Premium Education
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Learn From <span className="text-indigo-600">World-Class</span>{" "}
            Teachers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with expert educators who are passionate about helping you
            achieve your academic goals and unlock your full potential.
          </p> */}
          <SectionHead
            tag="LEARN FROM WORLD-CLASS TEACHERS"
            title="Learn From "
            subTitle="World-Class Teachers"
            desc="Connect with expert educators who are passionate about helping you achieve your academic goals and unlock your full potential."
          />
        </MotionDiv>

        <MotionDiv
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={slideIn}
              transition={{ duration: 0.5 }}
            >
              <FeaturedTeacher
                teacher={teachers[activeIndex]}
                isSaved={saved.includes(teachers[activeIndex].id)}
                onSave={toggleSave}
              />
            </MotionDiv>
          </AnimatePresence>

          <div className="flex justify-center mt-6 gap-2">
            {teachers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-8 bg-indigo-600" : "w-2 bg-gray-300"
                }`}
                aria-label={`Select teacher ${idx + 1}`}
              />
            ))}
          </div>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.map((teacher, i) => (
            <MotionDiv
              key={teacher.id}
              initial="initial"
              animate={inView ? "animate" : "initial"}
              variants={fadeInUpStagger}
              transition={{ duration: 0.2, delay: i * 0.01 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <TeacherCard
                teacher={teacher}
                isSaved={saved.includes(teacher.id)}
                onSave={toggleSave}
              />
            </MotionDiv>
          ))}
        </div>

        <MotionDiv
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/instructors">
          <Button size="lg" className="mx-auto">
            View All Teachers <ArrowRight size={16} className="ml-2" />
          </Button>
          </Link>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
