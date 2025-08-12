"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  CheckCircle, 
  Lock, 
  BookOpen,
  Award,
  ArrowLeft,
  Search,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Format duration from seconds to human readable format
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};

// Loading skeleton
const CourseLearnSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const { courseId } = use(params);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "incomplete" | "locked">("all");
  const [activeTab, setActiveTab] = useState<"content" | "overview" | "resources">("content");
  
  const {
    currentCourse,
    expandedSections,
    toggleSection,
    setProgress: setStoreProgress,
    setCourse
  } = useCoursePreviewStore();

  const {
    course: courseData,
    progress,
    navigation,
    isLoading,
    error,
    isEnrolled,
    isAuthenticated,
    handleMarkLectureComplete,
  } = useCoursePreview({ courseId });

  // Determine if course is free
  const isFreeCourse = courseData?.price === 0 || courseData?.enrollmentType === "FREE";
  
  // Determine if user can access content (enrolled OR free course)
  const canAccessContent = isEnrolled || isFreeCourse;

  // Update store when course data changes
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData, setCourse]);

  // Update store when progress changes
  useEffect(() => {
    if (progress) {
      setStoreProgress(progress);
    }
  }, [progress, setStoreProgress]);

  // Initialize expanded sections
  useEffect(() => {
    if (navigation?.sections && navigation.sections.length > 0 && expandedSections.size === 0) {
      // Auto-expand section with current lecture or first section
      const currentSectionId = navigation.currentSection || navigation.sections[0].id;
      toggleSection(currentSectionId);
    }
  }, [navigation, expandedSections.size, toggleSection]);

  const formatDuration = useCallback((duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  const getLectureIcon = useCallback((lecture: any) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    if (lecture.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
    if (lecture.type === 'quiz') {
      return <Target className="w-4 h-4 text-purple-500 flex-shrink-0" />;
    }
    return <Play className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  }, []);

  // Use store data if available, otherwise fall back to hook data
  const courseSections = currentCourse?.sections || courseData?.sections;
  
  // Filter lectures based on search and status
  const filteredSections = useMemo(() => {
    if (!courseSections) return [];
    
    return courseSections.map((section: any) => {
      const filteredLectures = section.lectures?.filter((lecture: any) => {
        const matchesSearch = !searchTerm || 
          lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecture.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
          filterStatus === "all" ||
          (filterStatus === "completed" && lecture.isCompleted) ||
          (filterStatus === "incomplete" && !lecture.isCompleted && !lecture.isLocked) ||
          (filterStatus === "locked" && lecture.isLocked);
        
        return matchesSearch && matchesFilter;
      }) || [];

      return {
        ...section,
        lectures: filteredLectures,
        visible: filteredLectures.length > 0
      };
    }).filter((section: any) => section.visible);
  }, [courseData?.sections, searchTerm, filterStatus]);

  // Calculate stats
  const courseStats = useMemo(() => {
    if (!progress || !courseSections) return null;
    
    const totalDuration = courseSections.reduce((total: number, section: any) => 
      total + (section.lectures?.reduce((t: number, l: any) => t + (l.duration || 0), 0) || 0), 0
    ) || 0;

    const nextLecture = navigation?.currentLecture || 
      courseSections.find((s: any) => s.lectures?.some((l: any) => !l.isCompleted))?.lectures?.find((l: any) => !l.isCompleted);

    return {
      totalDuration,
      completedLectures: progress.completedLectures || 0,
      totalLectures: progress.totalLectures || 0,
      completionPercentage: progress.completionPercentage || 0,
      timeSpent: progress.timeSpent || 0,
      streakDays: progress.streakDays || 0,
      certificateEarned: progress.certificateEarned,
      nextLecture,
      estimatedTimeToComplete: Math.max(0, totalDuration - (progress.timeSpent || 0))
    };
  }, [progress, courseSections, navigation]);

  const handleLectureClick = useCallback((lecture: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if lecture is locked by server
    if (lecture.isLocked) {
      if (isFreeCourse) {
        toast.error("Please sign in to access this lecture");
      } else {
        toast.error("Please enroll in the course to access this lecture");
      }
      return;
    }
    
    // Check if user can access content
    if (!canAccessContent) {
      if (isFreeCourse) {
        toast.error("Please sign in to access this lecture");
      } else {
        toast.error("Please enroll in the course to access this lecture");
      }
      return;
    }

    router.push(`/courses/${courseId}/learn/${lecture.id}`);
  }, [canAccessContent, isFreeCourse, courseId, router]);

  const handleToggleLectureComplete = useCallback(async (lecture: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      if (lecture.isCompleted) {
        // For uncomplete, we'd need a different mutation
        toast.info("Lecture is already marked as completed ✅");
      } else {
        // Show immediate feedback
        toast.loading("Marking lecture as complete...", { id: `complete-${lecture.id}` });
        
        await handleMarkLectureComplete(lecture.id, 100);
        
        toast.success("🎉 Lecture marked as complete!", { id: `complete-${lecture.id}` });
      }
    } catch (error) {
      toast.error("Failed to update lecture status", { id: `complete-${lecture.id}` });
    }
  }, [isAuthenticated, handleMarkLectureComplete]);

  const handleContinueLearning = useCallback(() => {
    // First try to get the next lecture from courseStats
    if (courseStats?.nextLecture && courseStats.nextLecture.id) {
      router.push(`/courses/${courseId}/learn/${courseStats.nextLecture.id}`);
      return;
    }
    
    // If no next lecture from stats, find first incomplete lecture
    const firstIncomplete = courseSections?.find((section: any) => 
      section.lectures?.some((lecture: any) => !lecture.isCompleted && !lecture.isLocked)
    )?.lectures?.find((lecture: any) => !lecture.isCompleted && !lecture.isLocked);
    
    if (firstIncomplete && firstIncomplete.id) {
      router.push(`/courses/${courseId}/learn/${firstIncomplete.id}`);
      return;
    }
    
    // Fallback to first available lecture
    if (filteredSections.length > 0 && filteredSections[0].lectures.length > 0) {
      const firstLecture = filteredSections[0].lectures[0];
      if (firstLecture && firstLecture.id) {
        router.push(`/courses/${courseId}/learn/${firstLecture.id}`);
        return;
      }
    }
    
    // If still no lecture found, show a message
    toast.info("No available lectures to continue with");
  }, [courseStats, courseSections, filteredSections, courseId, router]);

  if (isLoading) {
    return <CourseLearnSkeleton />;
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Course Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isFreeCourse ? "Sign In Required" : "Enrollment Required"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isFreeCourse 
                ? "Please sign in to access this free course content."
                : "Please enroll in this course to access the learning content."
              }
            </p>
            <Link href={`/courses/${courseId}`}>
              <Button className="w-full">
                {isFreeCourse ? "Sign In & Access" : "View Course Details"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Course Details
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold line-clamp-1">{currentCourse?.title || courseData?.title}</h1>
                <p className="text-sm text-gray-600">
                  {currentCourse?.instructor?.firstName || courseData?.instructor?.firstName} {currentCourse?.instructor?.lastName || courseData?.instructor?.lastName}
                </p>
              </div>
            </div>
            
            {courseStats && (
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(courseStats.completionPercentage)}%
                  </div>
                </div>
                {courseStats.streakDays > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Streak</div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-lg font-bold">{courseStats.streakDays}</span>
                    </div>
                  </div>
                )}
                {courseStats.certificateEarned && (
                  <Badge className="bg-green-500 text-white">
                    <Award className="w-4 h-4 mr-1" />
                    Certificate Earned
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search lectures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Lectures</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">In Progress</option>
                    <option value="locked">Locked</option>
                  </select>
                  {courseStats?.nextLecture && (
                    <Button onClick={handleContinueLearning}>
                      Continue Learning
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Sections and Lectures */}
                <div className="space-y-4">
                  {filteredSections.map((section: any, sectionIndex: number) => {
                    const isExpanded = expandedSections.has(section.id);
                    const sectionProgress = section.lectures?.filter((l: any) => l.isCompleted).length || 0;
                    const sectionTotal = section.lectures?.length || 0;
                    const sectionPercentage = sectionTotal > 0 ? (sectionProgress / sectionTotal) * 100 : 0;
                    
                    return (
                      <Card key={section.id} className="overflow-hidden">
                        <CardHeader 
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )}>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  Section {sectionIndex + 1}: {section.title}
                                </CardTitle>
                                {section.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {section.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {sectionPercentage > 0 && (
                                <div className="flex items-center gap-2">
                                  <Progress value={sectionPercentage} className="w-20 h-2" />
                                  <span className="text-sm text-gray-600">
                                    {sectionProgress}/{sectionTotal}
                                  </span>
                                </div>
                              )}
                              <Badge variant={sectionPercentage === 100 ? "default" : "secondary"}>
                                {sectionTotal} lectures • {formatDuration(
                                  section.lectures?.reduce((t: number, l: any) => t + (l.duration || 0), 0) || 0
                                )}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {isExpanded && (
                          <CardContent className="pt-0">
                            <div className="divide-y">
                              {section.lectures?.map((lecture: any, lectureIndex: number) => {
                                const isAccessible = !lecture.isLocked && canAccessContent;
                                const isCurrent = navigation?.currentLecture === lecture.id;
                                
                                return (
                                  <Link
                                    key={lecture.id}
                                    href={isAccessible ? `/courses/${courseId}/learn/${lecture.id}` : '#'}
                                    onClick={(e) => handleLectureClick(lecture, e)}
                                    className={cn(
                                      "flex items-center justify-between py-3 px-4 -mx-4 transition-all",
                                      isAccessible
                                        ? "hover:bg-blue-50 cursor-pointer"
                                        : "opacity-60 cursor-not-allowed",
                                      lecture.isCompleted && "bg-green-50/50",
                                      isCurrent && "bg-blue-50 border-l-4 border-blue-500"
                                    )}
                                  >
                                    <div className="flex items-start gap-3 flex-1">
                                      <div className="mt-0.5">
                                        {getLectureIcon(lecture)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className={cn(
                                            "font-medium",
                                            lecture.isCompleted && "text-green-700",
                                            !isAccessible && "text-gray-500"
                                          )}>
                                            {lectureIndex + 1}. {lecture.title}
                                          </span>
                                          {isCurrent && (
                                            <Badge variant="outline" className="text-xs">
                                              Current
                                            </Badge>
                                          )}
                                        </div>
                                        {lecture.description && (
                                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {lecture.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-4">
                                      <span className="text-sm text-gray-500 whitespace-nowrap">
                                        {formatDuration(lecture.duration || 0)}
                                      </span>
                                      
                                      {lecture.type === 'QUIZ' && (
                                        <Badge variant="secondary" className="text-xs">
                                          Quiz
                                        </Badge>
                                      )}
                                      
                                      {lecture.isPreview && !canAccessContent && (
                                        <Badge variant="outline" className="text-xs">
                                          Preview
                                        </Badge>
                                      )}
                                      
                                      {isAccessible && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={(e) => handleToggleLectureComplete(lecture, e)}
                                        >
                                          {lecture.isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                          ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-colors" />
                                          )}
                                        </Button>
                                      )}
                                      
                                      {!isAccessible && (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>

                {filteredSections.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No lectures found matching your criteria.</p>
                      {(searchTerm || filterStatus !== "all") && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                          }}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-600">{currentCourse?.description || courseData?.description}</p>
                    </div>
                    
                    {(currentCourse?.whatYouLearn || courseData?.whatYouLearn) && (currentCourse?.whatYouLearn?.length || courseData?.whatYouLearn?.length) > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">What You'll Learn</h3>
                        <ul className="space-y-1">
                          {(currentCourse?.whatYouLearn || courseData?.whatYouLearn)?.map((item: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(currentCourse?.requirements || courseData?.requirements) && (currentCourse?.requirements?.length || courseData?.requirements?.length) > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="space-y-1">
                          {(currentCourse?.requirements || courseData?.requirements)?.map((item: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {(currentCourse?.downloadableResources || courseData?.downloadableResources) !== null && (currentCourse?.downloadableResources || courseData?.downloadableResources) !== undefined && (currentCourse?.downloadableResources || courseData?.downloadableResources) !== false && (currentCourse?.downloadableResources || courseData?.downloadableResources) !== 0 ? (
                        <p className="text-gray-600">
                          This course includes {currentCourse?.downloadableResources || courseData?.downloadableResources} downloadable resources.
                          Access them within individual lectures.
                        </p>
                      ) : (
                        <p className="text-gray-600">
                          No downloadable resources available for this course.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseStats && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span className="font-semibold">
                          {Math.round(courseStats.completionPercentage)}%
                        </span>
                      </div>
                      <Progress 
                        value={courseStats.completionPercentage} 
                        className="h-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {courseStats.completedLectures}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {courseStats.totalLectures}
                        </div>
                        <div className="text-xs text-gray-600">Total Lectures</div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Spent</span>
                        <span className="font-medium">
                          {formatDuration(courseStats.timeSpent)}
                        </span>
                      </div>
                      {courseStats.streakDays > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Learning Streak</span>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">{courseStats.streakDays} days</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {courseStats.completionPercentage === 100 && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800">Course Completed!</h4>
                            <p className="text-xs text-green-600">Congratulations on finishing the course</p>
                          </div>
                        </div>
                        
                        {!courseStats.certificateEarned ? (
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <Award className="w-4 h-4 mr-2" />
                            Claim Certificate
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Button className="w-full" variant="outline">
                              <Award className="w-4 h-4 mr-2" />
                              View Certificate
                            </Button>
                            <Badge className="w-full justify-center bg-green-500 text-white py-2">
                              Certificate Earned ✓
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Completion Rate</div>
                      <div className="text-xs text-gray-600">
                        {currentCourse?.completionRate || courseData?.completionRate || 0}% avg for all students
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Your Rank</div>
                      <div className="text-xs text-gray-600">
                        Top {100 - Math.round((courseStats?.completionPercentage || 0))}% of students
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Est. Completion</div>
                      <div className="text-xs text-gray-600">
                        {courseStats?.estimatedTimeToComplete 
                          ? `${Math.ceil(courseStats.estimatedTimeToComplete / 60)} days left`
                          : 'Calculate your pace'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}