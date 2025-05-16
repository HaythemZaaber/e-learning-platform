"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Bookmark,
  MoreHorizontal,
  Award,
} from "lucide-react";
import Image from "next/image";
import SectionHead from "../../shared/SectionHead";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import course from "@/public/images/courses/course.jpg";
import { cn } from "@/lib/utils";

// Enhanced course data with more information
const coursesData = [
  {
    id: 1,
    title: "JavaScript Mastery: From Beginner to Professional",
    category: "Programming",
    teacher: "Jane Doe",
    teacherRole: "Senior Developer",
    teacherAvatar: "/images/avatars/teacher1.jpg", // Placeholder
    rating: 4.8,
    ratingCount: 1248,
    duration: "12h 30m",
    lessons: 24,
    students: 3452,
    level: "Beginner",
    image: course,
    price: 49.99,
    originalPrice: 89.99,
    badge: "Trending",
    badgeColor: "bg-orange-500",
    description:
      "Master JavaScript fundamentals, ES6 features, async programming and build real-world applications.",
    lastUpdated: "April 2023",
    tags: ["Web Development", "Frontend", "JavaScript"],
    featured: true,
  },
  {
    id: 2,
    title: "Algebra Fundamentals: Equations & Functions",
    category: "Mathematics",
    teacher: "John Smith",
    teacherRole: "Math Professor",
    teacherAvatar: "/images/avatars/teacher2.jpg", // Placeholder
    rating: 4.6,
    ratingCount: 856,
    duration: "10h 15m",
    lessons: 18,
    students: 2156,
    level: "Intermediate",
    image: course,
    price: 39.99,
    originalPrice: 59.99,
    badge: "New",
    badgeColor: "bg-green-500",
    description:
      "Learn algebraic concepts, equations, inequalities, and functions with practical examples.",
    lastUpdated: "May 2023",
    tags: ["Mathematics", "Algebra", "Functions"],
    featured: false,
  },
  {
    id: 3,
    title: "French for Beginners: Conversational Fluency",
    category: "Languages",
    teacher: "Emma Brown",
    teacherRole: "Language Expert",
    teacherAvatar: "/images/avatars/teacher3.jpg", // Placeholder
    rating: 4.9,
    ratingCount: 2035,
    duration: "8h 45m",
    lessons: 32,
    students: 5689,
    level: "Beginner",
    image: course,
    price: 0,
    originalPrice: 49.99,
    badge: "Free",
    badgeColor: "bg-blue-500",
    description:
      "Start speaking French with confidence through practical conversation exercises and vocabulary building.",
    lastUpdated: "March 2023",
    tags: ["Languages", "French", "Conversation"],
    featured: true,
  },
  {
    id: 4,
    title: "Python Data Science Toolkit",
    category: "Programming",
    teacher: "Michael Chen",
    teacherRole: "Data Scientist",
    teacherAvatar: "/images/avatars/teacher4.jpg", // Placeholder
    rating: 4.7,
    ratingCount: 1532,
    duration: "15h 20m",
    lessons: 28,
    students: 4230,
    level: "Intermediate",
    image: course,
    price: 59.99,
    originalPrice: 99.99,
    badge: "Bestseller",
    badgeColor: "bg-purple-500",
    description:
      "Learn Python for data science, including pandas, NumPy, Matplotlib and machine learning basics.",
    lastUpdated: "June 2023",
    tags: ["Programming", "Data Science", "Python"],
    featured: true,
  },
  {
    id: 5,
    title: "Chemistry 101: Matter and Reactions",
    category: "Science",
    teacher: "Sarah Johnson",
    teacherRole: "Chemistry Professor",
    teacherAvatar: "/images/avatars/teacher5.jpg", // Placeholder
    rating: 4.5,
    ratingCount: 782,
    duration: "11h 45m",
    lessons: 22,
    students: 1856,
    level: "Beginner",
    image: course,
    price: 44.99,
    originalPrice: 69.99,
    badge: "",
    badgeColor: "",
    description:
      "Explore fundamental chemistry concepts including atoms, molecules, and chemical reactions.",
    lastUpdated: "May 2023",
    tags: ["Science", "Chemistry", "STEM"],
    featured: false,
  },
  {
    id: 6,
    title: "Digital Marketing Fundamentals",
    category: "More",
    teacher: "David Wilson",
    teacherRole: "Marketing Director",
    teacherAvatar: "/images/avatars/teacher6.jpg", // Placeholder
    rating: 4.8,
    ratingCount: 2145,
    duration: "9h 30m",
    lessons: 20,
    students: 6542,
    level: "Beginner",
    image: course,
    price: 54.99,
    originalPrice: 89.99,
    badge: "Hot",
    badgeColor: "bg-red-500",
    description:
      "Learn SEO, social media marketing, content strategy, and paid advertising fundamentals.",
    lastUpdated: "April 2023",
    tags: ["Marketing", "Digital", "Business"],
    featured: true,
  },
];

