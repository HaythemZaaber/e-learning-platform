import { apiClient } from "@/lib/api-client";
import type {
  Story,
  Reel,
  CreateStoryReelDto,
  PaginatedResponse,
  InstructorFeed,
  LikeResponse,
  ViewResponse,
} from "@/types/storiesReelsTypes";

class StoriesReelsService {
  // ============================================
  // STORIES API
  // ============================================

  async createStory(data: CreateStoryReelDto, token: string): Promise<Story> {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.caption) {
      formData.append("caption", data.caption);
    }
    if (data.duration !== undefined) {
      formData.append("duration", data.duration.toString());
    }
    if (data.isPublic !== undefined) {
      formData.append("isPublic", data.isPublic.toString());
    }

    const response = await apiClient.post<Story>(
      "/stories-reels/story",
      formData,
      token
    );

    return response;
  }

  async getStories(instructorId?: string, token?: string): Promise<Story[]> {
    const params = instructorId ? { instructorId } : undefined;

    const response = await apiClient.get<Story[]>(
      "/stories-reels/stories",
      token,
      params
    );

    return response;
  }

  async likeStory(storyId: string, token: string): Promise<LikeResponse> {
    const response = await apiClient.post<LikeResponse>(
      `/stories-reels/story/${storyId}/like`,
      {},
      token
    );

    return response;
  }

  async deleteStory(storyId: string, token: string): Promise<void> {
    await apiClient.delete(`/stories-reels/story/${storyId}`, token);
  }

  // ============================================
  // REELS API
  // ============================================

  async createReel(data: CreateStoryReelDto, token: string): Promise<Reel> {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.caption) {
      formData.append("caption", data.caption);
    }
    if (data.duration !== undefined) {
      formData.append("duration", data.duration.toString());
    }
    if (data.isPublic !== undefined) {
      formData.append("isPublic", data.isPublic.toString());
    }

    const response = await apiClient.post<Reel>(
      "/stories-reels/reel",
      formData,
      token
    );

    return response;
  }

  async getReels(
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<PaginatedResponse<Reel>> {
    const response = await apiClient.get<PaginatedResponse<Reel>>(
      "/stories-reels/reels",
      token,
      { page, limit }
    );

    return response;
  }

  async getInstructorReels(
    instructorId: string,
    page: number = 1,
    limit: number = 20,
    token?: string
  ): Promise<PaginatedResponse<Reel>> {
    const response = await apiClient.get<PaginatedResponse<Reel>>(
      `/stories-reels/instructor/${instructorId}/reels`,
      token,
      { page, limit }
    );

    return response;
  }

  async likeReel(reelId: string, token: string): Promise<LikeResponse> {
    const response = await apiClient.post<LikeResponse>(
      `/stories-reels/reel/${reelId}/like`,
      {},
      token
    );

    return response;
  }

  async deleteReel(reelId: string, token: string): Promise<void> {
    await apiClient.delete(`/stories-reels/reel/${reelId}`, token);
  }

  // ============================================
  // COMBINED API
  // ============================================

  async getInstructorFeed(
    instructorId: string,
    token?: string
  ): Promise<InstructorFeed> {
    const response = await apiClient.get<InstructorFeed>(
      `/stories-reels/instructor/${instructorId}/feed`,
      token
    );

    return response;
  }

  // ============================================
  // VIEW TRACKING
  // ============================================

  async trackStoryView(storyId: string, token: string): Promise<ViewResponse> {
    const response = await apiClient.post<ViewResponse>(
      `/stories-reels/story/${storyId}/view`,
      {},
      token
    );

    return response;
  }

  async trackReelView(reelId: string, token: string): Promise<ViewResponse> {
    const response = await apiClient.post<ViewResponse>(
      `/stories-reels/reel/${reelId}/view`,
      {},
      token
    );

    return response;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };

      video.onerror = () => {
        reject(new Error("Failed to load video"));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  validateVideoDuration(
    duration: number,
    type: "STORY" | "REEL"
  ): {
    valid: boolean;
    message?: string;
  } {
    if (type === "STORY") {
      if (duration > 15) {
        return {
          valid: false,
          message: "Story videos must be 15 seconds or less",
        };
      }
    } else if (type === "REEL") {
      if (duration > 90) {
        return {
          valid: false,
          message: "Reel videos must be 90 seconds or less",
        };
      }
    }

    return { valid: true };
  }
}

export const storiesReelsService = new StoriesReelsService();
