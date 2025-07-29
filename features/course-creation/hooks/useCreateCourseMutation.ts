import { useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";
import { CourseData } from "../types";

export function useCreateCourseMutation() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const client = useApolloClient();

  // Get all the store methods we need
  const {
    courseData,
    isSubmitting,
    isSaving,
    globalErrors,
    updateCourseData,
    setCurrentStep,
    saveDraft,
    submitCourse,
    publishCourse,
    loadDraft,
  } = useCourseCreationStore();

  const submitCourseHandler = async (courseDataParam: CourseData) => {
    try {
      // Update the store with the course data
      updateCourseData(courseDataParam);

      // Submit the course using the store
      await submitCourse();

      return { success: true };
    } catch (err) {
      console.error("Course creation error:", err);
      throw err;
    }
  };

  const saveDraftHandler = async (
    draftData: CourseData,
    currentStep: number = 0,
    completionScore: number = 0
  ) => {
    try {
      // Update the store with the draft data
      updateCourseData(draftData);
      setCurrentStep(currentStep);

      // Save the draft using the store
      await saveDraft();

      return { success: true };
    } catch (err) {
      console.error("Draft save error:", err);
      throw err;
    }
  };

  const publishCourseHandler = async (courseId: string) => {
    try {
      // Update the course data with the ID
      updateCourseData({
        ...courseData,
        id: courseId,
      });

      // Publish the course using the store
      await publishCourse();

      return { success: true };
    } catch (err) {
      console.error("Course publish error:", err);
      throw err;
    }
  };

  // Content creation methods (these can still use direct GraphQL calls for specific operations)
  const createTextContent = async (
    courseId: string,
    title: string,
    content: string,
    options?: {
      description?: string;
      lessonId?: string;
      order?: number;
    }
  ) => {
    try {
      const result = await client.mutate({
        mutation: require("../services/graphql/mutations").CREATE_TEXT_CONTENT,
        variables: {
          courseId,
          title,
          content,
          description: options?.description,
          lessonId: options?.lessonId,
          order: options?.order,
        },
      });

      return result.data.createTextContent;
    } catch (err) {
      console.error("Text content creation error:", err);
      throw err;
    }
  };

  const createAssignment = async (
    courseId: string,
    title: string,
    description: string,
    options?: {
      instructions?: string;
      dueDate?: string;
      points?: number;
      lessonId?: string;
      order?: number;
    }
  ) => {
    try {
      const result = await client.mutate({
        mutation: require("../services/graphql/mutations").CREATE_ASSIGNMENT,
        variables: {
          courseId,
          title,
          description,
          instructions: options?.instructions,
          dueDate: options?.dueDate,
          points: options?.points,
          lessonId: options?.lessonId,
          order: options?.order,
        },
      });

      return result.data.createAssignment;
    } catch (err) {
      console.error("Assignment creation error:", err);
      throw err;
    }
  };

  const createResourceLink = async (
    courseId: string,
    title: string,
    url: string,
    resourceType: string,
    options?: {
      description?: string;
      lessonId?: string;
      order?: number;
    }
  ) => {
    try {
      const result = await client.mutate({
        mutation: require("../services/graphql/mutations").CREATE_RESOURCE_LINK,
        variables: {
          courseId,
          title,
          url,
          resourceType,
          description: options?.description,
          lessonId: options?.lessonId,
          order: options?.order,
        },
      });

      return result.data.createResourceLink;
    } catch (err) {
      console.error("Resource link creation error:", err);
      throw err;
    }
  };

  // File upload function (calls REST API)
  const uploadFile = async (
    courseId: string,
    file: File,
    contentType: string,
    metadata: {
      title: string;
      description?: string;
      lessonId?: string;
      order?: number;
    }
  ) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", metadata.title);
      formData.append("contentType", contentType);

      if (metadata.description)
        formData.append("description", metadata.description);
      if (metadata.lessonId) formData.append("lessonId", metadata.lessonId);
      if (metadata.order !== undefined)
        formData.append("order", metadata.order.toString());

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          setIsUploading(false);
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          setIsUploading(false);
          reject(new Error("Upload failed"));
        });

        // Get the API base URL (adjust as needed)
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        xhr.open(
          "POST",
          `${apiBaseUrl}/upload/course/${courseId}/content/batch`
        );

        // Add authorization header if available
        const token = localStorage.getItem("authToken"); // Adjust based on your auth setup
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (err) {
      setIsUploading(false);
      console.error("File upload error:", err);
      throw err;
    }
  };

  const uploadCourseThumbnail = async (courseId: string, file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          setIsUploading(false);
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          setIsUploading(false);
          reject(new Error("Upload failed"));
        });

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        xhr.open("POST", `${apiBaseUrl}/upload/course/${courseId}/thumbnail`);

        const token = localStorage.getItem("authToken");
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (err) {
      setIsUploading(false);
      console.error("Thumbnail upload error:", err);
      throw err;
    }
  };

  return {
    submitCourse: submitCourseHandler,
    saveDraft: saveDraftHandler,
    publishCourse: publishCourseHandler,
    createTextContent,
    createAssignment,
    createResourceLink,
    uploadFile,
    uploadCourseThumbnail,
    loading: isSubmitting || isSaving || isUploading,
    error: globalErrors.length > 0 ? globalErrors[0] : null,
    data: courseData,
    draftData: courseData,
    refetchDraft: loadDraft,
    uploadProgress,
    isUploading,
  };
}
