// src/services/api/uploadService.ts
import { ContentType, MAX_FILE_SIZES, SUPPORTED_VIDEO_FORMATS, SUPPORTED_DOCUMENT_FORMATS, SUPPORTED_IMAGE_FORMATS } from '../types';

// Create constants for ContentType values
const CONTENT_TYPE_VIDEO = 'video' as ContentType;
const CONTENT_TYPE_DOCUMENT = 'document' as ContentType;
const CONTENT_TYPE_IMAGE = 'image' as ContentType;
const CONTENT_TYPE_AUDIO = 'audio' as ContentType;
const CONTENT_TYPE_ARCHIVE = 'archive' as ContentType;

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  title: string;
  description?: string;
  contentType: string;
  sectionId: string;
  lectureId: string;
  uploadedAt: Date;
  status: 'uploaded' | 'error';
}

export class UploadApiService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // ============================================
  // DIRECT FILE UPLOADS
  // ============================================

  async uploadFile(
    file: File,
    contentType: ContentType,
    metadata: {
      title: string;
      description?: string;
      sectionId: string;
      lectureId: string;
    },
    authToken?: string
  ): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('contentType', contentType);
    formData.append('sectionId', metadata.sectionId);
    formData.append('lectureId', metadata.lectureId);
    
    if (metadata.description) {
      formData.append('description', metadata.description);
    }

    // Choose endpoint based on content type
    let endpoint = '';
    switch (contentType) {
      case CONTENT_TYPE_VIDEO:
        endpoint = `${this.baseUrl}/upload/video`;
        break;
      case CONTENT_TYPE_DOCUMENT:
        endpoint = `${this.baseUrl}/upload/document`;
        break;
      case CONTENT_TYPE_IMAGE:
        endpoint = `${this.baseUrl}/upload/image`;
        break;
      case CONTENT_TYPE_AUDIO:
        endpoint = `${this.baseUrl}/upload/audio`;
        break;
      case CONTENT_TYPE_ARCHIVE:
        endpoint = `${this.baseUrl}/upload/archive`;
        break;
      default:
        endpoint = `${this.baseUrl}/upload/file`;
        formData.append('contentType', contentType);
    }

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();
    
    return {
      id: result.fileInfo?.filePath || `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: result.fileInfo?.file_url,
      title: metadata.title,
      description: metadata.description,
      contentType: contentType,
      sectionId: metadata.sectionId,
      lectureId: metadata.lectureId,
      uploadedAt: new Date(result.fileInfo?.uploadedAt || Date.now()),
      status: 'uploaded',
    };
  }

  // ============================================
  // FILE DELETION
  // ============================================

  async deleteFile(filePath: string, authToken?: string): Promise<{ success: boolean; message: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/upload/file`, {
      method: 'DELETE',
      body: JSON.stringify({ data: {fileUrl: filePath} }),
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // THUMBNAIL UPLOADS
  // ============================================

  async uploadThumbnail(
    file: File,
    courseId?: string,
    metadata?: {
      title?: string;
      description?: string;
    },
    authToken?: string
  ) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata?.title) {
      formData.append('title', metadata.title);
    }
    if (metadata?.description) {
      formData.append('description', metadata.description);
    }
    
    // Add quality parameters for better image processing
    formData.append('quality', '95');
    formData.append('optimize', 'true');

    const endpoint = `${this.baseUrl}/upload/image`;

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Thumbnail upload failed: ${error}`);
    }

    return response.json();
  }

  async deleteThumbnail(courseId: string, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/upload/delete/thumbnail/${courseId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete thumbnail');
    }

    return response.json();
  }

  async deleteUnsavedThumbnail(thumbnailUrl: string, authToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/upload/thumbnail/unsaved`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ thumbnailUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete unsaved thumbnail');
    }

    return response.json();
  }

  async deleteDraftThumbnail(courseId: string, thumbnailUrl: string, authToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/upload/thumbnail/draft/${courseId}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ thumbnailUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete draft thumbnail');
    }

    return response.json();
  }

  async deleteCourseThumbnail(courseId: string, thumbnailUrl: string, authToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/upload/thumbnail/course/${courseId}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ thumbnailUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete course thumbnail');
    }

    return response.json();
  }

  // ============================================
  // BATCH OPERATIONS
  // ============================================

  async uploadMultipleFiles(
    files: File[],
    contentType: ContentType,
    metadata: {
      sectionId: string;
      lectureId: string;
    },
    authToken?: string
  ) {
    const results = [];
    
    for (const file of files) {
      try {
        const fileMetadata = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: `Uploaded ${contentType.toLowerCase()} file`,
          sectionId: metadata.sectionId,
          lectureId: metadata.lectureId,
        };

        const result = await this.uploadFile(file, contentType, fileMetadata, authToken);

        results.push({
          success: true,
          file: file.name,
          result,
        });
      } catch (error) {
        results.push({
          success: false,
          file: file.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // ============================================
  // CONTENT CREATION (Non-file content)
  // ============================================

  async createTextContent(
    courseId: string,
    lessonId: string,
    data: {
      title: string;
      content: string;
      description?: string;
      order?: number;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/course/${courseId}/content/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        lessonId,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create text content: ${error}`);
    }

    return response.json();
  }

  async createAssignment(
    courseId: string,
    lessonId: string,
    data: {
      title: string;
      description: string;
      instructions?: string;
      dueDate?: string;
      points?: number;
      order?: number;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/course/${courseId}/content/assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        lessonId,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create assignment: ${error}`);
    }

    return response.json();
  }

  async createResourceLink(
    courseId: string,
    lessonId: string,
    data: {
      title: string;
      url: string;
      description?: string;
      resourceType: string;
      order?: number;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/course/${courseId}/content/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        lessonId,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create resource link: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  validateFile(
    file: File,
    contentType: ContentType,
    maxSize?: number
  ): { isValid: boolean; error?: string } {
    const maxSizes = {
      [CONTENT_TYPE_VIDEO]: MAX_FILE_SIZES.video,
      [CONTENT_TYPE_DOCUMENT]: MAX_FILE_SIZES.document,
      [CONTENT_TYPE_IMAGE]: MAX_FILE_SIZES.image,
      [CONTENT_TYPE_AUDIO]: MAX_FILE_SIZES.audio,
      [CONTENT_TYPE_ARCHIVE]: MAX_FILE_SIZES.archive,
    };

    const allowedTypes = {
      [CONTENT_TYPE_VIDEO]: SUPPORTED_VIDEO_FORMATS,
      [CONTENT_TYPE_DOCUMENT]: SUPPORTED_DOCUMENT_FORMATS,
      [CONTENT_TYPE_IMAGE]: SUPPORTED_IMAGE_FORMATS,
      [CONTENT_TYPE_AUDIO]: ['audio/mp3', 'audio/wav', 'audio/ogg'],
      [CONTENT_TYPE_ARCHIVE]: [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
      ],
    };

    const sizeLimit = maxSize || maxSizes[contentType];
    if (file.size > sizeLimit) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${Math.round(sizeLimit / (1024 * 1024))}MB`,
      };
    }

    const allowedFormats = allowedTypes[contentType];
    if (!allowedFormats?.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedFormats?.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const uploadApiService = new UploadApiService();