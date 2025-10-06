export interface InstructorRating {
  id: string;
  instructorId: string;
  studentId: string;
  rating: number; // 1.0 to 5.0
  comment?: string;
  isVerified: boolean;
  isPublic: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export interface CreateInstructorRatingDto {
  instructorId: string;
  rating: number; // 1.0 to 5.0
  comment?: string;
  isPublic?: boolean;
}

export interface UpdateInstructorRatingDto {
  rating?: number; // 1.0 to 5.0
  comment?: string;
  isPublic?: boolean;
}

export interface InstructorRatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface RatingEligibility {
  isEligible: boolean;
  reason: string;
  courseEnrollments?: string[];
  completedSessions?: string[];
}

export interface InstructorRatingsResponse {
  ratings: InstructorRating[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatingFormData {
  rating: number;
  comment: string;
  isPublic: boolean;
}

export interface RatingFilters {
  page?: number;
  limit?: number;
  minRating?: number;
  maxRating?: number;
  includePrivate?: boolean;
}
