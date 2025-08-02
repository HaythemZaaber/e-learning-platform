import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  SAVE_COURSE_DRAFT,
  CREATE_COURSE,
  PUBLISH_COURSE,
  DELETE_COURSE_DRAFT,
} from "./mutations";
import { GET_COURSE_DRAFT } from "./queries";
import { CourseData, CourseLevel, ContentType } from "../../types";
import { UploadApiService, UploadedFile } from "./uploadService";

export class CourseCreationService {
  private uploadService: UploadApiService;

  constructor(private client: ApolloClient<any>) {
    this.uploadService = new UploadApiService();
  }

  // ============================================
  // ENHANCED DRAFT MANAGEMENT WITH ORGANIZED CONTENT
  // ============================================

  async saveDraft(
    courseData: CourseData,
    currentStep: number,
    completionScore: number,
    organizedContent?: any
  ) {
    try {
      console.log("Saving draft with organized content:", organizedContent);

      // Include organized content data in draft
      const draftDataWithContent = {
        ...courseData,
        _contentByLecture: organizedContent?.contentByLecture || {},
        _organizedContent: organizedContent || {},
        _contentSummary: this.generateContentSummary(organizedContent?.contentByLecture || {}),
      };

      const result = await this.client.mutate({
        mutation: SAVE_COURSE_DRAFT,
        variables: {
          input: {
            draftData: draftDataWithContent,
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
      console.log("Loading draft with organized content...");
      const result = await this.client.query({
        query: GET_COURSE_DRAFT,
        fetchPolicy: "network-only",
      });

      const draftData = result.data?.getCourseDraft;

      if (draftData?.success && draftData.draftData) {
        // Extract organized content from draft data
        const { 
          _contentByLecture, 
          _organizedContent, 
          _contentSummary, 
          ...courseData 
        } = draftData.draftData;

        return {
          success: true,
          draftData: {
            ...courseData,
            _contentByLecture: _contentByLecture || {},
            _organizedContent: _organizedContent || {},
          },
          currentStep: draftData.currentStep || 0,
          draftId: draftData.draftData?.id || null,
          lastSaved: draftData.draftData?.updatedAt
            ? new Date(draftData.draftData.updatedAt)
            : null,
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
  // ENHANCED COURSE SUBMISSION WITH ORGANIZED CONTENT
  // ============================================

  async submitCourse(courseDataWithContent: any) {
    try {
      console.log("Submitting course with organized content...");
      console.log("Full course data with content:", courseDataWithContent);

      // Extract organized content
      const { organizedContent, ...courseData } = courseDataWithContent;
      console.log("Extracted course data:", courseData);
      console.log("Extracted organized content:", organizedContent);

      // Step 1: Transform course data to match GraphQL schema
      const transformedData = this.transformCourseDataForSubmission(courseData);
      console.log("Transformed data for submission:", transformedData);

      // Step 2: Enhance sections with content information
      if (organizedContent?.contentByLecture) {
        console.log("Enhancing sections with content information...");
        transformedData.sections = this.enhanceSectionsWithContent(
          transformedData.sections || [],
          organizedContent.contentByLecture
        );
        console.log("Enhanced sections with content:", transformedData.sections);
      } else {
        console.warn("No organized content found in course data");
      }

      // Step 3: Create the course with content information
      console.log("Sending to GraphQL mutation:", { input: transformedData });
      const result = await this.client.mutate({
        mutation: CREATE_COURSE,
        variables: { input: transformedData },
      });

      console.log("GraphQL mutation result:", result);

        const createdCourse = result.data.createCourse.course;
 

        return {
          success: true,
          course: createdCourse,
          message: result.data.createCourse.message,
          errors: result.data.createCourse.errors || [],
        
        };

    } catch (error) {
      console.error("Failed to submit course:", error);
      throw error;
    }
  }

  // ============================================
  // SECTION ENHANCEMENT WITH CONTENT MAPPING
  // ============================================

  private enhanceSectionsWithContent(sections: any[], contentByLecture: any) {
    return sections.map(section => ({
      ...section,
      lectures: section.lectures?.map((lecture: any) => {
        const lectureContent = contentByLecture[lecture.id];
        const hasContent = lectureContent && Object.values(lectureContent).some(
          (items: any) => Array.isArray(items) && items.length > 0
        );

        // Get the single content item for this lecture and format it properly
        const contentItem = lectureContent ? this.formatContentItemForSubmission(lectureContent) : undefined;

        return {
          id: lecture.id,
          title: lecture.title,
          description: lecture.description || undefined,
          status: lecture.status || "draft",
          type: this.mapLectureTypeToEnum(lecture.type),
          duration: lecture.duration || 0,
          content: lecture.content || undefined,
          contentItem, // Formatted ContentItemInput for the lecture
          settings: lecture.settings || undefined,
        };
      }) || [],
    }));
  }

  private formatContentItemForSubmission(lectureContent: any): any | undefined {
    // Find the first content item of any type
    for (const [type, items] of Object.entries(lectureContent)) {
      if (Array.isArray(items) && items.length > 0) {
        const item = items[0];
        
        // Format the content item according to ContentItemInput structure
        const formattedItem = {
          title: item.title || item.name || 'Untitled',
          description: item.description || undefined,
          type: this.mapContentTypeToEnum(type),
          fileUrl: item.url || item.fileUrl || undefined,
          fileName: item.name || item.fileName || undefined,
          fileSize: item.size || item.fileSize || undefined,
          mimeType: item.type || item.mimeType || undefined,
          contentData: this.formatContentData(item, type),
          order: 0, // Single content item, so order is 0
        };

        return formattedItem;
      }
    }
    return undefined;
  }

  private mapContentTypeToEnum(contentType: string): string {
    // Map frontend content types to GraphQL enum values
    const typeMapping: Record<string, string> = {
      'videos': 'VIDEO',
      'documents': 'DOCUMENT',
      'images': 'IMAGE',
      'audio': 'AUDIO',
      'archives': 'ARCHIVE',
      'text': 'TEXT',
      'assignments': 'ASSIGNMENT',
      'resources': 'RESOURCE',
      'quizzes': 'QUIZ',
    };

    return typeMapping[contentType] || 'TEXT';
  }

  private mapLectureTypeToEnum(lectureType: string): string {
    // Map lecture types to LessonType enum values
    const typeMapping: Record<string, string> = {
      'video': 'VIDEO',
      'text': 'TEXT',
      'quiz': 'QUIZ',
      'assignment': 'ASSIGNMENT',
      'resource': 'RESOURCE',
    };

    return typeMapping[lectureType.toLowerCase()] || 'TEXT';
  }

  private formatContentData(item: any, contentType: string): any {
    // Format content data based on content type
    switch (contentType) {
      case 'text':
        return {
          content: item.content,
          richText: item.richText || false,
        };
      
      case 'assignments':
        return {
          instructions: item.instructions,
          dueDate: item.dueDate,
          points: item.points,
          submissionType: item.submissionType || 'file',
        };
      
      case 'resources':
        return {
          url: item.url,
          resourceType: item.resourceType,
          externalLink: item.externalLink || false,
        };
      
      case 'quizzes':
        return {
          questions: item.questions || [],
          timeLimit: item.timeLimit,
          attempts: item.attempts,
          passingScore: item.passingScore,
        };
      
      case 'videos':
      case 'documents':
      case 'images':
      case 'audio':
      case 'archives':
        return {
          originalName: item.name,
          uploadedAt: item.uploadedAt,
          status: item.status,
        };
      
      default:
        return item;
    }
  }

  private generateLectureContentSummary(lectureContent: any) {
    if (!lectureContent) return { totalItems: 0, types: [] };

    const summary = {
      totalItems: 0,
      types: [] as string[],
      breakdown: {} as Record<string, number>,
    };

    Object.entries(lectureContent).forEach(([type, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        summary.totalItems += items.length;
        summary.types.push(type);
        summary.breakdown[type] = items.length;
      }
    });

    return summary;
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
  // DRAFT DELETION
  // ============================================

  async deleteDraft() {
    try {
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
  // DIRECT FILE UPLOAD METHODS
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
    try {
      console.log(`Uploading ${contentType} file:`, file.name);
      
      const result = await this.uploadService.uploadFile(
        file,
        contentType,
        metadata,
        authToken
      );

      console.log("File uploaded successfully:", result);
      return result;

    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }

  async deleteFile(filePath: string, authToken?: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Deleting file: ${filePath}`);
      
      const result = await this.uploadService.deleteFile(filePath, authToken);
      
      console.log("File deleted successfully:", result);
      return result;

    } catch (error) {
      console.error("Failed to delete file:", error);
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
  // THUMBNAIL MANAGEMENT
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
    try {
      const result = await this.uploadService.uploadThumbnail(file, courseId, metadata, authToken);
      return result;
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
      throw error;
    }
  }

  async deleteThumbnail(courseId: string, authToken?: string) {
    try {
      const result = await this.uploadService.deleteThumbnail(courseId, authToken);
      return result;
    } catch (error) {
      console.error("Failed to delete thumbnail:", error);
      throw error;
    }
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
    try {
      console.log(`Batch uploading ${files.length} files...`);
      
      const results = await this.uploadService.uploadMultipleFiles(
        files,
        contentType,
        metadata,
        authToken
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

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
    console.log("courseDataFor Submission", courseData);
    
    // Handle price based on enrollment type
    let price = courseData.price || 0;
    let originalPrice = courseData.originalPrice || 0;
    
    // If enrollment type is FREE, force price to 0
    if (courseData.settings?.enrollmentType === "FREE") {
      price = 0;
      originalPrice = 0;
    }
    
    const transformedData = {
      title: courseData.title,
      description: courseData.description,
      shortDescription: courseData.shortDescription || "",
      category: courseData.category,
      level: courseData.level.toUpperCase() as Uppercase<CourseLevel>,
      thumbnail: courseData.thumbnail && courseData.thumbnail.trim() ? courseData.thumbnail : null,
      trailer: courseData.trailer && courseData.trailer.trim() ? courseData.trailer : null,
      price: price,
      originalPrice: originalPrice,
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
          description: lecture.description || undefined,
          status: lecture.status || "draft",
          type: this.mapLectureTypeToEnum(lecture.type),
          duration: lecture.duration || 0,
          content: lecture.content || undefined,
          contentItem: lecture.contentItem || undefined,
          settings: lecture.settings || undefined,
        })),
      })),
      settings: courseData.settings || {},
      additionalContent: courseData.additionalContent || [],
    };
    
    console.log("Transformed data thumbnail:", transformedData.thumbnail);
    console.log("Transformed data trailer:", transformedData.trailer);
    console.log("Full transformed data:", transformedData);
    
    return transformedData;
  }

  private generateContentSummary(contentByLecture: any) {
    const summary = {
      totalLectures: Object.keys(contentByLecture).length,
      totalContent: 0,
      contentTypes: {} as Record<string, number>,
      lectureBreakdown: {} as Record<string, any>,
    };

    Object.entries(contentByLecture).forEach(([lectureId, content]) => {
      let lectureTotal = 0;
      const lectureBreakdown: Record<string, number> = {};

      Object.entries(content as any).forEach(([type, items]) => {
        if (Array.isArray(items)) {
          const count = items.length;
          lectureTotal += count;
          summary.totalContent += count;
          
          summary.contentTypes[type] = (summary.contentTypes[type] || 0) + count;
          lectureBreakdown[type] = count;
        }
      });

      summary.lectureBreakdown[lectureId] = {
        total: lectureTotal,
        breakdown: lectureBreakdown,
      };
    });

    return summary;
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
  // VALIDATION HELPERS
  // ============================================

  validateCourseStructure(courseData: CourseData) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!courseData.title?.trim()) {
      errors.push("Course title is required");
    }

    if (!courseData.description?.trim()) {
      errors.push("Course description is required");
    }

    // Structure validation
    if (!courseData.sections || courseData.sections.length === 0) {
      errors.push("At least one section is required");
    } else {
      const totalLectures = courseData.sections.reduce(
        (total, section) => total + (section.lectures?.length || 0),
        0
      );
      
      if (totalLectures === 0) {
        errors.push("At least one lecture is required");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateContentCompleteness(contentByLecture: any) {
    const warnings: string[] = [];
    let totalContent = 0;

    Object.entries(contentByLecture).forEach(([lectureId, content]) => {
      const lectureContentCount = Object.values(content as any).reduce(
        (total: number, items: any) => total + (Array.isArray(items) ? items.length : 0),
        0
      );

      totalContent += lectureContentCount;

      if (lectureContentCount === 0) {
        warnings.push(`Lecture ${lectureId} has no content`);
      }
    });

    if (totalContent === 0) {
      warnings.push("No content has been added to any lecture");
    }

    return {
      totalContent,
      warnings,
    };
  }
}