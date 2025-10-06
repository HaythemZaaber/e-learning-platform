const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface FollowListPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

class InstructorFollowService {
  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit,
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed (${res.status})`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    return {} as T;
  }

  async isFollowing(
    instructorId: string,
    token?: string
  ): Promise<{ isFollowing: boolean }> {
    return this.makeRequest(
      `/instructor-follow/${instructorId}/following`,
      undefined,
      token
    );
  }

  async follow(instructorId: string, token?: string): Promise<any> {
    return this.makeRequest(
      `/instructor-follow/${instructorId}/follow`,
      { method: "POST" },
      token
    );
  }

  async unfollow(instructorId: string, token?: string): Promise<any> {
    return this.makeRequest(
      `/instructor-follow/${instructorId}/follow`,
      { method: "DELETE" },
      token
    );
  }

  async getStudentFollowing(
    page = 1,
    limit = 20,
    token?: string
  ): Promise<{ following: any[]; pagination: FollowListPagination }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.makeRequest(
      `/instructor-follow/following?${params.toString()}`,
      undefined,
      token
    );
  }

  async getInstructorFollowers(
    page = 1,
    limit = 20,
    token?: string
  ): Promise<{ followers: any[]; pagination: FollowListPagination }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.makeRequest(
      `/instructor-follow/followers?${params.toString()}`,
      undefined,
      token
    );
  }

  async getFollowStats(token?: string): Promise<{
    totalFollowers: number;
    newFollowersThisWeek: number;
    newFollowersThisMonth: number;
  }> {
    return this.makeRequest(`/instructor-follow/stats`, undefined, token);
  }
}

export const instructorFollowService = new InstructorFollowService();
