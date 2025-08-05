"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Grid3X3, List, MoreHorizontal, Eye, Edit, BarChart3, Copy, Share2, Trash2, Settings, DollarSign, Users, Star, Clock, BookOpen, Award, AlertCircle, CheckCircle, XCircle, Calendar, TrendingUp, TrendingDown } from "lucide-react";
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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useInstructorCourses } from "../../hooks/useInstructorCourses";
import { Course, CourseStatus } from "@/types/courseTypes";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import courseThumbnail from "@/public/images/courses/courseThumbnail.jpg";

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
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course: Course) => course.status === statusFilter);
    }

    // Sort courses
    switch (sortBy) {
      case "recent":
        filtered = [...filtered].sort(
          (a: Course, b: Course) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "title":
        filtered = [...filtered].sort((a: Course, b: Course) => a.title.localeCompare(b.title));
        break;
      case "students":
        filtered = [...filtered].sort((a: Course, b: Course) => (b.totalStudents || 0) - (a.totalStudents || 0));
        break;
      case "rating":
        filtered = [...filtered].sort((a: Course, b: Course) => b.rating - a.rating);
        break;
      case "revenue":
        filtered = [...filtered].sort((a: Course, b: Course) => (b.revenue || 0) - (a.revenue || 0));
        break;
    }

    return filtered;
  }, [courses, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE);
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
        icon: Edit 
      },
      PUBLISHED: { 
        color: "bg-green-100 text-green-700 border-green-200", 
        text: "Published",
        icon: CheckCircle 
      },
      UNDER_REVIEW: { 
        color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
        text: "Under Review",
        icon: AlertCircle 
      },
      ARCHIVED: { 
        color: "bg-red-100 text-red-700 border-red-200", 
        text: "Archived",
        icon: XCircle 
      },
      SUSPENDED: { 
        color: "bg-orange-100 text-orange-700 border-orange-200", 
        text: "Suspended",
        icon: AlertCircle 
      },
      COMING_SOON: { 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        text: "Coming Soon",
        icon: Calendar 
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleAction = async (action: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (action === "delete") {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
          try {
            await handleCourseAction(action, course.id);
            toast.success("Course deleted successfully");
          } catch (error) {
            toast.error("Failed to delete course");
          }
        }
      } else if (action === "edit") {
        // Show loading state
        toast.loading("Loading course for editing...");
        // Redirect to course creation page with course ID for editing
        window.location.href = `/instructor/dashboard/courses/course-creation?courseId=${course.id}`;
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
             className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-[650px] flex flex-col bg-white rounded-xl group cursor-pointer relative pt-0"
             onClick={handleCardClick}
           >
                         {/* Course Image */}
             <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
              <Image
                src={course.image || course.thumbnail || courseThumbnail}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Status and Featured Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {getStatusBadge(course.status)}
                {course.featured && (
                  <Badge className="bg-yellow-500/90 text-white text-xs border-0">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Level and Duration badges */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
                  {course.level}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.totalDuration}
                </Badge>
              </div>
            </div>

            {/* Action Menu - Moved outside image container */}
            <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
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
                <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={(e) => handleAction("edit", e)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction("preview", e)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction("analytics", e)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {course.status === "DRAFT" ? (
                    <DropdownMenuItem onClick={(e) => handleAction("publish", e)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={(e) => handleAction("unpublish", e)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Unpublish
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => handleAction("duplicate", e)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleAction("share", e)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => handleAction("delete", e)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

                         {/* Course Content */}
             <CardContent className="px-5 flex-grow  flex flex-col py-0">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0 text-xs">
                  {course.category}
                </Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">{course.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({course.ratingCount})</span>
                </div>
              </div>

                             <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                 {course.title}
               </h3>

               <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                 {course.description}
               </p>

                             {/* Enhanced Stats */}
               <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">{course.totalStudents?.toLocaleString() || 0}</div>
                    <div className="text-gray-500">Students</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">{formatCurrency(course.revenue || 0)}</div>
                    <div className="text-gray-500">Revenue</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <div className="font-medium">{course.totalLectures}</div>
                    <div className="text-gray-500">Lectures</div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                  <div>
                    <div className="font-medium">{course.rating}</div>
                    <div className="text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Course Footer */}
            <CardFooter className="p-5 pt-0 pb-2 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? "Free" : formatCurrency(course.price)}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(course.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                    </Badge>
                  </>
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
            </CardFooter>
          </Card>
        </motion.div>
      );
    }

    // List view
    return (
      <motion.div
        layout
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white rounded-xl group cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-80 md:h-48 aspect-video md:aspect-auto flex-shrink-0 overflow-hidden">
              <Image
                src={course.image || course.thumbnail || "/api/placeholder/400/225"}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {getStatusBadge(course.status)}
                {course.featured && (
                  <Badge className="bg-yellow-500/90 text-white text-xs w-fit border-0">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Action Menu */}
              <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
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
                  <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={(e) => handleAction("edit", e)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleAction("preview", e)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleAction("analytics", e)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {course.status === "DRAFT" ? (
                      <DropdownMenuItem onClick={(e) => handleAction("publish", e)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={(e) => handleAction("unpublish", e)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={(e) => handleAction("duplicate", e)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
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

              {/* Level badge */}
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
                  {course.level}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-6 flex flex-col">
              <div className="flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0 text-xs">
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
                    <span className="text-xs text-gray-500 ml-1">({course.ratingCount})</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">{course.totalStudents?.toLocaleString() || 0}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">{formatCurrency(course.revenue || 0)}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">{course.totalLectures}</div>
                      <div className="text-xs text-gray-500">Lectures</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                    <div>
                      <div className="font-medium">{course.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {course.price === 0 ? "Free" : formatCurrency(course.price)}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(course.originalPrice)}
                      </span>
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                        -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                      </Badge>
                    </>
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
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col space-y-4"
        )}>
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
                  placeholder="Search courses by title, description, or category..."
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
                  <SelectItem value="revenue">Highest Revenue</SelectItem>
                </SelectContent>
              </Select>

              {/* Results count */}
              <div className="flex-1 text-sm text-gray-600 text-right">
                {filteredAndSortedCourses.length} course{filteredAndSortedCourses.length !== 1 ? 's' : ''} found
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
                  No courses match your current search criteria. Try adjusting your filters or search terms.
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
                  Start building engaging courses that will inspire and educate your students. Our course creation tools make it easy to get started.
                </p>
                <Button 
                  onClick={() => window.location.href = "/instructor/dashboard/courses/course-creation"}
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

      {/* Course Statistics Summary */}
      {courses.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
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
                {courses.reduce((acc: number, course: Course) => acc + (course.totalStudents || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(courses.reduce((acc: number, course: Course) => acc + (course.revenue || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};