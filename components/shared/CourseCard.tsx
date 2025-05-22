"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Bookmark,
  ChevronDown,
  Play,
  Eye,
  ShoppingCart,
  Award,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "../../features/mainPage/types/coursesTypes";
import { cn } from "@/lib/utils";
import { CourseBadgeColor } from "@/features/mainPage/types/coursesTypes";

interface CourseCardProps {
  course: Course;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  className?: string;
  viewMode: "grid" | "list";
}

const CourseBadge = ({
  text,
  color,
}: {
  text: string;
  color: CourseBadgeColor | undefined;
}) => {
  if (!text) return null;

  const colorClasses = {
    primary: "bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary/90 text-secondary-foreground",
    accent: "bg-accent/90 text-accent-foreground",
    success: "bg-emerald-500/90 text-white",
    warning: "bg-amber-500/90 text-white",
    error: "bg-destructive/90 text-white",
    info: "bg-blue-500/90 text-white",
  };

  return (
    <Badge
      className={cn(
        "font-medium px-2 py-1 text-xs",
        colorClasses[color || "primary"]
      )}
    >
      {text}
    </Badge>
  );
};

const PriceDisplay = ({
  price,
  originalPrice,
  size = "md",
  className,
}: {
  price: number;
  originalPrice: number | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("font-bold text-gray-900", sizeClasses[size])}>
        {price === 0 ? (
          <span className="text-emerald-600">Free</span>
        ) : (
          `$${price.toFixed(2)}`
        )}
      </div>

      {hasDiscount && (
        <>
          <div className="text-gray-500 line-through text-sm">
            ${originalPrice.toFixed(2)}
          </div>
          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
            -{discountPercentage}%
          </Badge>
        </>
      )}
    </div>
  );
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSaved,
  onToggleSave,
  className,
  viewMode,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const GridView = () => (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full flex flex-col bg-white rounded-xl group",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top badges and actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex gap-2">
            {course.badge && (
              <CourseBadge text={course.badge} color={course.badgeColor} />
            )}
            {course.featured && (
              <Badge className="bg-yellow-500/90 text-white text-xs">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-2 rounded-full backdrop-blur-sm shadow-md transition-colors duration-200",
              isSaved
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            )}
            onClick={() => onToggleSave(course.id)}
          >
            <Bookmark className={cn("h-4 w-4", isSaved ? "fill-white" : "")} />
          </motion.button>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
            {course.level}
          </Badge>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {course.duration}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-0 text-xs"
          >
            {course.category}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{course.rating}</span>
            <span className="text-xs text-gray-500 ml-1">
              ({course.ratingCount})
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src={course.teacherAvatar || "/api/placeholder/32/32"}
              alt={course.teacher}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="ml-2 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {course.teacher}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {course.teacherRole}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 py-2 border-t border-gray-100 flex justify-between flex-wrap gap-4 items-center">
        <PriceDisplay
          price={course.price}
          originalPrice={course.originalPrice}
          size="md"
        />

        <div className="flex gap-2 justify-end ml-auto">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Eye className="h-4 w-4 mr-1" />
                Preview
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Play className="h-4 w-4 mr-2" />
                Preview Course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="rounded-lg">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Enroll Now
          </Button>
        </div>

        {/* <Button size="sm" className="rounded-lg">
          Enroll Now
        </Button> */}
      </CardFooter>
    </Card>
  );

  const ListView = () => (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white rounded-xl group",
        className
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-80 md:h-56 aspect-video md:aspect-auto flex-shrink-0 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {course.badge && (
              <CourseBadge text={course.badge} color={course.badgeColor} />
            )}
            {course.featured && (
              <Badge className="bg-yellow-500/90 text-white text-xs w-fit">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>

          {/* Level badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
              {course.level}
            </Badge>
          </div>

          {/* Save button */}
          <div className="absolute top-3 right-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm shadow-md transition-colors duration-200",
                isSaved
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-600 hover:bg-white"
              )}
              onClick={() => onToggleSave(course.id)}
            >
              <Bookmark
                className={cn("h-4 w-4", isSaved ? "fill-white" : "")}
              />
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow p-6 sm:py-2 flex flex-col">
          <div className="flex-grow">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-0 text-xs"
                >
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.duration}
                </Badge>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm font-semibold">{course.rating}</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({course.ratingCount})
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {course.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-yellow-500" />
                <span>{course.level}</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={course.teacherAvatar || "/api/placeholder/40/40"}
                  alt={course.teacher}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{course.teacher}</p>
                <p className="text-sm text-gray-500">{course.teacherRole}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            <PriceDisplay
              price={course.price}
              originalPrice={course.originalPrice}
              size="lg"
            />

            <div className="flex gap-2">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Play className="h-4 w-4 mr-2" />
                    Preview Course
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" className="rounded-lg">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      layout
      whileHover={{ y: viewMode === "grid" ? -5 : 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </motion.div>
  );
};
