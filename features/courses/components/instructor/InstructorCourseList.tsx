"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Edit,
  BarChart3,
  Copy,
  Share2,
  Trash2,
  Settings,
  DollarSign,
  Users,
  Star,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Play,
  FileText,
  Languages,
  Target,
  Globe,
  UserCheck,
  Hourglass,
  MapPin,
  Zap,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useInstructorCourses } from "../../hooks/useInstructorCourses";
import { Course, CourseStatus } from "@/types/courseTypes";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import courseThumbnail from "@/public/images/courses/courseThumbnail.jpg";
import { CourseShareModal } from "../sharing/CourseShareModal";
import { CourseAnalyticsModal } from "../analytics/CourseAnalyticsModal";

const ITEMS_PER_PAGE = 6;

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
      duration: 0.4,
    },
  },
};

interface InstructorCourseListProps {
  variant?: "grid" | "list";
  showFilters?: boolean;
}

export const InstructorCourseList = ({
  variant = "grid",
  showFilters = true,
}: InstructorCourseListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">(variant);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    courseId: string;
    courseTitle: string;
  } | null>(null);
  const [shareModal, setShareModal] = useState<{
    courseId: string;
    courseTitle: string;
  } | null>(null);
  const [analyticsModal, setAnalyticsModal] = useState<{
    courseId: string;
    courseTitle: string;
  } | null>(null);

  const {
    courses,
    loading,
    error,
    handleCourseAction,
    updateLoading,
    deleteLoading,
    publishLoading,
    unpublishLoading,
  } = useInstructorCourses();

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course: Course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.shortDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.subcategory
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.language?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (course: Course) => course.status === statusFilter
      );
    }

    // Sort courses
    switch (sortBy) {
      case "recent":
        filtered = [...filtered].sort(
          (a: Course, b: Course) =>
            new Date(b.publishedAt || b.updatedAt || 0).getTime() -
            new Date(a.publishedAt || a.updatedAt || 0).getTime()
        );
        break;
      case "title":
        filtered = [...filtered].sort((a: Course, b: Course) =>
          a.title.localeCompare(b.title)
        );
        break;
      case "students":
        filtered = [...filtered].sort(
          (a: Course, b: Course) =>
            (b.currentEnrollments || 0) - (a.currentEnrollments || 0)
        );
        break;
      case "rating":
        filtered = [...filtered].sort(
          (a: Course, b: Course) => (b.avgRating || 0) - (a.avgRating || 0)
        );
        break;
      case "views":
        filtered = [...filtered].sort(
          (a: Course, b: Course) => (b.views || 0) - (a.views || 0)
        );
        break;
      case "completion":
        filtered = [...filtered].sort(
          (a: Course, b: Course) =>
            (b.completionRate || 0) - (a.completionRate || 0)
        );
        break;
    }

    return filtered;
  }, [courses, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCourses.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = filteredAndSortedCourses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const getStatusBadge = (status: CourseStatus) => {
    const statusConfig = {
      DRAFT: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        text: "Draft",
        icon: Edit,
      },
      PUBLISHED: {
        color: "bg-green-100 text-green-700 border-green-200",
        text: "Published",
        icon: CheckCircle,
      },
      UNDER_REVIEW: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        text: "Under Review",
        icon: AlertCircle,
      },
      ARCHIVED: {
        color: "bg-red-100 text-red-700 border-red-200",
        text: "Archived",
        icon: XCircle,
      },
      SUSPENDED: {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        text: "Suspended",
        icon: AlertCircle,
      },
      COMING_SOON: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        text: "Coming Soon",
        icon: Calendar,
      },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border text-xs font-medium`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const renderPricing = (course: Course) => {
    const hasDiscount =
      course.originalPrice && course.originalPrice > course.price;
    const discountPercent =
      course.discountPercent ||
      (hasDiscount
        ? Math.round(
            ((course.price - course.originalPrice!) / course.price) * 100
          )
        : 0);
    const isDiscountValid =
      !course.discountValidUntil ||
      new Date(course.discountValidUntil) > new Date();
    const isFree = course.price === 0;

    if (isFree) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">FREE</div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle className="h-3 w-3" />
              <span>No cost</span>
            </div>
          </div>
        </div>
      );
    }

    if (hasDiscount && isDiscountValid) {
      return (
        <div className="flex flex-col gap-2">
          {/* Main Price Display */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(course.originalPrice!, course.currency)}
              </div>

              <div className="text-sm text-gray-500 line-through font-medium">
                {formatCurrency(course.price, course.currency)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="destructive"
                className="text-xs px-3 py-1 font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg animate-pulse"
              >
                -{discountPercent}% OFF
              </Badge>
            </div>
          </div>

          {/* Additional Price Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
              <Clock className="h-3 w-3" />
              <span className="font-medium">
                Save{" "}
                {formatCurrency(
                  course.price - course.originalPrice!,
                  course.currency
                )}
              </span>
            </div>
            {course.discountValidUntil && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
                <AlertTriangle className="h-3 w-3" />
                <span className="font-medium">
                  Expires{" "}
                  {new Date(course.discountValidUntil).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-gray-900">
          {formatCurrency(course.price, course.currency)}
        </div>
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 border-gray-200 text-gray-600 bg-gray-50"
        >
          <DollarSign className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      </div>
    );
  };

  const renderPricingList = (course: Course) => {
    const hasDiscount =
      course.originalPrice && course.originalPrice < course.price;
    const discountPercent =
      course.discountPercent ||
      (hasDiscount
        ? Math.round(
            ((course.price - course.originalPrice!) / course.price) * 100
          )
        : 0);
    const isDiscountValid =
      !course.discountValidUntil ||
      new Date(course.discountValidUntil) > new Date();
    const isFree = course.price === 0;

    if (isFree) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">FREE</div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle className="h-3 w-3" />
              <span>No cost</span>
            </div>
          </div>
        </div>
      );
    }

    if (hasDiscount && isDiscountValid) {
      return (
        <div className="flex flex-col gap-2">
          {/* Main Price Display */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(course.originalPrice!, course.currency)}
              </div>

              <div className="text-sm text-gray-500 line-through font-medium">
                {formatCurrency(course.price, course.currency)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="destructive"
                className="text-xs px-3 py-1 font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg animate-pulse"
              >
                -{discountPercent}% OFF
              </Badge>
            </div>
          </div>

          {/* Additional Price Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
              <Clock className="h-3 w-3" />
              <span className="font-medium">
                Save{" "}
                {formatCurrency(
                  course.price - course.originalPrice!,
                  course.currency
                )}
              </span>
            </div>
            {course.discountValidUntil && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
                <AlertTriangle className="h-3 w-3" />
                <span className="font-medium">
                  Expires{" "}
                  {new Date(course.discountValidUntil).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-gray-900">
          {formatCurrency(course.price, course.currency)}
        </div>
        <Badge
          variant="outline"
          className="text-xs px-2 py-1 border-gray-200 text-gray-600 bg-gray-50"
        >
          <DollarSign className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      </div>
    );
  };

  const formatDuration = (hours: number, minutes: number) => {
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const formatDurationFromSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    if (minutes > 0) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }
    return `${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty: string | number) => {
    const difficultyStr =
      typeof difficulty === "number"
        ? difficulty <= 1.5
          ? "beginner"
          : difficulty <= 2.5
          ? "intermediate"
          : difficulty <= 3.5
          ? "advanced"
          : "expert"
        : difficulty?.toLowerCase();

    switch (difficultyStr) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200";
      case "expert":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity?.toLowerCase()) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const isEnrollmentOpen = (course: Course) => {
    const now = new Date();
    const startDate = course.enrollmentStartDate
      ? new Date(course.enrollmentStartDate)
      : null;
    const endDate = course.enrollmentEndDate
      ? new Date(course.enrollmentEndDate)
      : null;

    if (!startDate && !endDate) return true;
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleCourseAction("delete", deleteConfirm.courseId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const [isHovered, setIsHovered] = useState(false);

    const totalDuration = formatDuration(
      course.estimatedHours || 0,
      course.estimatedMinutes || 0
    );
    const enrollmentOpen = isEnrollmentOpen(course);
    const enrollmentPercentage = course.maxStudents
      ? ((course.currentEnrollments || 0) / course.maxStudents) * 100
      : 0;

    const handleAction = async (action: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (action === "delete") {
        setDeleteConfirm({ courseId: course.id, courseTitle: course.title });
      } else if (action === "edit") {
        toast.loading("Loading course for editing...");
        window.location.href = `/instructor/dashboard/courses/course-creation?courseId=${course.id}`;
      } else if (action === "analytics") {
        setAnalyticsModal({ courseId: course.id, courseTitle: course.title });
      } else {
        await handleCourseAction(action, course.id);
      }
    };

    const handleCardClick = () => {
      handleCourseAction("preview", course.id);
    };

    if (viewMode === "grid") {
      return (
        <motion.div
          layout
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-[700px] flex flex-col bg-white rounded-xl group cursor-pointer relative pt-0"
            onClick={handleCardClick}
          >
            {/* Course Image */}
            <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
              <Image
                src={course.thumbnail || courseThumbnail}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Status and Featured Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {getStatusBadge(course.status)}
                {course.difficulty && (
                  <Badge
                    className={`${getDifficultyColor(
                      course.difficulty
                    )} border text-xs`}
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {typeof course.difficulty === "number"
                      ? course.difficulty <= 1.5
                        ? "Beginner"
                        : course.difficulty <= 2.5
                        ? "Intermediate"
                        : course.difficulty <= 3.5
                        ? "Advanced"
                        : "Expert"
                      : course.difficulty}
                  </Badge>
                )}
              </div>

              {/* Enhanced Discount Badge
              // {course.originalPrice && course.originalPrice > course.price && 
              //  (!course.discountValidUntil || new Date(course.discountValidUntil) > new Date()) && (
              //   <div className="absolute top-3 right-40">
              //     <Badge className="bg-red-500 text-white border-0 text-xs font-bold">
              //       <TrendingDown className="h-3 w-3 mr-1" />
              //       {course.discountPercent || Math.round(((course.price - course.originalPrice!) / course.price) * 100)}% OFF
              //     </Badge>
              //   </div>
              // )} */}

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Bottom badges */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs w-fit">
                    {course.level || "All Levels"}
                  </Badge>
                  {course.language && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs w-fit">
                      <Languages className="h-3 w-3 mr-1" />
                      {course.language}
                    </Badge>
                  )}
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {totalDuration}
                </Badge>
              </div>

              {/* Intensity indicator */}
              {course.intensityLevel && (
                <div className="absolute top-3 right-16">
                  <Badge className="bg-white/90 backdrop-blur-sm border-0 text-xs text-black">
                    <Zap
                      className={`h-3 w-3 mr-1 ${getIntensityColor(
                        course.intensityLevel
                      )}`}
                    />
                    {course.intensityLevel}
                  </Badge>
                </div>
              )}
            </div>

            {/* Action Menu */}
            <div
              className="absolute top-3 right-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onClick={(e) => handleAction("edit", e)}
                    className="focus:bg-blue-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleAction("preview", e)}
                    className="focus:bg-blue-100"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleAction("analytics", e)}
                    className="focus:bg-blue-100"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {course.status === "DRAFT" ? (
                    <DropdownMenuItem
                      onClick={(e) => handleAction("publish", e)}
                      className="focus:bg-blue-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => handleAction("unpublish", e)}
                      className="focus:bg-blue-100"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Unpublish
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => handleAction("duplicate", e)}
                    className="focus:bg-blue-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareModal({
                        courseId: course.id,
                        courseTitle: course.title,
                      });
                    }}
                    className="focus:bg-blue-100"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => handleAction("delete", e)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Course Content */}
            <CardContent className="px-5 pt-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-0 text-xs w-fit"
                  >
                    {course.category}
                  </Badge>
                  {course.subcategory && (
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-200 w-fit"
                    >
                      {course.subcategory}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">
                    {course.avgRating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({course.totalRatings || 0})
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {course.description || course.shortDescription}
              </p>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">
                      {course.currentEnrollments?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-500">Enrolled</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <div className="font-medium">
                      {course.views?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-500">Views</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                  <div>
                    <div className="font-medium">
                      {course.totalLectures || 0}
                    </div>
                    <div className="text-gray-500">Lectures</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  <div>
                    <div className="font-medium">
                      {course.totalSections || 0}
                    </div>
                    <div className="text-gray-500">Sections</div>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              {course.completionRate !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">
                      Completion Rate
                    </span>
                    <span className="text-xs font-medium">
                      {course.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Enrollment Status */}
              {course.maxStudents && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Enrollment</span>
                    <span className="text-xs font-medium">
                      {course.currentEnrollments || 0}/{course.maxStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        enrollmentPercentage > 80
                          ? "bg-red-500"
                          : enrollmentPercentage > 60
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(enrollmentPercentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  {!enrollmentOpen && (
                    <div className="flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 text-orange-500 mr-1" />
                      <span className="text-xs text-orange-600">
                        Enrollment Closed
                      </span>
                    </div>
                  )}
                  {course.waitlistEnabled && enrollmentPercentage >= 100 && (
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-xs text-blue-600">
                        Waitlist Available
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Course Dates */}
              {(course.courseStartDate || course.courseEndDate) && (
                <div className="text-xs text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {course.courseStartDate &&
                        new Date(course.courseStartDate).toLocaleDateString()}
                      {course.courseStartDate && course.courseEndDate && " - "}
                      {course.courseEndDate &&
                        new Date(course.courseEndDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Course Footer */}
            <CardFooter className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {renderPricing(course)}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("edit", e);
                  }}
                  disabled={updateLoading}
                  className="rounded-lg"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("analytics", e);
                  }}
                  className="rounded-lg"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    }

    // List view - Enhanced with new data
    return (
      <motion.div layout whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
        <Card
          className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white rounded-xl group cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-80 md:h-56 aspect-video md:aspect-auto flex-shrink-0 overflow-hidden">
              <Image
                src={course.thumbnail || courseThumbnail}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {getStatusBadge(course.status)}
                {course.difficulty && (
                  <Badge
                    className={`${getDifficultyColor(
                      course.difficulty
                    )} border text-xs w-fit`}
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {typeof course.difficulty === "number"
                      ? course.difficulty <= 1.5
                        ? "Beginner"
                        : course.difficulty <= 2.5
                        ? "Intermediate"
                        : course.difficulty <= 3.5
                        ? "Advanced"
                        : "Expert"
                      : course.difficulty}
                  </Badge>
                )}
              </div>

              {/* Enhanced Discount Badge */}
              {course.originalPrice &&
                course.originalPrice < course.price &&
                (!course.discountValidUntil ||
                  new Date(course.discountValidUntil) > new Date()) && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-xs font-bold">SAVE</div>
                        <div className="text-lg font-bold">
                          {course.discountPercent ||
                            Math.round(
                              ((course.price - course.originalPrice!) /
                                course.price) *
                                100
                            )}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Free Course Badge */}
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

              {/* Action Menu */}
              <div
                className="absolute top-3 right-3"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={(e) => handleAction("edit", e)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => handleAction("preview", e)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => handleAction("analytics", e)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {course.status === "DRAFT" ? (
                      <DropdownMenuItem
                        onClick={(e) => handleAction("publish", e)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={(e) => handleAction("unpublish", e)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => handleAction("duplicate", e)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareModal({
                          courseId: course.id,
                          courseTitle: course.title,
                        });
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => handleAction("delete", e)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Bottom badges */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                <div className="flex gap-2">
                  <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
                    {course.level || "All Levels"}
                  </Badge>
                  {course.language && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                      <Languages className="h-3 w-3 mr-1" />
                      {course.language}
                    </Badge>
                  )}
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {totalDuration}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-6 flex flex-col">
              <div className="flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-0 text-xs"
                      >
                        {course.category}
                      </Badge>
                      {course.subcategory && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-200"
                        >
                          {course.subcategory}
                        </Badge>
                      )}
                      {course.intensityLevel && (
                        <Badge className="bg-white border text-xs">
                          <Zap
                            className={`h-3 w-3 mr-1 ${getIntensityColor(
                              course.intensityLevel
                            )}`}
                          />
                          {course.intensityLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-semibold">
                      {course.avgRating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({course.totalRatings || 0})
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.shortDescription || course.description}
                </p>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">
                        {course.currentEnrollments?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-gray-500">Enrolled</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">
                        {course.views?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                    <div>
                      <div className="font-medium">
                        {course.totalLectures || 0}
                      </div>
                      <div className="text-xs text-gray-500">Lectures</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2 text-orange-500" />
                    <div>
                      <div className="font-medium">
                        {course.totalSections || 0}
                      </div>
                      <div className="text-xs text-gray-500">Sections</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                    <div>
                      <div className="font-medium">
                        {course.completionRate?.toFixed(1) || "N/A"}%
                      </div>
                      <div className="text-xs text-gray-500">Completion</div>
                    </div>
                  </div>
                  {course.maxStudents && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 mr-2 text-cyan-500" />
                      <div>
                        <div className="font-medium">{course.maxStudents}</div>
                        <div className="text-xs text-gray-500">
                          Max Students
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 mb-4">
                  {/* Completion Rate */}
                  {course.completionRate !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Completion Rate
                        </span>
                        <span className="text-xs font-medium">
                          {course.completionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Enrollment Status */}
                  {course.maxStudents && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Enrollment
                        </span>
                        <span className="text-xs font-medium">
                          {course.currentEnrollments || 0}/{course.maxStudents}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            enrollmentPercentage > 80
                              ? "bg-red-500"
                              : enrollmentPercentage > 60
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(enrollmentPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        {!enrollmentOpen && (
                          <div className="flex items-center">
                            <AlertCircle className="h-3 w-3 text-orange-500 mr-1" />
                            <span className="text-xs text-orange-600">
                              Enrollment Closed
                            </span>
                          </div>
                        )}
                        {course.waitlistEnabled &&
                          enrollmentPercentage >= 100 && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-xs text-blue-600">
                                Waitlist Available
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Dates */}
                {(course.courseStartDate ||
                  course.courseEndDate ||
                  course.enrollmentStartDate ||
                  course.enrollmentEndDate) && (
                  <div className="text-xs text-gray-600 mb-4 space-y-1">
                    {(course.courseStartDate || course.courseEndDate) && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span className="font-medium mr-1">Course:</span>
                        <span>
                          {course.courseStartDate &&
                            new Date(
                              course.courseStartDate
                            ).toLocaleDateString()}
                          {course.courseStartDate &&
                            course.courseEndDate &&
                            " - "}
                          {course.courseEndDate &&
                            new Date(course.courseEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {(course.enrollmentStartDate ||
                      course.enrollmentEndDate) && (
                      <div className="flex items-center">
                        <UserCheck className="h-3 w-3 mr-2" />
                        <span className="font-medium mr-1">Enrollment:</span>
                        <span>
                          {course.enrollmentStartDate &&
                            new Date(
                              course.enrollmentStartDate
                            ).toLocaleDateString()}
                          {course.enrollmentStartDate &&
                            course.enrollmentEndDate &&
                            " - "}
                          {course.enrollmentEndDate &&
                            new Date(
                              course.enrollmentEndDate
                            ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Learning Outcomes Preview */}
                {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      What you'll learn:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {course.whatYouLearn
                        .slice(0, 3)
                        .map((outcome: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{outcome}</span>
                          </li>
                        ))}
                      {course.whatYouLearn.length > 3 && (
                        <li className="text-blue-600 font-medium">
                          +{course.whatYouLearn.length - 3} more outcomes
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {renderPricingList(course)}
                  {course.publishedAt && (
                    <div className="text-xs text-gray-500">
                      Published{" "}
                      {new Date(course.publishedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("edit", e);
                    }}
                    disabled={updateLoading}
                    className="rounded-lg"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("analytics", e);
                    }}
                    className="rounded-lg"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        {showFilters && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 bg-gray-200 rounded-md w-64 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-md w-16 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Loading skeleton for courses */}
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col space-y-4"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-t-xl"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error loading courses
        </h3>
        <p className="text-red-600 mb-6">{error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <AlertCircle className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters and Search */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Top row - Search and View toggle */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses by title, description, category, or language..."
                  className="pl-9 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-md transition-all",
                    viewMode === "grid" ? "shadow-sm" : "hover:bg-white"
                  )}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md transition-all",
                    viewMode === "list" ? "shadow-sm" : "hover:bg-white"
                  )}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Bottom row - Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="students">Most Students</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="completion">Best Completion</SelectItem>
                </SelectContent>
              </Select>

              {/* Results count */}
              <div className="flex-1 text-sm text-gray-600 text-right">
                {filteredAndSortedCourses.length} course
                {filteredAndSortedCourses.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPage}-${viewMode}-${statusFilter}-${sortBy}-${searchTerm}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col space-y-4"
          )}
        >
          {currentCourses.map((course: Course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              layout
              className={viewMode === "list" ? "w-full" : undefined}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Empty State */}
      {currentCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            {searchTerm || statusFilter !== "all" ? (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 mb-6">
                  No courses match your current search criteria. Try adjusting
                  your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    disabled={!searchTerm}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to create your first course?
                </h3>
                <p className="text-gray-600 mb-6">
                  Start building engaging courses that will inspire and educate
                  your students. Our course creation tools make it easy to get
                  started.
                </p>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "/instructor/dashboard/courses/course-creation")
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedCourses.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            showSummary={true}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
          />
        </div>
      )}

      {/* Enhanced Course Statistics Summary */}
      {courses.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Course Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {courses.filter((c: Course) => c.status === "PUBLISHED").length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {courses
                  .reduce(
                    (acc: number, course: Course) =>
                      acc + (course.currentEnrollments || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {courses.length > 0
                  ? (
                      courses.reduce(
                        (acc: number, course: Course) =>
                          acc + (course.avgRating || 0),
                        0
                      ) / courses.length
                    ).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Course
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>"{deleteConfirm.courseTitle}"</strong>? This action cannot
              be undone and will permanently remove the course and all its
              content.
            </p>

            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <CourseShareModal
          isOpen={!!shareModal}
          onClose={() => setShareModal(null)}
          courseId={shareModal.courseId}
          courseTitle={shareModal.courseTitle}
        />
      )}

      {/* Analytics Modal */}
      {analyticsModal && (
        <CourseAnalyticsModal
          isOpen={!!analyticsModal}
          onClose={() => setAnalyticsModal(null)}
          courseId={analyticsModal.courseId}
          courseTitle={analyticsModal.courseTitle}
        />
      )}
    </div>
  );
};
