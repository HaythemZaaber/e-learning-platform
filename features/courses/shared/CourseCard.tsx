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
  TrendingUp,
  Crown,
  CheckCircle,
  BookmarkCheck,
  Zap,
  Download,
  Smartphone,
  Languages,
  GraduationCap,
  Timer,
  Sparkles,
  Target,
  Globe,
  Battery,
  Signal,
  Heart,
  MessageCircle,
  Brain,
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
import { Course, CourseLevel, CourseIntensity } from "@/types/courseTypes";
import courseThumbnail from "@/public/images/courses/courseThumbnail.jpg";

// Utility function to calculate actual course duration from sections
const getActualCourseDuration = (course: Course) => {
  if (!course?.sections) return { hours: 0, minutes: 0 };

  const totalSeconds = course.sections.reduce((total: number, section: any) => {
    const sectionDuration =
      section.lectures?.reduce(
        (lectureTotal: number, lecture: any) =>
          lectureTotal + (lecture.duration || 0),
        0
      ) || 0;
    return total + sectionDuration;
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return { hours, minutes };
};

interface CourseCardProps {
  course: Course;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  className?: string;
  viewMode: "grid" | "list";

  // Enhanced student-specific props
  isEnrolled?: boolean;
  progress?: number; // 0-100
  timeSpent?: number; // in minutes
  streakDays?: number;
  certificateEarned?: boolean;
  lastWatchedLecture?: string;
  nextLessonId?: string;
  completedLectures?: number;
  totalLectures?: number;
  difficultyMatch?: number; // 0-100 how well it matches student's level
  estimatedTimeToComplete?: number; // in hours

  // Enhanced interaction callbacks
  onEnroll?: (courseId: string) => Promise<void>;
  onContinueLearning?: (courseId: string) => void;
  onPreview?: (courseId: string) => void;
  onShare?: (course: Course) => void;
  onTrackView?: (courseId: string) => void;

  // Cart and payment callbacks
  onAddToCart?: (courseId: string) => Promise<void>;
  onRemoveFromCart?: (courseId: string) => Promise<void>;
  onBuyNow?: (courseId: string) => Promise<void>;
  isInCart?: boolean;
}

// Enhanced Badge Component with Premium Styling
const EnhancedCourseBadge = ({
  text,
  color,
  icon: Icon,
  variant = "default",
  className,
}: {
  text: string;
  color?: CourseBadgeColor;
  icon?: React.ElementType;
  variant?:
    | "default"
    | "featured"
    | "trending"
    | "bestseller"
    | "enrolled"
    | "new"
    | "premium"
    | "free";
  className?: string;
}) => {
  if (!text) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "featured":
        return "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-lg ring-2 ring-yellow-300/50 animate-pulse";
      case "trending":
        return "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white shadow-lg ring-2 ring-red-300/50 animate-bounce";
      case "bestseller":
        return "bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-600 text-white shadow-lg ring-2 ring-purple-300/50";
      case "enrolled":
        return "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg ring-2 ring-green-300/50";
      case "new":
        return "bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 text-white shadow-lg ring-2 ring-blue-300/50";
      case "premium":
        return "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black shadow-lg ring-2 ring-amber-300/50 font-bold";
      case "free":
        return "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-white shadow-lg ring-2 ring-emerald-300/50";
      default:
        const colorClasses = {
          primary:
            "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md ring-1 ring-blue-300/50",
          secondary:
            "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md ring-1 ring-gray-300/50",
          accent:
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md ring-1 ring-indigo-300/50",
          success:
            "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md ring-1 ring-emerald-300/50",
          warning:
            "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-1 ring-amber-300/50",
          error:
            "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md ring-1 ring-red-300/50",
          info: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md ring-1 ring-cyan-300/50",
        };
        return colorClasses[color || "primary"];
    }
  };

  return (
    <Badge
      className={cn(
        "font-semibold px-2.5 py-1.5 text-xs flex items-center gap-1.5 border-0 transition-all duration-300 hover:scale-105 backdrop-blur-sm",
        getVariantStyles(),
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {text}
    </Badge>
  );
};

// Enhanced Price Display Component
const StudentPriceDisplay = ({
  price,
  originalPrice,
  size = "md",
  className,
  isEnrolled,
  currency = "USD",
}: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  isEnrolled?: boolean;
  currency?: string;
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isFree = price === 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const currencySymbol = currency === "USD" ? "$" : currency;

  if (isEnrolled) {
    return (
      // <div className={cn("flex items-center gap-2", className)}>
      //   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg">
      //     <CheckCircle className="h-4 w-4" />
      //     <span className="font-bold">Enrolled</span>
      //   </div>
      // </div>
      <div className={cn("flex items-center gap-2", className)}></div>
    );
  }

  if (isFree) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-green-600">FREE</div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            <span>No cost</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Main Price Display */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-baseline gap-2 ">
          <div
            className={cn(
              "font-bold text-gray-900 !text-2xl",
              sizeClasses[size]
            )}
          >
            {currencySymbol}
            {price?.toFixed(2)}
          </div>

          {!!hasDiscount && (
            <div className="text-gray-500 line-through text-sm font-medium">
              {currencySymbol}
              {originalPrice?.toFixed(2)}
            </div>
          )}
        </div>

        {!!hasDiscount && (
          <div className="flex items-center gap-2">
            <Badge
              variant="destructive"
              className="text-xs px-3 py-1 font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg animate-pulse"
            >
              -{discountPercentage}% OFF
            </Badge>
            <div className="text-xs text-orange-600 font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Limited time!
            </div>
          </div>
        )}
      </div>

      {/* Additional Price Info */}
      {!!hasDiscount && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
            <Timer className="h-3 w-3" />
            <span className="font-medium">
              Save {currencySymbol}
              {(originalPrice - price)?.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Free Course Benefits */}
      {!!isFree && (
        <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
            <CheckCircle className="h-3 w-3" />
            <span className="font-medium">Full access included</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Status Badge Component
const ProgressStatusBadge = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) => {
  const getStatusInfo = () => {
    if (progress === 0) {
      return {
        text: "Not Started",
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: Clock,
        progressColor: "bg-gray-300",
      };
    } else if (progress === 100) {
      return {
        text: "Completed",
        color: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
        progressColor: "bg-green-500",
      };
    } else if (progress >= 50) {
      return {
        text: "In Progress",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: TrendingUp,
        progressColor: "bg-blue-500",
      };
    } else {
      return {
        text: "Just Started",
        color: "bg-orange-100 text-orange-700 border-orange-300",
        icon: Play,
        progressColor: "bg-orange-500",
      };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Progress indicator dot */}
      <div className={cn("w-2 h-2 rounded-full", statusInfo.progressColor)} />

      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border-2",
          statusInfo.color
        )}
      >
        <Icon className="h-3 w-3" />
        {statusInfo.text}
      </Badge>
    </div>
  );
};

// Enhanced Progress Bar Component
const StudentProgressBar = ({
  progress,
  timeSpent,
  streakDays,
  certificateEarned,
  className,
}: {
  progress: number;
  timeSpent?: number;
  streakDays?: number;
  certificateEarned?: boolean;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-gray-700">
        Learning Progress
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-blue-600">{progress}%</span>
        {certificateEarned && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            <Award className="h-3 w-3" />
            <span className="text-xs font-semibold">Certified</span>
          </div>
        )}
      </div>
    </div>

    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
      </div>
    </div>

    <div className="flex items-center justify-between text-xs">
      {timeSpent && timeSpent > 0 && (
        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          <Clock className="h-3 w-3" />
          <span className="font-medium">
            {Math.floor(timeSpent / 60)}h {timeSpent % 60}m learned
          </span>
        </div>
      )}

      {streakDays && streakDays > 0 && (
        <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          <Zap className="h-3 w-3" />
          <span className="font-medium">{streakDays} day streak 🔥</span>
        </div>
      )}
    </div>
  </div>
);

// Enhanced Level Badge Styling
const getLevelBadgeStyle = (level: CourseLevel) => {
  const styles = {
    BEGINNER:
      "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg ring-2 ring-green-300/50",
    INTERMEDIATE:
      "bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg ring-2 ring-blue-300/50",
    ADVANCED:
      "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg ring-2 ring-orange-300/50",
    EXPERT:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg ring-2 ring-red-300/50",
    ALL_LEVELS:
      "bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg ring-2 ring-purple-300/50",
  };
  return styles[level] || styles.BEGINNER;
};

// Intensity Level Icons
const getIntensityIcon = (intensity?: CourseIntensity) => {
  if (!intensity) return null;

  const icons = {
    LIGHT: <Battery className="h-3 w-3" />,
    REGULAR: <Signal className="h-3 w-3" />,
    INTENSIVE: <Zap className="h-3 w-3" />,
    BOOTCAMP: <Target className="h-3 w-3" />,
  };

  return icons[intensity];
};

// Student Action Configuration
const getStudentActions = (
  isEnrolled: boolean,
  isFree: boolean = false,
  isInCart: boolean = false
) => {
  if (isEnrolled) {
    return {
      primary: {
        icon: Play,
        label: "Continue Learning",
        action: "continue",
        className:
          "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg",
      },
      secondary: {
        icon: BookOpen,
        label: "Course Details",
        action: "view",
        className: "border-green-200 text-green-700 hover:bg-green-50",
      },
    };
  } else {
    if (isFree) {
      return {
        primary: {
          icon: ShoppingCart,
          label: isInCart ? "Remove from Cart" : "Add to Cart",
          action: isInCart ? "removeFromCart" : "addToCart",
          className: isInCart
            ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg",
        },
        secondary: {
          icon: BookOpen,
          label: "Enroll for Free",
          action: "enroll",
          className: "border-green-200 text-green-700 hover:bg-green-50",
        },
        tertiary: {
          icon: Eye,
          label: "Preview",
          action: "preview",
          className: "border-gray-200 text-gray-700 hover:bg-gray-50",
        },
      };
    } else {
      return {
        primary: {
          icon: ShoppingCart,
          label: isInCart ? "Remove from Cart" : "Add to Cart",
          action: isInCart ? "removeFromCart" : "addToCart",
          className: isInCart
            ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
            : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg",
        },
        secondary: {
          icon: DollarSign,
          label: "Buy Now",
          action: "buyNow",
          className:
            "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
        },
        tertiary: {
          icon: Eye,
          label: "Preview",
          action: "preview",
          className: "border-gray-200 text-gray-700 hover:bg-gray-50",
        },
      };
    }
  }
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isSaved,
  onToggleSave,
  className,
  viewMode,
  isEnrolled = false,
  progress = 0,
  timeSpent = 0,
  streakDays = 0,
  certificateEarned = false,
  lastWatchedLecture,
  nextLessonId,
  completedLectures = 0,
  totalLectures = 0,
  difficultyMatch,
  estimatedTimeToComplete,
  onEnroll,
  onContinueLearning,
  onPreview,
  onShare,
  onTrackView,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  isInCart = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/courses/${course.id}`);
    onTrackView?.(course.id);
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarking(true);
    try {
      await onToggleSave(course.id);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleActionClick = async (action: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case "continue":
        onContinueLearning?.(course.id);
        break;
      case "enroll":
        if (onEnroll) await onEnroll(course.id);
        break;
      case "preview":
        onPreview?.(course.id);
        break;
      case "view":
        handleViewDetails();
        break;
      case "addToCart":
        if (onAddToCart) await onAddToCart(course.id);
        break;
      case "removeFromCart":
        if (onRemoveFromCart) await onRemoveFromCart(course.id);
        break;
      case "buyNow":
        if (onBuyNow) await onBuyNow(course.id);
        break;
    }
  };

  const isFree =
    course.price === 0 || course.settings?.enrollmentType === "FREE";
  const actions = getStudentActions(isEnrolled, isFree, isInCart);

  const GridView = () => (
    <Card
      className={cn(
        "overflow-hidden pt-0 hover:shadow-2xl transition-all duration-500 min-h-[650px] border-0 shadow-lg h-full flex flex-col bg-white rounded-2xl group transform hover:-translate-y-2 cursor-pointer",
        className
      )}
      onClick={handleViewDetails}
    >
      {/* Enhanced Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={course.thumbnail || courseThumbnail}
          alt={course.title}
          fill
          // className={cn(
          //   "object-cover transition-all duration-700",
          //   imageLoaded ? "scale-100" : "scale-105",
          //   isHovered ? "scale-110" : "scale-100"
          // )}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

        {/* Premium badges section */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Priority badges with enhanced animations */}
            {course.isFeatured && (
              <EnhancedCourseBadge
                text="✨ Featured"
                variant="featured"
                icon={Crown}
              />
            )}
            {course.isTrending && (
              <EnhancedCourseBadge
                text="🔥 Trending"
                variant="trending"
                icon={TrendingUp}
              />
            )}
            {course.isBestseller && (
              <EnhancedCourseBadge
                text="👑 Bestseller"
                variant="bestseller"
                icon={Award}
              />
            )}
            {course.badge && (
              <EnhancedCourseBadge
                text={course.badge}
                color={course.badgeColor}
                variant="premium"
              />
            )}
            {isEnrolled && (
              <EnhancedCourseBadge
                text="Enrolled"
                variant="enrolled"
                icon={CheckCircle}
              />
            )}
          </div>

          {/* Enhanced bookmark button with love animation */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className={cn(
              "p-3 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 border-2",
              isSaved
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-500/25"
                : "bg-white/90 text-gray-700 hover:bg-white border-white/50 shadow-white/25",
              isBookmarking && "animate-pulse"
            )}
            onClick={handleBookmark}
            disabled={isBookmarking}
          >
            {isSaved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Heart className="h-4 w-4 fill-current" />
              </motion.div>
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        {/* Enhanced play overlay with premium effects */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Enhanced bottom section with multiple badges */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className={cn(
                "text-xs font-bold border-0",
                getLevelBadgeStyle(course.level)
              )}
            >
              {course.level.replace("_", " ")}
            </Badge>

            {course.intensityLevel && (
              <Badge className="bg-black/70 backdrop-blur-md text-white border-0 text-xs flex items-center gap-1 shadow-lg">
                {getIntensityIcon(course.intensityLevel)}
                {course.intensityLevel}
              </Badge>
            )}

            {/* Additional feature badges */}
            {course.hasCertificate && (
              <Badge className="bg-amber-500/90 backdrop-blur-md text-white border-0 text-xs shadow-lg">
                <GraduationCap className="h-3 w-3" />
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {course.language && course.language !== "en" && (
              <Badge className="bg-indigo-500/90 backdrop-blur-md text-white border-0 text-xs flex items-center gap-1 shadow-lg">
                <Globe className="h-3 w-3" />
                {course.language.toUpperCase()}
              </Badge>
            )}

            <Badge className="bg-black/70 backdrop-blur-md text-white border-0 text-xs flex items-center gap-1 shadow-lg">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-semibold">
                {(() => {
                  const duration = getActualCourseDuration(course);
                  if (duration.hours > 0 && duration.minutes > 0) {
                    return `${duration.hours}h ${duration.minutes}m`;
                  } else if (duration.hours > 0) {
                    return `${duration.hours}h`;
                  } else if (duration.minutes > 0) {
                    return `${duration.minutes}m`;
                  } else {
                    return "0m";
                  }
                })()}
              </span>
            </Badge>
          </div>
        </div>

        {/* Special Price Badge for Discounts */}
        {/* {course.originalPrice && course.originalPrice > course.price && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-xs font-bold">SAVE</div>
                <div className="text-lg font-bold">
                  {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Free Course Badge */}
        {/* {course.price === 0 && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-xs font-bold">FREE</div>
                <div className="text-sm font-semibold">COURSE</div>
              </div>
            </div>
          </div>
        )} */}

        {/* Difficulty match indicator */}
        {difficultyMatch !== undefined && difficultyMatch >= 80 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <EnhancedCourseBadge
              text="🎯 Perfect Match"
              variant="new"
              icon={Target}
            />
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <CardContent className="px-5 pt-4 pb-0 flex-grow flex flex-col">
        {/* Header with enhanced badges */}
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 text-xs font-semibold shadow-sm"
          >
            {course.category.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-yellow-700">
              {course.avgRating}
            </span>
            <span className="text-xs text-yellow-600">
              ({course.totalRatings})
            </span>
          </div>
        </div>

        {/* Enhanced title with premium styling */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight flex-1">
            {course.title}
          </h3>
          {/* Progress Status Badge for enrolled students */}
          {isEnrolled && progress !== undefined && (
            <ProgressStatusBadge progress={progress} />
          )}
        </div>

        {/* Enhanced description */}
        <p className="text-gray-600 text-sm  mb-2 leading-relaxed flex-grow">
          {course.description.slice(0, 140)}...
        </p>

        {/* Enhanced progress section for enrolled students */}
        {/* {isEnrolled && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-xl border-2 border-blue-100 shadow-sm">
            <StudentProgressBar
              progress={progress}
              timeSpent={timeSpent}
              streakDays={streakDays}
              certificateEarned={certificateEarned}
            /> */}

        {/* Continue learning section  */}
        {/* {lastWatchedLecture && (
              <div className="mt-4 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                  <Play className="h-4 w-4" />
                  <span className="font-medium">Continue: </span>
                  <span className="truncate">{lastWatchedLecture}</span>
                </div>
              </div>
            )}
          </div>
        )} */}

        {/* Learning outcomes preview for non-enrolled students */}
        {/* {!isEnrolled &&
          course.whatYouLearn &&
          course.whatYouLearn.length > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                What you'll learn
              </div>
              <div className="space-y-1">
                {course.whatYouLearn.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-green-700"
                  >
                    <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
                {course.whatYouLearn.length > 2 && (
                  <div className="text-sm text-green-600 font-semibold">
                    +{course.whatYouLearn.length - 2} more skills to unlock
                  </div>
                )}
              </div>
            </div>
          )} */}

        {/* Enhanced stats with premium styling */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1.5 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{course.totalSections} sections</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1.5 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{course.totalLectures} lessons</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1.5 rounded-lg">
            <Users className="h-4 w-4 text-green-500" />
            <span className="font-medium">
              {course.currentEnrollments?.toLocaleString()} students
            </span>
          </div>

          {course.hasSubtitles && (
            <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-1.5 rounded-lg">
              <Languages className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Subtitles</span>
            </div>
          )}
        </div>

        {/* Enhanced instructor section */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-3 ring-white shadow-md">
              <Image
                src={course.instructor?.profileImage || courseThumbnail}
                alt={
                  course.instructor?.firstName +
                    " " +
                    course.instructor?.lastName || "Instructor"
                }
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {course.instructor?.firstName +
                  " " +
                  course.instructor?.lastName}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {course.instructor?.instructorProfile?.title}
              </p>
            </div>
          </div>

          {course.instructor?.teachingRating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold text-yellow-700">
                {course.instructor.teachingRating}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Enhanced Responsive Footer */}
      <CardFooter className="p-4 sm:p-5 pt-0 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="w-full space-y-4">
          {/* Price and Course Features Row */}
          <div className="flex flex-col  justify-between items-start sm:items-center gap-3 sm:gap-4">
            {/* Enhanced Price Section */}
            <div className="flex-1 min-w-0">
              <StudentPriceDisplay
                price={course.price}
                originalPrice={course.originalPrice}
                size="md"
                isEnrolled={isEnrolled}
                currency={course.currency}
              />
            </div>

            {/* Action Buttons - Responsive Stack */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Share Button - Only show on larger screens */}
              {/* {onShare && !isEnrolled && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "rounded-xl border-2 hover:scale-105 transition-all duration-200 hidden sm:flex",
                    actions.secondary.className
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShare(course);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )} */}

              {/* Tertiary Action Button - Only for non-enrolled paid courses */}
              {!isEnrolled && !isFree && actions.tertiary && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-xl border-2 hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                    actions.tertiary.className
                  )}
                  onClick={(e) => handleActionClick(actions.tertiary.action, e)}
                >
                  <actions.tertiary.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    {actions.tertiary.label}
                  </span>
                  <span className="sm:hidden">
                    {actions.tertiary.label.split(" ")[0]}
                  </span>
                </Button>
              )}

              {/* Secondary Action Button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-xl border-2 hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                  actions.secondary.className
                )}
                onClick={(e) => handleActionClick(actions.secondary.action, e)}
              >
                <actions.secondary.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {actions.secondary.label}
                </span>
                <span className="sm:hidden">
                  {actions.secondary.label.split(" ")[0]}
                </span>
              </Button>

              {/* Primary Action Button */}
              <Button
                size="sm"
                className={cn(
                  "rounded-xl hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                  actions.primary.className
                )}
                onClick={(e) => handleActionClick(actions.primary.action, e)}
              >
                <actions.primary.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {actions.primary.label}
                </span>
                <span className="sm:hidden">
                  {actions.primary.label.split(" ")[0]}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Share Button - Only show on small screens */}
          {onShare && !isEnrolled && (
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShare(course);
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share this course
              </Button>
            </div>
          )}

          {/* Progress Bar for Enrolled Students */}
          {isEnrolled && progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Your Progress</span>
                <span className="text-gray-900 font-semibold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {completedLectures || 0} of {totalLectures || 0} lectures
                </span>
                <span>
                  {timeSpent
                    ? `${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`
                    : "0m"}{" "}
                  watched
                </span>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  const ListView = () => (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white rounded-2xl group cursor-pointer",
        className
      )}
      onClick={handleViewDetails}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Enhanced Image Section */}
        <div className="relative lg:w-96 lg:h-64 aspect-video lg:aspect-auto flex-shrink-0 overflow-hidden">
          <Image
            src={course.thumbnail || courseThumbnail}
            alt={course.title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              imageLoaded ? "scale-100" : "scale-105",
              isHovered ? "scale-110" : "scale-100"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Premium badges section */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {course.isFeatured && (
              <EnhancedCourseBadge
                text="✨ Featured"
                variant="featured"
                icon={Crown}
              />
            )}
            {course.isTrending && (
              <EnhancedCourseBadge
                text="🔥 Trending"
                variant="trending"
                icon={TrendingUp}
              />
            )}
            {course.isBestseller && (
              <EnhancedCourseBadge
                text="👑 Bestseller"
                variant="bestseller"
                icon={Award}
              />
            )}
            {course.badge && (
              <EnhancedCourseBadge
                text={course.badge}
                color={course.badgeColor}
                variant="premium"
              />
            )}
            {isEnrolled && (
              <EnhancedCourseBadge
                text="✅ Enrolled"
                variant="enrolled"
                icon={CheckCircle}
              />
            )}
          </div>

          {/* Enhanced play overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/20 backdrop-blur-xl rounded-full p-4 border-2 border-white/40 shadow-2xl">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </motion.div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <Badge
              className={cn(
                "text-xs font-bold border-0",
                getLevelBadgeStyle(course.level)
              )}
            >
              {course.level.replace("_", " ")}
            </Badge>

            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "p-3 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 border-2",
                isSaved
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400"
                  : "bg-white/90 text-gray-700 hover:bg-white border-white/50"
              )}
              onClick={handleBookmark}
            >
              {isSaved ? (
                <Heart className="h-4 w-4 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </motion.button>
          </div>

          {/* Special Price Badge for Discounts - List View */}
          {course.originalPrice && course.originalPrice > course.price && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-xs font-bold">SAVE</div>
                  <div className="text-lg font-bold">
                    {Math.round(
                      ((course.originalPrice - course.price) /
                        course.originalPrice) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Free Course Badge - List View */}
          {course.price === 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-xs font-bold">FREE</div>
                  <div className="text-sm font-semibold">COURSE</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Content Section */}
        <div className="flex-grow p-8 flex flex-col">
          {/* Enhanced header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 text-sm font-semibold shadow-sm"
              >
                {course.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-sm border-2 hover:bg-gray-50"
              >
                <Clock className="h-4 w-4 mr-1" />
                {(() => {
                  const duration = getActualCourseDuration(course);
                  if (duration.hours > 0 && duration.minutes > 0) {
                    return `${duration.hours}h ${duration.minutes}m`;
                  } else if (duration.hours > 0) {
                    return `${duration.hours}h`;
                  } else if (duration.minutes > 0) {
                    return `${duration.minutes}m`;
                  } else {
                    return "0m";
                  }
                })()}
              </Badge>
              {course.intensityLevel && (
                <Badge className="bg-gray-100 text-gray-700 text-sm flex items-center gap-1 font-medium">
                  {getIntensityIcon(course.intensityLevel)}
                  {course.intensityLevel}
                </Badge>
              )}
              {difficultyMatch !== undefined && difficultyMatch >= 80 && (
                <EnhancedCourseBadge
                  text="🎯 Perfect Match"
                  variant="new"
                  icon={Target}
                />
              )}
            </div>

            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-base font-bold text-yellow-700">
                {course.avgRating}
              </span>
              <span className="text-sm text-yellow-600">
                ({course.totalRatings})
              </span>
            </div>
          </div>

          {/* Enhanced title with premium styling */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight flex-1">
              {course.title}
            </h3>
            {/* Progress Status Badge for enrolled students */}
            {isEnrolled && progress !== undefined && (
              <ProgressStatusBadge progress={progress} />
            )}
          </div>

          {/* Enhanced description */}
          <p className="text-gray-600 mb-5 line-clamp-3 text-base leading-relaxed">
            {course.description}
          </p>

          {/* Enhanced progress section for enrolled students */}
          {/* {isEnrolled && (
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl border-2 border-blue-100 shadow-sm">
              <StudentProgressBar
                progress={progress}
                timeSpent={timeSpent}
                streakDays={streakDays}
                certificateEarned={certificateEarned}
              />

              {/* Next lesson continuation */}
          {/* {lastWatchedLecture && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center gap-3 text-base text-blue-700 bg-blue-100 px-4 py-3 rounded-xl">
                    <Play className="h-5 w-5" />
                    <div>
                      <span className="font-semibold">Continue Learning: </span>
                      <span className="truncate">{lastWatchedLecture}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )} */}

          {/* Learning outcomes preview for non-enrolled students */}
          {!isEnrolled &&
            course.whatYouLearn &&
            course.whatYouLearn.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  What you'll learn
                </div>
                <div className="space-y-1">
                  {course.whatYouLearn.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-green-700"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                  {course.whatYouLearn.length > 2 && (
                    <div className="text-sm text-green-600 font-semibold">
                      +{course.whatYouLearn.length - 2} more skills to unlock
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Enhanced stats with premium styling */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-6">
            <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1.5 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {course.totalSections} sections
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1.5 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {course.totalLectures} lessons
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1.5 rounded-lg">
              <Users className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {course.currentEnrollments?.toLocaleString()} students
              </span>
            </div>

            {course.hasSubtitles && (
              <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-1.5 rounded-lg">
                <Languages className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Subtitles</span>
              </div>
            )}
          </div>

          {/* Enhanced instructor section */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-3 ring-white shadow-md">
                <Image
                  src={course.instructor?.profileImage || courseThumbnail}
                  alt={
                    course.instructor?.firstName +
                      " " +
                      course.instructor?.lastName || "Instructor"
                  }
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {course.instructor?.firstName +
                    " " +
                    course.instructor?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {course.instructor?.instructorProfile?.title}
                </p>
              </div>
            </div>

            {course.instructor?.teachingRating && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700">
                  {course.instructor.teachingRating}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Responsive Footer */}
          <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="w-full space-y-4">
              {/* Price and Course Features Row */}
              <div className="flex flex-col justify-between items-start sm:items-center gap-3 sm:gap-4">
                {/* Enhanced Price Section */}
                <div className="flex-1 min-w-0">
                  <StudentPriceDisplay
                    price={course.price}
                    originalPrice={course.originalPrice}
                    size="md"
                    isEnrolled={isEnrolled}
                    currency={course.currency}
                  />

                  {/* Course Value Indicators - Responsive */}
                  {!isEnrolled && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {course.hasLifetimeAccess && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          <Timer className="h-3 w-3" />
                          <span className="hidden xs:inline">Lifetime</span>
                          <span className="xs:hidden">∞</span>
                        </div>
                      )}
                      {course.hasCertificate && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          <GraduationCap className="h-3 w-3" />
                          <span className="hidden xs:inline">Certificate</span>
                          <span className="xs:hidden">Cert</span>
                        </div>
                      )}
                      {course.downloadableResources && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                          <Download className="h-3 w-3" />
                          <span className="hidden xs:inline">Resources</span>
                          <span className="xs:hidden">
                            {typeof course.downloadableResources === "number"
                              ? course.downloadableResources
                              : "✓"}
                          </span>
                        </div>
                      )}
                      {course.hasMobileAccess && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          <Smartphone className="h-3 w-3" />
                          <span className="hidden xs:inline">Mobile</span>
                          <span className="xs:hidden">📱</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons - Responsive Stack */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {/* Tertiary Action Button - Only for non-enrolled paid courses */}
                  {!isEnrolled && !isFree && actions.tertiary && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl border-2 hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                        actions.tertiary.className
                      )}
                      onClick={(e) =>
                        handleActionClick(actions.tertiary.action, e)
                      }
                    >
                      <actions.tertiary.icon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        {actions.tertiary.label}
                      </span>
                      <span className="sm:hidden">
                        {actions.tertiary.label.split(" ")[0]}
                      </span>
                    </Button>
                  )}

                  {/* Secondary Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-xl border-2 hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                      actions.secondary.className
                    )}
                    onClick={(e) =>
                      handleActionClick(actions.secondary.action, e)
                    }
                  >
                    <actions.secondary.icon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">
                      {actions.secondary.label}
                    </span>
                    <span className="sm:hidden">
                      {actions.secondary.label.split(" ")[0]}
                    </span>
                  </Button>

                  {/* Primary Action Button */}
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-xl hover:scale-105 transition-all duration-200 flex-1 sm:flex-none",
                      actions.primary.className
                    )}
                    onClick={(e) =>
                      handleActionClick(actions.primary.action, e)
                    }
                  >
                    <actions.primary.icon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">
                      {actions.primary.label}
                    </span>
                    <span className="sm:hidden">
                      {actions.primary.label.split(" ")[0]}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Mobile Share Button - Only show on small screens */}
              {onShare && !isEnrolled && (
                <div className="sm:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-600 hover:text-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onShare(course);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share this course
                  </Button>
                </div>
              )}

              {/* Progress Bar for Enrolled Students */}
              {isEnrolled && progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      Your Progress
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {completedLectures || 0} of {totalLectures || 0} lectures
                    </span>
                    <span>
                      {timeSpent
                        ? `${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`
                        : "0m"}{" "}
                      watched
                    </span>
                  </div>
                </div>
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: viewMode === "grid" ? -8 : 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </motion.div>
  );
};

// Export with multiple options for flexibility
export default CourseCard;

// Named exports for specific use cases
export {
  CourseCard as StudentCourseCard,
  EnhancedCourseBadge,
  StudentPriceDisplay,
  StudentProgressBar,
};

// Type exports
export type { CourseCardProps };

/*
=== COMPLETE ENHANCED COURSE CARD ===

🎯 FEATURES:
✅ Premium gradient badges with animations
✅ Student progress tracking with streaks
✅ Smart enrollment flow
✅ Difficulty matching indicators
✅ Learning outcomes preview
✅ Enhanced instructor profiles
✅ Course feature indicators
✅ Responsive grid and list views
✅ Social sharing capabilities
✅ Smooth animations and transitions
✅ Heart bookmark animation
✅ Backdrop blur effects
✅ Ring effects on interactive elements

📋 USAGE:

1. Basic Usage:
<CourseCard
  course={courseData}
  isSaved={savedCourses.includes(courseData.id)}
  onToggleSave={handleToggleSave}
  viewMode="grid"
/>

2. Enrolled Student:
<CourseCard
  course={courseData}
  isSaved={savedCourses.includes(courseData.id)}
  onToggleSave={handleToggleSave}
  viewMode="grid"
  isEnrolled={true}
  progress={75}
  timeSpent={240}
  streakDays={7}
  certificateEarned={false}
  lastWatchedLecture="Introduction to React Hooks"
  onContinueLearning={(id) => router.push(`/courses/${id}/continue`)}
/>

3. With Full Features:
<CourseCard
  course={courseData}
  isSaved={savedCourses.includes(courseData.id)}
  onToggleSave={handleToggleSave}
  viewMode="list"
  isEnrolled={false}
  difficultyMatch={85}
  estimatedTimeToComplete={12}
  onEnroll={handleEnrollment}
  onPreview={handlePreview}
  onShare={handleShare}
  onTrackView={handleViewTracking}
/>

🚀 Ready for production use!
*/
