import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Award,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  UserCheck,
  Zap,
  Eye,
  Heart,
  Share2,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Activity,
  Play,
  FileText,
  Settings,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCourseAnalytics } from "../../hooks/useCourseAnalytics";
import { CourseAnalyticsData } from "@/types/courseAnalyticsTypes";
import { EnrollmentTrendChart } from "./charts/EnrollmentTrendChart";
import { RatingDistributionChart } from "./charts/RatingDistributionChart";
import { EngagementMetricsChart } from "./charts/EngagementMetricsChart";
import { RevenueChart } from "./charts/RevenueChart";

interface CourseAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export const CourseAnalyticsModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: CourseAnalyticsModalProps) => {
  const { analytics, loading, error, refetch, timeRange, setTimeRange } =
    useCourseAnalytics({
      courseId,
      enabled: isOpen,
    });

  // Mock data for development/testing
  const mockAnalytics = {
    courseId,
    courseTitle,
    courseStatus: "PUBLISHED",
    createdAt: new Date().toISOString(),
    totalEnrollments: 1250,
    activeStudents: 890,
    completedStudents: 360,
    enrollmentTrend: [
      { date: "2024-01-01", enrollments: 45, cumulative: 45 },
      { date: "2024-01-02", enrollments: 32, cumulative: 77 },
      { date: "2024-01-03", enrollments: 58, cumulative: 135 },
      { date: "2024-01-04", enrollments: 41, cumulative: 176 },
      { date: "2024-01-05", enrollments: 67, cumulative: 243 },
      { date: "2024-01-06", enrollments: 52, cumulative: 295 },
      { date: "2024-01-07", enrollments: 38, cumulative: 333 },
    ],
    completionStats: {
      totalEnrollments: 1250,
      completedEnrollments: 360,
      completionRate: 28.8,
      averageCompletionTime: 14.5,
    },
    averageRating: 4.3,
    totalRatings: 287,
    ratingDistribution: {
      one: 5,
      two: 12,
      three: 28,
      four: 89,
      five: 153,
    },
    recentReviews: [
      {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        rating: 5,
        comment: "Excellent course! Very comprehensive and well-structured.",
        courseQuality: 5,
        instructorRating: 5,
        difficultyRating: 3,
        valueForMoney: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        rating: 4,
        comment: "Great content, learned a lot from this course.",
        courseQuality: 4,
        instructorRating: 4,
        difficultyRating: 4,
        valueForMoney: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    engagementMetrics: {
      totalViews: 15420,
      uniqueViewers: 3420,
      averageSessionDuration: 45,
      averageProgressRate: 67.5,
      totalInteractions: 8920,
    },
    popularContent: [
      {
        id: "content1",
        title: "Introduction to React",
        type: "video",
        views: 3420,
        completionRate: 89.5,
        averageRating: 4.5,
      },
      {
        id: "content2",
        title: "State Management",
        type: "video",
        views: 2890,
        completionRate: 82.3,
        averageRating: 4.3,
      },
    ],
    revenueStats: {
      totalRevenue: 18750,
      averageRevenuePerStudent: 15.0,
      totalPaidEnrollments: 1250,
      conversionRate: 85.2,
    },
    studentProgress: [
      {
        userId: "student1",
        userName: "Alice Johnson",
        progressPercentage: 85.5,
        lecturesCompleted: 17,
        totalLectures: 20,
        timeSpent: 450,
        enrolledAt: new Date().toISOString(),
        status: "active",
      },
      {
        userId: "student2",
        userName: "Bob Wilson",
        progressPercentage: 100,
        lecturesCompleted: 20,
        totalLectures: 20,
        timeSpent: 520,
        enrolledAt: new Date().toISOString(),
        status: "completed",
      },
    ],
    courseQualityScore: 87,
    instructorRating: 4.5,
    totalRevenue: 18750,
    currency: "USD",
    additionalMetrics: {
      totalViews: 15420,
      uniqueViews: 3420,
      difficulty: "intermediate",
      estimatedHours: 12,
      language: "English",
      isPublic: true,
      certificate: true,
    },
  };

  // Use mock data if analytics is not available
  const displayAnalytics = analytics || mockAnalytics;

  const [activeTab, setActiveTab] = useState("overview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderKeyMetrics = () => {
    if (!displayAnalytics) return null;

    const metrics = [
      {
        label: "Total Enrollments",
        value: displayAnalytics.totalEnrollments.toLocaleString(),
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        change: "+12%",
        changeType: "positive" as const,
      },
      {
        label: "Average Rating",
        value: displayAnalytics.averageRating.toFixed(1),
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        change: "+0.3",
        changeType: "positive" as const,
      },
      {
        label: "Total Revenue",
        value: formatCurrency(
          displayAnalytics.totalRevenue,
          displayAnalytics.currency
        ),
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
        change: "+18%",
        changeType: "positive" as const,
      },
      {
        label: "Completion Rate",
        value: `${displayAnalytics.completionStats.completionRate.toFixed(1)}%`,
        icon: Target,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        change: "+5%",
        changeType: "positive" as const,
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metric.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-lg", metric.bgColor)}>
                      <IconComponent className={cn("h-6 w-6", metric.color)} />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        metric.changeType === "positive"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : "border-red-200 text-red-700 bg-red-50"
                      )}
                    >
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderStudentProgress = () => {
    if (!displayAnalytics?.studentProgress) return null;

    return (
      <div className="space-y-4">
        {displayAnalytics.studentProgress.slice(0, 10).map((student, index) => (
          <motion.div
            key={student.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {student.userName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {student.userName}
                </div>
                <div className="text-sm text-gray-500">
                  {student.lecturesCompleted}/{student.totalLectures} lectures
                  completed
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {student.progressPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {formatDuration(student.timeSpent)} spent
                </div>
              </div>
              <div className="w-20">
                <Progress value={student.progressPercentage} className="h-2" />
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  student.status === "completed"
                    ? "border-green-200 text-green-700 bg-green-50"
                    : student.status === "active"
                    ? "border-blue-200 text-blue-700 bg-blue-50"
                    : "border-gray-200 text-gray-700 bg-gray-50"
                )}
              >
                {student.status}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderRecentReviews = () => {
    if (!displayAnalytics?.recentReviews) return null;

    return (
      <div className="space-y-4">
        {displayAnalytics.recentReviews.slice(0, 5).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {review.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {review.userName}
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-3 w-3",
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.comment}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              {review.courseQuality && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>Quality: {review.courseQuality}/5</span>
                </div>
              )}
              {review.instructorRating && (
                <div className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  <span>Instructor: {review.instructorRating}/5</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPopularContent = () => {
    if (!displayAnalytics?.popularContent) return null;

    return (
      <div className="space-y-4">
        {displayAnalytics.popularContent.slice(0, 10).map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  content.type === "video"
                    ? "bg-blue-100"
                    : content.type === "text"
                    ? "bg-green-100"
                    : content.type === "quiz"
                    ? "bg-purple-100"
                    : "bg-gray-100"
                )}
              >
                {content.type === "video" ? (
                  <Play className="h-5 w-5 text-blue-600" />
                ) : content.type === "text" ? (
                  <FileText className="h-5 w-5 text-green-600" />
                ) : (
                  <BookOpen className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{content.title}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {content.type}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {content.views.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">views</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {content.completionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">completion</div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm font-semibold">
                  {content.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
          isFullscreen && "p-0"
        )}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={cn(
            "bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl",
            isFullscreen ? "max-w-none h-screen rounded-none" : "max-w-7xl"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Course Analytics
              </h2>
              <p className="text-gray-600">{courseTitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="space-y-6">
                {/* Loading skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-96 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error loading analytics
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : displayAnalytics ? (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {renderKeyMetrics()}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnrollmentTrendChart
                      data={displayAnalytics.enrollmentTrend}
                      loading={loading}
                    />
                    <RatingDistributionChart
                      data={displayAnalytics.ratingDistribution}
                      averageRating={displayAnalytics.averageRating}
                      totalRatings={displayAnalytics.totalRatings}
                      loading={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EngagementMetricsChart
                      data={displayAnalytics.engagementMetrics}
                      loading={loading}
                    />
                    {displayAnalytics.revenueStats && (
                      <RevenueChart
                        data={displayAnalytics.revenueStats}
                        loading={loading}
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Enrollment Tab */}
                <TabsContent value="enrollment" className="space-y-6">
                  <EnrollmentTrendChart
                    data={displayAnalytics.enrollmentTrend}
                    loading={loading}
                    className="h-[500px]"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Total Enrollments
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              {displayAnalytics.totalEnrollments.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Active Students
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              {displayAnalytics.activeStudents.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <Activity className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Completed
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              {displayAnalytics.completedStudents.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <Award className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-6">
                  <EngagementMetricsChart
                    data={displayAnalytics.engagementMetrics}
                    loading={loading}
                    className="h-[500px]"
                  />

                  <RatingDistributionChart
                    data={displayAnalytics.ratingDistribution}
                    averageRating={displayAnalytics.averageRating}
                    totalRatings={displayAnalytics.totalRatings}
                    loading={loading}
                    className="h-[400px]"
                  />
                </TabsContent>

                {/* Revenue Tab */}
                <TabsContent value="revenue" className="space-y-6">
                  {displayAnalytics.revenueStats ? (
                    <>
                      <RevenueChart
                        data={displayAnalytics.revenueStats}
                        loading={loading}
                        className="h-[500px]"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Total Revenue
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {formatCurrency(
                                    displayAnalytics.revenueStats.totalRevenue,
                                    displayAnalytics.currency
                                  )}
                                </p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Avg per Student
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {formatCurrency(
                                    displayAnalytics.revenueStats
                                      .averageRevenuePerStudent,
                                    displayAnalytics.currency
                                  )}
                                </p>
                              </div>
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Paid Enrollments
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {displayAnalytics.revenueStats.totalPaidEnrollments.toLocaleString()}
                                </p>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Conversion Rate
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {displayAnalytics.revenueStats.conversionRate.toFixed(
                                    1
                                  )}
                                  %
                                </p>
                              </div>
                              <div className="p-3 bg-orange-50 rounded-lg">
                                <Target className="h-6 w-6 text-orange-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">💰</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Revenue Data
                      </h3>
                      <p className="text-gray-600">
                        This course is free and has no revenue data.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Student Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderStudentProgress()}</CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Recent Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderRecentReviews()}</CardContent>
                  </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Popular Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderPopularContent()}</CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
