import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { InstructorRatingService } from "../services/instructorRatingService";
import {
  InstructorRating,
  CreateInstructorRatingDto,
  UpdateInstructorRatingDto,
  InstructorRatingStats,
  RatingEligibility,
  InstructorRatingsResponse,
  RatingFilters,
} from "@/types/instructorRatingTypes";
import { toast } from "sonner";

/**
 * Hook to check if a student is eligible to rate an instructor
 */
export const useRatingEligibility = (instructorId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["rating-eligibility", instructorId],
    queryFn: async (): Promise<RatingEligibility> => {
      const token = await getToken();
      return InstructorRatingService.checkRatingEligibility(
        instructorId,
        token || undefined
      );
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get instructor rating statistics
 */
export const useInstructorRatingStats = (instructorId: string) => {
  return useQuery({
    queryKey: ["instructor-rating-stats", instructorId],
    queryFn: (): Promise<InstructorRatingStats> =>
      InstructorRatingService.getInstructorRatingStats(instructorId),
    enabled: !!instructorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get instructor ratings with pagination
 */
export const useInstructorRatings = (
  instructorId: string,
  filters: RatingFilters = {}
) => {
  return useQuery({
    queryKey: ["instructor-ratings", instructorId, filters],
    queryFn: (): Promise<InstructorRatingsResponse> =>
      InstructorRatingService.getInstructorRatings(instructorId, filters),
    enabled: !!instructorId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get a student's rating for a specific instructor
 */
export const useStudentRatingForInstructor = (instructorId: string) => {
  const { getToken, user } = useAuth();

  return useQuery({
    queryKey: ["student-rating", instructorId, user?.id],
    queryFn: async (): Promise<InstructorRating | null> => {
      if (!user) return null;
      const token = await getToken();
      if (!token) return null;

      const rating =
        await InstructorRatingService.getStudentRatingForInstructor(
          instructorId,
          token
        );

      // Additional validation in the hook
      if (rating && (!rating.id || !rating.rating || rating.rating <= 0)) {
        console.log("Invalid rating data in hook:", rating);
        return null;
      }

      return rating;
    },
    enabled: !!instructorId && !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to create an instructor rating
 */
export const useCreateInstructorRating = () => {
  const { getToken } = useAuth();
  const { getToken: getClerkToken } = useClerkAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      ratingData: CreateInstructorRatingDto
    ): Promise<InstructorRating> => {
      console.log(
        "useCreateInstructorRating mutationFn called with:",
        ratingData
      );
      const token = await getToken();
      console.log("Token obtained:", token ? "Yes" : "No");
      console.log(
        "Token value:",
        token ? `${token.substring(0, 20)}...` : "No token"
      );
      console.log("Full token:", token);

      // Try to get a session token if the regular token doesn't work
      let authToken = token;
      if (!authToken) {
        // Try getting a session token from Clerk directly
        try {
          const sessionToken = await getClerkToken({
            template: "your-template-name",
          });
          console.log("Session token obtained:", sessionToken ? "Yes" : "No");
          authToken = sessionToken;
        } catch (error) {
          console.log("Failed to get session token:", error);
        }
      }

      if (!authToken) {
        throw new Error("No authentication token available");
      }

      console.log("Using token for API call:", authToken);
      const result = await InstructorRatingService.createRating(
        ratingData,
        authToken
      );
      console.log("Service call completed:", result);
      return result;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["instructor-ratings", data.instructorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-rating-stats", data.instructorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-rating", data.instructorId],
      });
      // Removed instructor-details invalidation to prevent page refresh

      // Update instructor stats optimistically without causing page refresh
      queryClient.setQueryData(
        ["instructor-rating-stats", data.instructorId],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            totalRatings: oldData.totalRatings + 1,
            averageRating:
              (oldData.averageRating * oldData.totalRatings + data.rating) /
              (oldData.totalRatings + 1),
            ratingDistribution: {
              ...oldData.ratingDistribution,
              [Math.round(
                data.rating
              ) as keyof typeof oldData.ratingDistribution]:
                (oldData.ratingDistribution[
                  Math.round(
                    data.rating
                  ) as keyof typeof oldData.ratingDistribution
                ] || 0) + 1,
            },
          };
        }
      );

      // Dispatch custom event to update instructor profile summary
      window.dispatchEvent(
        new CustomEvent("instructor-summary-update", {
          detail: {
            instructorId: data.instructorId,
            action: "rating-created",
            newRating: data.rating,
            totalRatings:
              (
                queryClient.getQueryData([
                  "instructor-rating-stats",
                  data.instructorId,
                ]) as any
              )?.totalRatings || 1,
            averageRating:
              (
                queryClient.getQueryData([
                  "instructor-rating-stats",
                  data.instructorId,
                ]) as any
              )?.averageRating || data.rating,
          },
        })
      );

      toast.success("Rating submitted successfully!");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to submit rating";

      // Provide more helpful message for duplicate rating error
      if (message.includes("already rated")) {
        toast.error(
          "You have already rated this instructor. Please use the 'Edit' button to update your existing rating."
        );
      } else {
        toast.error(message);
      }
    },
  });
};

/**
 * Hook to update an instructor rating
 */
export const useUpdateInstructorRating = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ratingId,
      ratingData,
    }: {
      ratingId: string;
      ratingData: UpdateInstructorRatingDto;
    }): Promise<InstructorRating> => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      return InstructorRatingService.updateRating(ratingId, ratingData, token);
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["instructor-ratings", data.instructorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-rating-stats", data.instructorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-rating", data.instructorId],
      });
      // Removed instructor-details invalidation to prevent page refresh

      // For rating updates, we'll just invalidate the stats to get fresh data
      // This is safer than trying to calculate the new average optimistically
      queryClient.invalidateQueries({
        queryKey: ["instructor-rating-stats", data.instructorId],
      });

      // Dispatch custom event to update instructor profile summary
      window.dispatchEvent(
        new CustomEvent("instructor-summary-update", {
          detail: {
            instructorId: data.instructorId,
            action: "rating-updated",
            newRating: data.rating,
          },
        })
      );

      toast.success("Rating updated successfully!");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to update rating";
      toast.error(message);
    },
  });
};

