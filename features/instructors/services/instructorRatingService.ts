import { apiClient } from "@/lib/api-client";
import {
  InstructorRating,
  CreateInstructorRatingDto,
  UpdateInstructorRatingDto,
  InstructorRatingStats,
  RatingEligibility,
  InstructorRatingsResponse,
  RatingFilters,
} from "@/types/instructorRatingTypes";

export class InstructorRatingService {
  private static baseUrl = "/instructor-ratings";

  /**
   * Check if a student is eligible to rate an instructor
   */
  static async checkRatingEligibility(
    instructorId: string,
    token?: string
  ): Promise<RatingEligibility> {
    const response = await apiClient.get<RatingEligibility>(
      `${this.baseUrl}/eligibility/${instructorId}`,
      token
    );
    return response;
  }

  /**
   * Create a new instructor rating
   */
  static async createRating(
    ratingData: CreateInstructorRatingDto,
    token: string
  ): Promise<InstructorRating> {
    console.log("InstructorRatingService.createRating called with:", {
      ratingData,
      token: token ? "Present" : "Missing",
      url: this.baseUrl,
    });

    const response = await apiClient.post<InstructorRating>(
      this.baseUrl,
      ratingData,
      token
    );

    console.log("API response:", response);
    return response;
  }

  /**
   * Update an existing instructor rating
   */
  static async updateRating(
    ratingId: string,
    ratingData: UpdateInstructorRatingDto,
    token: string
  ): Promise<InstructorRating> {
    const response = await apiClient.put<InstructorRating>(
      `${this.baseUrl}/${ratingId}`,
      ratingData,
      token
    );
    return response;
  }

  /**
   * Delete an instructor rating
   */
  static async deleteRating(
    ratingId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`${this.baseUrl}/${ratingId}`, token);
    return response;
  }

  /**
   * Get all ratings for an instructor
   */
  static async getInstructorRatings(
    instructorId: string,
    filters: RatingFilters = {}
  ): Promise<InstructorRatingsResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.minRating)
      params.append("minRating", filters.minRating.toString());
    if (filters.maxRating)
      params.append("maxRating", filters.maxRating.toString());
    if (filters.includePrivate) params.append("includePrivate", "true");

    const response = await apiClient.get<InstructorRatingsResponse>(
      `${this.baseUrl}/instructor/${instructorId}?${params.toString()}`
    );
    return response;
  }

  /**
   * Get instructor rating statistics
   */
  static async getInstructorRatingStats(
    instructorId: string
  ): Promise<InstructorRatingStats> {
    const response = await apiClient.get<InstructorRatingStats>(
      `${this.baseUrl}/instructor/${instructorId}/stats`
    );
    return response;
  }

  /**
   * Get a student's rating for a specific instructor
   */
  static async getStudentRatingForInstructor(
    instructorId: string,
    token: string
  ): Promise<InstructorRating | null> {
    try {
      const response = await apiClient.get<InstructorRating>(
        `${this.baseUrl}/student/${instructorId}`,
        token
      );

      // Validate that the response is a valid rating
      if (
        !response ||
        !response.id ||
        !response.rating ||
        response.rating <= 0
      ) {
        console.log("Invalid rating data received:", response);
        return null;
      }

      return response;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      console.log("Error fetching student rating:", error);
      throw error;
    }
  }

  /**
   * Get a specific rating by ID
   */
  static async getRatingById(
    ratingId: string,
    includePrivate = false,
    token?: string
  ): Promise<InstructorRating> {
    const params = includePrivate ? "?includePrivate=true" : "";

    const response = await apiClient.get<InstructorRating>(
      `${this.baseUrl}/${ratingId}${params}`,
      token
    );
    return response;
  }
}

// Export the class directly for static method usage
