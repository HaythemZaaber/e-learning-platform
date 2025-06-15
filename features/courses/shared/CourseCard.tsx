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
  Edit,
  BarChart3,
  Settings,
  DollarSign,
  Calendar,
  Shield,
  UserCheck,
  Trash2,
  Copy,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { CourseBadgeColor } from "@/features/mainPage/types/coursesTypes";
import { useRouter } from "next/navigation";
import { Course } from "@/types/courseTypes";

type UserRole = "learner" | "instructor" | "parent" | "admin";

interface CourseCardProps {
  course: Course;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  className?: string;
  viewMode: "grid" | "list";
  userRole: UserRole;
  // Optional props for different roles
  isEnrolled?: boolean; // for learners
  progress?: number; // for learners (0-100)
  isOwnCourse?: boolean; // for instructors
  revenue?: number; // for instructors
  childProgress?: number; // for parents
  moderationStatus?: "pending" | "approved" | "rejected"; // for admin
  isInstructorDashboard?: boolean; // to differentiate instructor dashboard vs public course list
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
  userRole,
  revenue,
}: {
  price: number;
  originalPrice: number | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
  userRole: UserRole;
  revenue?: number;
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

  // Show revenue for instructors
  if (userRole === "instructor" && revenue !== undefined) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className={cn("font-bold text-green-600", sizeClasses[size])}>
          Revenue: ${revenue.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          Price: {price === 0 ? "Free" : `$${price.toFixed(2)}`}
        </div>
      </div>
    );
  }

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

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const getRoleSpecificActions = (
  userRole: UserRole,
  course: Course,
  isEnrolled?: boolean,
  isOwnCourse?: boolean,
  moderationStatus?: "pending" | "approved" | "rejected"
) => {
  switch (userRole) {
    case "learner":
      if (isEnrolled) {
        return {
          primary: {
            icon: Play,
            label: "Continue Learning",
            action: "continue",
          },
          secondary: { icon: BookOpen, label: "View Course", action: "view" },
        };
      } else {
        return {
          primary: {
            icon: ShoppingCart,
            label: "Enroll Now",
            action: "enroll",
          },
          secondary: { icon: Eye, label: "Preview", action: "preview" },
        };
      }

    case "instructor":
      if (isOwnCourse) {
        return {
          primary: { icon: Edit, label: "Edit Course", action: "edit" },
          secondary: {
            icon: BarChart3,
            label: "Analytics",
            action: "analytics",
          },
        };
      } else {
        return {
          primary: { icon: Eye, label: "View Course", action: "view" },
          secondary: { icon: Copy, label: "Duplicate", action: "duplicate" },
        };
      }

    case "parent":
      return {
        primary: {
          icon: UserCheck,
          label: "Enroll Child",
          action: "enroll_child",
        },
        secondary: { icon: Eye, label: "Preview", action: "preview" },
      };

    case "admin":
      return {
        primary: { icon: Settings, label: "Manage", action: "manage" },
        secondary:
          moderationStatus === "pending"
            ? { icon: Shield, label: "Review", action: "review" }
            : { icon: Eye, label: "View Details", action: "view" },
      };

    default:
      return {
        primary: { icon: ShoppingCart, label: "Enroll Now", action: "enroll" },
        secondary: { icon: Eye, label: "Preview", action: "preview" },
      };
  }
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSaved,
  onToggleSave,
  className,
  viewMode,
  userRole,
  isEnrolled = false,
  progress = 0,
  isOwnCourse = false,
  revenue,
  childProgress,
  moderationStatus,
  isInstructorDashboard = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/courses/${course.id}`);
  };

  const actions = getRoleSpecificActions(
    userRole,
    course,
    isEnrolled,
    isOwnCourse,
    moderationStatus
  );

  const GridView = () => (
    <Card
      className={cn(
        "overflow-hidden pt-0 hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full flex flex-col bg-white rounded-xl group",
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
          <div className="flex gap-2 flex-wrap">
            {course.badge && (
              <CourseBadge text={course.badge} color={course.badgeColor} />
            )}
            {course.featured && (
              <Badge className="bg-yellow-500/90 text-white text-xs">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {userRole === "instructor" && isOwnCourse && (
              <Badge className="bg-purple-500/90 text-white text-xs">
                Your Course
              </Badge>
            )}
            {userRole === "admin" && moderationStatus && (
              <Badge
                className={cn(
                  "text-xs",
                  moderationStatus === "pending" &&
                    "bg-yellow-500/90 text-white",
                  moderationStatus === "approved" &&
                    "bg-green-500/90 text-white",
                  moderationStatus === "rejected" && "bg-red-500/90 text-white"
                )}
              >
                {moderationStatus}
              </Badge>
            )}
            {isEnrolled && (
              <Badge className="bg-green-500/90 text-white text-xs">
                Enrolled
              </Badge>
            )}
          </div>

          {userRole !== "admin" && (
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
          )}
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
            {course.totalDuration}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent
        className="p-5 py-0 flex-grow flex flex-col cursor-pointer"
        onClick={handleViewDetails}
      >
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
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors group-hover:underline">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {course.description}
        </p>

        {/* Progress bar for enrolled learners or parent viewing child's progress */}
        {((userRole === "learner" && isEnrolled) ||
          (userRole === "parent" && childProgress !== undefined)) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">
                {userRole === "parent" ? "Child's Progress" : "Progress"}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {userRole === "parent" ? childProgress : progress}%
              </span>
            </div>
            <ProgressBar
              progress={userRole === "parent" ? childProgress || 0 : progress}
            />
          </div>
        )}

        {/* Stats - Modified for instructor dashboard */}
        <div className="flex items-center text-xs text-gray-500 mb-4 gap-5">
          {userRole === "instructor" && isInstructorDashboard ? (
            <>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-green-500" />
                <span>{course.totalStudents?.toLocaleString()} enrolled</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                <span>${revenue?.toFixed(0) || "0"} earned</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1 text-blue-500" />
                <span>{course.rating} rating</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                <span>{course.totalSections} sections</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                <span>{course.totalLectures} lectures</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.totalStudents?.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        {/* Instructor - Hidden for instructor dashboard */}
        {!(userRole === "instructor" && isInstructorDashboard) && (
          <div className="flex items-center mb-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={course.instructor?.avatar || "/api/placeholder/32/32"}
                alt={course.instructor?.name}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="ml-2 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {course.instructor?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {course.instructor?.title}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 py-0 border-t border-gray-100 flex justify-between flex-wrap gap-4 items-center">
        <PriceDisplay
          price={course.price}
          originalPrice={course.originalPrice}
          size="md"
          userRole={userRole}
          revenue={revenue}
        />

        <div className="flex gap-2 justify-end ml-auto">
          {userRole === "admin" ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Settings className="h-4 w-4 mr-1" />
                  Actions
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="rounded-lg">
                <actions.secondary.icon className="h-4 w-4 mr-1" />
                {actions.secondary.label}
              </Button>
              <Button size="sm" className="rounded-lg">
                <actions.primary.icon className="h-4 w-4 mr-1" />
                {actions.primary.label}
              </Button>
            </>
          )}
        </div>
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
            {userRole === "instructor" && isOwnCourse && (
              <Badge className="bg-purple-500/90 text-white text-xs w-fit">
                Your Course
              </Badge>
            )}
            {userRole === "admin" && moderationStatus && (
              <Badge
                className={cn(
                  "text-xs w-fit",
                  moderationStatus === "pending" &&
                    "bg-yellow-500/90 text-white",
                  moderationStatus === "approved" &&
                    "bg-green-500/90 text-white",
                  moderationStatus === "rejected" && "bg-red-500/90 text-white"
                )}
              >
                {moderationStatus}
              </Badge>
            )}
            {isEnrolled && (
              <Badge className="bg-green-500/90 text-white text-xs w-fit">
                Enrolled
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
          {userRole !== "admin" && (
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
          )}
        </div>

        {/* Content Section */}
        <div
          className="flex-grow p-6 sm:py-2 flex flex-col cursor-pointer"
          onClick={handleViewDetails}
        >
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
                  {course.totalDuration}
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

            {/* Progress bar for enrolled learners or parent viewing child's progress */}
            {((userRole === "learner" && isEnrolled) ||
              (userRole === "parent" && childProgress !== undefined)) && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {userRole === "parent" ? "Child's Progress" : "Progress"}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {userRole === "parent" ? childProgress : progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={
                    userRole === "parent" ? childProgress || 0 : progress
                  }
                />
              </div>
            )}

            {/* Stats - Modified for instructor dashboard */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {userRole === "instructor" && isInstructorDashboard ? (
                <>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      {course.totalStudents?.toLocaleString()} students enrolled
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span>${revenue?.toFixed(0) || "0"} total revenue</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>
                      {course.rating} avg rating ({course.ratingCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{course.totalLectures} lectures</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{course.totalSections} sections</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{course.totalLectures} lectures</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      {course.totalStudents?.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>{course.level}</span>
                  </div>
                </>
              )}
            </div>

            {/* Instructor - Hidden for instructor dashboard */}
            {!(userRole === "instructor" && isInstructorDashboard) && (
              <div className="flex items-center mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={course.instructor?.avatar || "/api/placeholder/40/40"}
                    alt={course.instructor?.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {course.instructor?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {course.instructor?.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            <PriceDisplay
              price={course.price}
              originalPrice={course.originalPrice}
              size="lg"
              userRole={userRole}
              revenue={revenue}
            />

            <div className="flex gap-2">
              {userRole === "admin" ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Settings className="h-4 w-4 mr-1" />
                      Actions
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <actions.secondary.icon className="h-4 w-4 mr-1" />
                    {actions.secondary.label}
                  </Button>
                  <Button size="sm" className="rounded-lg">
                    <actions.primary.icon className="h-4 w-4 mr-1" />
                    {actions.primary.label}
                  </Button>
                </>
              )}
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
