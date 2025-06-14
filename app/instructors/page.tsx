"use client";

import { useState } from "react";
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
import { instructors } from "@/data/instructorsData";

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

  const sortedInstructors = [...instructors].sort((a, b) => {
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

  const availableTodayCount = instructors.filter(
    (i) => i.nextAvailableSlot
  ).length;
  const liveSessionsCount = instructors.filter(
    (i) => i.liveSessionsEnabled
  ).length;

  // Calculate additional stats for enhanced hero
  const avgRating =
    instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length;
  const totalStudents = instructors.reduce(
    (sum, i) => sum + i.studentsCount,
    0
  );

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

            {/* CTA Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore All Instructors
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Live Session
              </Button>
            </div> */}
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {instructors.length}
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
          <div className="border-b bg-white/50 backdrop-blur-sm">
            <div className="container py-6 px-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {sortedInstructors.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {instructors.length}
                  </span>{" "}
                  instructors
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
                            onClick={() => setSortBy(option.value)}
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

          <div className="container py-8 px-5">
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedInstructors.map((instructor) => (
                  <InstructorCard
                    key={instructor.id}
                    instructor={instructor}
                    view="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedInstructors.map((instructor) => (
                  <InstructorCard
                    key={instructor.id}
                    instructor={instructor}
                    view="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
