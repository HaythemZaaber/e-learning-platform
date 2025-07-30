import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  SAVE_COURSE_DRAFT,
  CREATE_COURSE,
  PUBLISH_COURSE,
  DELETE_COURSE_DRAFT,
} from "./mutations";
import { GET_COURSE_DRAFT } from "./queries";
import { CourseData, CourseLevel, ContentType } from "../../types";
import { TempUploadedFile } from "../../../../stores/courseCreation.store";
import { UploadApiService } from "./uploadService";

export class CourseCreationService {
  private uploadService: UploadApiService;

  constructor(private client: ApolloClient<any>) {
    this.uploadService = new UploadApiService();
  }

  // ============================================
  // DRAFT MANAGEMENT WITH UPLOAD INTEGRATION
  // ============================================

  async saveDraft(
    courseData: CourseData,
    currentStep: number,
    completionScore: number,
    tempUploads?: TempUploadedFile[]
  ) {
    try {
      // Include temporary upload information in draft data
      const draftDataWithUploads = {
        ...courseData,
        _tempUploads: tempUploads || [], // Store temp upload metadata
        _uploadSummary: this.generateUploadSummary(tempUploads || []),
      };

      const result = await this.client.mutate({
        mutation: SAVE_COURSE_DRAFT,
        variables: {
          input: {
            draftData: draftDataWithUploads,
            currentStep,
            completionScore,
          },
        },
      });

      if (result.data?.saveCourseDraft?.success) {
        return {
          success: true,
          draftId: result.data.saveCourseDraft.draftData?.id || null,
          message: result.data.saveCourseDraft.message,
        };
      } else {
        throw new Error(
          result.data?.saveCourseDraft?.message || "Failed to save draft"
        );
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      throw error;
    }
  }

  async loadDraft() {
    try {
      console.log("Loading draft with upload data...");
      const result = await this.client.query({
        query: GET_COURSE_DRAFT,
        fetchPolicy: "network-only", // Don't use cache for drafts
      });

      const draftData = result.data?.getCourseDraft;

      if (draftData?.success && draftData.draftData) {
        // Extract temp uploads from draft data
        const { _tempUploads, _uploadSummary, ...courseData } = draftData.draftData;

        return {
          success: true,
          draftData: courseData,
          currentStep: draftData.currentStep || 0,
          draftId: draftData.draftData?.id || null,
          lastSaved: draftData.draftData?.updatedAt
            ? new Date(draftData.draftData.updatedAt)
            : null,
          tempUploads: _tempUploads || [],
          uploadSummary: _uploadSummary || {},
        };
      } else {
        throw new Error("No draft found");
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
      throw error;
    }
  }

  // ============================================
  // COURSE SUBMISSION WITH FILE CONVERSION
  // ============================================

  async submitCourse(courseData: CourseData, tempUploadedFiles?: any) {
    try {
      console.log("Submitting course with temp uploads...");

      // Step 1: Transform course data to match GraphQL schema
      const transformedData = this.transformCourseDataForSubmission(courseData);

      // Step 2: Create the course first
      const result = await this.client.mutate({
        mutation: CREATE_COURSE,
        variables: { input: transformedData },
      });

      if (result.data?.createCourse?.success) {
        const createdCourse = result.data.createCourse.course;
        
        console.log("Course created successfully, ID:", createdCourse.id);

        // Step 3: Convert temporary uploads to permanent (handled by backend)
        // The backend will automatically convert temp uploads during course creation
        
        // Step 4: Clean up temporary uploads on frontend
        if (tempUploadedFiles) {
          await this.cleanupTempUploadsAfterSubmission();
        }

        return {
          success: true,
          course: createdCourse,
          message: result.data.createCourse.message,
          errors: result.data.createCourse.errors || [],
          warnings: result.data.createCourse.warnings || [],
        };

      } else {
        const errors = result.data?.createCourse?.errors || [];
        const warnings = result.data?.createCourse?.warnings || [];

        return {
          success: false,
          message:
            result.data?.createCourse?.message || "Failed to create course",
          errors,
          warnings,
        };
      }
    } catch (error) {
      console.error("Failed to submit course:", error);
      throw error;
    }
  }

  // ============================================
  // COURSE PUBLISHING
  // ============================================

  async publishCourse(courseId: string) {
    try {
      const result = await this.client.mutate({
        mutation: PUBLISH_COURSE,
        variables: { courseId },
      });

      if (result.data?.publishCourse?.success) {
        return {
          success: true,
          course: result.data.publishCourse.course,
          message: result.data.publishCourse.message,
          errors: result.data.publishCourse.errors || [],
          warnings: result.data.publishCourse.warnings || [],
        };
      } else {
        const errors = result.data?.publishCourse?.errors || [];
        const warnings = result.data?.publishCourse?.warnings || [];

        return {
          success: false,
          message:
            result.data?.publishCourse?.message || "Failed to publish course",
          errors,
          warnings,
        };
      }
    } catch (error) {
      console.error("Failed to publish course:", error);
      throw error;
    }
  }

  // ============================================
  // DRAFT DELETION WITH CLEANUP
  // ============================================

  async deleteDraft() {
    try {
      // Clean up temporary uploads first
      await this.cleanupTempUploadsAfterSubmission();

      // Then delete the draft
      const result = await this.client.mutate({
        mutation: DELETE_COURSE_DRAFT,
      });

      return {
        success: result.data?.deleteCourseDraft?.success || false,
        message:
          result.data?.deleteCourseDraft?.message || "Failed to delete draft",
      };
    } catch (error) {
      console.error("Failed to delete draft:", error);
      throw error;
    }
  }

  // ============================================
  // FILE UPLOAD INTEGRATION METHODS
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
    try {
      console.log(`Uploading temporary ${contentType} file:`, file.name);
      
      const result = await this.uploadService.uploadTempFile(
        file,
        contentType,
        metadata
      );

      console.log("Temp file uploaded successfully:", result);
      return result;

    } catch (error) {
      console.error("Failed to upload temporary file:", error);
      throw error;
    }
  }

  async convertTempToPermanent(
    tempUploadId: string,
    courseId: string,
    lessonId?: string
  ) {
    try {
      console.log(`Converting temp upload ${tempUploadId} to permanent...`);
      
      const result = await this.uploadService.convertTempToPermanent(
        tempUploadId,
        courseId,
        lessonId
      );

      console.log("Temp upload converted successfully:", result);
      return result;

    } catch (error) {
      console.error("Failed to convert temp upload:", error);
      throw error;
    }
  }

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
    try {
      console.log(`Uploading permanent ${contentType} file to course ${courseId}:`, file.name);
      
      const result = await this.uploadService.uploadPermanentFile(
        file,
        courseId,
        contentType,
        metadata
      );

      console.log("Permanent file uploaded successfully:", result);
      return result;

    } catch (error) {
      console.error("Failed to upload permanent file:", error);
      throw error;
    }
  }

