"use client";

import { useRef, useEffect, useState } from "react";
import { Search, X, BookOpen, Users, Star, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchStore } from "@/stores/search.store";
import { AnimatedWrapper, fadeInUp } from "../animations/AnimatedWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

interface SearchSuggestion {
  id: string;
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

export function HeroSearch() {
  const setShowNavbarSearch = useSearchStore(
    (state) => state.setShowNavbarSearch
  );
  const observerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get course data
  const { courses, isLoading: coursesLoading } = useCourses({
    limit: 50, // Get courses for search suggestions
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbarSearch(!entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [setShowNavbarSearch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // Filter courses based on search term
      const filteredCourses = courses.filter(course => 
        course.title?.toLowerCase().includes(value.toLowerCase()) ||
        course.description?.toLowerCase().includes(value.toLowerCase()) ||
        course.category?.toLowerCase().includes(value.toLowerCase()) ||
        course.instructor?.firstName?.toLowerCase().includes(value.toLowerCase()) ||
        course.instructor?.lastName?.toLowerCase().includes(value.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(value.toLowerCase())
      );

      // Convert to suggestions format
      const suggestions: SearchSuggestion[] = filteredCourses.slice(0, 6).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || course.shortDescription || '',
        thumbnail: course.thumbnail,
        rating: course.avgRating,
        students: course.currentEnrollments,
        duration: course.totalDuration || `${course.estimatedHours || 0}h ${course.estimatedMinutes || 0}m`,
        category: course.category,
        instructor: course.instructor ? {
          name: `${course.instructor.firstName} ${course.instructor.lastName}`,
          title: course.instructor.title || 'Instructor'
        } : undefined
      }));

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search courses');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(`/courses/${suggestion.id}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const handleExploreCourses = () => {
    if (searchTerm.trim()) {
      // Navigate to courses page with search parameter
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/courses');
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExploreCourses();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <AnimatedWrapper
      animation={fadeInUp}
      className="flex flex-col sm:flex-row gap-4 mt-4 relative"
    >
      <div ref={searchRef} className="relative flex-grow max-w-md">
        <div ref={observerRef} className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
            size={20}
          />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              setIsSearchFocused(true);
              if (searchSuggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for courses, subjects, or instructors..."
            className="pl-10 pr-10 py-6 w-full rounded-lg border border-gray-200 focus:border-accent focus:ring-accent text-lg"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
            >
              {isSearching ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Searching...</p>
                </div>
              ) : searchSuggestions.length > 0 ? (
                <div className="p-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Card className="hover:bg-gray-50 transition-colors border-0 shadow-none mb-2 last:mb-0">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            {/* Thumbnail */}
                            <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={suggestion.thumbnail || "/images/courses/courseThumbnail.jpg"}
                                alt={suggestion.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                                {suggestion.description}
                              </p>
                              
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {suggestion.category && (
                                  <Badge variant="outline" className="text-xs px-2 py-0">
                                    {suggestion.category}
                                  </Badge>
                                )}
                                {suggestion.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span>{suggestion.rating}</span>
                                  </div>
                                )}
                                {suggestion.students && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{suggestion.students.toLocaleString()}</span>
                                  </div>
                                )}
                                {suggestion.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{suggestion.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Arrow indicator */}
                            <div className="flex items-center text-gray-400">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {/* View all results */}
                  <div className="p-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-accent hover:text-accent/80"
                      onClick={handleExploreCourses}
                    >
                      View all results for "{searchTerm}"
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : searchTerm && !isSearching ? (
                <div className="p-4 text-center">
                  <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No courses found</p>
                  <p className="text-xs text-gray-500">Try different keywords</p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={handleExploreCourses}
        className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-accent/25"
        size="lg"
      >
        {searchTerm ? `Search "${searchTerm}"` : "Explore Courses"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </AnimatedWrapper>
  );
}
