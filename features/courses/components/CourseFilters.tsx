'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CourseCategory, CourseLevel } from '../types/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface CourseFiltersProps {
  categories: CourseCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showFeatured: boolean;
  onFeaturedChange: (show: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
}

const COURSE_LEVELS: CourseLevel[] = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const DURATION_OPTIONS = [
  { value: 'any', label: 'Any Duration' },
  { value: '0-2', label: 'Under 2 hours' },
  { value: '2-5', label: '2 - 5 hours' },
  { value: '5-10', label: '5 - 10 hours' },
  { value: '10+', label: 'Over 10 hours' },
];

const CourseFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showFeatured,
  onFeaturedChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetFilters,
  priceRange,
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

  const formatPrice = (value: number) => {
    return value === 0 ? 'Free' : `$${value}`;
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, width: 40 }}
                animate={{ opacity: 1, width: 250 }}
                exit={{ opacity: 0, width: 40 }}
                className="flex items-center"
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
                    onSearchChange('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 text-gray-500 hover:text-gray-700"
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
                className="bg-secondary p-2 rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={sortBy} onValueChange={onSortChange}>
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
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Courses</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="categories">
                    <AccordionTrigger className="text-lg font-semibold">
                      Categories
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category.id}
                              checked={selectedCategory === category.name}
                              onCheckedChange={() => onCategoryChange(category.name)}
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
                    <AccordionTrigger className="text-lg font-semibold">
                      Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                        <Slider
                          value={[priceRange[0], priceRange[1]]}
                          min={0}
                          max={200}
                          step={5}
                          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="level">
                    <AccordionTrigger className="text-lg font-semibold">
                      Level
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {COURSE_LEVELS.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
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
                    <AccordionTrigger className="text-lg font-semibold">
                      Duration
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {DURATION_OPTIONS.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.value}
                              checked={duration === option.value}
                              onCheckedChange={() => onDurationChange(option.value)}
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
                    <AccordionTrigger className="text-lg font-semibold">
                      Rating
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {[4, 3, 2, 1].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`rating-${value}`}
                              checked={rating === value}
                              onCheckedChange={() => onRatingChange(value)}
                            />
                            <label
                              htmlFor={`rating-${value}`}
                              className="text-sm font-medium leading-none flex items-center"
                            >
                              {value}+ <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="features">
                    <AccordionTrigger className="text-lg font-semibold">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={showFeatured}
                            onCheckedChange={() => onFeaturedChange(!showFeatured)}
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

              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    onResetFilters();
                    setIsOpen(false);
                  }}
                                  >
                  Reset Filters
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
