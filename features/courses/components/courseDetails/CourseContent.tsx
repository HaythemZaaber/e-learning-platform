"use client";

import { ChevronDown, ChevronUp, Play, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CourseSection } from "@/types/courseTypes";

export function CourseContent({ sections, courseId }: { sections: CourseSection[], courseId: string }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    sections?.[0]?.id || null
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

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

  const getTotalLectures = () => {
    return sections?.reduce((total, section) => total + (section.lectures?.length || 0), 0) || 0;
  };

  const getTotalDuration = () => {
    return sections?.reduce((total, section) => {
      const sectionDuration = section.lectures?.reduce((lectureTotal, lecture) => 
        lectureTotal + (lecture.duration || 0), 0) || 0;
      return total + sectionDuration;
    }, 0) || 0;
  };

  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Course Content</h2>
      <div className="text-sm text-gray-600 mb-4 flex justify-between">
        <span>{sections?.length || 0} sections • {getTotalLectures()} lectures • {formatTotalDuration(getTotalDuration())} total length</span>
        <Link href={`/courses/${courseId}/learn`}>
          <button className="text-primary hover:underline cursor-pointer">
           View all sections
          </button>
        </Link>
      </div>

      <div className="space-y-3">
        {sections?.map((section) => (
          <div key={section.id} className="border rounded-md overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2">
                <div className="transition-transform duration-300">
                  {expandedSection === section.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                <span className="font-medium">{section.title}</span>
                <span className="text-sm text-gray-500">
                  • {formatTotalDuration(section.lectures?.reduce((total, lecture) => total + (lecture.duration || 0), 0) || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {section.lectures?.length || 0} lectures
              </div>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                expandedSection === section.id
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="divide-y">
                  {section.lectures?.map((lecture, idx) => (
                    <Link
                      key={idx}
                      href={`/courses/${courseId}/learn/${lecture.id}`}
                      className={`flex justify-between items-center p-4 transition-colors ${
                        lecture.isLocked 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getLectureIcon(lecture)}
                        <span>{lecture.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {formatDuration(lecture.duration || 0)}
                        </span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
