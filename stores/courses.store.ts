import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Course, CourseFilters, CourseLevel, CourseStatus, COURSE_CATEGORIES, COURSE_LEVELS } from "@/types/courseTypes";

// Types for the store
interface CoursesState {
  // Data
  courses: Course[];
  filteredCourses: Course[];
  featuredCourses: Course[];
  trendingCourses: Course[];
  savedCourses: string[];
  
  // Loading states
  isLoading: boolean;
  isFiltering: boolean;
  isSaving: boolean;
  isRefreshing: boolean;
  
  // Error handling
  error: string | null;
  
  // Filters and search
  filters: CourseFilters;
  searchQuery: string;
  viewMode: "grid" | "list";
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  
  // Categories and metadata
  categories: Array<{ id: string; name: string; count: number }>;
  levels: Array<{ id: string; name: string; count: number }>;
  
  // Actions
  setCourses: (courses: Course[]) => void;
  setFilteredCourses: (courses: Course[]) => void;
  setFeaturedCourses: (courses: Course[]) => void;
  setTrendingCourses: (courses: Course[]) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setFiltering: (filtering: boolean) => void;
  setSaving: (saving: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  updateFilters: (filters: Partial<CourseFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  
  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  
  // Saved courses actions
  toggleSavedCourse: (courseId: string) => void;
  addSavedCourse: (courseId: string) => void;
  removeSavedCourse: (courseId: string) => void;
  clearSavedCourses: () => void;
  isCourseSaved: (courseId: string) => boolean;
  
  // Categories and metadata actions
  setCategories: (categories: Array<{ id: string; name: string; count: number }>) => void;
  setLevels: (levels: Array<{ id: string; name: string; count: number }>) => void;
  
  // Utility actions
  getCourseById: (id: string) => Course | undefined;
  getCoursesByCategory: (category: string) => Course[];
  getCoursesByLevel: (level: CourseLevel) => Course[];
  getCoursesByInstructor: (instructorId: string) => Course[];
  
  // Reset actions
  reset: () => void;
}

// Initial state
const initialState = {
  courses: [],
  filteredCourses: [],
  featuredCourses: [],
  trendingCourses: [],
  savedCourses: [],
  
  isLoading: false,
  isFiltering: false,
  isSaving: false,
  isRefreshing: false,
  
  error: null,
  
  filters: {
    categories: [],
    priceRange: { min: 0, max: 200 },
    levels: [],
    durations: [],
    ratings: [],
    showFeatured: false,
    search: "",
    sortBy: "newest" as const,
  },
  searchQuery: "",
  viewMode: "grid" as const,
  
  currentPage: 1,
  itemsPerPage: 12,
  totalPages: 1,
  totalItems: 0,
  
  categories: COURSE_CATEGORIES.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
    count: 0,
  })),
  levels: COURSE_LEVELS.map(level => ({
    id: level,
    name: level.charAt(0).toUpperCase() + level.slice(1).toLowerCase(),
    count: 0,
  })),
};

export const useCoursesStore = create<CoursesState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Data setters
        setCourses: (courses) => {
          set({ courses, totalItems: courses.length });
        },
        
        setFilteredCourses: (filteredCourses) => {
          set({ 
            filteredCourses, 
            totalItems: filteredCourses.length,
            totalPages: Math.ceil(filteredCourses.length / get().itemsPerPage)
          });
        },
        
        setFeaturedCourses: (featuredCourses) => set({ featuredCourses }),
        setTrendingCourses: (trendingCourses) => set({ trendingCourses }),
        
        // Loading setters
        setLoading: (isLoading) => set({ isLoading }),
        setFiltering: (isFiltering) => set({ isFiltering }),
        setSaving: (isSaving) => set({ isSaving }),
        setRefreshing: (isRefreshing) => set({ isRefreshing }),
        setError: (error) => set({ error }),
        
        // Filter actions
        updateFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
            currentPage: 1, // Reset to first page when filters change
          }));
        },
        
        resetFilters: () => {
          set((state) => ({
            filters: initialState.filters,
            searchQuery: "",
            currentPage: 1,
          }));
        },
        
        setSearchQuery: (searchQuery) => {
          set({ searchQuery, currentPage: 1 });
        },
        
        setViewMode: (viewMode) => set({ viewMode }),
        
        // Pagination actions
        setCurrentPage: (currentPage) => set({ currentPage }),
        setItemsPerPage: (itemsPerPage) => {
          set({ itemsPerPage, currentPage: 1 });
        },
        
        // Saved courses actions
        toggleSavedCourse: (courseId) => {
          set((state) => {
            const isSaved = state.savedCourses.includes(courseId);
            const newSavedCourses = isSaved
              ? state.savedCourses.filter(id => id !== courseId)
              : [...state.savedCourses, courseId];
            
            return { savedCourses: newSavedCourses };
          });
        },
        
        addSavedCourse: (courseId) => {
          set((state) => ({
            savedCourses: state.savedCourses.includes(courseId)
              ? state.savedCourses
              : [...state.savedCourses, courseId]
          }));
        },
        
        removeSavedCourse: (courseId) => {
          set((state) => ({
            savedCourses: state.savedCourses.filter(id => id !== courseId)
          }));
        },
        
        clearSavedCourses: () => set({ savedCourses: [] }),
        
        isCourseSaved: (courseId) => {
          return get().savedCourses.includes(courseId);
        },
        
        // Categories and metadata actions
        setCategories: (categories) => set({ categories }),
        setLevels: (levels) => set({ levels }),
        
        // Utility actions
        getCourseById: (id) => {
          return get().courses.find(course => course.id === id);
        },
        
        getCoursesByCategory: (category) => {
          return get().courses.filter(course => course.category === category);
        },
        
        getCoursesByLevel: (level) => {
          return get().courses.filter(course => course.level === level);
        },
        
        getCoursesByInstructor: (instructorId) => {
          return get().courses.filter(course => course.instructor?.id === instructorId);
        },
        

        
        // Reset action
        reset: () => set(initialState),
      }),
      {
        name: "courses-storage",
        partialize: (state) => ({
          savedCourses: state.savedCourses,
          viewMode: state.viewMode,
          filters: state.filters,
        }),
      }
    ),
    { name: "courses-store" }
  )
); 