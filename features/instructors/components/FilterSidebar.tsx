"use client"

import { useState } from "react"
import { Check, Search, Calendar, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import type { Category } from "@/data/instructorsData"

const categories: Category[] = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Languages",
  "Data Science",
  "Music",
  "Photography",
]

const experienceLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "expert", label: "Expert" },
]

const ratings = [
  { id: "rating4plus", label: "4.0 & up" },
  { id: "rating3plus", label: "3.5 & up" },
  { id: "rating3", label: "3.0 & up" },
]

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "mandarin", label: "Mandarin" },
  { id: "french", label: "French" },
  { id: "japanese", label: "Japanese" },
]

const timePreferences = [
  { id: "morning", label: "Morning (6AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { id: "evening", label: "Evening (6PM - 12AM)" },
]

const sessionTypes = [
  { id: "individual", label: "One-on-One" },
  { id: "small-group", label: "Small Group (2-5)" },
  { id: "large-group", label: "Large Group (6+)" },
]

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedTimePreferences, setSelectedTimePreferences] = useState<string[]>([])
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Live Session Filters
  const [availableToday, setAvailableToday] = useState(false)
  const [offersLiveSessions, setOffersLiveSessions] = useState(false)
  const [groupSessionsAvailable, setGroupSessionsAvailable] = useState(false)
  const [hasRecordedCourses, setHasRecordedCourses] = useState(false)
  const [activeOnReels, setActiveOnReels] = useState(false)
  const [regularStoryPoster, setRegularStoryPoster] = useState(false)

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleExperienceChange = (id: string) => {
    setSelectedExperience((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]))
  }

  const handleRatingChange = (id: string) => {
    setSelectedRatings((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const handleLanguageChange = (id: string) => {
    setSelectedLanguages((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]))
  }

  const handleTimePreferenceChange = (id: string) => {
    setSelectedTimePreferences((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const handleSessionTypeChange = (id: string) => {
    setSelectedSessionTypes((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedExperience([])
    setSelectedRatings([])
    setSelectedLanguages([])
    setSelectedTimePreferences([])
    setSelectedSessionTypes([])
    setPriceRange([0, 200])
    setSearchQuery("")
    setAvailableToday(false)
    setOffersLiveSessions(false)
    setGroupSessionsAvailable(false)
    setHasRecordedCourses(false)
    setActiveOnReels(false)
    setRegularStoryPoster(false)
  }

  const getTotalFilterCount = () => {
    return (
      selectedCategories.length +
      selectedExperience.length +
      selectedRatings.length +
      selectedLanguages.length +
      selectedTimePreferences.length +
      selectedSessionTypes.length +
      (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) +
      (searchQuery ? 1 : 0) +
      (availableToday ? 1 : 0) +
      (offersLiveSessions ? 1 : 0) +
      (groupSessionsAvailable ? 1 : 0) +
      (hasRecordedCourses ? 1 : 0) +
      (activeOnReels ? 1 : 0) +
      (regularStoryPoster ? 1 : 0)
    )
  }

  const totalFilters = getTotalFilterCount()

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search instructors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {totalFilters > 0 && (
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="font-normal">
            {totalFilters} {totalFilters === 1 ? "filter" : "filters"} applied
          </Badge>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-primary" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["live-sessions", "categories", "content"]}>
        {/* Live Sessions Section */}
        <AccordionItem value="live-sessions">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Live Sessions
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="available-today" className="text-sm font-medium">
                  Available Today
                </label>
                <Switch id="available-today" checked={availableToday} onCheckedChange={setAvailableToday} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="offers-live" className="text-sm font-medium">
                  Offers Live Sessions
                </label>
                <Switch id="offers-live" checked={offersLiveSessions} onCheckedChange={setOffersLiveSessions} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="group-sessions" className="text-sm font-medium">
                  Group Sessions Available
                </label>
                <Switch
                  id="group-sessions"
                  checked={groupSessionsAvailable}
                  onCheckedChange={setGroupSessionsAvailable}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Time Preferences */}
        <AccordionItem value="time-preferences">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Preferences
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {timePreferences.map((time) => (
                <div key={time.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedTimePreferences.includes(time.id) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleTimePreferenceChange(time.id)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedTimePreferences.includes(time.id)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedTimePreferences.includes(time.id) && <Check className="h-3 w-3" />}
                      </div>
                      {time.label}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Session Types */}
        <AccordionItem value="session-types">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Session Types
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedSessionTypes.includes(type.id) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleSessionTypeChange(type.id)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedSessionTypes.includes(type.id)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedSessionTypes.includes(type.id) && <Check className="h-3 w-3" />}
                      </div>
                      {type.label}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Content Filters */}
        <AccordionItem value="content">
          <AccordionTrigger className="text-sm font-medium">Content & Activity</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="recorded-courses" className="text-sm font-medium">
                  Has Recorded Courses
                </label>
                <Switch id="recorded-courses" checked={hasRecordedCourses} onCheckedChange={setHasRecordedCourses} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="active-reels" className="text-sm font-medium">
                  Active on Reels
                </label>
                <Switch id="active-reels" checked={activeOnReels} onCheckedChange={setActiveOnReels} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="story-poster" className="text-sm font-medium">
                  Regular Story Poster
                </label>
                <Switch id="story-poster" checked={regularStoryPoster} onCheckedChange={setRegularStoryPoster} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedCategories.includes(category) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedCategories.includes(category)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedCategories.includes(category) && <Check className="h-3 w-3" />}
                      </div>
                      {category}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Experience Level */}
        <AccordionItem value="experience">
          <AccordionTrigger>Experience Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <div key={level.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedExperience.includes(level.id) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleExperienceChange(level.id)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedExperience.includes(level.id)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedExperience.includes(level.id) && <Check className="h-3 w-3" />}
                      </div>
                      {level.label}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedRatings.includes(rating.id) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleRatingChange(rating.id)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedRatings.includes(rating.id)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedRatings.includes(rating.id) && <Check className="h-3 w-3" />}
                      </div>
                      {rating.label}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Session Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={10} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger>Languages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {languages.map((language) => (
                <div key={language.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start h-7 px-2 w-full font-normal ${
                      selectedLanguages.includes(language.id) ? "bg-secondary" : ""
                    }`}
                    onClick={() => handleLanguageChange(language.id)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-4 h-4 rounded border ${
                          selectedLanguages.includes(language.id)
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground"
                        } mr-2 flex items-center justify-center`}
                      >
                        {selectedLanguages.includes(language.id) && <Check className="h-3 w-3" />}
                      </div>
                      {language.label}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r bg-background">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Filters</h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden  absolute fixed ">
            Filters
            {totalFilters > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {totalFilters}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 p-5">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
