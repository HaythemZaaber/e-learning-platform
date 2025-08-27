import { useQuery, useLazyQuery } from '@apollo/client';
import { useInstructorsStore } from '@/stores/instructors.store';
import { 
  GET_FEATURED_INSTRUCTORS, 
  GET_INSTRUCTOR_HERO_STATS, 
  GET_INSTRUCTORS_LIST, 
  GET_AVAILABLE_TODAY_INSTRUCTORS,
  GET_INSTRUCTOR_PROFILE,
  GET_MY_INSTRUCTOR_PROFILE,
  GET_INSTRUCTOR_STATS,
  GET_MY_INSTRUCTOR_STATS,
  SEARCH_INSTRUCTORS
} from '@/graphql/queries/instructors';
import { 
  FeaturedInstructorsResponse, 
  InstructorHeroStats, 
  InstructorListResponse, 
  InstructorStatsResponse, 
  InstructorSearchResponse,
  InstructorListFiltersInput,
  InstructorSearchFiltersInput,
  InstructorProfile
} from '@/types/instructorGraphQLTypes';
import { 
  getMockFeaturedInstructors, 
  getMockInstructorHeroStats, 
  getMockInstructorsList, 
  getMockAvailableTodayInstructors,
  getMockTransformedInstructors,
  isGraphQLAvailable,
  getFallbackData
} from '@/features/instructors/services/mockInstructorService';
import { useEffect } from 'react';

// =============================================================================
// INDIVIDUAL GRAPHQL HOOKS
// =============================================================================

export const useFeaturedInstructors = (limit: number = 6) => {
  const { setFeaturedInstructors, setFeaturedInstructorsLoading, setFeaturedInstructorsError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getFeaturedInstructors: FeaturedInstructorsResponse }>(GET_FEATURED_INSTRUCTORS, {
    variables: { limit },
    errorPolicy: 'all'
  });

  useEffect(() => {
    setFeaturedInstructorsLoading(loading);
    setFeaturedInstructorsError(error?.message || null);
    
    if (data?.getFeaturedInstructors?.featuredInstructors) {
      setFeaturedInstructors(data.getFeaturedInstructors.featuredInstructors);
    }
  }, [data, loading, error, limit, setFeaturedInstructors, setFeaturedInstructorsLoading, setFeaturedInstructorsError]);

  return {
    featuredInstructors: data?.getFeaturedInstructors?.featuredInstructors || [],
    loading,
    error: error?.message || null
  };
};

export const useInstructorHeroStats = () => {
  const { setHeroStats, setHeroStatsLoading, setHeroStatsError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getInstructorHeroStats: InstructorHeroStats }>(GET_INSTRUCTOR_HERO_STATS, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    setHeroStatsLoading(loading);
    setHeroStatsError(error?.message || null);
    
    if (data?.getInstructorHeroStats) {
      setHeroStats(data.getInstructorHeroStats);
    }
  }, [data, loading, error, setHeroStats, setHeroStatsLoading, setHeroStatsError]);

  return {
    heroStats: data?.getInstructorHeroStats || null,
    loading,
    error: error?.message || null
  };
};

export const useInstructorsList = (
  filters?: InstructorListFiltersInput,
  page: number = 1,
  limit: number = 6,
  sortBy: string = 'featured'
) => {
  const { setInstructors, setInstructorsLoading, setInstructorsError, setPagination, setTransformedInstructors } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getInstructorsList: InstructorListResponse }>(GET_INSTRUCTORS_LIST, {
    variables: { filters, page, limit, sortBy },
    errorPolicy: 'all'
  });

  useEffect(() => {
    setInstructorsLoading(loading);
    setInstructorsError(error?.message || null);
    
    if (data?.getInstructorsList) {
      setInstructors(data.getInstructorsList.instructors);
      setPagination({
        currentPage: data.getInstructorsList.page,
        totalPages: data.getInstructorsList.totalPages,
        totalItems: data.getInstructorsList.total,
        itemsPerPage: data.getInstructorsList.limit,
        hasMore: data.getInstructorsList.hasMore
      });
    }
  }, [data, loading, error, filters, page, limit, sortBy, setInstructors, setInstructorsLoading, setInstructorsError, setPagination]);

  return {
    instructors: data?.getInstructorsList?.instructors || [],
    pagination: data?.getInstructorsList ? {
      currentPage: data.getInstructorsList.page,
      totalPages: data.getInstructorsList.totalPages,
      totalItems: data.getInstructorsList.total,
      itemsPerPage: data.getInstructorsList.limit,
      hasMore: data.getInstructorsList.hasMore
    } : {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: limit,
      hasMore: false
    },
    loading,
    error: error?.message || null
  };
};

export const useAvailableTodayInstructors = (limit: number = 10) => {
  const { setAvailableTodayInstructors, setAvailableTodayLoading, setAvailableTodayError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getAvailableTodayInstructors: InstructorProfile[] }>(GET_AVAILABLE_TODAY_INSTRUCTORS, {
    variables: { limit },
    errorPolicy: 'all'
  });

  useEffect(() => {
    setAvailableTodayLoading(loading);
    setAvailableTodayError(error?.message || null);
    
    if (data?.getAvailableTodayInstructors) {
      setAvailableTodayInstructors(data.getAvailableTodayInstructors);
    }
  }, [data, loading, error, limit, setAvailableTodayInstructors, setAvailableTodayLoading, setAvailableTodayError]);

  return {
    availableTodayInstructors: data?.getAvailableTodayInstructors || [],
    loading,
    error: error?.message || null
  };
};

