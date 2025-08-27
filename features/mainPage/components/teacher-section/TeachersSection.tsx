"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Filter, Users, Star, Clock, GraduationCap, Award, DollarSign } from "lucide-react";
import { useInView } from "react-intersection-observer";
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

// GraphQL hooks
import { useInstructorsData } from "@/features/instructors/hooks/useInstructorsGraphQL";
import { useInstructorsStore } from "@/stores/instructors.store";

// Loading and error components
import {
  InstructorGridSkeleton,
  FeaturedInstructorHeroSkeleton,
  HeroStatsSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/ui/instructor-skeleton";

export default function TeachersHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // GraphQL data
  const {
    featuredInstructors,
    heroStats,
    transformedInstructors,
    loading,
    error,
  } = useInstructorsData();

  // Store actions and transformed data
  const { 
    toggleSavedInstructor, 
    isInstructorSaved,
    getFilteredInstructors
  } = useInstructorsStore();

  // Auto-rotate featured instructor
  useEffect(() => {
    if (transformedInstructors.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % transformedInstructors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [transformedInstructors.length]);

  const handleSave = (id: string) => {
    toggleSavedInstructor(id);
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredInstructors = transformedInstructors.filter((instructor) => {
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

  const featuredInstructor = transformedInstructors[activeIndex];

  // Loading states
  const isLoading = loading;
  const hasError = !!error;

  // Error state
  if (hasError) {
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
          <ErrorState
            error={error || "Failed to load instructors"}
            onRetry={() => window.location.reload()}
          />
        </div>
      </MotionSection>
    );
  }

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
          {isLoading ? (
            <FeaturedInstructorHeroSkeleton />
          ) : featuredInstructor ? (
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
                    <div className="relative">
                      <Image
                        src={featuredInstructor.avatar}
                        alt={featuredInstructor.name}
                        fill
                        className="object-cover rounded-t-xl rounded-lb-none md:rounded-tr-none md:rounded-l-xl"
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
                                        <div className="flex flex-col justify-center p-4">
                      <h3 className="text-xl font-bold mb-1">
                        {featuredInstructor.name}
                      </h3>
                      <p className="text-base text-indigo-600 mb-2">
                        {featuredInstructor.title}
                      </p>
                      
                      {/* Rating and Key Stats in one row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium text-sm">
                            {featuredInstructor.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-600 ml-1 text-sm">
                            ({featuredInstructor.reviewsCount.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {featuredInstructor.studentsCount.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {featuredInstructor.coursesCount}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {featuredInstructor.shortBio}
                      </p>

                      {/* Expertise - compact */}
                      {featuredInstructor.skills?.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {featuredInstructor.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700 px-2 py-0.5">
                                {skill.name}
                              </Badge>
                            ))}
                            {featuredInstructor.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5">
                                +{featuredInstructor.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Categories - compact */}
                      {featuredInstructor.categories?.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {featuredInstructor.categories.slice(0, 2).map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5">
                                {category}
                              </Badge>
                            ))}
                            {featuredInstructor.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs text-gray-500 px-2 py-0.5">
                                +{featuredInstructor.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Session Pricing - compact */}
                      {featuredInstructor.liveSessionsEnabled && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-purple-700">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">Session Rates</span>
                            </div>
                            <div className="text-purple-600">
                              ${featuredInstructor.priceRange?.min || 50} - ${featuredInstructor.priceRange?.max || 200}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Available Slot - compact */}
                      {featuredInstructor.liveSessionsEnabled && featuredInstructor.nextAvailableSlot && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-green-700">
                              <Clock className="h-4 w-4" />
                              <span>Next: {featuredInstructor.nextAvailableSlot.time}</span>
                            </div>
                            <span className="font-medium text-green-700">
                              ${featuredInstructor.nextAvailableSlot.price}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2">
                        <Link href={`/instructors/${featuredInstructor.id}`}>
                          View Profile <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </AnimatePresence>
          ) : (
            <EmptyState
              title="No Featured Instructors"
              description="We're currently setting up our featured instructors. Check back soon!"
            />
          )}
          
          {/* Pagination dots */}
          {transformedInstructors.length > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              {transformedInstructors.map((_, idx) => (
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
          )}
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

        {isLoading ? (
          <InstructorGridSkeleton count={6} view="grid" />
        ) : filteredInstructors.length > 0 ? (
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
                  isSaved={isInstructorSaved(instructor.id)}
                  onSave={handleSave}
                />
              </MotionDiv>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Instructors Found"
            description="No instructors match your current filter criteria. Try adjusting your filters."
            action={
              <Button onClick={() => setFilter("all")} variant="outline">
                Clear Filters
              </Button>
            }
          />
        )}

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
