import { 
  InstructorDetailsResponse, 
  InstructorCoursesResponse, 
  InstructorReviewsResponse, 
  AvailabilityResponse,
  BookingRequest 
} from '@/types/instructorTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class InstructorProfileService {
  // Remove the getAuthHeaders and getClerkToken methods since we'll get tokens from hooks

  private async makeRequest<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    };
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getInstructorDetails(instructorId: string, token?: string): Promise<InstructorDetailsResponse> {
    return this.makeRequest<InstructorDetailsResponse>(`/instructor-profiles/details/${instructorId}`, undefined, token);
  }

  async getInstructorCourses(
    instructorId: string, 
    options: { page?: number; limit?: number; status?: string } = {},
    token?: string
  ): Promise<InstructorCoursesResponse> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.status) params.append('status', options.status);

    const queryString = params.toString();
    const endpoint = `/instructor-profiles/${instructorId}/courses${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<InstructorCoursesResponse>(endpoint, undefined, token);
  }

  async getInstructorReviews(
    instructorId: string, 
    options: { page?: number; limit?: number; rating?: number } = {},
    token?: string
  ): Promise<InstructorReviewsResponse> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.rating) params.append('rating', options.rating.toString());

    const queryString = params.toString();
    const endpoint = `/instructor-profiles/${instructorId}/reviews${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<InstructorReviewsResponse>(endpoint, undefined, token);
  }

  async getInstructorAvailability(
    instructorId: string, 
    options: { startDate?: string; endDate?: string } = {},
    token?: string
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams();
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);

    const queryString = params.toString();
    const endpoint = `/instructor-profiles/${instructorId}/availability${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<AvailabilityResponse>(endpoint, undefined, token);
  }

  async getInstructorStats(instructorId: string, token?: string): Promise<any> {
    return this.makeRequest(`/instructor-profiles/${instructorId}/stats`, undefined, token);
  }

  async submitBooking(bookingRequest: BookingRequest, token?: string): Promise<{ success: boolean; message?: string }> {
    return this.makeRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingRequest),
    }, token);
  }
}

export const instructorProfileService = new InstructorProfileService();

