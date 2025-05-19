"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Bookmark,
  ChevronDown,
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
import { Course } from "../../features/mainPage/types/courses";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

const CourseBadge = ({ text, color }: { text: string; color: string }) => {
  if (!text) return null;

  return (
    <Badge className={`${color} text-white font-medium px-2 py-1`}>
      {text}
    </Badge>
  );
};

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

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSaved,
  onToggleSave,
}) => {
  return (
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
            <CourseBadge text={course.badge} color={course.badgeColor} />
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md",
              isSaved ? "text-red-500" : "text-gray-600"
            )}
            onClick={() => onToggleSave(course.id)}
          >
            <Bookmark
              className={cn("h-4 w-4", isSaved ? "fill-red-500" : "")}
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
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-gray-500 ml-1">
              ({course.ratingCount})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-lg line-clamp-2 mb-2">{course.title}</h3>

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
            <span className="text-xs">{course.lessons} lessons</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1 opacity-70" />
            <span className="text-xs">{course.students.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center mt-auto">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src={course.teacherAvatar || "https://via.placeholder.com/60"}
              alt={course.teacher}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{course.teacher}</p>
            <p className="text-xs text-gray-500">{course.teacherRole}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center">
        <PriceDisplay
          price={course.price}
          originalPrice={course.originalPrice}
        />

        <DropdownMenu modal={false}>
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
  );
};