  // ============================================
  // CONTENT CREATION METHODS
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
    try {
      const result = await this.uploadService.createTextContent(
        courseId,
        lessonId,
        data
      );

      return result;
    } catch (error) {
      console.error("Failed to create text content:", error);
      throw error;
    }
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
    try {
      const result = await this.uploadService.createAssignment(
        courseId,
        lessonId,
        data
      );

      return result;
    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw error;
    }
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
    try {
      const result = await this.uploadService.createResourceLink(
        courseId,
        lessonId,
        data
      );

      return result;
    } catch (error) {
      console.error("Failed to create resource link:", error);
      throw error;
    }
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
    try {
      console.log(`Batch uploading ${files.length} files...`);
      
      const results = await this.uploadService.uploadMultipleFiles(
        files,
        contentType,
        courseId,
        lessonId
      );

      const successful = results.filter((r: any) => r.success).length;
      const failed = results.filter((r: any) => !r.success).length;

      console.log(`Batch upload completed: ${successful} successful, ${failed} failed`);
      return results;

    } catch (error) {
      console.error("Failed to batch upload files:", error);
      throw error;
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  private transformCourseDataForSubmission(courseData: CourseData) {
    return {
      title: courseData.title,
      description: courseData.description,
      shortDescription: courseData.shortDescription || "",
      category: courseData.category,
      level: courseData.level.toUpperCase() as Uppercase<CourseLevel>,
      thumbnail: courseData.thumbnail || "",
      trailer: courseData.trailer || "",
      price: courseData.price || 0,
      originalPrice: courseData.originalPrice || 0,
      currency: courseData.currency || "USD",
      objectives: courseData.objectives.filter((obj: string) => obj.trim()),
      prerequisites: courseData.prerequisites.filter((req: string) =>
        req.trim()
      ),
      whatYouLearn:
        courseData.whatYouLearn?.filter((item: string) => item.trim()) || [],
      seoTags: courseData.seoTags || [],
      marketingTags: courseData.marketingTags || [],
      sections: courseData.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        description: section.description || "",
        lectures: section.lectures.map((lecture: any) => ({
          id: lecture.id,
          title: lecture.title,
          description: lecture.description || "",
          type: lecture.type.toUpperCase(),
          duration: lecture.duration || 0,
          content: lecture.content || "",
          contentItems: lecture.contentItems || [],
          settings: lecture.settings || {},
          status: lecture.status || "draft",
        })),
      })),
      settings: courseData.settings || {},
      additionalContent: courseData.additionalContent || [],
    };
  }

  private generateUploadSummary(tempUploads: TempUploadedFile[]) {
    const summary = {
      totalFiles: tempUploads.length,
      totalSize: tempUploads.reduce((sum, file) => sum + file.size, 0),
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };

    tempUploads.forEach(file => {
      // Count by content type
      summary.byType[file.contentType] = (summary.byType[file.contentType] || 0) + 1;
      
      // Count by status
      summary.byStatus[file.status] = (summary.byStatus[file.status] || 0) + 1;
    });

    return summary;
  }

  private async cleanupTempUploadsAfterSubmission() {
    try {
      console.log("Cleaning up temporary uploads...");
      await this.uploadService.cleanupTempUploads();
      console.log("Temporary uploads cleaned up successfully");
    } catch (error) {
      console.error("Failed to cleanup temporary uploads:", error);
      // Don't throw error here as it's not critical
    }
  }

  // ============================================
  // FILE VALIDATION HELPER
  // ============================================

  validateFile(
    file: File,
    contentType: ContentType,
    maxSize?: number
  ): { isValid: boolean; error?: string } {
    return this.uploadService.validateFile(file, contentType, maxSize);
  }

  formatFileSize(bytes: number): string {
    return this.uploadService.formatFileSize(bytes);
  }

  // ============================================
  // TEMP UPLOAD MANAGEMENT
  // ============================================

  async getMyTempUploads() {
    try {
      const result = await this.uploadService.getMyTempUploads();
      return result;
    } catch (error) {
      console.error("Failed to get temp uploads:", error);
      throw error;
    }
  }

  async deleteTempUpload(tempUploadId: string) {
    try {
      const result = await this.uploadService.deleteTempUpload(tempUploadId);
      return result;
    } catch (error) {
      console.error("Failed to delete temp upload:", error);
      throw error;
    }
  }

  // ============================================
  // PROGRESS TRACKING HELPERS
  // ============================================

  onUploadProgress(callback: (fileId: string, progress: number) => void) {
    // This would be implemented with WebSocket or polling
    // For now, it's a placeholder for future implementation
    console.log("Upload progress tracking not yet implemented");
  }

  onUploadComplete(callback: (fileId: string, result: any) => void) {
    // This would be implemented with WebSocket or polling
    // For now, it's a placeholder for future implementation
    console.log("Upload completion tracking not yet implemented");
  }

  // ============================================
  // ERROR HANDLING HELPERS
  // ============================================

  private handleUploadError(error: any, fileName: string) {
    console.error(`Upload error for ${fileName}:`, error);
    
    // Categorize errors for better user feedback
    if (error.message?.includes('size')) {
      return `File ${fileName} is too large. Please choose a smaller file.`;
    } else if (error.message?.includes('type')) {
      return `File ${fileName} has an unsupported format.`;
    } else if (error.message?.includes('network')) {
      return `Network error uploading ${fileName}. Please check your connection.`;
    } else {
      return `Failed to upload ${fileName}. Please try again.`;
    }
  }

  // ============================================
  // ADVANCED FEATURES (for future implementation)
  // ============================================

  async resumeUpload(fileId: string) {
    // Placeholder for resumable upload implementation
    console.log("Resume upload not yet implemented for file:", fileId);
  }

  async pauseUpload(fileId: string) {
    // Placeholder for pausable upload implementation
    console.log("Pause upload not yet implemented for file:", fileId);
  }

  async cancelUpload(fileId: string) {
    // Placeholder for cancellable upload implementation
    console.log("Cancel upload not yet implemented for file:", fileId);
  }
}