export const useInstructorProfile = (instructorId: string) => {
  const { setInstructorProfile, setInstructorProfileLoading, setInstructorProfileError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery(GET_INSTRUCTOR_PROFILE, {
    variables: { instructorId },
    skip: !instructorId,
    errorPolicy: 'all'
  });

  useEffect(() => {
    setInstructorProfileLoading(loading);
    setInstructorProfileError(error?.message || null);
    
    if (data?.instructorProfile) {
      setInstructorProfile(data.instructorProfile);
    }
  }, [data, loading, error, instructorId, setInstructorProfile, setInstructorProfileLoading, setInstructorProfileError]);

  return {
    instructorProfile: data?.instructorProfile || null,
    loading,
    error: error?.message || null
  };
};

export const useMyInstructorProfile = () => {
  const { setMyInstructorProfile, setMyInstructorProfileLoading, setMyInstructorProfileError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery(GET_MY_INSTRUCTOR_PROFILE, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    setMyInstructorProfileLoading(loading);
    setMyInstructorProfileError(error?.message || null);
    
    if (data?.myInstructorProfile) {
      setMyInstructorProfile(data.myInstructorProfile);
    }
  }, [data, loading, error, setMyInstructorProfile, setMyInstructorProfileLoading, setMyInstructorProfileError]);

  return {
    myInstructorProfile: data?.myInstructorProfile || null,
    loading,
    error: error?.message || null
  };
};

export const useInstructorStats = (instructorId: string) => {
  const { setInstructorStats, setInstructorStatsLoading, setInstructorStatsError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getInstructorStats: InstructorStatsResponse }>(GET_INSTRUCTOR_STATS, {
    variables: { instructorId },
    skip: !instructorId,
    errorPolicy: 'all'
  });

  useEffect(() => {
    setInstructorStatsLoading(loading);
    setInstructorStatsError(error?.message || null);
    
    if (data?.getInstructorStats) {
      setInstructorStats(data.getInstructorStats);
    }
  }, [data, loading, error, instructorId, setInstructorStats, setInstructorStatsLoading, setInstructorStatsError]);

  return {
    instructorStats: data?.getInstructorStats || null,
    loading,
    error: error?.message || null
  };
};

export const useMyInstructorStats = () => {
  const { setMyInstructorStats, setMyInstructorStatsLoading, setMyInstructorStatsError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ getMyInstructorStats: InstructorStatsResponse }>(GET_MY_INSTRUCTOR_STATS, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    setMyInstructorStatsLoading(loading);
    setMyInstructorStatsError(error?.message || null);
    
    if (data?.getMyInstructorStats) {
      setMyInstructorStats(data.getMyInstructorStats);
    }
  }, [data, loading, error, setMyInstructorStats, setMyInstructorStatsLoading, setMyInstructorStatsError]);

  return {
    myInstructorStats: data?.getMyInstructorStats || null,
    loading,
    error: error?.message || null
  };
};

export const useSearchInstructors = (filters: InstructorSearchFiltersInput) => {
  const { setSearchResults, setSearchLoading, setSearchError } = useInstructorsStore();
  
  const { data, loading, error } = useQuery<{ searchInstructors: InstructorSearchResponse }>(SEARCH_INSTRUCTORS, {
    variables: { filters },
    errorPolicy: 'all'
  });

  useEffect(() => {
    setSearchLoading(loading);
    setSearchError(error?.message || null);
    
    if (data?.searchInstructors) {
      setSearchResults(data.searchInstructors.instructors);
    }
  }, [data, loading, error, filters, setSearchResults, setSearchLoading, setSearchError]);

  return {
    searchResults: data?.searchInstructors?.instructors || [],
    loading,
    error: error?.message || null
  };
};

// =============================================================================
// COMPOSED HOOKS FOR SPECIFIC USE CASES
// =============================================================================

export const useInstructorsData = () => {
  const { featuredInstructors, loading: featuredLoading, error: featuredError } = useFeaturedInstructors();
  const { heroStats, loading: statsLoading, error: statsError } = useInstructorHeroStats();
  const { transformedInstructors } = useInstructorsStore();

  return {
    featuredInstructors,
    heroStats,
    transformedInstructors,
    loading: featuredLoading || statsLoading,
    error: featuredError || statsError
  };
};

export const useInstructorsPageData = (
  filters?: InstructorListFiltersInput,
  page: number = 1,
  limit: number = 6,
  sortBy: string = 'featured'
) => {
  const { instructors, pagination, loading: instructorsLoading, error: instructorsError } = useInstructorsList(filters, page, limit, sortBy);
  const { availableTodayInstructors, loading: availableLoading, error: availableError } = useAvailableTodayInstructors();
  const { transformedInstructors } = useInstructorsStore();

  return {
    instructors,
    availableTodayInstructors,
    transformedInstructors,
    pagination,
    loading: instructorsLoading || availableLoading,
    error: instructorsError || availableError
  };
};

// =============================================================================
// UTILITY HOOKS FOR STORE INTERACTION
// =============================================================================

export const useInstructorById = (id: string) => {
  const { getInstructorById } = useInstructorsStore();
  return getInstructorById(id);
};

export const useInstructorFilters = () => {
  const { filters, setFilters, resetFilters } = useInstructorsStore();
  return { filters, setFilters, resetFilters };
};

export const useInstructorPagination = () => {
  const { pagination, setCurrentPage, setItemsPerPage } = useInstructorsStore();
  return { pagination, setCurrentPage, setItemsPerPage };
};

export const useInstructorUI = () => {
  const { viewMode, setViewMode, sortBy, setSortBy } = useInstructorsStore();
  return { viewMode, setViewMode, sortBy, setSortBy };
};
