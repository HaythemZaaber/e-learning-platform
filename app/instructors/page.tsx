"use client";

import React, { useState, useMemo } from "react";
import {
  Grid,
  List,
  ChevronDown,
  Calendar,
  Users,
  Star,
  Award,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstructorCard } from "@/components/shared/InstructorCard";
import { FilterSidebar } from "@/features/instructors/components/FilterSidebar";
import { Pagination } from "@/components/shared/Pagination";

// GraphQL hooks
import { useInstructorsPageData } from "@/features/instructors/hooks/useInstructorsGraphQL";
import { useInstructorsStore } from "@/stores/instructors.store";

// Loading and error components
import {
  InstructorGridSkeleton,
  InstructorPageHeaderSkeleton,
  PaginationSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/ui/instructor-skeleton";

const ITEMS_PER_PAGE = 6;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "students", label: "Most Students" },
  { value: "newest", label: "Newest" },
  { value: "available-today", label: "Available Today" },
  { value: "most-booked", label: "Most Booked" },
  { value: "name", label: "A-Z" },
];

export default function InstructorsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // GraphQL data
  const {
    instructors,
    availableTodayInstructors,
    transformedInstructors,
    pagination,
    loading,
    error,
  } = useInstructorsPageData(undefined, currentPage, ITEMS_PER_PAGE, sortBy);

  // Store actions and state
  const {
    getFilteredInstructors,
    setCurrentPage: setStoreCurrentPage,
    setSortBy: setStoreSortBy,
    setViewMode,
    viewMode,
    filters,
  } = useInstructorsStore();

  // Get filtered and sorted instructors
  const sortedInstructors = useMemo(() => {
    // Use filtered instructors from store if available, otherwise use GraphQL data
    const filteredInstructors = getFilteredInstructors();
    const instructorsToUse =
      filteredInstructors.length > 0
        ? filteredInstructors
        : transformedInstructors;

    // Debug: Log data sources for troubleshooting
    console.log("Data sources:", {
      filteredInstructorsLength: filteredInstructors.length,
      transformedInstructorsLength: transformedInstructors.length,
      rawInstructorsLength: instructors.length,
      usingFiltered: filteredInstructors.length > 0,
      usingTransformed:
        filteredInstructors.length === 0 && transformedInstructors.length > 0,
      usingRaw:
        filteredInstructors.length === 0 &&
        transformedInstructors.length === 0 &&
        instructors.length > 0,
    });

    // If still no data, use the raw instructors data as fallback
    const finalInstructors =
      instructorsToUse.length > 0
        ? instructorsToUse
        : instructors.length > 0
        ? instructors.map((instructor) => ({
            id: instructor.user.id,

            name: `${instructor.user.firstName} ${instructor.user.lastName}`,
            title: instructor.title || "Instructor",
            avatar: instructor.user.profileImage || "/placeholder.svg",
            coverImage: "/placeholder.svg?height=600&width=1200",
            bio: instructor.bio || "",
            shortBio: instructor.shortBio || "",
            rating: instructor.teachingRating || 0,
            reviewsCount: Math.floor(instructor.totalStudents * 0.1),
            studentsCount: instructor.totalStudents,
            coursesCount: instructor.totalCourses,
            responseTime: `${instructor.responseTime || 24} hours`,
            completionRate: instructor.courseCompletionRate || 0,
            languages: ["English"],
            experience: instructor.experience || 0,
            education: instructor.qualifications || [],
            certifications: instructor.qualifications || [],
            philosophy: instructor.teachingStyle || "",
            categories: instructor.teachingCategories || [],
            skills: instructor.expertise.map((exp) => ({
              name: exp,
              proficiency: "Expert",
            })),
            location: "Remote",
            socialLinks: {
              linkedin: instructor.linkedinProfile,
              website: instructor.personalWebsite,
            },
            isOnline: false,
            isVerified: instructor.isVerified,
            priceRange: {
              min: Math.min(
                instructor.individualSessionRate || 50,
                instructor.groupSessionRate || 200
              ),
              max: Math.max(
                instructor.individualSessionRate || 50,
                instructor.groupSessionRate || 200
              ),
            },
            liveSessionsEnabled: instructor.isAcceptingStudents || false,
            groupSessionsEnabled: instructor.groupSessionRate > 0,
            nextAvailableSlot: undefined,
            weeklyBookings: 0,
            responseTimeHours: instructor.responseTime || 24,
            contentEngagement: {
              totalViews: instructor.totalStudents * 10,
              totalLikes: instructor.totalStudents,
              avgEngagementRate: 5.5,
            },
            reels: [],
            stories: [],
            storyHighlights: [],
            recordedCourses: [],
            follow: {
              totalFollowers: (instructor as any).totalFollowers ?? 0,
              newFollowersThisWeek:
                (instructor as any).newFollowersThisWeek ?? 0,
              newFollowersThisMonth:
                (instructor as any).newFollowersThisMonth ?? 0,
              isFollowing: (instructor as any).isFollowing ?? false,
            },
          }))
        : [];

    return [...finalInstructors].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "students":
          return b.studentsCount - a.studentsCount;
        case "most-booked":
          return b.weeklyBookings - a.weeklyBookings;
        case "available-today":
          return (b.nextAvailableSlot ? 1 : 0) - (a.nextAvailableSlot ? 1 : 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return 0; // Would sort by join date if available
        default:
          return 0; // Featured order
      }
    });
  }, [
    getFilteredInstructors,
    sortBy,
    filters,
    transformedInstructors,
    instructors,
  ]);

  console.log("sortedInstructors", sortedInstructors[0]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedInstructors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInstructors = sortedInstructors.slice(startIndex, endIndex);

  // Reset page when sort changes
  React.useEffect(() => {
    setCurrentPage(1);
    setStoreCurrentPage(1);
  }, [sortBy, setStoreCurrentPage]);

  // Sync view mode with store
  React.useEffect(() => {
    setViewMode(view);
  }, [view, setViewMode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setStoreCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setStoreSortBy(newSortBy as any);
  };

  // Calculate stats for enhanced hero
  const availableTodayCount = availableTodayInstructors?.length || 0;
  const liveSessionsCount = sortedInstructors.filter(
    (i) => i.liveSessionsEnabled
  ).length;
  const avgRating =
    sortedInstructors.length > 0
      ? sortedInstructors.reduce((sum, i) => sum + i.rating, 0) /
        sortedInstructors.length
      : 0;
  const totalStudents = sortedInstructors.reduce(
    (sum, i) => sum + i.studentsCount,
    0
  );

  // Loading states
  const isLoading = loading;
  const hasError = !!error;

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-background">
        <ErrorState
          error={error || "Failed to load instructors. Please try again."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container py-16 mx-auto w-[90vw] relative">
          {/* Main Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                World-Class Learning Experience
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Meet Our Expert
              <br />
              <span className="text-blue-600">Instructors</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Learn from industry professionals and subject matter experts who
              are passionate about sharing their knowledge and helping you
              succeed in your learning journey.
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg text-center"
                >
                  <div className="animate-pulse">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {sortedInstructors.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Expert Instructors
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 group-hover:bg-green-200 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {availableTodayCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Available Today
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 group-hover:bg-purple-200 transition-colors">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Average Rating
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {(totalStudents / 1000).toFixed(0)}K+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Students Taught
                </div>
              </div>
            </div>
          )}

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <Badge className="bg-white/90 text-gray-700 border-gray-200 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors">
              🎯 Personalized Learning Paths
            </Badge>
            <Badge className="bg-white/90 text-gray-700 border-gray-200 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors">
              🔴 Live Interactive Sessions
            </Badge>
            <Badge className="bg-white/90 text-gray-700 border-gray-200 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors">
              📚 On-Demand Courses
            </Badge>
            <Badge className="bg-white/90 text-gray-700 border-gray-200 px-4 py-2 rounded-full font-medium hover:bg-white transition-colors">
              🏆 Industry Experts
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex w-[93vw] mx-auto">
        <FilterSidebar />

        <div className="flex-1">
          {isLoading ? (
            <InstructorPageHeaderSkeleton />
          ) : (
            <div className="border-b bg-white/50 backdrop-blur-sm">
              <div className="container py-6 px-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}-
                      {Math.min(endIndex, sortedInstructors.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {sortedInstructors.length}
                    </span>{" "}
                    instructors
                    {currentPage > 1 &&
                      ` • Page ${currentPage} of ${totalPages}`}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Sort by:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-lg border-2 hover:bg-gray-50"
                          >
                            {
                              sortOptions.find(
                                (option) => option.value === sortBy
                              )?.label
                            }
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-2"
                        >
                          {sortOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className="rounded-lg"
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex border-2 rounded-lg overflow-hidden">
                      <Button
                        variant={view === "grid" ? "default" : "ghost"}
                        size="sm"
                        className="h-9 px-4 rounded-none border-r"
                        onClick={() => setView("grid")}
                      >
                        <Grid className="h-4 w-4" />
                        <span className="sr-only">Grid view</span>
                      </Button>
                      <Button
                        variant={view === "list" ? "default" : "ghost"}
                        size="sm"
                        className="h-9 px-4 rounded-none"
                        onClick={() => setView("list")}
                      >
                        <List className="h-4 w-4" />
                        <span className="sr-only">List view</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container py-8 px-5">
            {isLoading ? (
              <InstructorGridSkeleton count={6} view={view} />
            ) : currentInstructors.length > 0 ? (
              <>
                {view === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {currentInstructors.map((instructor) => (
                      <InstructorCard
                        key={instructor.id}
                        instructor={instructor}
                        view="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {currentInstructors.map((instructor) => (
                      <InstructorCard
                        key={instructor.id}
                        instructor={instructor}
                        view="list"
                      />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedInstructors.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                    showSummary={true}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <EmptyState
                title="No Instructors Found"
                description="No instructors match your current filter criteria. Try adjusting your filters or search terms."
                action={
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Reset Filters
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
