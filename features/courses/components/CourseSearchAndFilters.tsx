import React from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Grid2X2,
  List,
  X,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CourseFilters from "./CourseFilters";
import { CourseLevel } from "../types/courseTypes";

interface CourseCategory {
  id: string;
  name: string;
  count: number;
}

interface CourseSearchAndFiltersProps {
  quickSearch: string;
  onQuickSearchChange: (value: string) => void;
  showFilters: boolean;
  onShowFiltersChange: (value: boolean) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  filters: {
    categories?: string[];
    showFeatured?: boolean;
    levels?: CourseLevel[];
    search?: string;
    sortBy?: string;
    priceRange?: [number, number];
    ratings?: number[];
    durations?: string[];
  };
  categories: CourseCategory[];
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

const CourseSearchAndFilters: React.FC<CourseSearchAndFiltersProps> = ({
  quickSearch,
  onQuickSearchChange,
  showFilters,
  onShowFiltersChange,
  viewMode,
  onViewModeChange,
  filters,
  categories,
  onFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof typeof filters];
    if (value === undefined || value === null) return false;

    switch (key) {
      case "categories":
      case "levels":
      case "ratings":
      case "durations":
        return Array.isArray(value) && value.length > 0;
      case "showFeatured":
        return value === true;
      case "search":
        return typeof value === "string" && value.trim().length > 0;
      case "priceRange":
        return (
          Array.isArray(value) &&
          (Number(value[0]) > 0 || Number(value[1]) < 200)
        );
      case "sortBy":
        return value !== "newest";
      default:
        return false;
    }
  });

  const handleRemoveFilter = (type: string, value: any) => {
    switch (type) {
      case "categories":
        onFilterChange({
          categories: filters.categories?.filter((cat) => cat !== value),
        });
        break;
      case "levels":
        onFilterChange({
          levels: filters.levels?.filter((level) => level !== value),
        });
        break;
      case "ratings":
        onFilterChange({
          ratings: filters.ratings?.filter((rating) => rating !== value),
        });
        break;
      case "durations":
        onFilterChange({
          durations: filters.durations?.filter(
            (duration) => duration !== value
          ),
        });
        break;
      case "featured":
        onFilterChange({ showFeatured: false });
        break;
      case "price":
        onFilterChange({ priceRange: [0, 200] });
        break;
    }
  };

  const getDurationLabel = (value: string) => {
    const option = DURATION_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Quick Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search courses, instructors, topics..."
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowFiltersChange(!showFilters)}
            className={`rounded-xl ${
              showFilters ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>

          <div className="flex gap-1 border rounded-xl p-1 bg-gray-50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-lg h-8 w-8 p-0"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-lg h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {filters.categories?.map((category) => (
            <Badge
              key={category}
              variant="default"
              className="rounded-full flex items-center gap-1 px-3 py-1"
            >
              {category}
              <button
                onClick={() => handleRemoveFilter("categories", category)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.showFeatured && (
            <Badge
              variant="default"
              className="rounded-full flex items-center gap-1 px-3 py-1"
            >
              <TrendingUp className="h-3 w-3" />
              Featured
              <button
                onClick={() => handleRemoveFilter("featured", true)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.levels?.map((level) => (
            <Badge
              key={level}
              variant="outline"
              className="rounded-full flex items-center gap-1 px-3 py-1"
            >
              {level}
              <button
                onClick={() => handleRemoveFilter("levels", level)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.ratings?.map((rating) => (
            <Badge
              key={rating}
              variant="outline"
              className="rounded-full flex items-center gap-1 px-3 py-1"
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-500" />
              ))}
              <span>+</span>
              <button
                onClick={() => handleRemoveFilter("ratings", rating)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.durations?.map((duration) => (
            <Badge
              key={duration}
              variant="outline"
              className="rounded-full flex items-center gap-1 px-3 py-1"
            >
              {getDurationLabel(duration)}
              <button
                onClick={() => handleRemoveFilter("durations", duration)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.priceRange &&
            (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) && (
              <Badge
                variant="outline"
                className="rounded-full flex items-center gap-1 px-3 py-1"
              >
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <button
                  onClick={() => handleRemoveFilter("price", null)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-gray-500  h-6 px-2 rounded-full"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Collapsible Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
          >
            <CourseFilters
              categories={categories}
              selectedCategories={filters.categories || []}
              onCategoriesChange={(categories: string[]) =>
                onFilterChange({ categories })
              }
              showFeatured={filters.showFeatured || false}
              onFeaturedChange={(showFeatured) =>
                onFilterChange({ showFeatured })
              }
              search={filters.search || ""}
              onSearchChange={(search) => onFilterChange({ search })}
              sortBy={filters.sortBy || "newest"}
              onSortChange={(sortBy) =>
                onFilterChange({ sortBy: sortBy as any })
              }
              onResetFilters={onResetFilters}
              priceRange={filters.priceRange || [0, 200]}
              maxPrice={200}
              onPriceRangeChange={(range) =>
                onFilterChange({ priceRange: range })
              }
              selectedLevels={filters.levels || []}
              onLevelsChange={(levels) =>
                onFilterChange({ levels: levels as CourseLevel[] })
              }
              selectedRatings={filters.ratings || []}
              onRatingsChange={(ratings) => onFilterChange({ ratings })}
              selectedDurations={filters.durations || []}
              onDurationsChange={(durations) => onFilterChange({ durations })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DURATION_OPTIONS = [
  { value: "any", label: "Any Duration" },
  { value: "0-2", label: "Under 2 hours" },
  { value: "2-5", label: "2 - 5 hours" },
  { value: "5-10", label: "5 - 10 hours" },
  { value: "10+", label: "Over 10 hours" },
];

export default CourseSearchAndFilters;
