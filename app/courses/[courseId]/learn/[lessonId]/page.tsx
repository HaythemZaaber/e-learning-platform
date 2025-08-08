// app/courses/[courseId]/learn/[lessonId]/page.tsx
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { VideoPlayer } from "@/features/courses/components/lessons/videoPlayer";
import { LectureNavigation } from "@/features/courses/components/lessons/lectureNavigation";

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  } = useCoursePreview({ 
    courseId: params.courseId,
    lectureId: params.lessonId 
  });

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const allLectures = courseData.sections?.flatMap(section => section.lectures || []) || [];
  const currentIndex = allLectures.findIndex(lecture => lecture.id === currentLecture.id);
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
  const previousLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;

  const handleNextLecture = () => {
    if (nextLecture && !nextLecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${nextLecture.id}`);
    }
  };

  const handlePreviousLecture = () => {
    if (previousLecture && !previousLecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${previousLecture.id}`);
    }
  };

  const handleLectureSelect = (lecture: any) => {
    if (!lecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${lecture.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData || !currentLecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lecture Not Found
          </h1>
          <p className="text-gray-600">
            The lecture you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            {!isAuthenticated 
              ? "Please sign in and enroll in this course to access the learning content."
              : "Please enroll in this course to access the learning content."
            }
          </p>
          <Link href={`/courses/${params.courseId}`}>
            <Button>{!isAuthenticated ? "Sign In & Enroll" : "Enroll Now"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${params.courseId}/learn`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
                              <div>
                  <h1 className="text-xl font-bold">{currentLecture.title}</h1>
                  <p className="text-sm text-gray-600">
                    {courseData.title}
                  </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <VideoPlayer
                src={currentLecture.videoUrl || ""}
                title={currentLecture.title}
                currentLecture={{
                  id: currentLecture.id,
                  title: currentLecture.title,
                  duration: formatDuration(currentLecture.duration || 0),
                  hasNotes: false,
                  hasTranscript: !!currentLecture.transcript,
                }}
                onNext={handleNextLecture}
                onPrevious={handlePreviousLecture}
                onProgress={(progress) => {
                  handleUpdateProgress(currentLecture.id, progress, 0);
                }}
              />
            </div>

            {/* Lecture Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Lecture Content</h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  {currentLecture.description}
                </p>
                
                {currentLecture.content && (
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: currentLecture.content }}
                  />
                )}
              </div>

              {/* Lecture Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                 <div className="flex items-center gap-4">
                   <Button
                     variant="outline"
                     onClick={handlePreviousLecture}
                     disabled={!previousLecture || previousLecture.isLocked}
                   >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Previous
                   </Button>
                   
                   <Button
                     onClick={handleNextLecture}
                     disabled={!nextLecture || nextLecture.isLocked}
                   >
                     Next
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Discussion
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LectureNavigation
              sections={courseData.sections || []}
              currentLectureId={currentLecture.id}
              onLectureSelect={handleLectureSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
