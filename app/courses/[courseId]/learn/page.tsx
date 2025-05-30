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

interface Lecture {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'quiz' | 'reading';
}

interface Section {
  id: string;
  title: string;
  duration: string;
  lectures: Lecture[];
}

export default function CourseLearnPage({
  params,
}: {
  params: { courseId: string };
}) {
  const router = useRouter();
  
  // Mock data - replace with actual API call
  const courseData = {
    id: params.courseId,
    title: "Difficult Things About Education",
    description: "Master Python by building 100 projects in 100 days.",
    totalDuration: "65 hours",
    completedLectures: 3,
    totalLectures: 45,
    lastWatchedLecture: "variables",
    sections: [
      {
        id: "intro",
        title: "Intro to Python and Modules",
        duration: "45 mins",
        lectures: [
          {
            id: "course-intro",
            title: "Course Intro",
            duration: "5 mins",
            type: "video" as const,
            isCompleted: true,
            isLocked: false,
          },
          {
            id: "python-basics",
            title: "Python Basics",
            duration: "15 mins",
            type: "video" as const,
            isCompleted: true,
            isLocked: false,
          },
          {
            id: "setup-project",
            title: "Setup Your First Project",
            duration: "25 mins",
            type: "video" as const,
            isCompleted: true,
            isLocked: false,
          },
        ],
      },
      {
        id: "fundamentals",
        title: "Course Fundamentals",
        duration: "1h 30min",
        lectures: [
          {
            id: "variables",
            title: "Variables and Data Types",
            duration: "20 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: false,
          },
          {
            id: "control-flow",
            title: "Control Flow",
            duration: "25 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: false,
          },
          {
            id: "functions",
            title: "Functions",
            duration: "25 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: true,
          },
          {
            id: "error-handling",
            title: "Error Handling",
            duration: "20 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
      {
        id: "education",
        title: "10 Things To Know About Education!",
        duration: "2h 45min",
        lectures: [
          {
            id: "education-basics",
            title: "Education Basics",
            duration: "30 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: true,
          },
          {
            id: "learning-strategies",
            title: "Learning Strategies",
            duration: "45 mins",
            type: "video" as const,
            isCompleted: false,
            isLocked: true,
          },
        ],
      },
    ] as Section[],
  };

  const progressPercentage = Math.round(
    (courseData.completedLectures / courseData.totalLectures) * 100
  );

  const handleLectureClick = (lecture: Lecture) => {
    if (!lecture.isLocked) {
      router.push(`/courses/${params.courseId}/learn/${lecture.id}`);
    }
  };

  const resumeLastLesson = () => {
    router.push(`/courses/${params.courseId}/learn/${courseData.lastWatchedLecture}`);
  };

  const getLectureIcon = (lecture: Lecture) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (lecture.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    return <Play className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${params.courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Course Details
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{courseData.title}</h1>
                <p className="text-sm text-gray-600">{courseData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Progress</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{progressPercentage}% Complete</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{courseData.completedLectures} of {courseData.totalLectures} lessons completed</span>
                <span>{courseData.totalDuration} total</span>
              </div>

              <Button onClick={resumeLastLesson} className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>

            {/* Course Sections */}
            <div className="space-y-6">
              {courseData.sections.map((section, sectionIndex) => (
                <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      <span className="text-sm text-gray-600">{section.duration}</span>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {section.lectures.map((lecture, lectureIndex) => (
                      <div
                        key={lecture.id}
                        onClick={() => handleLectureClick(lecture)}
                        className={`p-4 flex items-center justify-between transition-colors ${
                          lecture.isLocked 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {getLectureIcon(lecture)}
                          </div>
                          <div>
                            <p className="font-medium">{lecture.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{lecture.duration}</span>
                              {lecture.type === 'video' && (
                                <>
                                  <span>•</span>
                                  <span>Video</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {lecture.isCompleted && (
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Completed
                          </div>
                        )}
                        
                        {lecture.isLocked && (
                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Locked
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold mb-4">Course Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lessons</span>
                  <span className="font-medium">{courseData.totalLectures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {courseData.completedLectures}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium">
                    {courseData.totalLectures - courseData.completedLectures}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-medium">{courseData.totalDuration}</span>
                </div>
              </div>
            </div>

            {/* Course Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Course Resources</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course Notes
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Downloadable Resources
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Q&A Forum
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}