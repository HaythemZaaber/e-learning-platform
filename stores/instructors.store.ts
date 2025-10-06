import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  InstructorProfile,
  TransformedInstructor,
  InstructorHeroStats,
  FilterState,
  PaginationState,
  SortOption,
  InstructorListFiltersInput,
} from "@/types/instructorGraphQLTypes";

// =============================================================================
// INSTRUCTOR STORE INTERFACE
// =============================================================================

interface InstructorsState {
  // Data
  featuredInstructors: InstructorProfile[];
  instructors: InstructorProfile[];
  availableTodayInstructors: InstructorProfile[];
  heroStats: InstructorHeroStats | null;
  instructorProfile: InstructorProfile | null;
  myInstructorProfile: InstructorProfile | null;
  instructorStats: any | null;
  myInstructorStats: any | null;
  searchResults: InstructorProfile[];

  // Transformed data for UI compatibility
  transformedInstructors: TransformedInstructor[];

  // Loading states
  featuredInstructorsLoading: boolean;
  instructorsLoading: boolean;
  heroStatsLoading: boolean;
  availableTodayLoading: boolean;
  instructorProfileLoading: boolean;
  myInstructorProfileLoading: boolean;
  instructorStatsLoading: boolean;
  myInstructorStatsLoading: boolean;
  searchLoading: boolean;
  isRefreshing: boolean;

  // Error handling
  featuredInstructorsError: string | null;
  instructorsError: string | null;
  heroStatsError: string | null;
  availableTodayError: string | null;
  instructorProfileError: string | null;
  myInstructorProfileError: string | null;
  instructorStatsError: string | null;
  myInstructorStatsError: string | null;
  searchError: string | null;

  // Filters and search
  filters: FilterState;
  searchQuery: string;
  sortBy: SortOption;
  viewMode: "grid" | "list";

  // Pagination
  pagination: PaginationState;

  // UI state
  selectedInstructor: InstructorProfile | null;
  savedInstructors: string[];
  isFilterModalOpen: boolean;

  // Actions
  setFeaturedInstructors: (instructors: InstructorProfile[]) => void;
  setInstructors: (instructors: InstructorProfile[]) => void;
  setAvailableTodayInstructors: (instructors: InstructorProfile[]) => void;
  setHeroStats: (stats: InstructorHeroStats) => void;
  setInstructorProfile: (profile: InstructorProfile | null) => void;
  setMyInstructorProfile: (profile: InstructorProfile | null) => void;
  setInstructorStats: (stats: any | null) => void;
  setMyInstructorStats: (stats: any | null) => void;
  setSearchResults: (results: InstructorProfile[]) => void;
  setTransformedInstructors: (instructors: TransformedInstructor[]) => void;

  // Loading actions
  setFeaturedInstructorsLoading: (loading: boolean) => void;
  setInstructorsLoading: (loading: boolean) => void;
  setHeroStatsLoading: (loading: boolean) => void;
  setAvailableTodayLoading: (loading: boolean) => void;
  setInstructorProfileLoading: (loading: boolean) => void;
  setMyInstructorProfileLoading: (loading: boolean) => void;
  setInstructorStatsLoading: (loading: boolean) => void;
  setMyInstructorStatsLoading: (loading: boolean) => void;
  setSearchLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;

  // Error actions
  setFeaturedInstructorsError: (error: string | null) => void;
  setInstructorsError: (error: string | null) => void;
  setHeroStatsError: (error: string | null) => void;
  setAvailableTodayError: (error: string | null) => void;
  setInstructorProfileError: (error: string | null) => void;
  setMyInstructorProfileError: (error: string | null) => void;
  setInstructorStatsError: (error: string | null) => void;
  setMyInstructorStatsError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  clearErrors: () => void;

  // Filter actions
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setViewMode: (mode: "grid" | "list") => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setPagination: (pagination: PaginationState) => void;

  // UI actions
  setSelectedInstructor: (instructor: InstructorProfile | null) => void;
  toggleSavedInstructor: (instructorId: string) => void;
  addSavedInstructor: (instructorId: string) => void;
  removeSavedInstructor: (instructorId: string) => void;
  isInstructorSaved: (instructorId: string) => boolean;
  setFilterModalOpen: (open: boolean) => void;

