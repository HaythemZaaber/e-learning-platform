"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Share2,
  Bookmark,
  BookmarkCheck,
  HelpCircle,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { useVideoProgress } from "@/features/courses/hooks/useVideoProgress";
import { VideoPlayer } from "@/features/courses/components/lessons/videoPlayer";
import { LectureNavigation } from "@/features/courses/components/lessons/lectureNavigation";
import { NotesPanel } from "@/features/courses/components/lessons/NotesPanel";
import { ContentType } from "@/types/courseTypes";
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

// Content Renderer Component for different content types
interface ContentRendererProps {
  contentData: any;
  lecture: any;
  onMarkComplete: (lectureId: string, progress: number) => Promise<void>;
  isCompleted: boolean;
}

const ContentRenderer = ({ contentData, lecture, onMarkComplete, isCompleted }: ContentRendererProps) => {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const handleMarkComplete = async () => {
    if (isCompleted) {
      toast.info("Content already marked as completed ✅");
      return;
    }

    setIsMarkingComplete(true);
    try {
      await onMarkComplete(lecture.id, 100);
      toast.success("🎉 Content marked as completed!");
    } catch (error) {
      toast.error("Failed to mark content as complete");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleDownload = async () => {
    if (!contentData?.url) {
      toast.error("Download link not available");
      return;
    }

    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = contentData.url;
      link.download = contentData.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Auto-mark as complete for downloadable content
      if (!isCompleted) {
        await handleMarkComplete();
      }

      toast.success("📥 File downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'IMAGE':
        return <FileText className="w-8 h-8 text-green-500" />;
      case 'AUDIO':
        return <FileText className="w-8 h-8 text-purple-500" />;
      case 'ARCHIVE':
        return <FileText className="w-8 h-8 text-orange-500" />;
      case 'TEXT':
        return <FileText className="w-8 h-8 text-gray-500" />;
      case 'RESOURCE':
        return <Download className="w-8 h-8 text-indigo-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const renderContent = () => {
    if (!contentData) {
      return (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Content Available</h2>
          <p className="text-gray-600">This lecture doesn't have any content yet.</p>
        </div>
      );
    }

    switch (contentData.type) {
      case 'DOCUMENT':
      case 'RESOURCE':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getContentIcon(contentData.type)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{contentData.title || 'Document'}</h3>
                {contentData.description && (
                  <p className="text-gray-600 text-sm">{contentData.description}</p>
                )}
                {contentData.fileSize && (
                  <p className="text-gray-500 text-xs">{formatFileSize(contentData.fileSize)}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {contentData.isDownloadable && (
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download {contentData.fileName || 'File'}
                </Button>
              )}
              <Button 
                onClick={handleMarkComplete}
                disabled={isMarkingComplete || isCompleted}
                variant={isCompleted ? "secondary" : "default"}
                className="flex-1"
              >
                {isMarkingComplete ? (
                  <>Loading...</>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'IMAGE':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getContentIcon(contentData.type)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{contentData.title || 'Image'}</h3>
                {contentData.description && (
                  <p className="text-gray-600 text-sm">{contentData.description}</p>
                )}
              </div>
            </div>
            
            {contentData.url && (
              <div className="mb-4">
                <img 
                  src={contentData.url} 
                  alt={contentData.title || 'Lecture content'} 
                  className="w-full h-auto rounded-lg border"
                />
              </div>
            )}
            
            <div className="flex gap-3">
              {contentData.isDownloadable && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              )}
              <Button 
                onClick={handleMarkComplete}
                disabled={isMarkingComplete || isCompleted}
                variant={isCompleted ? "secondary" : "default"}
                className="flex-1"
              >
                {isMarkingComplete ? (
                  <>Loading...</>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'AUDIO':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getContentIcon(contentData.type)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{contentData.title || 'Audio'}</h3>
                {contentData.description && (
                  <p className="text-gray-600 text-sm">{contentData.description}</p>
                )}
              </div>
            </div>
            
            {contentData.url && (
              <div className="mb-4">
                <audio controls className="w-full">
                  <source src={contentData.url} type={contentData.mimeType || 'audio/mpeg'} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            <div className="flex gap-3">
              {contentData.isDownloadable && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio
                </Button>
              )}
              <Button 
                onClick={handleMarkComplete}
                disabled={isMarkingComplete || isCompleted}
                variant={isCompleted ? "secondary" : "default"}
                className="flex-1"
              >
                {isMarkingComplete ? (
                  <>Loading...</>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getContentIcon(contentData.type)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{contentData.title || 'Text Content'}</h3>
                {contentData.description && (
                  <p className="text-gray-600 text-sm">{contentData.description}</p>
                )}
              </div>
            </div>
            
            {contentData.url && (
              <div className="mb-4">
                <iframe 
                  src={contentData.url} 
                  className="w-full h-96 border rounded-lg"
                  title={contentData.title || 'Text content'}
                />
              </div>
            )}
            
            <Button 
              onClick={handleMarkComplete}
              disabled={isMarkingComplete || isCompleted}
              variant={isCompleted ? "secondary" : "default"}
              className="w-full"
            >
              {isMarkingComplete ? (
                <>Loading...</>
              ) : isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {getContentIcon(contentData.type)}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{contentData.title || 'Content'}</h3>
                {contentData.description && (
                  <p className="text-gray-600 text-sm">{contentData.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {contentData.isDownloadable && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              <Button 
                onClick={handleMarkComplete}
                disabled={isMarkingComplete || isCompleted}
                variant={isCompleted ? "secondary" : "default"}
                className="flex-1"
              >
                {isMarkingComplete ? (
                  <>Loading...</>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completionInProgress, setCompletionInProgress] = useState(false);
  const completionAttemptedRef = useRef<boolean>(false);

  const {
    setLecture: setStoreLecture,
  } = useCoursePreviewStore();

  const {
    course: courseData,
    lecture: currentLecture,
    progress: courseProgress,
    navigation,
    isLoading,
    error,
    isEnrolled,
    isAuthenticated,
    handleMarkLectureComplete,
    handleUpdateProgress,
    handleToggleBookmark,
    handleDownloadResource,
    handleTrackInteraction,
    refetchProgress,
    updateZustandStore,
  } = useCoursePreview({ 
    courseId,
    lectureId: lessonId,
    autoTrackView: false, // Disable auto view tracking to prevent conflicts with milestone tracking
    autoTrackProgress: false // Manual control
  });

  // Determine if course is free
  const isFreeCourse = courseData?.price === 0 || courseData?.enrollmentType === "FREE";
  
  // Determine if user can access content (enrolled OR free course)
  const canAccessContent = isEnrolled || isFreeCourse;

  const handleUpdateProgressRef = useRef(handleUpdateProgress);

  // Update ref when function changes
  useEffect(() => {
    handleUpdateProgressRef.current = handleUpdateProgress;
  }, [handleUpdateProgress]);

  // Create stable wrapper for handleUpdateProgress using ref
  const progressUpdateCallback = useCallback((progress: number, timeSpent: number) => {
    return handleUpdateProgressRef.current(lessonId, progress, timeSpent);
  }, [lessonId]);

  // Use the video progress hook
  const {
    progress: videoProgress,
    currentTime,
    duration,
    timeSpent,
    isCompleted,
    updateProgress: updateVideoProgress,
    getInitialTime,

  } = useVideoProgress(courseId, lessonId, progressUpdateCallback, currentLecture?.isCompleted);

  // Track lecture view once when lecture is loaded
  const hasTrackedView = useRef<boolean>(false);
  const currentLectureIdRef = useRef<string>('');
  const trackedMilestones = useRef<Set<number>>(new Set());
  const handleTrackInteractionRef = useRef(handleTrackInteraction);
  
  // Update ref when function changes
  useEffect(() => {
    handleTrackInteractionRef.current = handleTrackInteraction;
  }, [handleTrackInteraction]);

  // Update store when lecture changes
  useEffect(() => {
    if (currentLecture) {
      // Reset tracking if lecture changed
      if (currentLectureIdRef.current !== currentLecture.id) {
        hasTrackedView.current = false;
        currentLectureIdRef.current = currentLecture.id;
        trackedMilestones.current.clear(); // Reset milestone tracking for new lecture
      }
      
      setStoreLecture(currentLecture);
      
      // Reset completion state for new lecture
      setCompletionInProgress(false);
      completionAttemptedRef.current = false;
      
      // Track lecture view only once per lecture
      if (!hasTrackedView.current && isAuthenticated) {
        handleTrackInteractionRef.current(currentLecture.id, 'lecture_view', {
          timestamp: Date.now(),
          lectureTitle: currentLecture.title
        });
        hasTrackedView.current = true;
      }
      
      console.log('📚 Lecture loaded:', {
        id: currentLecture.id,
        title: currentLecture.title,
        isCompleted: currentLecture.isCompleted
      });
    }
  }, [currentLecture, setStoreLecture, isAuthenticated]);

  // Format duration helper
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

  // Format seconds to time
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  // Get content from contentItem
  const getContentData = useCallback(() => {
    if (!currentLecture) return null;
    
    // First check if lecture has direct videoUrl (legacy support)
    if (currentLecture.videoUrl) {
      return {
        type: 'VIDEO' as ContentType,
        url: currentLecture.videoUrl,
        title: currentLecture.title,
        description: currentLecture.description
      };
    }
    
    // Then check contentItem
    if (currentLecture.contentItem) {
      const contentItem = currentLecture.contentItem;
      return {
        type: contentItem.type,
        url: contentItem.fileUrl,
        title: contentItem.title,
        description: contentItem.description,
        fileName: contentItem.fileName,
        fileSize: contentItem.fileSize,
        mimeType: contentItem.mimeType,
        isDownloadable: contentItem.isDownloadable,
        contentData: contentItem.contentData
      };
    }
    
    return null;
  }, [currentLecture]);

  // Calculate lecture navigation
  const allLectures = courseData?.sections?.flatMap((section: any) => section.lectures || []) || [];
  const currentIndex = allLectures.findIndex((lecture: any) => lecture.id === currentLecture?.id);
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
  const previousLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;

  const handleNextLecture = useCallback(() => {
    if (nextLecture && canAccessContent && !nextLecture.isLocked) {
      router.push(`/courses/${courseId}/learn/${nextLecture.id}`);
    } else if (!nextLecture) {
      toast.success("🎉 Congratulations! You've completed all lectures in this course!");
    }
  }, [nextLecture, canAccessContent, courseId, router]);

  const handlePreviousLecture = useCallback(() => {
    if (previousLecture && canAccessContent && !previousLecture.isLocked) {
      router.push(`/courses/${courseId}/learn/${previousLecture.id}`);
    }
  }, [previousLecture, canAccessContent, courseId, router]);

  const handleLectureSelect = useCallback((lecture: any) => {
    if (canAccessContent && !lecture.isLocked) {
      router.push(`/courses/${courseId}/learn/${lecture.id}`);
    } else {
      if (lecture.isLocked) {
        if (isFreeCourse) {
          toast.error("Please sign in to access this lecture");
        } else {
          toast.error("Please enroll in the course to access this lecture");
        }
      } else {
        if (isFreeCourse) {
          toast.error("Please sign in to access this lecture");
        } else {
          toast.error("Please enroll in the course to access this lecture");
        }
      }
    }
  }, [canAccessContent, isFreeCourse, courseId, router]);

  const handleVideoProgress = useCallback((progress: number, currentTimeSeconds: number, durationSeconds: number) => {
    // Update local progress tracking
    console.log('🎯 Video progress:', {
      progress,
      currentTimeSeconds,
      durationSeconds
    });
    updateVideoProgress(currentTimeSeconds, durationSeconds);
    
    // Track milestones (including 100% for completion) - prevent duplicates
    const milestones = [25, 50, 75, 100];
    const currentMilestone = Math.floor(progress / 25) * 25;
    if (milestones.includes(currentMilestone) && 
        Math.abs(progress - currentMilestone) < 1 && 
        !trackedMilestones.current.has(currentMilestone)) {
      
      // Mark this milestone as tracked
      trackedMilestones.current.add(currentMilestone);
      
      handleTrackInteractionRef.current(lessonId, `video_progress_${currentMilestone}`, { 
        progress: currentMilestone,
        actualProgress: progress,
        timeWatched: currentTimeSeconds
      }, durationSeconds);
      
      if (currentMilestone === 25) {
        toast.success("🎯 25% Complete - Keep going!");
      } else if (currentMilestone === 50) {
        toast.success("⭐ Halfway there!");
      } else if (currentMilestone === 75) {
        toast.success("🔥 Almost done - 75% complete!");
      } else if (currentMilestone === 100) {
        toast.success("🎉 100% Complete - Lecture finished!");
      }
    }
    
    // Auto-complete at 100% - ONLY for incomplete lectures
    if (progress === 100 && currentLecture && 
        !isCompleted && 
        !currentLecture.isCompleted && 
        !completionInProgress && 
        !completionAttemptedRef.current) {
      
      console.log('🎯 Auto-completing lecture at 100%:', {
        lectureId: currentLecture.id,
        progress: progress.toFixed(1),
        isCompleted,
        lectureCompleted: currentLecture.isCompleted,
        completionInProgress
      });
      
      setCompletionInProgress(true);
      completionAttemptedRef.current = true;
      
      handleMarkLectureComplete(currentLecture.id, 100, timeSpent * 60).then(async () => {
        toast.success("🎉 Lecture completed! Great job!", {
          description: "You've mastered this content!",
          duration: 5000,
        });
        
        // Update completion state without aggressive refetching
        setCompletionInProgress(false);
        
        // Update Zustand store immediately to reflect completion status
        await updateZustandStore();
        
        // Gentle refresh of progress data only (not the entire course)
        setTimeout(() => {
          refetchProgress();
          updateZustandStore(); // Update store again with fresh data
        }, 1000);
      }).catch((error) => {
        console.error('❌ Failed to mark lecture complete:', error);
        toast.error("Failed to mark lecture as complete");
        setCompletionInProgress(false);
        completionAttemptedRef.current = false; // Allow retry on error
      });
    }

  }, [updateVideoProgress, lessonId, currentLecture, isCompleted, handleMarkLectureComplete, refetchProgress, completionInProgress, updateZustandStore]);

  const handleManualComplete = useCallback(async () => {
    if (!currentLecture || completionInProgress || completionAttemptedRef.current) return;
    
    try {
      setCompletionInProgress(true);
      completionAttemptedRef.current = true;
      
      toast.loading("Marking lecture as complete...", { id: `complete-${currentLecture.id}` });
      await handleMarkLectureComplete(currentLecture.id, 100, currentLecture.duration);
      toast.success("🎉 Lecture completed!", { id: `complete-${currentLecture.id}` });
      
      // Update completion state without aggressive refetching
      setCompletionInProgress(false);
      
      // Update Zustand store immediately to reflect completion status
      await updateZustandStore();
      
      // Gentle refresh of progress data only
      setTimeout(() => {
        refetchProgress();
        updateZustandStore(); // Update store again with fresh data
      }, 1000);
    } catch (error) {
      toast.error("Failed to mark lecture as complete", { id: `complete-${currentLecture.id}` });
      setCompletionInProgress(false);
      completionAttemptedRef.current = false; // Allow retry on error
    }
  }, [currentLecture, handleMarkLectureComplete, refetchProgress, completionInProgress, updateZustandStore]);

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

  const handleJumpToTimestamp = useCallback((timestamp: number) => {
    // Use the global seek function exposed by VideoPlayer
    if ((window as any).seekVideoTo) {
      (window as any).seekVideoTo(timestamp);
    }
  }, []);

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

  if (!canAccessContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isFreeCourse ? "Sign In Required" : "Access Required"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isFreeCourse 
                ? "Please sign in to access this free course lecture."
                : "Please enroll in this course to access this lecture."
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

  const contentData = getContentData();
  const hasVideo = contentData?.type === 'VIDEO';
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
              {/* Progress indicator */}
              {videoProgress > 0 && (
                <div className="flex items-center gap-2 mr-3">
                  <Progress value={videoProgress} className="w-20 h-2" />
                  <span className="text-sm font-medium">{Math.round(videoProgress)}%</span>
                </div>
              )}
              
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
            {/* Content Display */}
            {hasVideo ? (
              <Card className="overflow-hidden mb-6">
                                              <VideoPlayer
                src={contentData?.url || ''}
                  title={currentLecture.title}
                  currentLecture={{
                    id: currentLecture.id,
                    title: currentLecture.title,
                    duration: formatDuration(currentLecture.duration || 0),
                    hasNotes: true,
                    hasTranscript: !!currentLecture.transcript,
                  }}
                courseId={courseId}
                                    onNext={nextLecture ? handleNextLecture : undefined}
                  onPrevious={previousLecture ? handlePreviousLecture : undefined}
                  onProgress={handleVideoProgress}
                  initialTime={getInitialTime()}
                />
              </Card>
            ) : (
              <ContentRenderer 
                contentData={contentData}
                lecture={currentLecture}
                onMarkComplete={(lectureId, progress) => handleMarkLectureComplete(lectureId, progress, currentLecture.duration)}
                isCompleted={isCompleted}
              />
            )}

            {/* Progress Stats Card */}
            {(videoProgress > 0 || timeSpent > 0) && (
              <Card className="mb-6">
                <CardContent className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(videoProgress)}%
                      </div>
                      <div className="text-xs text-gray-600">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatTime(timeSpent)}
                      </div>
                      <div className="text-xs text-gray-600">Time Watched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-xs text-gray-600">Current Position</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {isCompleted ? "✓" : formatTime(Math.max(0, duration - currentTime))}
                      </div>
                      <div className="text-xs text-gray-600">
                        {isCompleted ? "Completed" : "Remaining"}
                      </div>
                    </div>
                  </div>
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
                      <NotesPanel
                        lectureId={currentLecture.id}
                        courseId={courseId}
                        currentTime={currentTime}
                        onNoteClick={handleJumpToTimestamp}
                        className="h-[600px]"
                      />
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Downloadable Resources</h3>
                        {hasResources ? (
                          <div className="space-y-2">
                            {currentLecture.resources?.map((resource: any, index: number) => (
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
            {!currentLecture.isCompleted && !isCompleted && !completionInProgress && (
              <div className="text-center">
                <Button
                  onClick={handleManualComplete}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={completionInProgress}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            )}
            
            {/* Completion in Progress */}
            {completionInProgress && (
              <div className="text-center">
                <Button
                  disabled
                  className="bg-gray-400 cursor-not-allowed"
                >
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Completing...
                </Button>
              </div>
            )}
              
              {/* Completed Badge */}
              {(currentLecture.isCompleted || isCompleted) && (
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
                disabled={!previousLecture || !canAccessContent || previousLecture.isLocked}
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
                disabled={!nextLecture || !canAccessContent || nextLecture.isLocked}
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
                sections={courseData?.sections || navigation?.sections || []}
                currentLectureId={currentLecture.id}
                onLectureSelect={handleLectureSelect}
                isFreeCourse={courseData?.price === 0 || courseData?.enrollmentType === "FREE"}
                canAccessContent={isEnrolled || (courseData?.price === 0 || courseData?.enrollmentType === "FREE")}
                progress={courseProgress ? {
                  completedLectures: courseProgress.completedLectures,
                  totalLectures: courseProgress.totalLectures,
                  completionPercentage: courseProgress.completionPercentage
                } : undefined}
              />
              
              {/* Progress Summary Card */}
              {courseProgress && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium">{Math.round(courseProgress.completionPercentage)}%</span>
                    </div>
                    <Progress value={courseProgress.completionPercentage} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{courseProgress.completedLectures}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{courseProgress.totalLectures}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </div>
                    
                    {courseProgress.timeSpent > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Time</span>
                          <span className="font-medium">{formatDuration(courseProgress.watchTime)}</span>
                        </div>
            </div>
          )}
                    
                    {courseProgress.certificateEarned && (
                      <div className="border-t pt-3">
                        <Badge className="w-full justify-center bg-green-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Certificate Earned!
                        </Badge>
        </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}