"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Filter, Users, Star, Clock } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { instructors } from "@/data/instructorsData";
import { TeacherCard } from "./components/TeacherCard";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function TeachersHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % instructors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredInstructors = instructors.filter((instructor) => {
    switch (filter) {
      case "online":
        return instructor.isOnline;
      case "live":
        return instructor.liveSessionsEnabled;
      case "verified":
        return instructor.isVerified;
      default:
        return true;
    }
  });

  const featuredInstructor = instructors[activeIndex];

  return (
    <MotionSection
      className="py-16 sm:py-24 bg-gradient-to-b from-white to-primary/5"
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ duration: 0.5 }}
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto px-4">
        <MotionDiv
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
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
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 pr-8">
                  <div className="relative ">
                    <Image
                      src={featuredInstructor.avatar}
                      alt={featuredInstructor.name}
                      fill
                      className="object-cover rounded-t-xl rounded-lb-none md:rounded-tr-none md:rounded-l-xl "
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {featuredInstructor.isOnline && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Online
                        </Badge>
                      )}
                      {featuredInstructor.isVerified && (
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center gap-1">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-5">
                    <h3 className="text-2xl font-bold mb-2">
                      {featuredInstructor.name}
                    </h3>
                    <p className="text-lg text-indigo-600 mb-4">
                      {featuredInstructor.title}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">
                          {featuredInstructor.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600 ml-1">
                          ({featuredInstructor.reviewsCount.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-1" />
                        {featuredInstructor.studentsCount.toLocaleString()}{" "}
                        students
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6">
                      {featuredInstructor.shortBio}
                    </p>
                    {featuredInstructor.liveSessionsEnabled &&
                      featuredInstructor.nextAvailableSlot && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-purple-700">
                              <Clock className="h-5 w-5" />
                              <span>
                                Next Session:{" "}
                                {featuredInstructor.nextAvailableSlot.time}
                              </span>
                            </div>
                            <span className="font-medium text-purple-700">
                              ${featuredInstructor.nextAvailableSlot.price}
                            </span>
                          </div>
                        </div>
                      )}
                    <Button asChild className="w-full">
                      <Link href={`/instructors/${featuredInstructor.id}`} >
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
          <div className="flex justify-center mt-6 gap-2">
            {instructors.map((_, idx) => (
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">All Instructors</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter instructors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instructors</SelectItem>
              <SelectItem value="online">Online Now</SelectItem>
              <SelectItem value="live">Live Sessions</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredInstructors.slice(0, 6).map((instructor, i) => (
            <MotionDiv
              key={instructor.id}
              initial="initial"
              animate={inView ? "animate" : "initial"}
              variants={fadeInUpStagger}
              transition={{ duration: 0.2, delay: i * 0.01 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <TeacherCard
                instructor={instructor}
                isSaved={saved.includes(instructor.id)}
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
              View All Instructors <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