  // Utility actions
  getFilteredInstructors: () => TransformedInstructor[];
  getInstructorById: (id: string) => InstructorProfile | null;
  transformInstructorData: (
    instructor: InstructorProfile
  ) => TransformedInstructor;
  resetState: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialFilterState: FilterState = {
  searchQuery: "",
  selectedCategories: [],
  selectedExperience: [],
  selectedRatings: [],
  selectedLanguages: [],
  selectedTimePreferences: [],
  selectedSessionTypes: [],
  priceRange: [0, 200],
  availableToday: false,
  offersLiveSessions: false,
  groupSessionsAvailable: false,
  hasRecordedCourses: false,
  activeOnReels: false,
  regularStoryPoster: false,
};

const initialPaginationState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,
  totalItems: 0,
};

const initialState = {
  // Data
  featuredInstructors: [],
  instructors: [],
  availableTodayInstructors: [],
  heroStats: null,
  instructorProfile: null,
  myInstructorProfile: null,
  instructorStats: null,
  myInstructorStats: null,
  searchResults: [],
  transformedInstructors: [],

  // Loading states
  featuredInstructorsLoading: false,
  instructorsLoading: false,
  heroStatsLoading: false,
  availableTodayLoading: false,
  instructorProfileLoading: false,
  myInstructorProfileLoading: false,
  instructorStatsLoading: false,
  myInstructorStatsLoading: false,
  searchLoading: false,
  isRefreshing: false,

  // Error handling
  featuredInstructorsError: null,
  instructorsError: null,
  heroStatsError: null,
  availableTodayError: null,
  instructorProfileError: null,
  myInstructorProfileError: null,
  instructorStatsError: null,
  myInstructorStatsError: null,
  searchError: null,

  // Filters and search
  filters: initialFilterState,
  searchQuery: "",
  sortBy: "featured" as SortOption,
  viewMode: "grid" as "grid" | "list",

  // Pagination
  pagination: initialPaginationState,

  // UI state
  selectedInstructor: null,
  savedInstructors: [],
  isFilterModalOpen: false,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const transformInstructorData = (
  instructor: InstructorProfile
): TransformedInstructor => {
  const fullName =
    [instructor.user.firstName, instructor.user.lastName]
      .filter(Boolean)
      .join(" ") || "Instructor";

  // Extract languages properly
  const languages = Array.isArray(instructor.languagesSpoken)
    ? instructor.languagesSpoken.map((lang) =>
        typeof lang === "string" ? lang : (lang as any).language || "English"
      )
    : ["English"];

  // Calculate availability and next slot
  const hasAvailableSlots =
    instructor.preferredSchedule &&
    Object.values(instructor.preferredSchedule).some(
      (day: any) => day.available && day.timeSlots && day.timeSlots.length > 0
    );

  const nextAvailableSlot = hasAvailableSlots
    ? {
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        type: "individual",
        price: instructor.individualSessionRate || 50,
      }
    : undefined;

  // Determine if online based on availability
  const isOnline = hasAvailableSlots && Math.random() > 0.7; // Simulate online status

  return {
    id: instructor.user.id,
    name: fullName,
    title: instructor.title || "Instructor",
    avatar: instructor.user.profileImage || "/placeholder.svg",
    coverImage: "/placeholder.svg?height=600&width=1200",
    bio: instructor.bio || "",
    shortBio: instructor.shortBio || "",
    rating: instructor.teachingRating || 0,
    reviewsCount: Math.floor(instructor.totalStudents * 0.1), // Estimate
    studentsCount: instructor.totalStudents,
    coursesCount: instructor.totalCourses,
    responseTime: `${instructor.responseTime || 24} hours`,
    completionRate: instructor.courseCompletionRate || 0,
    languages,
    experience: instructor.experience || 0,
    education: instructor.qualifications || [],
    certifications: instructor.qualifications || [],
    philosophy: instructor.teachingStyle || "",
    categories: instructor.teachingCategories || [],
    skills: instructor.expertise.map((exp) => ({
      name: exp,
      proficiency: "Expert",
    })),
    location: "Remote", // Default location
    socialLinks: {
      linkedin: instructor.linkedinProfile,
      website: instructor.personalWebsite,
    },
    isOnline,
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
    nextAvailableSlot,
    weeklyBookings: Math.floor(Math.random() * 20) + 5, // Simulate weekly bookings
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
      newFollowersThisWeek: (instructor as any).newFollowersThisWeek ?? 0,
      newFollowersThisMonth: (instructor as any).newFollowersThisMonth ?? 0,
      isFollowing: (instructor as any).isFollowing ?? false,
    },
  };
};

