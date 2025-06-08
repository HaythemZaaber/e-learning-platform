"use client"

import { useState } from "react"
import { Grid, List, ChevronDown, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EnhancedInstructorCard } from "@/components/shared/InstructorCard"
import { EnhancedFilterSidebar } from "@/features/instructors/components/FilterSidebar"
import { instructors } from "@/lib/data/instructorsData"

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "students", label: "Most Students" },
  { value: "newest", label: "Newest" },
  { value: "available-today", label: "Available Today" },
  { value: "most-booked", label: "Most Booked" },
  { value: "name", label: "A-Z" },
]

export default function InstructorsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  const sortedInstructors = [...instructors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "students":
        return b.studentsCount - a.studentsCount
      case "most-booked":
        return b.weeklyBookings - a.weeklyBookings
      case "available-today":
        return (b.nextAvailableSlot ? 1 : 0) - (a.nextAvailableSlot ? 1 : 0)
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
        return 0 // Would sort by join date if available
      default:
        return 0 // Featured order
    }
  })

  const availableTodayCount = instructors.filter((i) => i.nextAvailableSlot).length
  const liveSessionsCount = instructors.filter((i) => i.liveSessionsEnabled).length

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Meet Our Expert Instructors</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Learn from industry professionals and subject matter experts who are passionate about sharing their
              knowledge and helping you succeed. Book live sessions, watch recorded courses, and follow their latest
              content.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="font-normal">
                {instructors.length} instructors available
              </Badge>
              <Badge variant="outline" className="font-normal bg-green-50 text-green-700 border-green-200">
                <Calendar className="h-3 w-3 mr-1" />
                {availableTodayCount} available today
              </Badge>
              <Badge variant="outline" className="font-normal bg-blue-50 text-blue-700 border-blue-200">
                <Users className="h-3 w-3 mr-1" />
                {liveSessionsCount} offer live sessions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <EnhancedFilterSidebar />

        <div className="flex-1">
          <div className="border-b">
            <div className="container py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {sortedInstructors.length} of {instructors.length} instructors
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          {sortOptions.find((option) => option.value === sortBy)?.label}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {sortOptions.map((option) => (
                          <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex border rounded-md">
                    <Button
                      variant={view === "grid" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3 rounded-r-none"
                      onClick={() => setView("grid")}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={view === "list" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3 rounded-l-none"
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

          <div className="container py-8">
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedInstructors.map((instructor) => (
                  <EnhancedInstructorCard key={instructor.id} instructor={instructor} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedInstructors.map((instructor) => (
                  <EnhancedInstructorCard key={instructor.id} instructor={instructor} view="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
