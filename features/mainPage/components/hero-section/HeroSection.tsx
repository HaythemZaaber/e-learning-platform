"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  TrendingUp,
  Play,
  Award,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import banner from "@/public/images/banner.png";
import { useSearchStore } from "@/stores/search.store";
import {
  AnimatedWrapper,
  fadeInLeft,
  fadeIn,
} from "../animations/AnimatedWrapper";
import { HeroImage } from "./HeroImage";
import { HeroSearch } from "./HeroSearch";
import { useRouter } from "next/navigation";

import { gql, useQuery } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      role
    }
  }
`;

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const setShowNavbarSearch = useSearchStore(
    (state) => state.setShowNavbarSearch
  );
  const observerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <section className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 " ref={observerRef}>
      <div className="container w-[90vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <AnimatedWrapper
            animation={fadeInLeft}
            className="flex flex-col gap-6"
          >
            <AnimatedWrapper
              animation={fadeIn}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-white text-sm font-medium w-fit shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Now offering 2000+ new courses!
            </AnimatedWrapper>

            <AnimatedWrapper animation={fadeIn}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Find Expert Teachers Worldwide for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Every Passion
                </span> and School Subject
              </h1>
            </AnimatedWrapper>

            <AnimatedWrapper animation={fadeIn}>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                From academic excellence to creative mastery, our AI helps match
                you with the right mentor—live or on your schedule. Join thousands of students learning from world-class instructors.
              </p>
            </AnimatedWrapper>

            <HeroSearch />

            {/* Course Statistics */}
            <AnimatedWrapper
              animation={fadeIn}
              className="grid grid-cols-3 gap-4 mt-6 "
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2000+</div>
                <div className="text-sm text-gray-600">Courses Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
            </AnimatedWrapper>

            <AnimatedWrapper
              animation={fadeIn}
              className="flex items-center gap-4 mt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-${i * 100} to-purple-${i * 100}`}
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
