"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Sparkles, Bookmark } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import course from "@/public/images/courses/course.jpg";

// Define TypeScript interface for teacher data
interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  image: StaticImageData;
  bio: string;
  achievements?: string[];
  availability?: string;
  featured?: boolean;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Sarah Malik",
    subject: "Mathematics",
    rating: 4.8,
    image: course,
    bio: "Ph.D. in Applied Math with 10+ years of teaching experience. Specializes in calculus and algebra.",
    achievements: ["Excellence in Teaching Award", "Published Researcher"],
    availability: "Mon, Wed, Fri",
    featured: true,
  },
  {
    id: 2,
    name: "Mohamed Ben Ali",
    subject: "Physics",
    rating: 4.7,
    image: course,
    bio: "Experienced high school teacher and Olympiad trainer with a passion for making complex concepts simple.",
    achievements: ["National Science Fair Judge", "10+ Years Experience"],
    availability: "Tue, Thu, Sat",
  },
  {
    id: 3,
    name: "Laura Nguyen",
    subject: "English Literature",
    rating: 4.9,
    image: course,
    bio: "Specialist in English classics and language training. Former editor and published author.",
    achievements: ["Published Author", "Master's in Literature"],
    availability: "Mon, Tue, Thu",
    featured: true,
  },
];

export default function TeachersHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Auto carousel for featured teachers
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
    <section
      className="py-20 bg-gradient-to-b from-indigo-50 to-white"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
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
          </p>
        </motion.div>

        {/* Featured Teacher Spotlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full"
                  >
                    <Image
                      src={teachers[activeIndex].image}
                      alt={teachers[activeIndex].name}
                      fill
                      className="object-cover"
                    />
                    {teachers[activeIndex].featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          Featured Teacher
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {teachers[activeIndex].name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-3">
                      {teachers[activeIndex].subject}
                    </p>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={18}
                          className={`${
                            idx < Math.round(teachers[activeIndex].rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          } mr-1`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">
                        {teachers[activeIndex].rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-6">
                      {teachers[activeIndex].bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {teachers[activeIndex].achievements?.map(
                        (achievement, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-gray-100"
                          >
                            {achievement}
                          </Badge>
                        )
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Book a Session <ArrowRight size={16} className="ml-2" />
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleSave(teachers[activeIndex].id)}
                          className={
                            saved.includes(teachers[activeIndex].id)
                              ? "text-pink-600"
                              : ""
                          }
                        >
                          <Bookmark
                            size={18}
                            className={
                              saved.includes(teachers[activeIndex].id)
                                ? "fill-pink-600"
                                : ""
                            }
                          />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Teacher selector dots */}
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
        </motion.div>

        {/* Teacher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="rounded-2xl shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={() => toggleSave(teacher.id)}
                  >
                    <Bookmark
                      size={18}
                      className={
                        saved.includes(teacher.id)
                          ? "fill-pink-600 text-pink-600"
                          : ""
                      }
                    />
                  </Button>
                </div>
                <CardContent className="p-6 text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-2">
                    {teacher.subject}
                  </p>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={`${
                          idx < Math.round(teacher.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } mr-1`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {teacher.rating.toFixed(1)}
                    </span>
                  </div>

                  {teacher.availability && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Available: </span>
                      {teacher.availability}
                    </div>
                  )}

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {teacher.bio}
                  </p>

                  <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 mt-2">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="mx-auto">
            View All Teachers <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
