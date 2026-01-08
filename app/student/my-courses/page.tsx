"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Search,
  Grid3X3,
  List,
  CheckCircle,
  RefreshCw,
  BarChart3,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyEnrollments } from "@/features/courses/hooks/useMyEnrollments";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/features/courses/shared/CourseCard";
import { usePaymentStore } from "@/stores/payment.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/Pagination";

// Loading skeleton components
const CourseCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="aspect-video relative bg-gray-200">
      <Skeleton className="w-full h-full" />
    </div>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <Skeleton className="h-2 w-full mb-2" />
      <Skeleton className="h-2 w-2/3" />
    </CardContent>
  </Card>
);

const ITEMS_PER_PAGE = 6;

export default function MyCoursesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    enrollments,
    courses,
    isLoading,
    error,
    refetch,
    totalEnrollments,
    completedCourses,
    getAverageProgress,
    getCertificatesEarned,
  } = useMyEnrollments();

  // Payment store for cart functionality
  const { addToCheckout, removeFromCheckout, checkoutItems } = usePaymentStore();

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in-progress" | "not-started">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories and levels for filters
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const levels = Array.from(new Set(courses.map(c => c.level).filter(Boolean)));

  // Filter courses based on search and filters
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      const course = enrollment.course;
      if (!course) return false;

      // Search filter
      const matchesSearch = searchTerm === "" || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "completed" && enrollment.progress >= 100) ||
        (statusFilter === "in-progress" && enrollment.progress > 0 && enrollment.progress < 100) ||
        (statusFilter === "not-started" && enrollment.progress === 0);

      // Category filter
      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;

      // Level filter
      const matchesLevel = levelFilter === "all" || course.level === levelFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
    });
  }, [enrollments, searchTerm, statusFilter, categoryFilter, levelFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEnrollments = filteredEnrollments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, levelFilter]);



  // CourseCard handlers
  const handleToggleSave = async () => {
    // TODO: Implement save/bookmark functionality
    toast.info("Save functionality coming soon!");
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/courses/${courseId}/learn`);
  };

  const handlePreview = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleShare = (course: any) => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out this course: ${course.title}`,
        url: `${window.location.origin}/courses/${course.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/courses/${course.id}`);
      toast.success("Course link copied to clipboard!");
    }
  };

  const handleAddToCart = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      addToCheckout(course);
      toast.success(`Added "${course.title}" to cart`);
    }
  };

  const handleRemoveFromCart = async (courseId: string) => {
    removeFromCheckout(courseId);
  };

  const handleBuyNow = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      addToCheckout(course);
      router.push("/checkout");
    }
  };

  const handleTrackView = (courseId: string) => {
    // TODO: Implement view tracking
    console.log("Course viewed:", courseId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Sign In Required</h2>
            <p className="text-blue-600 mb-6">
              You need to be signed in to access your courses and track your progress.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => router.push("/sign-in")}
              >
                Sign In to Continue
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/courses")}
              >
                Browse Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className=" mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-1">Track your learning progress and continue your journey</p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">
        {/* Stats Overview */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Courses</p>
                      <p className="text-2xl font-bold text-blue-900">{totalEnrollments}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-900">{completedCourses}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Avg Progress</p>
                      <p className="text-2xl font-bold text-purple-900">{getAverageProgress()}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Certificates</p>
                      <p className="text-2xl font-bold text-amber-900">{getCertificatesEarned()}</p>
                    </div>
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={cn(
            "grid gap-6",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-red-500 mb-4">
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
              <p className="text-gray-600 mb-4">There was an error loading your courses. Please try again.</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEnrollments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || levelFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "You haven't enrolled in any courses yet. Start your learning journey today!"}
              </p>
              {!searchTerm && statusFilter === "all" && categoryFilter === "all" && levelFilter === "all" && (
                <Button onClick={() => router.push("/courses")}>
                  Browse Courses
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Courses Grid/List using CourseCard */}
        {!isLoading && !error && filteredEnrollments.length > 0 && (
          <>
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              <AnimatePresence>
                {currentEnrollments.map((enrollment: { id: string; course: any; progress?: number; enrolledAt: string; lastWatchedLecture?: string; totalTimeSpent?: number | undefined; streakDays?: number | undefined; certificateEarned?: boolean; completedLectures?: number; totalLectures?: number }) => {
                  const course = enrollment.course;
                  const progress = enrollment.progress || 0;
                  const isInCart = checkoutItems.some(item => item.courseId === course.id);
                  
                  return (
                    <CourseCard
                      key={enrollment.id}
                      course={course}
                      isSaved={false} // TODO: Implement saved courses functionality
                      onToggleSave={handleToggleSave}
                      viewMode={viewMode}
                      isEnrolled={true}
                      progress={progress}
                      timeSpent={enrollment.totalTimeSpent || 0}
                      streakDays={enrollment.streakDays || 0}
                      certificateEarned={enrollment.certificateEarned || false}
                      lastWatchedLecture={enrollment.lastWatchedLecture}
                      completedLectures={enrollment.completedLectures || 0}
                      totalLectures={enrollment.totalLectures || 0}
                      onContinueLearning={handleContinueLearning}
                      onPreview={handlePreview}
                      onShare={handleShare}
                      onTrackView={handleTrackView}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      onBuyNow={handleBuyNow}
                      isInCart={isInCart}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredEnrollments.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                  showSummary={true}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
