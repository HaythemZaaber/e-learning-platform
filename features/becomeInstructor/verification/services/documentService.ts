// ============================================================================
// DOCUMENT UPLOAD SERVICE FOR NESTJS BACKEND INTEGRATION
// ============================================================================

export interface DocumentUploadRequest {
  verificationId: string;
  documentType: 'identity' | 'education' | 'professional' | 'employment' | 'profile' | 'video' | 'demo';
  file: File;
  metadata?: {
    originalName: string;
    fileSize: number;
    mimeType: string;
    checksum?: string;
    description?: string;
    uploadedAt: string;
  };
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadDate: string;
    verificationStatus: 'pending' | 'verified' | 'failed';
    aiAnalysis?: {
      confidence: number;
      extractedText?: string;
      validationChecks: Record<string, boolean>;
      issues?: string[];
      suggestions?: string[];
    };
  };
  errors?: string[];
  uploadProgress?: number;
}

export interface DocumentVerificationRequest {
  documentId: string;
  verificationId: string;
  aiAnalysis?: {
    confidence: number;
    extractedText?: string;
    validationChecks: Record<string, boolean>;
    issues?: string[];
    suggestions?: string[];
  };
}

export class DocumentService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  private static apiVersion = 'v1';

  // ============================================================================
  // DOCUMENT UPLOAD OPERATIONS
  // ============================================================================

  /**
   * Upload document with progress tracking
   */
  static async uploadDocument(
    verificationId: string, 
    documentType: string, 
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<DocumentUploadResponse> {
    try {
      // Validate file before upload
      const validation = this.validateFile(file, documentType);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'File validation failed',
          errors: [validation.error || 'Invalid file'],
        };
      }

      const formData = new FormData();
      formData.append('verificationId', verificationId);
      formData.append('documentType', documentType);
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      }));

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${this.baseUrl}/api/${this.apiVersion}/verification/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${this.getAuthToken()}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        message: 'Failed to upload document',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(verificationId: string, documentId: string): Promise<DocumentUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/verification/document`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ verificationId, documentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        message: 'Failed to delete document',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Update document verification status
   */
  static async updateDocumentVerification(
    verificationId: string, 
    documentId: string, 
    status: 'pending' | 'verified' | 'failed',
    aiAnalysis?: any
  ): Promise<DocumentUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/verification/document/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          verificationId,
          documentId,
          status,
          aiAnalysis,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating document verification:', error);
      return {
        success: false,
        message: 'Failed to update document verification',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get document requirements by country
   */
  static async getDocumentRequirements(country: string): Promise<{
    success: boolean;
    requirements: Array<{
      type: string;
      required: boolean;
      description: string;
      acceptedFormats: string[];
      maxSize: number;
      examples?: string[];
    }>;
    errors?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${this.apiVersion}/verification/requirements?country=${country}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting document requirements:', error);
      return {
        success: false,
        requirements: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // ============================================================================
  // FILE VALIDATION
  // ============================================================================

  /**
   * Validate file before upload
   */
  static validateFile(file: File, documentType: string): { isValid: boolean; error?: string } {
    // Check file size
    const maxSize = this.getMaxFileSize(documentType);
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size too large. Maximum size is ${this.formatFileSize(maxSize)}`,
      };
    }

    // Check file type
    const allowedTypes = this.getAllowedFileTypes(documentType);
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File is empty. Please select a valid file.',
      };
    }

    return { isValid: true };
  }

  /**
   * Get maximum file size for document type
   */
  private static getMaxFileSize(documentType: string): number {
    const maxSizes: Record<string, number> = {
      identity: 10 * 1024 * 1024, // 10MB
      education: 25 * 1024 * 1024, // 25MB
      professional: 25 * 1024 * 1024, // 25MB
      employment: 25 * 1024 * 1024, // 25MB
      profile: 5 * 1024 * 1024, // 5MB
      video: 100 * 1024 * 1024, // 100MB
      demo: 100 * 1024 * 1024, // 100MB
    };

    return maxSizes[documentType] || 10 * 1024 * 1024; // Default 10MB
  }

  /**
   * Get allowed file types for document type
   */
  private static getAllowedFileTypes(documentType: string): string[] {
    const allowedTypes: Record<string, string[]> = {
      identity: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      education: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      professional: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      employment: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      profile: ['image/jpeg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
      demo: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
    };

    return allowedTypes[documentType] || ['image/jpeg', 'image/png', 'application/pdf'];
  }

  /**
   * Format file size for display
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ============================================================================
  // AI ANALYSIS SIMULATION
  // ============================================================================

  /**
   * Simulate AI analysis for document verification
   */
  static async simulateAIAnalysis(file: File, documentType: string): Promise<{
    confidence: number;
    extractedText?: string;
    validationChecks: Record<string, boolean>;
    issues?: string[];
    suggestions?: string[];
  }> {
    return new Promise((resolve) => {
      // Simulate AI processing time
      setTimeout(() => {
        const analysis = {
          confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
          extractedText: documentType === 'identity' ? 'Sample extracted text from document' : undefined,
          documentType: documentType,
          validationChecks: {
            textClarity: Math.random() > 0.1,
            faceVisible: file.type.startsWith('image/') ? Math.random() > 0.2 : true,
            documentIntegrity: Math.random() > 0.1,
            expirationDate: Math.random() > 0.3,
            properLighting: file.type.startsWith('image/') ? Math.random() > 0.2 : true,
            noBlur: Math.random() > 0.15,
          },
          issues: [] as string[],
          suggestions: [] as string[],
        };

        // Add issues based on failed checks
        Object.entries(analysis.validationChecks).forEach(([check, passed]) => {
          if (!passed) {
            analysis.issues?.push(`${check.replace(/([A-Z])/g, ' $1').trim()}`);
          }
        });

        // Add suggestions for improvement
        if (analysis.confidence < 90) {
          analysis.suggestions?.push('Consider retaking the photo with better lighting');
          analysis.suggestions?.push('Ensure the document is fully visible and flat');
        }

        resolve(analysis);
      }, 2000 + Math.random() * 1000); // 2-3 seconds
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get authentication token
   */
  private static getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Generate file checksum (simplified)
   */
  static async generateChecksum(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        let hash = 0;
        for (let i = 0; i < uint8Array.length; i++) {
          hash = ((hash << 5) - hash) + uint8Array[i];
          hash = hash & hash; // Convert to 32-bit integer
        }
        resolve(hash.toString(16));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Create document preview URL
   */
  static createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to create preview'));
      };
      reader.readAsDataURL(file);
    });
  }
}

// ============================================================================
// REACT HOOK FOR DOCUMENT SERVICE
// ============================================================================

export const useDocumentService = () => {
  return {
    uploadDocument: DocumentService.uploadDocument,
    deleteDocument: DocumentService.deleteDocument,
    updateDocumentVerification: DocumentService.updateDocumentVerification,
    getDocumentRequirements: DocumentService.getDocumentRequirements,
    validateFile: DocumentService.validateFile,
    simulateAIAnalysis: DocumentService.simulateAIAnalysis,
    generateChecksum: DocumentService.generateChecksum,
    createPreviewUrl: DocumentService.createPreviewUrl,
  };
};
