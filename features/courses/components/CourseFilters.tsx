"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CourseCategory, CourseLevel } from "../types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseFiltersProps {
  categories: CourseCategory[];
  selectedCategories: string[]; // Changed to array to support multiple selection
  onCategoriesChange: (categories: string[]) => void; // Updated to handle multiple categories
  showFeatured: boolean;
  onFeaturedChange: (show: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
  priceRange: [number, number];
  maxPrice: number; // Added for dynamic price ceiling
  onPriceRangeChange: (range: [number, number]) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
}

const COURSE_LEVELS: CourseLevel[] = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced",
];
const DURATION_OPTIONS = [
  { value: "any", label: "Any Duration" },
  { value: "0-2", label: "Under 2 hours" },
  { value: "2-5", label: "2 - 5 hours" },
  { value: "5-10", label: "5 - 10 hours" },
  { value: "10+", label: "Over 10 hours" },
];

const CourseFilters = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  showFeatured,
  onFeaturedChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetFilters,
  priceRange,
  maxPrice = 200, // Default max price
  onPriceRangeChange,
  selectedLevel,
  onLevelChange,
  rating,
  onRatingChange,
  duration,
  onDurationChange,
}: CourseFiltersProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedLevel !== "All Levels") count++;
    if (duration !== "any") count++;
    if (rating > 0) count++;
    if (showFeatured) count++;
    setActiveFiltersCount(count);
  }, [
    selectedCategories,
    priceRange,
    selectedLevel,
    duration,
    rating,
    showFeatured,
    maxPrice,
  ]);

  const formatPrice = (value: number) => {
    return value === 0 ? "Free" : `$${value}`;
  };

  const handleCategoryChange = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoriesChange(
        selectedCategories.filter((cat) => cat !== categoryName)
      );
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
    }
  };

  const handleResetSection = (section: string) => {
    switch (section) {
      case "categories":
        onCategoriesChange([]);
        break;
      case "price":
        onPriceRangeChange([0, maxPrice]);
        break;
      case "level":
        onLevelChange("All Levels");
        break;
      case "duration":
        onDurationChange("any");
        break;
      case "rating":
        onRatingChange(0);
        break;
      case "features":
        onFeaturedChange(false);
        break;
      default:
        break;
    }
  };

  // Function to toggle accordion state
  const toggleAccordion = (value: string) => {
    setExpandedAccordions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="mb-8 space-y-6 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, width: "100%" }}
                animate={{ opacity: 1, width: "100%" }}

                exit={{ opacity: 0 }}
                className="flex items-center w-full sm:w-[300px]"
              >
                <Input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pr-8"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (search) {
                      onSearchChange("");
                    } else {
                      setIsSearchOpen(false);
                    }
                  }}
                  className="absolute right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(true)}
                className="bg-primary p-2 rounded-md hover:bg-primary/80 text-white transition-colors"
                aria-label="Search courses"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-3 sm:mt-0 w-full sm:w-auto">
          {/* Active filters display */}
          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-2 flex-wrap"
              >
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category}
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Select value={sortBy} onValueChange={onSortChange} >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} active filter${
                        activeFiltersCount > 1 ? "s" : ""
                      }`
                    : "No active filters"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SheetContent className="w-full md:max-w-md lg:max-w-lg overflow-y-auto p-5">
              <SheetHeader>
                <div className="flex justify-between items-center">
                  <SheetTitle>Filter Courses</SheetTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onResetFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Reset All
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="mt-6">
                <Accordion
                  type="multiple"
                  value={expandedAccordions}
                  onValueChange={setExpandedAccordions}
                  className="w-full space-y-4"
                >
                  <AccordionItem value="categories">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("categories")}
                      >
                        Categories
                        {selectedCategories.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {selectedCategories.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("categories");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onCheckedChange={() =>
                                handleCategoryChange(category.name)
                              }
                            />
                            <label
                              htmlFor={category.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.name} ({category.count})
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("price")}
                      >
                        Price Range
                        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                          <Badge variant="secondary" className="ml-2">
                            {formatPrice(priceRange[0])} -{" "}
                            {formatPrice(priceRange[1])}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("price");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            {formatPrice(priceRange[0])}
                          </span>
                          <span className="text-sm">
                            {formatPrice(priceRange[1])}
                          </span>
                        </div>
                        <Slider
                          value={[priceRange[0], priceRange[1]]}
                          min={0}
                          max={maxPrice}
                          step={5}
                          onValueChange={(value) =>
                            onPriceRangeChange(value as [number, number])
                          }
                          className="py-4"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                            onClick={() => onPriceRangeChange([0, maxPrice])}
                          >
                            All Prices
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                            onClick={() => onPriceRangeChange([0, 0])}
                          >
                            Free Only
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                            onClick={() => onPriceRangeChange([1, maxPrice])}
                          >
                            Paid Only
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="level">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("level")}
                      >
                        Level
                        {selectedLevel !== "All Levels" && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedLevel}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {selectedLevel !== "All Levels" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("level");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {COURSE_LEVELS.map((level) => (
                          <div
                            key={level}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={level}
                              checked={selectedLevel === level}
                              onCheckedChange={() => onLevelChange(level)}
                            />
                            <label
                              htmlFor={level}
                              className="text-sm font-medium leading-none"
                            >
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="duration">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("duration")}
                      >
                        Duration
                        {duration !== "any" && (
                          <Badge variant="secondary" className="ml-2">
                            {
                              DURATION_OPTIONS.find(
                                (opt) => opt.value === duration
                              )?.label
                            }
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {duration !== "any" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("duration");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {DURATION_OPTIONS.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option.value}
                              checked={duration === option.value}
                              onCheckedChange={() =>
                                onDurationChange(option.value)
                              }
                            />
                            <label
                              htmlFor={option.value}
                              className="text-sm font-medium leading-none"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rating">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("rating")}
                      >
                        Rating
                        {rating > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 flex items-center"
                          >
                            {rating}+{" "}
                            <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {rating > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("rating");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {[4, 3, 2, 1].map((value) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`rating-${value}`}
                              checked={rating === value}
                              onCheckedChange={() => onRatingChange(value)}
                            />
                            <label
                              htmlFor={`rating-${value}`}
                              className="text-sm font-medium leading-none flex items-center"
                            >
                              <div className="flex items-center">
                                {value}+
                                <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                                {Array(value - 1)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                {Array(5 - value)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 text-gray-300"
                                    />
                                  ))}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="features">
                    <div className="flex justify-between items-center">
                      <AccordionTrigger
                        className="text-lg font-semibold"
                        onClick={() => toggleAccordion("features")}
                      >
                        Features
                        {showFeatured && (
                          <Badge variant="secondary" className="ml-2">
                            Featured Only
                          </Badge>
                        )}
                      </AccordionTrigger>
                      {showFeatured && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSection("features");
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={showFeatured}
                            onCheckedChange={() =>
                              onFeaturedChange(!showFeatured)
                            }
                          />
                          <label
                            htmlFor="featured"
                            className="text-sm font-medium leading-none"
                          >
                            Featured Courses Only
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Separator className="my-6" />

              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onResetFilters();
                    setIsOpen(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset All Filters
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Apply Filters (
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} active`
                    : "none"}
                  )
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters summary for desktop view */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="hidden sm:flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="flex items-center gap-1"
              >
                {category}
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="outline" className="flex items-center gap-1">
                Price: {formatPrice(priceRange[0])} -{" "}
                {formatPrice(priceRange[1])}
                <button
                  onClick={() => handleResetSection("price")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedLevel !== "All Levels" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Level: {selectedLevel}
                <button
                  onClick={() => handleResetSection("level")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {duration !== "any" && (
              <Badge variant="outline" className="flex items-center gap-1">
                Duration:{" "}
                {DURATION_OPTIONS.find((opt) => opt.value === duration)?.label}
                <button
                  onClick={() => handleResetSection("duration")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {rating > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                Rating: {rating}+{" "}
                <Star className="h-3 w-3 ml-0.5 fill-yellow-400 text-yellow-400" />
                <button
                  onClick={() => handleResetSection("rating")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {showFeatured && (
              <Badge variant="outline" className="flex items-center gap-1">
                Featured Only
                <button
                  onClick={() => handleResetSection("features")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-muted-foreground ml-auto"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseFilters;