/**
 * Hook to delete an instructor rating
 */
export const useDeleteInstructorRating = (instructorId?: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      ratingId: string
    ): Promise<{ success: boolean; message: string }> => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      return InstructorRatingService.deleteRating(ratingId, token);
    },
    onSuccess: (data, ratingId) => {
      // We need to get the instructor ID to invalidate the right queries
      // This is a limitation - we might need to pass instructorId to the mutation
      queryClient.invalidateQueries({ queryKey: ["instructor-ratings"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-rating-stats"] });
      queryClient.invalidateQueries({ queryKey: ["student-rating"] });
      // Removed instructor-details invalidation to prevent page refresh

      // For rating deletion, just invalidate the stats to get fresh data
      if (instructorId) {
        queryClient.invalidateQueries({
          queryKey: ["instructor-rating-stats", instructorId],
        });

        // Dispatch custom event to update instructor profile summary
        window.dispatchEvent(
          new CustomEvent("instructor-summary-update", {
            detail: {
              instructorId,
              action: "rating-deleted",
            },
          })
        );
      }

      toast.success("Rating deleted successfully!");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to delete rating";
      toast.error(message);
    },
  });
};

/**
 * Hook to manage instructor rating with all CRUD operations
 */
export const useInstructorRatingManagement = (instructorId: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<RatingFilters>({
    page: 1,
    limit: 10,
  });

  const eligibility = useRatingEligibility(instructorId);
  const stats = useInstructorRatingStats(instructorId);
  const ratings = useInstructorRatings(instructorId, filters);
  const studentRating = useStudentRatingForInstructor(instructorId);

  const createRating = useCreateInstructorRating();
  const updateRating = useUpdateInstructorRating();
  const deleteRating = useDeleteInstructorRating();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilters: Partial<RatingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    setCurrentPage(1);
  };

  return {
    // Data
    eligibility,
    stats,
    ratings,
    studentRating,

    // Actions
    createRating,
    updateRating,
    deleteRating,

    // Pagination & Filters
    currentPage,
    filters,
    handlePageChange,
    handleFilterChange,

    // Loading states
    isLoading: eligibility.isLoading || stats.isLoading || ratings.isLoading,
    isCreating: createRating.isPending,
    isUpdating: updateRating.isPending,
    isDeleting: deleteRating.isPending,
  };
};
