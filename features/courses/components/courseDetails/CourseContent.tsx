"use client";

import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function CourseContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "intro"
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: "intro",
      title: "Intro to Python and Modules",
      duration: "45 mins",
      lectures: [
        {
          title: "Course Intro",
          duration: "5 mins",
          type: "video",
          id: "course-intro",
        },
        {
          title: "Python Basics",
          duration: "15 mins",
          type: "video",
          id: "python-basics",
        },
        {
          title: "Setup Your First Project",
          duration: "25 mins",
          type: "video",
          id: "setup-project",
        },
      ],
    },
    {
      id: "fundamentals",
      title: "Course Fundamentals",
      duration: "1h 30min",
      lectures: [
        {
          title: "Variables and Data Types",
          duration: "20 mins",
          type: "video",
          id: "variables",
        },
        {
          title: "Control Flow",
          duration: "25 mins",
          type: "video",
          id: "control-flow",
        },
        {
          title: "Functions",
          duration: "25 mins",
          type: "video",
          id: "functions",
        },
        {
          title: "Error Handling",
          duration: "20 mins",
          type: "video",
          id: "error-handling",
        },
      ],
    },
    {
      id: "education",
      title: "10 Things To Know About Education!",
      duration: "2h 45min",
      lectures: [
        {
          title: "Education Basics",
          duration: "30 mins",
          type: "video",
          id: "education-basics",
        },
        {
          title: "Learning Strategies",
          duration: "45 mins",
          type: "video",
          id: "learning-strategies",
        },
        {
          title: "Teaching Methods",
          duration: "50 mins",
          type: "video",
          id: "teaching-methods",
        },
        {
          title: "Assessment Techniques",
          duration: "40 mins",
          type: "video",
          id: "assessment-techniques",
        },
      ],
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Course Content</h2>
      <div className="text-sm text-gray-600 mb-4 flex justify-between">
        <span>3 sections • 11 lectures • 4h 45m total length</span>
        <button className="text-primary hover:underline cursor-pointer">Expand all sections</button>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
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
                  • {section.duration}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {section.lectures.length} lectures
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
                  {section.lectures.map((lecture, idx) => (
                    <Link
                      key={idx}
                      href={`/courses/course-id/lessons/${lecture.id}`}
                      className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Play size={14} />
                        <span>{lecture.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {lecture.duration}
                      </span>
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
