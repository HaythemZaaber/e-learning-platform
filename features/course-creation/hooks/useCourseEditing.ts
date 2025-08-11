"use client";

import { useEffect, useState, useRef } from "react";
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
  const lastProcessedParamsRef = useRef<string>("");
  const hasLoadedCourseRef = useRef(false);

  const {
    courseData,
    updateCourseData,
    reset,
    setCurrentStep,
    setContentByLecture,
  } = useCourseCreationStore();

  // Check URL parameters for edit or duplicate mode
  useEffect(() => {
    const editParam = searchParams.get("edit");
    const courseIdParam = searchParams.get("courseId");
    const duplicateParam = searchParams.get("duplicate");

    // Create a unique key for current parameters
    const currentParams = `${editParam || ''}-${courseIdParam || ''}-${duplicateParam || ''}`;
    
    // Skip if we've already processed these exact parameters
    if (lastProcessedParamsRef.current === currentParams) {
      return;
    }

    // Reset the ref when parameters change
    hasLoadedCourseRef.current = false;
    lastProcessedParamsRef.current = currentParams;

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
  }, [searchParams.get("edit"), searchParams.get("courseId"), searchParams.get("duplicate")]);

  // Load course data for editing
  const loadCourseForEditing = async (id: string) => {
    if (hasLoadedCourseRef.current) return; // Prevent duplicate calls
    
    setIsLoadingCourse(true);
    try {
      const { data } = await client.query({
        query: GET_COURSE_BY_ID,
        variables: { courseId: id },
        fetchPolicy: "network-only",
      });

      if (data.getCourse) {
        console.log("Raw course data from GraphQL:", data.getCourse);
        console.log("Enrollment type from backend:", data.getCourse.enrollmentType);
        
        // Transform the course data to match the store structure
        const transformedData = transformCourseDataForStore(data.getCourse);
        console.log("Transformed course data:", transformedData);
        
        // Extract contentByLecture from transformed data
        const { _contentByLecture, ...courseData } = transformedData;
        console.log("Extracted contentByLecture:", _contentByLecture);
        
        // Update course data in store
        updateCourseData(courseData);
        
        // Set contentByLecture in store if it exists
        if (_contentByLecture && Object.keys(_contentByLecture).length > 0) {
          setContentByLecture(_contentByLecture);
          console.log("ContentByLecture set in store:", _contentByLecture);
        } else {
          console.log("No contentByLecture found in transformed data");
        }
        
        hasLoadedCourseRef.current = true;
        toast.success("Course loaded for editing");
      } else {
        hasLoadedCourseRef.current = true;
        toast.error("Course not found");
      }
    } catch (error) {
      console.error("Error loading course for editing:", error);
      hasLoadedCourseRef.current = true;
      toast.error("Failed to load course for editing");
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Load course data for duplication
  const loadCourseForDuplication = () => {
    if (hasLoadedCourseRef.current) return; // Prevent duplicate calls
    
    setIsLoadingCourse(true);
    try {
      const storedCourseData = localStorage.getItem("courseToDuplicate");
      if (storedCourseData) {
        const courseData = JSON.parse(storedCourseData);
        const transformedData = transformCourseDataForStore(courseData);
        
        // Extract contentByLecture from transformed data
        const { _contentByLecture, ...courseDataWithoutContent } = transformedData;
        
        // Remove the ID to create a new course
        delete courseDataWithoutContent.id;
        
        // Update title to indicate it's a copy
        if (courseDataWithoutContent.title) {
          courseDataWithoutContent.title = `${courseDataWithoutContent.title} (Copy)`;
        }

        // Update course data in store
        updateCourseData(courseDataWithoutContent);
        
        // Set contentByLecture in store if it exists
        if (_contentByLecture && Object.keys(_contentByLecture).length > 0) {
          setContentByLecture(_contentByLecture);
        }
        
        localStorage.removeItem("courseToDuplicate");
        hasLoadedCourseRef.current = true;
        toast.success("Course loaded for duplication");
      } else {
        hasLoadedCourseRef.current = true;
        toast.error("No course data found for duplication");
      }
    } catch (error) {
      console.error("Error loading course for duplication:", error);
      hasLoadedCourseRef.current = true;
      toast.error("Failed to load course for duplication");
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Transform GraphQL course data to match store structure
  const transformCourseDataForStore = (course: any) => {
    console.log("Starting transformation of course data:", course);
    console.log("Enrollment type from course:", course.enrollmentType);
    
    // Transform contentItem data into contentByLecture structure
    const contentByLecture: any = {};
    
    course.sections?.forEach((section: any) => {
      console.log("Processing section:", section);
      section.lectures?.forEach((lecture: any) => {
        console.log("Processing lecture:", lecture);
        if (lecture.contentItem) {
          console.log("Found contentItem for lecture:", lecture.contentItem);
          
          // Initialize lecture content structure
          contentByLecture[lecture.id] = {
            videos: [],
            documents: [],
            images: [],
            audio: [],
            archives: [],
            text: [],
            assignments: [],
            resources: [],
            quizzes: [],
          };

          // Map contentItem to appropriate content type
          const contentItem = lecture.contentItem;
          const contentType = contentItem.type?.toLowerCase();
          console.log(`Content type: ${contentType}, mimeType: ${contentItem.mimeType}`);
          
          // Create content object for the store
          const contentObject = {
            id: contentItem.id,
            title: contentItem.title,
            url: contentItem.fileUrl, // This should match what the component expects
            fileName: contentItem.fileName,
            fileSize: contentItem.fileSize,
            mimeType: contentItem.mimeType,
            type: contentItem.type,
            order: contentItem.order,
            createdAt: new Date(),
            // Add additional properties that might be expected
            name: contentItem.fileName,
            size: contentItem.fileSize,
            uploadedAt: new Date(),
            status: 'permanent', // Mark as permanent since it's from the database
          };
          console.log("Created content object:", contentObject);

          // Map to appropriate content type based on mimeType or type
          if (contentType === 'video' || contentItem.mimeType?.startsWith('video/')) {
            contentByLecture[lecture.id].videos = [contentObject];
            console.log("Mapped to videos");
          } else if (contentType === 'document' || contentItem.mimeType?.includes('pdf') || contentItem.mimeType?.includes('document') || contentItem.mimeType?.includes('text/')) {
            contentByLecture[lecture.id].documents = [contentObject];
            console.log("Mapped to documents");
          } else if (contentType === 'image' || contentItem.mimeType?.startsWith('image/')) {
            contentByLecture[lecture.id].images = [contentObject];
            console.log("Mapped to images");
          } else if (contentType === 'audio' || contentItem.mimeType?.startsWith('audio/')) {
            contentByLecture[lecture.id].audio = [contentObject];
            console.log("Mapped to audio");
          } else if (contentType === 'archive' || contentItem.mimeType?.includes('zip') || contentItem.mimeType?.includes('rar') || contentItem.mimeType?.includes('7z')) {
            contentByLecture[lecture.id].archives = [contentObject];
            console.log("Mapped to archives");
          } else {
            // Default to documents for unknown types
            console.log(`Unknown content type: ${contentType}, mimeType: ${contentItem.mimeType}, defaulting to documents`);
            contentByLecture[lecture.id].documents = [contentObject];
          }
        } else {
          console.log("No contentItem found for lecture:", lecture.id);
        }
      });
    });
    
    console.log("Final contentByLecture structure:", contentByLecture);

    const finalSettings = course.settings || {
      isPublic: false,
      enrollmentType: (course.enrollmentType || "FREE").toUpperCase(),
      language: "English",
      certificate: false,
      seoDescription: "",
      seoTags: [],
      accessibility: {
        captions: false,
        transcripts: false,
        audioDescription: false,
      },
    };
    
    console.log("Final settings object:", finalSettings);
    console.log("Final enrollment type:", finalSettings.enrollmentType);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      category: course.category,
      level: course.level,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      status: course.status,
      objectives: course.objectives || [],
      prerequisites: course.prerequisites || [],
      requirements: course.requirements || [],
      whatYouLearn: course.whatYouLearn || [],
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
          isCompleted: lecture.isCompleted || false,
        })) || [],
      })) || [],
      settings: finalSettings,
      // Add the contentByLecture structure to be used by the store
      _contentByLecture: contentByLecture,
    };
  };

  // Reset to create new course
  const resetToNewCourse = () => {
    reset();
    setIsEditMode(false);
    setIsDuplicateMode(false);
    setCourseId(null);
    setCurrentStep(0); // Use number instead of string
    hasLoadedCourseRef.current = false;
    lastProcessedParamsRef.current = "";
  };

  return {
    isEditMode,
    isDuplicateMode,
    isLoadingCourse,
    courseId,
    resetToNewCourse,
  };
}; 