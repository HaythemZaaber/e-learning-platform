"use client";

import { useState } from "react";


import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "@/features/courses/components/lessons/videoPlayer";
import { LectureNavigation } from "@/features/courses/components/lessons/lectureNavigation";

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const [currentLectureId, setCurrentLectureId] = useState("lecture-1");

  // Mock data - in a real app, this would come from your API
  const courseData = {
    id: params.courseId,
    title: "Difficult Things About Education",
    sections: [
      {
        id: "section-1",
        title: "Introduction to Python",
        lectures: [
          {
            id: "lecture-1",
            title: "Course Introduction",
            duration: "5:30",
            isCompleted: true,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            id: "lecture-2",
            title: "Setting Up Python Environment",
            duration: "12:45",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
          {
            id: "lecture-3",
            title: "Your First Python Program",
            duration: "8:20",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
      {
        id: "section-2",
        title: "Python Fundamentals",
        lectures: [
          {
            id: "variables",
            title: "Variables and Data Types",
            duration: "15:30",
            isCompleted: false,
            isLocked: false,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
          {
            id: "lecture-5",
            title: "Control Flow",
            duration: "18:45",
            isCompleted: false,
            isLocked: true,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
        ],
      },
    ],
  };

  // Find current lecture by matching the lessonId from params
  const currentLecture =
    courseData.sections
      .flatMap((section) => section.lectures)
      .find((lecture) => lecture.id === params.lessonId) ||
    courseData.sections[0].lectures[0];

  const allLectures = courseData.sections.flatMap(
    (section) => section.lectures
  );
  const currentIndex = allLectures.findIndex(
    (lecture) => lecture.id === currentLecture.id
  );

  const handleLectureSelect = (lecture: any) => {
    setCurrentLectureId(lecture.id);
  };

  const handleNext = () => {
    if (currentIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentIndex + 1];
      if (!nextLecture.isLocked) {
        setCurrentLectureId(nextLecture.id);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentLectureId(allLectures[currentIndex - 1].id);
    }
  };

  const handleProgress = (progress: number) => {
    // Track video progress - you could save this to your backend
    console.log(`Video progress: ${progress}%`);
  };

  if (!currentLecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lecture not found</h1>
          <Link href={`/courses/${params.courseId}`}>
            <Button>Back to Course</Button>
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
                <h1 className="text-lg font-semibold">{courseData.title}</h1>
                <p className="text-sm text-gray-600">{currentLecture.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Resources
              </Button>
              <Button variant="ghost" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Q&A
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <VideoPlayer
              src={currentLecture.videoUrl}
              title={currentLecture.title}
              currentLecture={{
                id: currentLecture.id,
                title: currentLecture.title,
                duration: currentLecture.duration,
                hasNotes: true,
                hasTranscript: true,
              }}
              onNext={
                currentIndex < allLectures.length - 1 ? handleNext : undefined
              }
              onPrevious={currentIndex > 0 ? handlePrevious : undefined}
              onProgress={handleProgress}
            />

            {/* Lecture Description */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About This Lecture</h2>
              <p className="text-gray-700 mb-4">
                In this lecture, we'll cover the fundamental concepts that will
                serve as the foundation for your Python programming journey.
                You'll learn about variables, data types, and how to write your
                first Python program.
              </p>

              <div className="space-y-3">
                <h3 className="font-medium">What you'll learn:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Understanding Python syntax and structure</li>
                  <li>Working with variables and data types</li>
                  <li>Writing and executing your first Python program</li>
                  <li>Best practices for Python development</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LectureNavigation
              sections={courseData.sections}
              currentLectureId={currentLectureId}
              onLectureSelect={handleLectureSelect}
            />

            {/* Progress Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Course Progress</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>3 of 12 lectures completed</p>
                  <p>Estimated time remaining: 2h 30m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
