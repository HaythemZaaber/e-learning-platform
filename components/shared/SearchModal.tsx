"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  TrendingUp,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { Course } from "@/types/courseTypes";

// Utility function to calculate actual course duration from sections
const getActualCourseDuration = (course: Course) => {
  if (!course?.sections) return { hours: 0, minutes: 0 };
  
  const totalSeconds = course.sections.reduce((total: number, section: any) => {
    const sectionDuration = section.lectures?.reduce((lectureTotal: number, lecture: any) => 
      lectureTotal + (lecture.duration || 0), 0) || 0;
    return total + sectionDuration;
  }, 0);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  return { hours, minutes };
};

// Utility function to format duration
const formatDuration = (hours: number, minutes: number) => {
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "0m";
  }
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'course' | 'instructor';
  title: string;
  description: string;
  thumbnail?: string;
  rating?: number;
  students?: number;
  duration?: string;
  category?: string;
  instructor?: {
    name: string;
    title: string;
  };
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'courses' | 'instructors'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use real course data from the database
  const { courses, isLoading: coursesLoading } = useCourses({
    limit: 100, // Get more courses for search
  });

  useEffect(() => {
    if (isOpen) {
      // Focus the search input when modal opens
      const timer = setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Filter real courses based on search term
      const filteredCourses = courses.filter(course => 
        course.title?.toLowerCase().includes(query.toLowerCase()) ||
        course.description?.toLowerCase().includes(query.toLowerCase()) ||
        course.category?.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor?.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(query.toLowerCase())
      );

      // Convert courses to search results format
      const courseResults: SearchResult[] = filteredCourses.map(course => {
        const duration = getActualCourseDuration(course);
        return {
          id: course.id,
          type: 'course',
          title: course.title,
          description: course.description || course.shortDescription || '',
          thumbnail: course.thumbnail,
          rating: course.avgRating,
          students: course.currentEnrollments,
          duration: formatDuration(duration.hours, duration.minutes),
          category: course.category,
          instructor: course.instructor ? {
            name: `${course.instructor.firstName} ${course.instructor.lastName}`,
            title: course.instructor.title || 'Instructor'
          } : undefined
        };
      });

      // For now, we'll only show courses. In the future, you can add instructor search
      const instructorResults: SearchResult[] = [];
      
      setSearchResults([...courseResults, ...instructorResults]);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search courses');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'course') {
      router.push(`/courses/${result.id}`);
    } else {
      router.push(`/instructors/${result.id}`);
    }
    onClose();
  };

  const filteredResults = searchResults.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'courses') return result.type === 'course';
    if (activeFilter === 'instructors') return result.type === 'instructor';
    return true;
  });

  const SearchResultCard = ({ result }: { result: SearchResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => handleResultClick(result)}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full pt-0">
        <CardContent className="p-0 h-full">
          <div className={viewMode === 'grid' ? 'flex flex-col h-full' : 'flex'}>
            {/* Thumbnail - Smaller for grid view */}
            <div className={`relative ${viewMode === 'grid' ? 'aspect-[4/3]' : 'w-32 h-24'} flex-shrink-0`}>
              <Image
                src={result.thumbnail || "/images/courses/courseThumbnail.jpg"}
                alt={result.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {result.type === 'course' ? 'Course' : 'Instructor'}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900  text-sm">
                  {result.title}
                </h3>
                {result.rating !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{result.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1">
                {result.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                {result.category && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {result.category}
                  </span>
                )}
                {result.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{result.duration}</span>
                  </div>
                )}
                {result.students !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{result.students.toLocaleString()}</span>
                  </div>
                )}
                {result.instructor && (
                  <div className="flex items-center gap-1">
                    <span>by {result.instructor.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">Search Courses and Instructors</DialogTitle>
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-white">
            <div className="flex items-center gap-3 flex-1">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                id="search-input"
                placeholder="Search for courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-primary/10 hover:text-black"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters and View Toggle - Fixed */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-1">
                {(['all', 'courses', 'instructors'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className="text-xs"
                  >
                    {filter === 'all' ? 'All' : filter === 'courses' ? 'Courses' : 'Instructors'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Results - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6">
            {coursesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading courses...</span>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : searchTerm && filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : !searchTerm ? (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start searching</h3>
                <p className="text-gray-600">
                  Search for courses, instructors, or topics to get started
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredResults.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </span>
              <div className="flex items-center gap-4">
                <span>Press Esc to close</span>
                <span>Press Enter to search</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
