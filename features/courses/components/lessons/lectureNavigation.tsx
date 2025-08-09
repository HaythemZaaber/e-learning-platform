"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Play, CheckCircle, Lock, Clock, Award, Target, ExpandIcon, MinimizeIcon } from "lucide-react";
import { CourseSection, CourseLecture } from "@/types/courseTypes";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LectureNavigationProps {
  sections: CourseSection[];
  currentLectureId: string;
  onLectureSelect: (lecture: CourseLecture) => void;
  progress?: {
    completedLectures: number;
    totalLectures: number;
    completionPercentage: number;
  };
}

export function LectureNavigation({
  sections,
  currentLectureId,
  onLectureSelect,
  progress,
}: LectureNavigationProps) {
  // Find the section containing the current lecture and expand it by default
  const currentSectionId = useMemo(() => {
    if (!sections || sections.length === 0 || !currentLectureId) return null;
    
    return sections.find(section => 
      section.lectures && section.lectures.length > 0 && 
      section.lectures.some(lecture => lecture.id === currentLectureId)
    )?.id || null;
  }, [sections, currentLectureId]);

  // Initialize expanded sections with current section or first section
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initialSections = new Set<string>();
    
    // Try to restore from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lecture-navigation-expanded');
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          parsed.forEach(id => initialSections.add(id));
        }
      } catch (e) {
        console.log('Failed to restore expanded sections from localStorage');
      }
    }
    
    // If nothing restored, use default logic
    if (initialSections.size === 0) {
      // Always expand the current section if found
      if (currentSectionId) {
        initialSections.add(currentSectionId);
      }
      // If no current section but we have sections, expand the first one
      else if (sections && sections.length > 0) {
        initialSections.add(sections[0].id);
      }
    }
    
    return initialSections;
  });

  // Update expanded sections when current lecture changes or sections are loaded
  useEffect(() => {
    if (currentSectionId && !expandedSections.has(currentSectionId)) {
      setExpandedSections(prev => new Set([...prev, currentSectionId]));
    }
    // Emergency fallback: if we have a current lecture but no sections are expanded, expand its section
    else if (currentLectureId && expandedSections.size === 0 && sections.length > 0) {
      const fallbackSection = sections.find(section => 
        section?.lectures?.some(lecture => lecture?.id === currentLectureId)
      );
      if (fallbackSection) {
        setExpandedSections(new Set([fallbackSection.id]));
      } else {
        // Last resort: expand first section
        setExpandedSections(new Set([sections[0].id]));
      }
    }
  }, [currentSectionId, currentLectureId, expandedSections.size, sections]);

  // Ensure at least one section is expanded when sections load
  useEffect(() => {
    if (sections && sections.length > 0 && expandedSections.size === 0) {
      const sectionToExpand = currentSectionId || sections[0].id;
      setExpandedSections(new Set([sectionToExpand]));
    }
  }, [sections, currentSectionId, expandedSections.size]);

  // Save expanded sections to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && expandedSections.size > 0) {
      try {
        localStorage.setItem('lecture-navigation-expanded', JSON.stringify(Array.from(expandedSections)));
      } catch (e) {
        console.log('Failed to save expanded sections to localStorage');
      }
    }
  }, [expandedSections]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lecture-navigation-expanded', JSON.stringify(Array.from(newExpanded)));
      } catch (e) {
        console.log('Failed to save expanded sections to localStorage');
      }
    }
  };

  const expandAllSections = () => {
    const allSectionIds = sections.map(section => section.id);
    const newExpanded = new Set(allSectionIds);
    setExpandedSections(newExpanded);
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set());
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getLectureIcon = (lecture: CourseLecture) => {
    if (lecture.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (lecture.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    if (lecture.type === 'QUIZ') {
      return <Target className="w-4 h-4 text-purple-600" />;
    }
    return <Play className="w-4 h-4 text-blue-600" />;
  };

  const getSectionStats = (section: CourseSection) => {
    const total = section.lectures?.length || 0;
    const completed = section.lectures?.filter(l => l.isCompleted).length || 0;
    const duration = section.lectures?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, duration, percentage };
  };

  // Loading state
  if (!sections || sections.length === 0) {
    console.log('⚠️ No sections available for navigation');
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Course Content</h3>
        </div>
        <div className="p-4">
          <div className="text-center space-y-3">
            <p className="text-gray-500">Loading course sections...</p>
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 ml-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
   
      
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Course Content</h3>
          <div className="flex items-center gap-2">
            {progress && (
              <Badge variant="secondary" className="text-xs">
                {progress.completedLectures}/{progress.totalLectures}
              </Badge>
            )}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAllSections}
                className="h-7 px-2 text-xs"
                title="Expand All Sections"
              >
                <ExpandIcon className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={collapseAllSections}
                className="h-7 px-2 text-xs"
                title="Collapse All Sections"
              >
                <MinimizeIcon className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress.completionPercentage)}%</span>
            </div>
            <Progress value={progress.completionPercentage} className="h-2" />
          </div>
        )}
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {sections.filter(section => section && section.id).map((section, sectionIndex) => {
          const sectionStats = getSectionStats(section);
          const isCurrentSection = section.id === currentSectionId;
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} className="border-b last:border-0">
              <button
                className={cn(
                  "w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors",
                  isCurrentSection && "bg-blue-50"
                )}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      Section {sectionIndex + 1}: {section.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{sectionStats.completed}/{sectionStats.total} completed</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(sectionStats.duration)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sectionStats.percentage > 0 && (
                    <div className="flex items-center gap-2">
                      <Progress value={sectionStats.percentage} className="w-8 h-1.5" />
                      <span className="text-xs text-gray-500 min-w-[2rem]">
                        {Math.round(sectionStats.percentage)}%
                      </span>
                    </div>
                  )}
                  {sectionStats.percentage === 100 && (
                    <Award className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="bg-gray-50/50">
                  {section.lectures && section.lectures.length > 0 ? (
                    section.lectures.map((lecture, lectureIndex) => {
                      const isCurrent = currentLectureId === lecture.id;
                      const isAccessible = !lecture.isLocked;
                    
                    return (
                      <button
                        key={lecture.id}
                        className={cn(
                          "w-full flex items-center gap-3 px-6 py-3 text-left transition-all",
                          isAccessible 
                            ? "hover:bg-white cursor-pointer" 
                            : "cursor-not-allowed opacity-60",
                          isCurrent && "bg-blue-100 border-r-4 border-blue-600 shadow-sm",
                          lecture.isCompleted && !isCurrent && "bg-green-50/50"
                        )}
                        onClick={() => isAccessible && onLectureSelect(lecture)}
                        disabled={!isAccessible}
                      >
                        <div className="flex-shrink-0">
                          {getLectureIcon(lecture)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              lecture.isLocked 
                                ? "text-gray-400" 
                                : lecture.isCompleted 
                                  ? "text-green-700"
                                  : "text-gray-900",
                              isCurrent && "text-blue-700"
                            )}>
                              {lectureIndex + 1}. {lecture.title}
                            </span>
                            {isCurrent && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                Now Playing
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(lecture.duration || 0)}</span>
                            {lecture.type === 'QUIZ' && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">Quiz</Badge>
                              </>
                            )}
                            {lecture.isPreview && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">Preview</Badge>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {lecture.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {isCurrent && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </button>
                    );
                  })
                  ) : (
                    <div className="px-6 py-4 text-sm text-gray-500 italic">
                      No lectures available in this section
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
