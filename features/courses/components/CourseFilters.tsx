"use client";

import React from "react";
import { CourseLevel } from "@/types/courseTypes";
import { DualRangeSlider } from "@/components/shared/DualRangeSlider";
import { Star } from "lucide-react";

interface CourseCategory {
  id: string;
  name: string;
  count: number;
}

interface CourseFiltersProps {
  categories: CourseCategory[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  showFeatured: boolean;
  onFeaturedChange: (show: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
  priceRange: { min: number; max: number };
  maxPrice: number;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  selectedLevels: CourseLevel[];
  onLevelsChange: (levels: CourseLevel[]) => void;
  selectedRatings: number[];
  onRatingsChange: (ratings: number[]) => void;
  selectedDurations: string[];
  onDurationsChange: (durations: string[]) => void;
}

const COURSE_LEVELS: CourseLevel[] = [
  "ALL_LEVELS",
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
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
  maxPrice = 200,
  onPriceRangeChange,
  selectedLevels,
  onLevelsChange,
  selectedRatings,
  onRatingsChange,
  selectedDurations,
  onDurationsChange,
}: CourseFiltersProps) => {
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

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.includes(category.name)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs text-gray-500">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-5">
        <label htmlFor="featured" className="text-sm font-medium text-gray-900">
          Featured Courses
        </label>
        <button
          onClick={() => onFeaturedChange(!showFeatured)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showFeatured ? "bg-blue-600" : "bg-gray-200"
          }`}
          id="featured"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showFeatured ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Price Range */}
      <DualRangeSlider
        min={0}
        max={maxPrice}
        value={[priceRange.min, priceRange.max]}
        onChange={(range) => onPriceRangeChange({ min: range[0], max: range[1] })}
        formatValue={formatPrice}
        step={5}
      />

      {/* Course Levels */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Course Level</h3>
        <div className="flex flex-wrap gap-2">
          {COURSE_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => {
                if (selectedLevels.includes(level)) {
                  onLevelsChange(selectedLevels.filter((l) => l !== level));
                } else {
                  onLevelsChange([...selectedLevels, level]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevels.includes(level)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {level === "ALL_LEVELS" ? "All Levels" : 
               level === "BEGINNER" ? "Beginner" :
               level === "INTERMEDIATE" ? "Intermediate" :
               level === "ADVANCED" ? "Advanced" : level}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Duration</h3>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (selectedDurations.includes(option.value)) {
                  onDurationsChange(
                    selectedDurations.filter((d) => d !== option.value)
                  );
                } else {
                  onDurationsChange([...selectedDurations, option.value]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDurations.includes(option.value)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                if (selectedRatings.includes(rating)) {
                  onRatingsChange(selectedRatings.filter((r) => r !== rating));
                } else {
                  onRatingsChange([...selectedRatings, rating]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedRatings.includes(rating)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-500" />
              ))}
              <span>+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={onResetFilters}
          className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md border border-gray-200 hover:bg-primary hover:text-white cursor-pointer"
        >
          Reset all filters
        </button>
      </div>
    </div>
  );
};

export default CourseFilters;
