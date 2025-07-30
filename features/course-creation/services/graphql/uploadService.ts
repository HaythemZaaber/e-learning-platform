// src/services/api/uploadService.ts
import { ContentType, MAX_FILE_SIZES, SUPPORTED_VIDEO_FORMATS, SUPPORTED_DOCUMENT_FORMATS, SUPPORTED_IMAGE_FORMATS } from '../../types';

// Create constants for ContentType values
const CONTENT_TYPE_VIDEO = 'video' as ContentType;
const CONTENT_TYPE_DOCUMENT = 'document' as ContentType;
const CONTENT_TYPE_IMAGE = 'image' as ContentType;
const CONTENT_TYPE_AUDIO = 'audio' as ContentType;
const CONTENT_TYPE_ARCHIVE = 'archive' as ContentType;

export class UploadApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // ============================================
  // TEMPORARY UPLOADS
  // ============================================

  async uploadTempFile(
    file: File,
    contentType: ContentType,
    metadata: {
      title: string;
      description?: string;
      tempId?: string;
    }
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('tempId', metadata.tempId || `temp-${Date.now()}`);
    
    if (metadata.description) {
      formData.append('description', metadata.description);
    }

    // Choose endpoint based on content type
    let endpoint = '';
    switch (contentType) {
      case CONTENT_TYPE_VIDEO:
        endpoint = `${this.baseUrl}/upload/temp/video`;
        break;
      case CONTENT_TYPE_DOCUMENT:
        endpoint = `${this.baseUrl}/upload/temp/document`;
        break;
      case CONTENT_TYPE_IMAGE:
        endpoint = `${this.baseUrl}/upload/temp/image`;
        break;
      case CONTENT_TYPE_AUDIO:
        endpoint = `${this.baseUrl}/upload/temp/audio`;
        break;
      case CONTENT_TYPE_ARCHIVE:
        endpoint = `${this.baseUrl}/upload/temp/archive`;
        break;
      default:
        endpoint = `${this.baseUrl}/upload/temp/batch`;
        formData.append('contentType', contentType);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // PERMANENT UPLOADS
  // ============================================

  async uploadPermanentFile(
    file: File,
    courseId: string,
    contentType: ContentType,
    metadata: {
      title: string;
      description?: string;
      lessonId?: string;
      order?: number;
    }
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('contentType', contentType);
    
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    if (metadata.lessonId) {
      formData.append('lessonId', metadata.lessonId);
    }
    if (metadata.order !== undefined) {
      formData.append('order', metadata.order.toString());
    }

    const response = await fetch(`${this.baseUrl}/upload/course/${courseId}/permanent`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // CONVERSION METHODS
  // ============================================

  async convertTempToPermanent(
    tempUploadId: string,
    courseId: string,
    lessonId?: string,
    order?: number
  ) {
    const response = await fetch(`${this.baseUrl}/upload/convert/${tempUploadId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId,
        lessonId,
        order,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Conversion failed: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // MANAGEMENT METHODS
  // ============================================

  async getMyTempUploads() {
    const response = await fetch(`${this.baseUrl}/upload/temp/my-uploads`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch temporary uploads');
    }

    return response.json();
  }

  async cleanupTempUploads() {
    const response = await fetch(`${this.baseUrl}/upload/temp/cleanup`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to cleanup temporary uploads');
    }

    return response.json();
  }

  async deleteTempUpload(tempUploadId: string) {
    const response = await fetch(`${this.baseUrl}/upload/temp/${tempUploadId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete temporary upload');
    }

    return response.json();
  }

  // ============================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================

  async uploadFile(
    file: File,
    fileName?: string,
    folderPath?: string
  ) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (fileName) {
      formData.append('fileName', fileName);
    }
    if (folderPath) {
      formData.append('folderPath', folderPath);
    }

    const response = await fetch(`${this.baseUrl}/upload/file`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    return response.json();
  }

  // ============================================
  // BATCH OPERATIONS
  // ============================================

  async uploadMultipleFiles(
    files: File[],
    contentType: ContentType,
    courseId?: string,
    lessonId?: string
  ) {
    const results = [];
    
    for (const file of files) {
      try {
        const metadata = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: `Uploaded ${contentType.toLowerCase()} file`,
          tempId: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        let result;
        if (courseId) {
          // Upload directly as permanent
          result = await this.uploadPermanentFile(file, courseId, contentType, {
            ...metadata,
            lessonId,
          });
        } else {
          // Upload as temporary
          result = await this.uploadTempFile(file, contentType, metadata);
        }

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