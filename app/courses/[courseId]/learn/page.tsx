"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen,
  Award,
  ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoursePreview } from "@/features/courses/hooks/useCoursePreview";
import LoadingSpinner from "@/components/ui/loadingSpinner";

export default function CourseLearnPage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();
  
  const {
    course: courseData,
    progress,
    navigation,
    isLoading,
    error,
    isEnrolled,
    isAuthenticated,
    handleMarkLectureComplete,
    handleUpdateProgress,
  } = useCoursePreview({ courseId: params.courseId });

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getLectureIcon = (lecture: any) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (lecture.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    return <Play className="w-4 h-4 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600">
            The course you're looking for doesn't exist or has been removed.
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
              <Link href={`/courses/${params.courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{courseData.title}</h1>
                <p className="text-sm text-gray-600">
                  {courseData.instructor?.firstName} {courseData.instructor?.lastName}
                </p>
              </div>
            </div>
            
            {progress && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-lg font-bold">
                  {Math.round(progress.completionPercentage || 0)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Course Content</h2>
              
              <div className="space-y-4">
                {courseData.sections?.map((section) => (
                  <div key={section.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3">
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-600">
                        {section.lectures?.length || 0} lectures • {formatDuration(section.lectures?.reduce((total, lecture) => total + (lecture.duration || 0), 0) || 0)}
                      </p>
                    </div>
                    
                    <div className="divide-y">
                      {section.lectures?.map((lecture) => (
                        <Link
                          key={lecture.id}
                          href={`/courses/${params.courseId}/learn/${lecture.id}`}
                          className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                            lecture.isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getLectureIcon(lecture)}
                            <div>
                              <div className="font-medium">{lecture.title}</div>
                              <div className="text-sm text-gray-500">
                                {formatDuration(lecture.duration || 0)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {lecture.isPreview && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Preview
                              </span>
                            )}
                            {lecture.isCompleted && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            )}
                            {lecture.isLocked && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Locked
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Course Progress</h3>
              
              {progress && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round(progress.completionPercentage || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Lectures Completed</div>
                      <div className="font-semibold">
                        {progress.completedLectures || 0} / {progress.totalLectures || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Time Spent</div>
                      <div className="font-semibold">
                        {Math.round((progress.timeSpent || 0) / 60)}h {Math.round((progress.timeSpent || 0) % 60)}m
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}