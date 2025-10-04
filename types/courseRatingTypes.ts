export interface CourseRating {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  courseQuality?: number;
  instructorRating?: number;
  difficultyRating?: number;
  valueForMoney?: number;
  status: string;
  flaggedCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
}

export interface CourseRatingResponse {
  success: boolean;
  message: string;
  rating?: CourseRating;
  errors?: string[];
}

export interface CourseRatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  averageCourseQuality?: number;
  averageInstructorRating?: number;
  averageDifficultyRating?: number;
  averageValueForMoney?: number;
}

export interface PaginatedCourseRatingsResponse {
  success: boolean;
  message: string;
  ratings: CourseRating[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  errors?: string[];
}

export interface CreateCourseRatingInput {
  courseId: string;
  rating: number;
  comment?: string;
  courseQuality?: number;
  instructorRating?: number;
  difficultyRating?: number;
  valueForMoney?: number;
}

export interface UpdateCourseRatingInput {
  ratingId: string;
  rating?: number;
  comment?: string;
  courseQuality?: number;
  instructorRating?: number;
  difficultyRating?: number;
  valueForMoney?: number;
}

export interface CourseRatingFilters {
  rating?: number;
  limit?: number;
  offset?: number;
}
