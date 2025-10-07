export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export interface InstructorInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
}

export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  duration?: number;
  views: number;
  likesCount: number;
  createdAt: string;
  expiresAt?: string;
  instructor: InstructorInfo;
  isLiked?: boolean;
  isPublic?: boolean;
}

export interface Reel {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  duration: number;
  views: number;
  likesCount: number;
  createdAt: string;
  instructor: InstructorInfo;
  isLiked?: boolean;
  isPublic?: boolean;
}

export interface CreateStoryReelDto {
  caption?: string;
  file: File;
  duration?: number;
  isPublic?: boolean;
}

export interface ViewResponse {
  viewed: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface InstructorFeed {
  stories: Story[];
  reels: Reel[];
}

export interface LikeResponse {
  liked: boolean;
}

// Duration constraints (in seconds)
export const STORY_MAX_DURATION = 15;
export const REEL_MAX_DURATION = 90;
export const STORY_EXPIRY_HOURS = 24;
