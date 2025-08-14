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
  isFreeCourse?: boolean;
  canAccessContent?: boolean;
  progress?: CourseProgress | null;
}

export function CourseContent({ 
  sections = [], 
  courseId, 
  isEnrolled = false,
  isFreeCourse = false,
  canAccessContent = false,
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

  // Determine if a lecture should be locked for the current user
  const isLectureLocked = (lecture: any) => {
    // If user can access content (enrolled), nothing is locked
    if (canAccessContent) {
      return false;
    }
    
    // For non-enrolled users, ALL lectures are locked (both free and paid courses)
    return true;
  };

  // Determine if a section should be locked (if any lecture in it is locked)
  const isSectionLocked = (section: any) => {
    if (canAccessContent) {
      return false;
    }
    
    // Check if any lecture in the section is locked
    return section.lectures?.some((lecture: any) => isLectureLocked(lecture)) || true;
  };

  const getLectureIcon = (lecture: any) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    
    const locked = isLectureLocked(lecture);
    if (locked) {
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
    const locked = isLectureLocked(lecture);
    
    if (locked) {
      e.preventDefault();
      if (isFreeCourse) {
        toast.error("Please sign in to access this lecture");
      } else {
        toast.error("Please enroll in the course to access this lecture");
      }
      return;
    }

    // Only allow navigation if lecture is not locked
    if (lecture.isLocked) {
      e.preventDefault();
      if (isFreeCourse) {
        toast.error("Please sign in to access this lecture");
      } else {
        toast.error("Please enroll in the course to access this lecture");
      }
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
            {canAccessContent && (
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
          {canAccessContent && (
            <Link href={`/courses/${courseId}/learn`}>
              <Button size="sm" className="text-xs">
                Continue Learning
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter (shown when user can access content) */}
      {canAccessContent && (
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

      {/* Overall Progress (shown when user can access content) */}
      {canAccessContent && progress && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-900">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-blue-900">
              {Math.round(progress?.completionPercentage || 0)}%
            </span>
          </div>
          <Progress 
            value={progress?.completionPercentage || 0} 
            className="h-2"
          />
          {progress?.certificateEarned && (
            <Badge className="mt-2 bg-green-500 text-white">
              Certificate Earned! 🎉
            </Badge>
          )}
        </div>
      )}

      {/* Access Notice for Non-Enrolled Users */}
      {!canAccessContent && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">
                {isFreeCourse ? "Enroll for Free to Access Content" : "Enroll to Access Content"}
              </h4>
              <p className="text-sm text-amber-700">
                {isFreeCourse 
                  ? "This is a free course. Enroll now to start learning and track your progress."
                  : "Enroll in this course to access all lectures and track your progress."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Locked Content Notice */}
      {!canAccessContent && !isFreeCourse && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <div>
              <h4 className="font-semibold text-gray-700">
                Course Content is Locked
              </h4>
              <p className="text-sm text-gray-600">
                Lectures are locked until you enroll in this course. 
                You can expand sections to preview the course structure and content.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {filteredSections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionProgress = canAccessContent ? getSectionProgress(section) : 0;
          const sectionLocked = isSectionLocked(section);
          
          return (
            <div 
              key={section.id} 
              className={cn(
                "border-2 border-gray-200 rounded-lg overflow-hidden transition-all hover:border-gray-300",
                isExpanded && "shadow-lg border-blue-200",
                sectionLocked && "opacity-75 bg-gray-50"
              )}
            >
              <button
                className={cn(
                  "w-full flex justify-between items-center p-6 transition-colors",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                  isExpanded ? "bg-blue-50 border-b border-gray-200" : "bg-white",
                  sectionLocked && "opacity-80"
                )}
                onClick={() => {
                  // Allow section expansion for all users to see course structure
                  toggleSection(section.id);
                }}
                aria-expanded={isExpanded}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={cn(
                    "transition-transform duration-200 text-gray-600",
                    isExpanded && "rotate-180 text-blue-600"
                  )}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-gray-900">
                        Section {sectionIndex + 1}: {section.title}
                      </span>
                      {canAccessContent && sectionProgress === 100 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Completed
                        </Badge>
                      )}
                      {sectionLocked && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          {isFreeCourse ? "Enroll for Free" : "Enroll to Access"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                                  <div className="flex items-center gap-4 text-sm">
                    {canAccessContent && sectionProgress > 0 && (
                      <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                        <Progress value={sectionProgress} className="w-16 h-1.5" />
                        <span className="text-xs font-semibold text-blue-700">
                          {Math.round(sectionProgress)}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {section.lectures?.length || 0} lectures
                      </span>
                      <span className="hidden sm:inline whitespace-nowrap font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {formatTotalDuration(
                          section.lectures?.reduce((total, lecture) => 
                            total + (lecture.duration || 0), 0
                          ) || 0
                        )}
                      </span>
                      {sectionLocked && (
                        <span className="text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Locked
                        </span>
                      )}
                    </div>
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
                      const locked = isLectureLocked(lecture);
                      const isAccessible = !locked;
                      const isLoading = loadingLecture === lecture.id;
                      
                                              return (
                          <Link
                            key={lecture.id}
                            href={isAccessible && !lecture.isLocked ? `/courses/${courseId}/learn/${lecture.id}` : '#'}
                            onClick={(e) => handleLectureClick(lecture, e)}
                            className={cn(
                              "flex justify-between items-center p-4 transition-all group",
                              isAccessible && !lecture.isLocked
                                ? "hover:bg-blue-50 cursor-pointer"
                                : "opacity-60 cursor-not-allowed bg-gray-50",
                              lecture.isCompleted && "bg-green-50/50",
                              isLoading && "animate-pulse",
                              lecture.isLocked && "border-l-4 border-gray-300"
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
                                  (!isAccessible || lecture.isLocked) && "text-gray-500"
                                )}>
                                  {lectureIndex + 1}. {lecture.title}
                                  {lecture.isLocked && (
                                    <Lock className="w-3 h-3 ml-1 inline" />
                                  )}
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
                            
                            {lecture.isPreview && !canAccessContent && (
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
                                {isFreeCourse ? "Enroll for Free" : "Enroll to Access"}
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