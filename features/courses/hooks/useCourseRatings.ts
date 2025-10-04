import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import {
  CREATE_COURSE_RATING,
  UPDATE_COURSE_RATING,
  DELETE_COURSE_RATING,
} from "@/graphql/mutations/courseRatingMutations";
import {
  GET_COURSE_RATINGS,
  GET_USER_COURSE_RATING,
} from "@/graphql/queries/courseRatingQueries";
import {
  CourseRating,
  CourseRatingStats,
  CreateCourseRatingInput,
  UpdateCourseRatingInput,
  CourseRatingFilters,
} from "@/types/courseRatingTypes";

export const useCourseRatings = (
  courseId: string,
  filters?: CourseRatingFilters
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get course ratings
  const {
    data: ratingsData,
    loading: ratingsLoading,
    error: ratingsError,
    refetch: refetchRatings,
  } = useQuery(GET_COURSE_RATINGS, {
    variables: {
      courseId,
      rating: filters?.rating,
      limit: filters?.limit || 10,
      offset: filters?.offset || 0,
    },
    skip: !courseId,
    fetchPolicy: "cache-and-network",
  });

  // Get user's rating for this course
  const {
    data: userRatingData,
    loading: userRatingLoading,
    error: userRatingError,
    refetch: refetchUserRating,
  } = useQuery(GET_USER_COURSE_RATING, {
    variables: { courseId },
    skip: !courseId,
    fetchPolicy: "cache-and-network",
  });

  // Create rating mutation
  const [createRating] = useMutation(CREATE_COURSE_RATING, {
    onCompleted: (data) => {
      if (data.createCourseRating.success) {
        toast.success("Review submitted successfully!");
        refetchRatings();
        refetchUserRating();
      } else {
        toast.error(data.createCourseRating.message);
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Failed to submit review: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Update rating mutation
  const [updateRating] = useMutation(UPDATE_COURSE_RATING, {
    onCompleted: (data) => {
      if (data.updateCourseRating.success) {
        toast.success("Review updated successfully!");
        refetchRatings();
        refetchUserRating();
      } else {
        toast.error(data.updateCourseRating.message);
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Failed to update review: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Delete rating mutation
  const [deleteRating] = useMutation(DELETE_COURSE_RATING, {
    onCompleted: (data) => {
      if (data.deleteCourseRating.success) {
        toast.success("Review deleted successfully!");
        refetchRatings();
        refetchUserRating();
      } else {
        toast.error(data.deleteCourseRating.message);
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete review: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleCreateRating = async (input: CreateCourseRatingInput) => {
    setIsSubmitting(true);
    try {
      await createRating({
        variables: {
          courseId: input.courseId,
          rating: input.rating,
          comment: input.comment,
          courseQuality: input.courseQuality,
          instructorRating: input.instructorRating,
          difficultyRating: input.difficultyRating,
          valueForMoney: input.valueForMoney,
        },
      });
    } catch (error) {
      console.error("Error creating rating:", error);
      setIsSubmitting(false);
    }
  };

  const handleUpdateRating = async (input: UpdateCourseRatingInput) => {
    setIsSubmitting(true);
    try {
      await updateRating({
        variables: {
          ratingId: input.ratingId,
          rating: input.rating,
          comment: input.comment,
          courseQuality: input.courseQuality,
          instructorRating: input.instructorRating,
          difficultyRating: input.difficultyRating,
          valueForMoney: input.valueForMoney,
        },
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    setIsSubmitting(true);
    try {
      await deleteRating({
        variables: { ratingId },
      });
    } catch (error) {
      console.error("Error deleting rating:", error);
      setIsSubmitting(false);
    }
  };

  return {
    // Data
    ratings: ratingsData?.getCourseRatings?.ratings || [],
    userRating: userRatingData?.getUserCourseRating?.rating,

    // Loading states
    ratingsLoading,
    userRatingLoading,
    isSubmitting,

    // Error states
    ratingsError,
    userRatingError,

    // Actions
    createRating: handleCreateRating,
    updateRating: handleUpdateRating,
    deleteRating: handleDeleteRating,

    // Refetch functions
    refetchRatings,
    refetchUserRating,
  };
};
