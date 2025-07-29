import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  SAVE_COURSE_DRAFT,
  CREATE_COURSE,
  PUBLISH_COURSE,
  DELETE_COURSE_DRAFT,
} from "./mutations";
import { GET_COURSE_DRAFT } from "./queries";
import { CourseData, CourseLevel } from "../../types";

export class CourseCreationService {
  constructor(private client: ApolloClient<any>) {}

  async saveDraft(
    courseData: CourseData,
    currentStep: number,
    completionScore: number
  ) {
    try {
      const result = await this.client.mutate({
        mutation: SAVE_COURSE_DRAFT,
        variables: {
          input: {
            draftData: courseData,
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
        console.log("sending");
      const result = await this.client.query({
        query: GET_COURSE_DRAFT,
        fetchPolicy: "network-only", // Don't use cache for drafts
      });

      const draftData = result.data?.getCourseDraft;

      if (draftData?.success && draftData.draftData) {
        return {
          success: true,
          draftData: draftData.draftData,
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

  async submitCourse(courseData: CourseData) {
    try {
      // Transform course data to match GraphQL schema
      const transformedData = {
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

      const result = await this.client.mutate({
        mutation: CREATE_COURSE,
        variables: { input: transformedData },
      });

      if (result.data?.createCourse?.success) {
        return {
          success: true,
          course: result.data.createCourse.course,
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
}