// =============================================================================
// ZUSTAND STORE
// =============================================================================

export const useInstructorsStore = create<InstructorsState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // =============================================================================
        // DATA SETTERS
        // =============================================================================

        setFeaturedInstructors: (instructors: InstructorProfile[]) =>
          set((state) => {
            state.featuredInstructors = instructors;
            state.transformedInstructors = instructors.map(
              transformInstructorData
            );
          }),

        setInstructors: (instructors: InstructorProfile[]) =>
          set((state) => {
            state.instructors = instructors;
            // Also update transformed instructors for filtering
            state.transformedInstructors = instructors.map(
              transformInstructorData
            );
          }),

        setAvailableTodayInstructors: (instructors: InstructorProfile[]) =>
          set((state) => {
            state.availableTodayInstructors = instructors;
          }),

        setHeroStats: (stats: InstructorHeroStats) =>
          set((state) => {
            state.heroStats = stats;
          }),

        setInstructorProfile: (profile: InstructorProfile | null) =>
          set((state) => {
            state.instructorProfile = profile;
          }),

        setMyInstructorProfile: (profile: InstructorProfile | null) =>
          set((state) => {
            state.myInstructorProfile = profile;
          }),

        setInstructorStats: (stats: any | null) =>
          set((state) => {
            state.instructorStats = stats;
          }),

        setMyInstructorStats: (stats: any | null) =>
          set((state) => {
            state.myInstructorStats = stats;
          }),

        setSearchResults: (results: InstructorProfile[]) =>
          set((state) => {
            state.searchResults = results;
          }),

        setTransformedInstructors: (instructors: TransformedInstructor[]) =>
          set((state) => {
            state.transformedInstructors = instructors;
          }),

        // =============================================================================
        // LOADING ACTIONS
        // =============================================================================

        setFeaturedInstructorsLoading: (loading: boolean) =>
          set((state) => {
            state.featuredInstructorsLoading = loading;
          }),

        setInstructorsLoading: (loading: boolean) =>
          set((state) => {
            state.instructorsLoading = loading;
          }),

        setHeroStatsLoading: (loading: boolean) =>
          set((state) => {
            state.heroStatsLoading = loading;
          }),

        setAvailableTodayLoading: (loading: boolean) =>
          set((state) => {
            state.availableTodayLoading = loading;
          }),

        setInstructorProfileLoading: (loading: boolean) =>
          set((state) => {
            state.instructorProfileLoading = loading;
          }),

        setMyInstructorProfileLoading: (loading: boolean) =>
          set((state) => {
            state.myInstructorProfileLoading = loading;
          }),

        setInstructorStatsLoading: (loading: boolean) =>
          set((state) => {
            state.instructorStatsLoading = loading;
          }),

        setMyInstructorStatsLoading: (loading: boolean) =>
          set((state) => {
            state.myInstructorStatsLoading = loading;
          }),

        setSearchLoading: (loading: boolean) =>
          set((state) => {
            state.searchLoading = loading;
          }),

        setRefreshing: (refreshing: boolean) =>
          set((state) => {
            state.isRefreshing = refreshing;
          }),

        // =============================================================================
        // ERROR ACTIONS
        // =============================================================================

        setFeaturedInstructorsError: (error: string | null) =>
          set((state) => {
            state.featuredInstructorsError = error;
          }),

        setInstructorsError: (error: string | null) =>
          set((state) => {
            state.instructorsError = error;
          }),

        setHeroStatsError: (error: string | null) =>
          set((state) => {
            state.heroStatsError = error;
          }),

        setAvailableTodayError: (error: string | null) =>
          set((state) => {
            state.availableTodayError = error;
          }),

        setInstructorProfileError: (error: string | null) =>
          set((state) => {
            state.instructorProfileError = error;
          }),

        setMyInstructorProfileError: (error: string | null) =>
          set((state) => {
            state.myInstructorProfileError = error;
          }),

        setInstructorStatsError: (error: string | null) =>
          set((state) => {
            state.instructorStatsError = error;
          }),

        setMyInstructorStatsError: (error: string | null) =>
          set((state) => {
            state.myInstructorStatsError = error;
          }),

        setSearchError: (error: string | null) =>
          set((state) => {
            state.searchError = error;
          }),

        clearErrors: () =>
          set((state) => {
            state.featuredInstructorsError = null;
            state.instructorsError = null;
            state.heroStatsError = null;
            state.availableTodayError = null;
            state.instructorProfileError = null;
            state.myInstructorProfileError = null;
            state.instructorStatsError = null;
            state.myInstructorStatsError = null;
            state.searchError = null;
          }),

        // =============================================================================
        // FILTER ACTIONS
        // =============================================================================

        setFilters: (filters: FilterState) =>
          set((state) => {
            state.filters = filters;
            state.pagination.currentPage = 1;
          }),

        resetFilters: () =>
          set((state) => {
            state.filters = { ...initialFilterState };
            state.pagination.currentPage = 1;
          }),

        setSearchQuery: (query: string) =>
          set((state) => {
            state.searchQuery = query;
            state.pagination.currentPage = 1;
          }),

        setSortBy: (sortBy: SortOption) =>
          set((state) => {
            state.sortBy = sortBy;
            state.pagination.currentPage = 1;
          }),

        setViewMode: (mode: "grid" | "list") =>
          set((state) => {
            state.viewMode = mode;
          }),

        // =============================================================================
        // PAGINATION ACTIONS
        // =============================================================================

        setCurrentPage: (page: number) =>
          set((state) => {
            state.pagination.currentPage = page;
          }),

        setItemsPerPage: (itemsPerPage: number) =>
          set((state) => {
            state.pagination.itemsPerPage = itemsPerPage;
            state.pagination.currentPage = 1;
          }),

        setPagination: (pagination: PaginationState) =>
          set((state) => {
            state.pagination = pagination;
          }),

        // =============================================================================
        // UI ACTIONS
        // =============================================================================

        setSelectedInstructor: (instructor: InstructorProfile | null) =>
          set((state) => {
            state.selectedInstructor = instructor;
          }),

        toggleSavedInstructor: (instructorId: string) =>
          set((state) => {
            const index = state.savedInstructors.indexOf(instructorId);
            if (index > -1) {
              state.savedInstructors.splice(index, 1);
            } else {
              state.savedInstructors.push(instructorId);
            }
          }),

        addSavedInstructor: (instructorId: string) =>
          set((state) => {
            if (!state.savedInstructors.includes(instructorId)) {
              state.savedInstructors.push(instructorId);
            }
          }),

        removeSavedInstructor: (instructorId: string) =>
          set((state) => {
            const index = state.savedInstructors.indexOf(instructorId);
            if (index > -1) {
              state.savedInstructors.splice(index, 1);
            }
          }),

        isInstructorSaved: (instructorId: string) => {
          const { savedInstructors } = get();
          return savedInstructors.includes(instructorId);
        },

        setFilterModalOpen: (open: boolean) =>
          set((state) => {
            state.isFilterModalOpen = open;
          }),

        // =============================================================================
        // UTILITY ACTIONS
        // =============================================================================

        getFilteredInstructors: () => {
          const { instructors, filters, sortBy } = get();

          // If no instructors data, return empty array
          if (!instructors || instructors.length === 0) {
            return [];
          }

          let filtered = instructors.map(transformInstructorData);

          // Apply search filter
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
              (instructor) =>
                instructor.name.toLowerCase().includes(query) ||
                instructor.title.toLowerCase().includes(query) ||
                instructor.bio.toLowerCase().includes(query) ||
                instructor.categories.some((cat) =>
                  cat.toLowerCase().includes(query)
                )
            );
          }

          // Apply category filter
          if (filters.selectedCategories.length > 0) {
            filtered = filtered.filter((instructor) =>
              instructor.categories.some((category) =>
                filters.selectedCategories.includes(category)
              )
            );
          }

          // Apply rating filter
          if (filters.selectedRatings.length > 0) {
            const minRating = Math.max(
              ...filters.selectedRatings.map((r) => {
                if (r === "rating4plus") return 4.0;
                if (r === "rating3plus") return 3.5;
                if (r === "rating3") return 3.0;
                return 0;
              })
            );
            filtered = filtered.filter(
              (instructor) => instructor.rating >= minRating
            );
          }

          // Apply verification filter
          if (filters.selectedRatings.includes("verified")) {
            filtered = filtered.filter((instructor) => instructor.isVerified);
          }

          // Apply live sessions filter
          if (filters.offersLiveSessions) {
            filtered = filtered.filter(
              (instructor) => instructor.liveSessionsEnabled
            );
          }

          // Apply available today filter
          if (filters.availableToday) {
            filtered = filtered.filter(
              (instructor) => instructor.nextAvailableSlot
            );
          }

          // Apply group sessions filter
          if (filters.groupSessionsAvailable) {
            filtered = filtered.filter(
              (instructor) => instructor.groupSessionsEnabled
            );
          }

          // Apply price range filter
          filtered = filtered.filter((instructor) => {
            const avgPrice =
              (instructor.priceRange.min + instructor.priceRange.max) / 2;
            return (
              avgPrice >= filters.priceRange[0] &&
              avgPrice <= filters.priceRange[1]
            );
          });

          // Apply sorting
          switch (sortBy) {
            case "rating":
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            case "students":
              filtered.sort((a, b) => b.studentsCount - a.studentsCount);
              break;
            case "name":
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "newest":
              // Sort by creation date if available
              break;
            default:
              // Featured order (already sorted by backend)
              break;
          }

          return filtered;
        },

        getInstructorById: (id: string) => {
          const { instructors, featuredInstructors } = get();
          return (
            instructors.find((instructor) => instructor.id === id) ||
            featuredInstructors.find((instructor) => instructor.id === id) ||
            null
          );
        },

        transformInstructorData,

        resetState: () => set(initialState),
      })),
      {
        name: "instructors-store",
        partialize: (state) => ({
          savedInstructors: state.savedInstructors,
          viewMode: state.viewMode,
          filters: state.filters,
          sortBy: state.sortBy,
        }),
      }
    )
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const useInstructorsSelectors = () => {
  const store = useInstructorsStore();

  return {
    // Data selectors
    featuredInstructors: store.featuredInstructors,
    instructors: store.instructors,
    availableTodayInstructors: store.availableTodayInstructors,
    heroStats: store.heroStats,
    instructorProfile: store.instructorProfile,
    myInstructorProfile: store.myInstructorProfile,
    instructorStats: store.instructorStats,
    myInstructorStats: store.myInstructorStats,
    searchResults: store.searchResults,
    transformedInstructors: store.transformedInstructors,

    // Loading selectors
    featuredInstructorsLoading: store.featuredInstructorsLoading,
    instructorsLoading: store.instructorsLoading,
    heroStatsLoading: store.heroStatsLoading,
    availableTodayLoading: store.availableTodayLoading,
    instructorProfileLoading: store.instructorProfileLoading,
    myInstructorProfileLoading: store.myInstructorProfileLoading,
    instructorStatsLoading: store.instructorStatsLoading,
    myInstructorStatsLoading: store.myInstructorStatsLoading,
    searchLoading: store.searchLoading,
    isRefreshing: store.isRefreshing,

    // Error selectors
    featuredInstructorsError: store.featuredInstructorsError,
    instructorsError: store.instructorsError,
    heroStatsError: store.heroStatsError,
    availableTodayError: store.availableTodayError,
    instructorProfileError: store.instructorProfileError,
    myInstructorProfileError: store.myInstructorProfileError,
    instructorStatsError: store.instructorStatsError,
    myInstructorStatsError: store.myInstructorStatsError,
    searchError: store.searchError,

    // Filter selectors
    filters: store.filters,
    searchQuery: store.searchQuery,
    sortBy: store.sortBy,
    viewMode: store.viewMode,

    // Pagination selectors
    pagination: store.pagination,

    // UI selectors
    selectedInstructor: store.selectedInstructor,
    savedInstructors: store.savedInstructors,
    isFilterModalOpen: store.isFilterModalOpen,

    // Computed selectors
    filteredInstructors: store.getFilteredInstructors(),
    totalFilterCount: () => {
      const { filters } = store;
      return (
        filters.selectedCategories.length +
        filters.selectedExperience.length +
        filters.selectedRatings.length +
        filters.selectedLanguages.length +
        filters.selectedTimePreferences.length +
        filters.selectedSessionTypes.length +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0) +
        (filters.availableToday ? 1 : 0) +
        (filters.offersLiveSessions ? 1 : 0) +
        (filters.groupSessionsAvailable ? 1 : 0) +
        (filters.hasRecordedCourses ? 1 : 0) +
        (filters.activeOnReels ? 1 : 0) +
        (filters.regularStoryPoster ? 1 : 0)
      );
    },
  };
};
