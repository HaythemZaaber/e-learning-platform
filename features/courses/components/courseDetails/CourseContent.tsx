"use client";

import { ChevronDown, ChevronUp, Play, Lock, CheckCircle, FileText, Clock, BarChart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CourseSection, CourseProgress } from "@/types/courseTypes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCoursePreviewStore } from "@/stores/coursePreview.store";
import { toast } from "sonner";

interface CourseContentProps {
  sections: CourseSection[];
  courseId: string;
  isEnrolled?: boolean;
  progress?: CourseProgress | null;
}

export function CourseContent({ 
  sections = [], 
  courseId, 
  isEnrolled = false,
  progress 
}: CourseContentProps) {
  const { expandedSections, toggleSection } = useCoursePreviewStore();
  const [loadingLecture, setLoadingLecture] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "completed" | "incomplete">("all");

  // Initialize first section as expanded
  useEffect(() => {
    if (sections.length > 0 && expandedSections.size === 0) {
      toggleSection(sections[0].id);
    }
  }, [sections]);

  const formatDuration = (duration: number) => {
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
  };

  const getLectureIcon = (lecture: any) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    if (lecture.isLocked && !isEnrolled) {
      return <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
    if (lecture.type === 'quiz') {
      return <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />;
    }
    return <Play className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const getTotalLectures = useMemo(() => {
    return sections.reduce((total, section) => total + (section.lectures?.length || 0), 0);
  }, [sections]);

  const getTotalDuration = useMemo(() => {
    return sections.reduce((total, section) => {
      const sectionDuration = section.lectures?.reduce((lectureTotal, lecture) => 
        lectureTotal + (lecture.duration || 0), 0) || 0;
      return total + sectionDuration;
    }, 0);
  }, [sections]);

  const getCompletedLectures = useMemo(() => {
    return sections.reduce((total, section) => {
      const completed = section.lectures?.filter(l => l.isCompleted).length || 0;
      return total + completed;
    }, 0);
  }, [sections]);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getSectionProgress = (section: CourseSection) => {
    if (!section.lectures || section.lectures.length === 0) return 0;
    const completed = section.lectures.filter(l => l.isCompleted).length;
    return (completed / section.lectures.length) * 100;
  };

  const handleLectureClick = async (lecture: any, e: React.MouseEvent) => {
    if (lecture.isLocked && !isEnrolled) {
      e.preventDefault();
      toast.error("Please enroll in the course to access this lecture");
      return;
    }

    if (!lecture.isPreview && !isEnrolled) {
      e.preventDefault();
      toast.info("This lecture is available after enrollment");
      return;
    }

    setLoadingLecture(lecture.id);
    // Simulate loading
    setTimeout(() => setLoadingLecture(null), 500);
  };

  const handleExpandAll = () => {
    sections.forEach(section => {
      if (!expandedSections.has(section.id)) {
        toggleSection(section.id);
      }
    });
  };

  const handleCollapseAll = () => {
    sections.forEach(section => {
      if (expandedSections.has(section.id)) {
        toggleSection(section.id);
      }
    });
  };

  // Filter sections and lectures based on search and filter
  const filteredSections = useMemo(() => {
    return sections.map(section => {
      const filteredLectures = section.lectures?.filter(lecture => {
        const matchesSearch = !searchTerm || 
          lecture.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterType === "all" ||
          (filterType === "completed" && lecture.isCompleted) ||
          (filterType === "incomplete" && !lecture.isCompleted);
        
        return matchesSearch && matchesFilter;
      }) || [];

      return {
        ...section,
        lectures: filteredLectures,
        visible: filteredLectures.length > 0 || 
          (!searchTerm && section.title.toLowerCase().includes(searchTerm.toLowerCase()))
      };
    }).filter(section => section.visible);
  }, [sections, searchTerm, filterType]);

  if (sections.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Course Content</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Course Content</h2>
          <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <BarChart className="w-4 h-4" />
              {sections.length} sections
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              {getTotalLectures} lectures
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTotalDuration(getTotalDuration)} total
            </span>
            {isEnrolled && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {getCompletedLectures}/{getTotalLectures} completed
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            className="text-xs"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCollapseAll}
            className="text-xs"
          >
            Collapse All
          </Button>
          {isEnrolled && (
            <Link href={`/courses/${courseId}/learn`}>
              <Button size="sm" className="text-xs">
                Continue Learning
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter (shown when enrolled) */}
      {isEnrolled && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Lectures</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      )}

      {/* Overall Progress (shown when enrolled) */}
      {isEnrolled && progress && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-900">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-blue-900">
              {Math.round(progress.completionPercentage || 0)}%
            </span>
          </div>
          <Progress 
            value={progress.completionPercentage || 0} 
            className="h-2"
          />
          {progress.certificateEarned && (
            <Badge className="mt-2 bg-green-500 text-white">
              Certificate Earned! 🎉
            </Badge>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {filteredSections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionProgress = getSectionProgress(section);
          
          return (
            <div 
              key={section.id} 
              className={cn(
                "border rounded-lg overflow-hidden transition-all",
                isExpanded && "shadow-md"
              )}
            >
              <button
                className={cn(
                  "w-full flex justify-between items-center p-4 transition-colors",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                  isExpanded ? "bg-gray-50" : "bg-white"
                )}
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Section {sectionIndex + 1}: {section.title}
                      </span>
                      {sectionProgress === 100 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {isEnrolled && sectionProgress > 0 && (
                    <div className="flex items-center gap-2">
                      <Progress value={sectionProgress} className="w-16 h-1.5" />
                      <span className="text-xs font-medium">
                        {Math.round(sectionProgress)}%
                      </span>
                    </div>
                  )}
                  <span className="whitespace-nowrap">
                    {section.lectures?.length || 0} lectures
                  </span>
                  <span className="hidden sm:inline whitespace-nowrap">
                    {formatTotalDuration(
                      section.lectures?.reduce((total, lecture) => 
                        total + (lecture.duration || 0), 0
                      ) || 0
                    )}
                  </span>
                </div>
              </button>

              <div
                id={`section-${section.id}`}
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="divide-y border-t">
                    {section.lectures?.map((lecture, lectureIndex) => {
                      const isAccessible = lecture.isPreview || isEnrolled;
                      const isLoading = loadingLecture === lecture.id;
                      
                      return (
                        <Link
                          key={lecture.id}
                          href={isAccessible ? `/courses/${courseId}/learn/${lecture.id}` : '#'}
                          onClick={(e) => handleLectureClick(lecture, e)}
                          className={cn(
                            "flex justify-between items-center p-4 transition-all group",
                            isAccessible
                              ? "hover:bg-blue-50 cursor-pointer"
                              : "opacity-60 cursor-not-allowed bg-gray-50",
                            lecture.isCompleted && "bg-green-50/50",
                            isLoading && "animate-pulse"
                          )}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {getLectureIcon(lecture)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-medium",
                                  lecture.isCompleted && "text-green-700",
                                  !isAccessible && "text-gray-500"
                                )}>
                                  {lectureIndex + 1}. {lecture.title}
                                </span>
                                {lecture.type === 'QUIZ' && (
                                  <Badge variant="secondary" className="text-xs">
                                    Quiz
                                  </Badge>
                                )}
                              </div>
                              {lecture.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {lecture.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {formatDuration(lecture.duration || 0)}
                            </span>
                            
                            {lecture.isPreview && !isEnrolled && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                Preview
                              </Badge>
                            )}
                            
                            {lecture.isCompleted && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Completed
                              </Badge>
                            )}
                            
                            {!isAccessible && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                            
                            {lecture.contentItem && (
                              <Badge variant="outline" className="text-xs">
                                {lecture.contentItem.type}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No lectures found matching your criteria.</p>
          {(searchTerm || filterType !== "all") && (
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}