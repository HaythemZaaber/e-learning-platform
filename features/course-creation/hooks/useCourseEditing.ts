"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import { GET_COURSE_BY_ID } from "../../courses/services/graphql/courseQueries";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";
import { toast } from "sonner";

export const useCourseEditing = () => {
  const searchParams = useSearchParams();
  const client = useApolloClient();
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);

  const {
    courseData,
    updateCourseData,
    reset,
    setCurrentStep,
  } = useCourseCreationStore();

  // Check URL parameters for edit or duplicate mode
  useEffect(() => {
    const editParam = searchParams.get("edit");
    const courseIdParam = searchParams.get("courseId");
    const duplicateParam = searchParams.get("duplicate");

    if (editParam) {
      setIsEditMode(true);
      setCourseId(editParam);
      loadCourseForEditing(editParam);
    } else if (courseIdParam) {
      setIsEditMode(true);
      setCourseId(courseIdParam);
      loadCourseForEditing(courseIdParam);
    } else if (duplicateParam === "true") {
      setIsDuplicateMode(true);
      loadCourseForDuplication();
    }
  }, [searchParams]);

  // Load course data for editing
  const loadCourseForEditing = async (id: string) => {
    setIsLoadingCourse(true);
    try {
      const { data } = await client.query({
        query: GET_COURSE_BY_ID,
        variables: { courseId: id },
        fetchPolicy: "network-only",
      });

      if (data.getCourse) {
        // Transform the course data to match the store structure
        const transformedData = transformCourseDataForStore(data.getCourse);
        updateCourseData(transformedData);
        toast.success("Course loaded for editing");
      } else {
        toast.error("Course not found");
      }
    } catch (error) {
      console.error("Error loading course for editing:", error);
      toast.error("Failed to load course for editing");
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Load course data for duplication
  const loadCourseForDuplication = () => {
    setIsLoadingCourse(true);
    try {
      const storedCourseData = localStorage.getItem("courseToDuplicate");
      if (storedCourseData) {
        const courseData = JSON.parse(storedCourseData);
        const transformedData = transformCourseDataForStore(courseData);
        
        // Remove the ID to create a new course
        delete transformedData.id;
        
        // Update title to indicate it's a copy
        if (transformedData.title) {
          transformedData.title = `${transformedData.title} (Copy)`;
        }

        updateCourseData(transformedData);
        localStorage.removeItem("courseToDuplicate");
        toast.success("Course loaded for duplication");
      } else {
        toast.error("No course data found for duplication");
      }
    } catch (error) {
      console.error("Error loading course for duplication:", error);
      toast.error("Failed to load course for duplication");
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Transform GraphQL course data to match store structure
  const transformCourseDataForStore = (course: any) => {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      status: course.status,
      objectives: course.objectives || [],
      prerequisites: course.prerequisites || [],
      requirements: course.requirements || [],
      whatYoullLearn: course.whatYoullLearn || [],
      targetAudience: course.targetAudience || [],
      language: course.language || "English",
      hasSubtitles: course.hasSubtitles || false,
      subtitleLanguages: course.subtitleLanguages || [],
      hasCertificate: course.hasCertificate || false,
      hasLifetimeAccess: course.hasLifetimeAccess || true,
      hasMobileAccess: course.hasMobileAccess || true,
      downloadableResources: course.downloadableResources || 0,
      codingExercises: course.codingExercises || 0,
      articles: course.articles || 0,
      quizzes: course.quizzes || 0,
      assignments: course.assignments || 0,
      sections: course.sections?.map((section: any, index: number) => ({
        id: section.id,
        title: section.title,
        description: section.description || "",
        order: section.order || index,
        lectures: section.lectures?.map((lecture: any, lectureIndex: number) => ({
          id: lecture.id,
          title: lecture.title,
          description: lecture.description || "",
          type: lecture.type,
          duration: lecture.duration,
          content: lecture.content || "",
          status: lecture.status || "draft",
          videoUrl: lecture.videoUrl,
          articleContent: lecture.articleContent,
          resources: lecture.resources || [],
          quiz: lecture.quiz || null,
          order: lectureIndex,
        })) || [],
      })) || [],
      settings: course.settings || {
        isPublic: false,
        enrollmentType: "free",
        language: "English",
        certificate: false,
        seoDescription: "",
        seoTags: [],
        accessibility: {
          captions: false,
          transcripts: false,
          audioDescription: false,
        },
      },
    };
  };

  // Reset to create new course
  const resetToNewCourse = () => {
    reset();
    setIsEditMode(false);
    setIsDuplicateMode(false);
    setCourseId(null);
    setCurrentStep(0); // Use number instead of string
  };

  return {
    isEditMode,
    isDuplicateMode,
    isLoadingCourse,
    courseId,
    resetToNewCourse,
  };
}; 