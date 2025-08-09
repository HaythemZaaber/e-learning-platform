"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Users,
  MessageCircle,
  CheckCircle,
  Play,
  Lock,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Heart,
  Flag,
  Share2,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  HelpCircle,
  Settings,
  Maximize,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { VideoPlayer } from "@/features/courses/components/lessons/videoPlayer";
import { LectureNavigation } from "@/features/courses/components/lessons/lectureNavigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

// Loading skeleton
const LessonSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Skeleton className="aspect-video w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const { courseId, lessonId } = use(params);
  
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "resources" | "discussion">("overview");
  const [noteContent, setNoteContent] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const progressUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressRef = useRef<number>(0);

  const {
    setLecture: setStoreLecture,
    setVideoProgress,
    videoProgress,
  } = useCoursePreviewStore();

  const {
    course: courseData,
    lecture: currentLecture,
    progress,
    navigation,
    isLoading,
    error,
    isEnrolled,
    isAuthenticated,
    handleMarkLectureComplete,
    handleUpdateProgress,
    handleToggleBookmark,
    handleAddNote,
    handleDownloadResource,
    handleTrackInteraction,
  } = useCoursePreview({ 
    courseId,
    lectureId: lessonId,
    autoTrackView: true,
    autoTrackProgress: false // We'll handle this manually with debouncing
  });

  // Update store when lecture changes
  useEffect(() => {
    if (currentLecture) {
      setStoreLecture(currentLecture);
    }
  }, [currentLecture, setStoreLecture]);

  // Create debounced progress update function
  const debouncedProgressUpdate = useCallback(
    debounce((lectureId: string, progress: number, timeSpent: number) => {
      // Only update if progress changed significantly (more than 5%)
      if (Math.abs(progress - lastProgressRef.current) > 5) {
        handleUpdateProgress(lectureId, progress, timeSpent);
        lastProgressRef.current = progress;
      }
    }, 5000), // Update every 5 seconds max
    [handleUpdateProgress]
  );

  // Format duration helper
  const formatDuration = useCallback((duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Get video URL from contentItem
  const getVideoUrl = useCallback(() => {
    if (!currentLecture) return null;
    
    // First check if lecture has direct videoUrl
    if (currentLecture.videoUrl) {
      return currentLecture.videoUrl;
    }
    
    // Then check contentItem
    if (currentLecture.contentItem) {
      const contentItem = currentLecture.contentItem;
      if (contentItem.type === 'VIDEO' && contentItem.fileUrl) {
        return contentItem.fileUrl;
      }
    }
    
    return null;
  }, [currentLecture]);

  // Calculate lecture navigation
  const allLectures = courseData?.sections?.flatMap(section => section.lectures || []) || [];
  const currentIndex = allLectures.findIndex(lecture => lecture.id === currentLecture?.id);
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
  const previousLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;

  const handleNextLecture = useCallback(() => {
    if (nextLecture && !nextLecture.isLocked) {
      // Mark current as complete if progress > 90%
      if (videoProgress > 90 && currentLecture) {
        handleMarkLectureComplete(currentLecture.id, 100);
      }
      router.push(`/courses/${courseId}/learn/${nextLecture.id}`);
    } else if (!nextLecture) {
      toast.success("Congratulations! You've completed all lectures in this course.");
    }
  }, [nextLecture, videoProgress, currentLecture, handleMarkLectureComplete, courseId, router]);

  const handlePreviousLecture = useCallback(() => {
    if (previousLecture && !previousLecture.isLocked) {
      router.push(`/courses/${courseId}/learn/${previousLecture.id}`);
    }
  }, [previousLecture, courseId, router]);

  const handleLectureSelect = useCallback((lecture: any) => {
    if (!lecture.isLocked) {
      router.push(`/courses/${courseId}/learn/${lecture.id}`);
    } else {
      toast.error("This lecture is locked. Please complete previous lectures first.");
    }
  }, [courseId, router]);

  const handleVideoProgress = useCallback((progress: number) => {
    setVideoProgress(progress);
    
    // Track interaction at key points
    if (progress === 25 || progress === 50 || progress === 75) {
      handleTrackInteraction(lessonId, `video_progress_${progress}`, { progress });
    }
    
    // Use debounced update for progress tracking
    if (currentLecture) {
      const timeSpent = Math.round((progress / 100) * (currentLecture.duration || 0));
      debouncedProgressUpdate(currentLecture.id, progress, timeSpent);
    }
    
    // Auto-complete at 90%
    if (progress >= 90 && currentLecture && !currentLecture.isCompleted) {
      handleMarkLectureComplete(currentLecture.id, progress);
      toast.success("🎉 Lecture completed! Great job!");
    }
  }, [setVideoProgress, handleTrackInteraction, lessonId, currentLecture, debouncedProgressUpdate, handleMarkLectureComplete]);

  const handleBookmark = useCallback(async () => {
    if (!currentLecture) return;
    
    try {
      await handleToggleBookmark(currentLecture.id);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Lecture bookmarked");
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  }, [currentLecture, handleToggleBookmark, isBookmarked]);

  const handleSaveNote = useCallback(async () => {
    if (!currentLecture || !noteContent.trim()) return;
    
    try {
      await handleAddNote(currentLecture.id, noteContent, videoProgress);
      toast.success("Note saved successfully");
      setNoteContent("");
    } catch (error) {
      toast.error("Failed to save note");
    }
  }, [currentLecture, noteContent, videoProgress, handleAddNote]);

  const handleShareLecture = useCallback(async () => {
    if (!currentLecture) return;
    
    try {
      const shareUrl = `${window.location.origin}/courses/${courseId}/learn/${currentLecture.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: currentLecture.title,
          text: `Check out this lecture: ${currentLecture.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lecture link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share lecture");
    }
  }, [currentLecture, courseId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateTimerRef.current) {
        clearTimeout(progressUpdateTimerRef.current);
      }
      debouncedProgressUpdate.cancel();
    };
  }, [debouncedProgressUpdate]);

  if (isLoading) {
    return <LessonSkeleton />;
  }

  if (error || !courseData || !currentLecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lecture Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The lecture you're looking for doesn't exist or has been removed.
            </p>
            <Link href={`/courses/${courseId}/learn`}>
              <Button>Back to Course</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Required
            </h1>
            <p className="text-gray-600 mb-6">
              {!isAuthenticated 
                ? "Please sign in and enroll to access this lecture."
                : "Please enroll in this course to access this lecture."
              }
            </p>
            <Link href={`/courses/${courseId}`}>
              <Button className="w-full">
                {!isAuthenticated ? "Sign In & Enroll" : "View Course Details"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videoUrl = getVideoUrl();
  const hasVideo = !!videoUrl;
  const hasResources = currentLecture.resources && currentLecture.resources.length > 0;
  const hasQuiz = !!currentLecture.quiz;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${courseId}/learn`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold line-clamp-1">{currentLecture.title}</h1>
                <p className="text-sm text-gray-600">
                  {courseData.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareLecture}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                {sidebarCollapsed ? <ChevronDown /> : <ChevronUp />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "lg:col-span-4" : "lg:col-span-3"
          )}>
            {/* Video Player or Content Display */}
            {hasVideo ? (
              <Card className="overflow-hidden mb-6">
                <VideoPlayer
                  src={videoUrl}
                  title={currentLecture.title}
                  currentLecture={{
                    id: currentLecture.id,
                    title: currentLecture.title,
                    duration: formatDuration(currentLecture.duration || 0),
                    hasNotes: true,
                    hasTranscript: !!currentLecture.transcript,
                  }}
                  onNext={nextLecture ? handleNextLecture : undefined}
                  onPrevious={previousLecture ? handlePreviousLecture : undefined}
                  onProgress={handleVideoProgress}
                />
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Text Lecture</h2>
                  <p className="text-gray-600">
                    This is a text-based lecture. Read the content below.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Lecture Content Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="resources">
                      Resources {hasResources && `(${currentLecture.resources?.length || 0})`}
                    </TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About This Lecture</h3>
                          <p className="text-gray-700">
                            {currentLecture.description || "No description available."}
                          </p>
                        </div>

                        {currentLecture.content && (
                          <div>
                            <Separator className="my-4" />
                            <div 
                              className="prose prose-gray max-w-none"
                              dangerouslySetInnerHTML={{ __html: currentLecture.content }}
                            />
                          </div>
                        )}

                        {hasQuiz && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <HelpCircle className="w-5 h-5 text-blue-600" />
                              <div>
                                <h4 className="font-semibold">Quiz Available</h4>
                                <p className="text-sm text-gray-600">
                                  Test your knowledge with a quiz at the end of this lecture.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Take Notes</h3>
                          <Textarea
                            placeholder="Write your notes here..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="min-h-[200px]"
                          />
                          <Button 
                            onClick={handleSaveNote}
                            disabled={!noteContent.trim()}
                            className="mt-3"
                          >
                            <StickyNote className="w-4 h-4 mr-2" />
                            Save Note
                          </Button>
                        </div>

                        {/* Display existing notes */}
                        <div>
                          <h4 className="font-medium mb-2">Your Previous Notes</h4>
                          <p className="text-sm text-gray-600">
                            No notes yet. Start taking notes to remember key points!
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Downloadable Resources</h3>
                        {hasResources ? (
                          <div className="space-y-2">
                            {currentLecture.resources?.map((resource, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-gray-400" />
                                  <div>
                                    <p className="font-medium">{resource.name}</p>
                                    <p className="text-sm text-gray-600">{resource.type}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadResource(resource.url, currentLecture.id)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            No downloadable resources for this lecture.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Discussion Tab */}
                    <TabsContent value="discussion" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Discussion</h3>
                        <p className="text-gray-600">
                          Join the discussion with other students. Ask questions and share insights.
                        </p>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Discussion
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Lecture Actions */}
            <div className="mt-6 space-y-4">
              {/* Mark as Complete Button */}
              {!currentLecture.isCompleted && (
                <div className="text-center">
                  <Button
                    onClick={() => {
                      toast.loading("Marking lecture as complete...", { id: `complete-${currentLecture.id}` });
                      handleMarkLectureComplete(currentLecture.id, 100).then(() => {
                        toast.success("🎉 Lecture completed! Great job!", { id: `complete-${currentLecture.id}` });
                      }).catch(() => {
                        toast.error("Failed to mark lecture as complete", { id: `complete-${currentLecture.id}` });
                      });
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}
              
              {/* Completed Badge */}
              {currentLecture.isCompleted && (
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Lecture Completed ✓
                  </Badge>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousLecture}
                  disabled={!previousLecture || previousLecture.isLocked}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Lecture
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Lecture {currentIndex + 1} of {allLectures.length}
                  </p>
                </div>
                
                <Button
                  onClick={handleNextLecture}
                  disabled={!nextLecture || nextLecture.isLocked}
                >
                  Next Lecture
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Lecture Navigation */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1 space-y-4">
              <LectureNavigation
                sections={navigation?.sections || courseData?.sections || []}
                currentLectureId={currentLecture.id}
                onLectureSelect={handleLectureSelect}
                progress={progress ? {
                  completedLectures: progress.completedLectures,
                  totalLectures: progress.totalLectures,
                  completionPercentage: progress.completionPercentage
                } : undefined}
              />
              
              {/* Progress Summary Card */}
              {progress && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h4 className="font-semibold text-sm mb-3">Learning Progress</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium">{Math.round(progress.completionPercentage)}%</span>
                    </div>
                    <Progress value={progress.completionPercentage} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{progress.completedLectures}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{progress.totalLectures}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </div>
                    
                    {progress.timeSpent > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time Spent</span>
                          <span className="font-medium">{formatDuration(progress.timeSpent)}</span>
                        </div>
                      </div>
                    )}
                    
                    {progress.certificateEarned && (
                      <div className="border-t pt-3">
                        <Badge className="w-full justify-center bg-green-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Certificate Earned!
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}