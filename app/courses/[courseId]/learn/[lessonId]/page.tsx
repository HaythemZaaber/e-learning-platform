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
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lecture {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'quiz' | 'reading';
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

// Mock VideoPlayer component - replace with your actual component
const VideoPlayer = ({ 
  src, 
  title, 
  onProgress, 
  onComplete 
}: { 
  src: string; 
  title: string; 
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}) => (
  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
    <video 
      className="w-full h-full" 
      controls 
      src={src}
      onTimeUpdate={(e) => {
        const video = e.currentTarget;
        const progress = (video.currentTime / video.duration) * 100;
        onProgress?.(progress);
      }}
      onEnded={() => onComplete?.()}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
      {title}
    </div>
  </div>
);

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  // Mock course data
  const courseData = {
    id: params.courseId,
    title: "Difficult Things About Education",
    sections: [
      {
        id: "intro",
        title: "Intro to Python and Modules",
        lectures: [
          {
            id: "course-intro",
            title: "Course Intro",
            duration: "5:30",
            isCompleted: true,
            isLocked: false,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            id: "python-basics",
            title: "Python Basics",
            duration: "15:20",
            isCompleted: true,
            isLocked: false,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
          {
            id: "setup-project",
            title: "Setup Your First Project",
            duration: "25:45",
            isCompleted: false,
            isLocked: false,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
      {
        id: "fundamentals",
        title: "Python Fundamentals",
        lectures: [
          {
            id: "variables",
            title: "Variables and Data Types",
            duration: "20:30",
            isCompleted: false,
            isLocked: false,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
          {
            id: "control-flow",
            title: "Control Flow",
            duration: "25:15",
            isCompleted: false,
            isLocked: false,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
          {
            id: "functions",
            title: "Functions",
            duration: "18:45",
            isCompleted: false,
            isLocked: true,
            type: "video" as const,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          },
        ],
      },
    ] as Section[],
  };

  // Find current lecture
  const allLectures = courseData.sections.flatMap(section => section.lectures);
  const currentLecture = allLectures.find(lecture => lecture.id === params.lessonId);
  const currentIndex = allLectures.findIndex(lecture => lecture.id === params.lessonId);
  
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
  const previousLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;

  if (!currentLecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link href={`/courses/${params.courseId}/learn`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (nextLecture && !nextLecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${nextLecture.id}`);
    }
  };

  const handlePrevious = () => {
    if (previousLecture) {
      router.push(`/courses/${params.courseId}/learn/${previousLecture.id}`);
    }
  };

  const handleLectureSelect = (lecture: Lecture) => {
    if (!lecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${lecture.id}`);
    }
  };

  const handleVideoComplete = () => {
    // Mark as completed and auto-advance
    console.log("Video completed, marking as watched");
    if (nextLecture && !nextLecture.isLocked) {
      setTimeout(() => {
        router.push(`/courses/${params.courseId}/learn/${nextLecture.id}`);
      }, 3000); // 3 second delay before auto-advance
    }
  };

  const LectureIcon = ({ lecture }: { lecture: Lecture }) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (lecture.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    if (lecture.id === currentLecture.id) {
      return <Play className="w-4 h-4 text-blue-500" />;
    }
    return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
  };

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
                  Course Overview
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{courseData.title}</h1>
                <p className="text-sm text-gray-600">{currentLecture.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Notes
              </Button>
              <Button variant="ghost" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Q&A
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                {sidebarCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* Video Player */}
          <div className={sidebarCollapsed ? 'col-span-1' : 'lg:col-span-3'}>
            <VideoPlayer
              src={currentLecture.videoUrl}
              title={currentLecture.title}
              onProgress={setWatchProgress}
              onComplete={handleVideoComplete}
            />

            {/* Lesson Navigation */}
            <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow-sm">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={!previousLecture}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Lesson {currentIndex + 1} of {allLectures.length}
                </p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${watchProgress}%` }}
                  ></div>
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!nextLecture || nextLecture.isLocked}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Lesson Description */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About This Lesson</h2>
              <p className="text-gray-700 mb-4">
                In this lesson, we'll dive deep into {currentLecture.title.toLowerCase()}. 
                This foundational concept will help you understand the core principles 
                that you'll use throughout the rest of the course.
              </p>

              <div className="space-y-3">
                <h3 className="font-medium">Key Topics Covered:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Understanding the fundamental concepts</li>
                  <li>Practical examples and use cases</li>
                  <li>Best practices and common pitfalls</li>
                  <li>Hands-on exercises</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Navigation */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-16">
                <h3 className="font-semibold mb-4">Course Content</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {courseData.sections.map((section) => (
                    <div key={section.id}>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.lectures.map((lecture) => (
                          <div
                            key={lecture.id}
                            onClick={() => handleLectureSelect(lecture)}
                            className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                              lecture.id === currentLecture.id
                                ? 'bg-blue-50 text-blue-700'
                                : lecture.isLocked
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <LectureIcon lecture={lecture} />
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{lecture.title}</p>
                              <p className="text-xs text-gray-500">{lecture.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Your Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Completed</span>
                      <span>
                        {allLectures.filter(l => l.isCompleted).length} / {allLectures.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(allLectures.filter(l => l.isCompleted).length / allLectures.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Download Resources
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}