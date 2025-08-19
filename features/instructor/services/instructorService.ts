import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { 
  InstructorProfile, 
  InstructorStats, 
  UpdateInstructorProfileInput,
  InstructorSearchFilters,
  InstructorSearchResponse 
} from '@/types/instructorTypes';

// GraphQL Queries
import {
  GET_INSTRUCTOR_PROFILE,
  GET_MY_INSTRUCTOR_PROFILE,
  GET_INSTRUCTOR_STATS,
  GET_MY_INSTRUCTOR_STATS,
  SEARCH_INSTRUCTORS,
  GET_VERIFICATION_STATUS
} from '@/graphql/queries/instructor';

// GraphQL Mutations
import {
  UPDATE_INSTRUCTOR_PROFILE,
  CREATE_INSTRUCTOR_PROFILE,
  DELETE_INSTRUCTOR_PROFILE,
  UPDATE_PROFILE_IMAGE,
  REQUEST_VERIFICATION
} from '@/graphql/mutations/instructor';

// Custom hooks for GraphQL operations
export const useGetInstructorProfile = (userId: string) => {
  return useQuery(GET_INSTRUCTOR_PROFILE, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all',
  });
};

export const useGetMyInstructorProfile = () => {
  return useQuery(GET_MY_INSTRUCTOR_PROFILE, {
    errorPolicy: 'all',
  });
};

export const useGetInstructorStats = (userId: string) => {
  return useQuery(GET_INSTRUCTOR_STATS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all',
  });
};

export const useGetMyInstructorStats = () => {
  return useQuery(GET_MY_INSTRUCTOR_STATS, {
    errorPolicy: 'all',
  });
};

export const useSearchInstructors = () => {
  return useLazyQuery(SEARCH_INSTRUCTORS, {
    errorPolicy: 'all',
  });
};

export const useGetVerificationStatus = () => {
  return useQuery(GET_VERIFICATION_STATUS, {
    errorPolicy: 'all',
  });
};

export const useUpdateInstructorProfile = () => {
  return useMutation(UPDATE_INSTRUCTOR_PROFILE, {
    errorPolicy: 'all',
    update: (cache, { data }) => {
      if (data?.updateInstructorProfile) {
        // Update the cache with the new profile data
        cache.writeQuery({
          query: GET_MY_INSTRUCTOR_PROFILE,
          data: { getMyInstructorProfile: data.updateInstructorProfile },
        });
      }
    },
  });
};

export const useCreateInstructorProfile = () => {
  return useMutation(CREATE_INSTRUCTOR_PROFILE, {
    errorPolicy: 'all',
  });
};

export const useDeleteInstructorProfile = () => {
  return useMutation(DELETE_INSTRUCTOR_PROFILE, {
    errorPolicy: 'all',
  });
};


export const useUpdateProfileImage = () => {
  return useMutation(UPDATE_PROFILE_IMAGE, {
    errorPolicy: 'all',
  });
};

export const useRequestVerification = () => {
  return useMutation(REQUEST_VERIFICATION, {
    errorPolicy: 'all',
  });
};

// Service class for non-hook operations
class InstructorService {
  // This class can be used for operations that don't need to be hooks
  // For example, background operations, service workers, etc.
  
  static async getInstructorProfile(userId: string): Promise<InstructorProfile> {
    // This would be used in contexts where hooks are not available
    // Implementation would depend on your GraphQL client setup
    throw new Error('Use useGetInstructorProfile hook instead');
  }

  static async updateInstructorProfile(input: UpdateInstructorProfileInput): Promise<InstructorProfile> {
    // This would be used in contexts where hooks are not available
    // Implementation would depend on your GraphQL client setup
    throw new Error('Use useUpdateInstructorProfile hook instead');
  }

  static async searchInstructors(filters: InstructorSearchFilters): Promise<InstructorSearchResponse> {
    // This would be used in contexts where hooks are not available
    // Implementation would depend on your GraphQL client setup
    throw new Error('Use useSearchInstructors hook instead');
  }
}

export const instructorService = InstructorService;
