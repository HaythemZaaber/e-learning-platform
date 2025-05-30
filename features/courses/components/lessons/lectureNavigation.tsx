"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, CheckCircle, Lock } from "lucide-react";

interface Lecture {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface LectureNavigationProps {
  sections: Section[];
  currentLectureId: string;
  onLectureSelect: (lecture: Lecture) => void;
}

export function LectureNavigation({
  sections,
  currentLectureId,
  onLectureSelect,
}: LectureNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["section-1"])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Course Content</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="border-b last:border-0">
            <button
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2">
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span className="font-medium text-left">{section.title}</span>
              </div>
              <span className="text-sm text-gray-500">
                {section.lectures.length} lectures
              </span>
            </button>

            {expandedSections.has(section.id) && (
              <div className="pb-2">
                {section.lectures.map((lecture) => (
                  <button
                    key={lecture.id}
                    className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors ${
                      currentLectureId === lecture.id
                        ? "bg-blue-50 border-r-2 border-blue-600"
                        : ""
                    }`}
                    onClick={() =>
                      !lecture.isLocked && onLectureSelect(lecture)
                    }
                    disabled={lecture.isLocked}
                  >
                    <div className="flex-shrink-0">
                      {lecture.isLocked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : lecture.isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <div
                        className={`text-sm ${
                          lecture.isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {lecture.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lecture.duration}
                      </div>
                    </div>

                    {currentLectureId === lecture.id && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