// Enhanced categories with icons
const categories = [
  { name: "All", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Programming", icon: <TrendingUp className="h-4 w-4" /> },
  { name: "Mathematics", icon: <CheckCircle2 className="h-4 w-4" /> },
  { name: "Languages", icon: <Users className="h-4 w-4" /> },
  { name: "Science", icon: <Award className="h-4 w-4" /> },
  { name: "More", icon: <MoreHorizontal className="h-4 w-4" /> },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Badge component with proper styling based on type
const CourseBadge = ({ text, color }: { text: string; color: string }) => {
  if (!text) return null;

  return (
    <Badge className={`${color} text-white font-medium px-2 py-1`}>
      {text === "Trending" && <TrendingUp className="h-3 w-3 mr-1" />}
      {text}
    </Badge>
  );
};

// Price display component with discount calculation
const PriceDisplay = ({
  price,
  originalPrice,
}: {
  price: number;
  originalPrice: number;
}) => {
  const discount =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  if (price === 0) {
    return <span className="text-green-600 font-bold">Free</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg">${price}</span>
      {originalPrice > price && (
        <>
          <span className="text-gray-400 line-through text-sm">
            ${originalPrice}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-md">
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
};

export default function CoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedCourses, setSavedCourses] = useState<number[]>([]);
  const [showFeatured, setShowFeatured] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleSavedCourse = (id: number) => {
    setSavedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const filteredCourses =
    showFeatured && selectedCategory === "All"
      ? coursesData.filter((course) => course.featured)
      : selectedCategory === "All"
      ? coursesData
      : coursesData.filter((course) => course.category === selectedCategory);

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50">
      <div className="container w-[90vw]">
        <SectionHead
          tag="DISCOVER YOUR NEXT SKILL"
          title="Explore Our Courses"
          subTitle="Learn from top educators in various fields"
          desc="Choose from thousands of courses designed to help you master new skills, advance your career, or explore new passions."
        />

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-6">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full sm:w-auto"
          >
            <TabsList className="flex flex-wrap h-auto bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-100 shadow-sm">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.name}
                  value={cat.name}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-white rounded-lg transition-all",
                    "data-[state=active]:shadow-md"
                  )}
                >
                  {cat.icon}
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {selectedCategory === "All" && (
            <div className="flex items-center mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-sm border border-gray-200",
                  showFeatured ? "bg-accent/10 text-accent" : "bg-white"
                )}
                onClick={() => setShowFeatured(!showFeatured)}
              >
                <Star
                  className={`h-4 w-4 mr-1 ${
                    showFeatured ? "fill-accent" : ""
                  }`}
                />
                {showFeatured ? "Featured Courses" : "All Courses"}
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + (showFeatured ? "-featured" : "")}
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course.id} variants={cardVariants} layout>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col bg-white rounded-xl py-0">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                    {/* Top badges and actions */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      {course.badge && (
                        <CourseBadge
                          text={course.badge}
                          color={course.badgeColor}
                        />
                      )}

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md",
                          savedCourses.includes(course.id)
                            ? "text-red-500"
                            : "text-gray-600"
                        )}
                        onClick={() => toggleSavedCourse(course.id)}
                      >
                        <Bookmark
                          className={cn(
                            "h-4 w-4",
                            savedCourses.includes(course.id)
                              ? "fill-red-500"
                              : ""
                          )}
                        />
                      </motion.button>
                    </div>

                    {/* Course level badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant="outline"
                        className="bg-black/50 backdrop-blur-sm text-white border-0"
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="bg-accent/10 text-accent border-0"
                      >
                        {course.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({course.ratingCount})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg line-clamp-2 mb-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {course.description}
                    </p>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1 opacity-70" />
                        <span className="text-xs">{course.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1 opacity-70" />
                        <span className="text-xs">
                          {course.lessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1 opacity-70" />
                        <span className="text-xs">
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mt-auto">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={
                            course.teacherAvatar ||
                            "https://via.placeholder.com/60"
                          }
                          alt={course.teacher}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{course.teacher}</p>
                        <p className="text-xs text-gray-500">
                          {course.teacherRole}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center">
                    <PriceDisplay
                      price={course.price}
                      originalPrice={course.originalPrice}
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Options
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>View Course</DropdownMenuItem>
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem>Add to Cart</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-medium text-gray-600">
              No courses found
            </h3>
            <p className="text-gray-500 mt-2">
              Try selecting a different category
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-10"
        >
          <Button size="lg" className="bg-accent hover:bg-accent/90 px-8">
            Browse All Courses
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Import only at the end to prevent cycle
import { ChevronRight, ChevronDown } from "lucide-react";
