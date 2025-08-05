"use client";

import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { GET_INSTRUCTOR_COURSES, GET_COURSE_BY_ID } from "../services/graphql/courseQueries";
import { UPDATE_COURSE, DELETE_COURSE, PUBLISH_COURSE, UNPUBLISH_COURSE } from "../services/graphql/courseMutations";
import { toast } from "sonner";


export const useInstructorCourses = () => {
  const { userId } = useAuth();
  const client = useApolloClient();

  // Query for fetching instructor courses
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useQuery(GET_INSTRUCTOR_COURSES, {
    
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  console.log("coursesData", coursesData);

  // Mutation for updating course
  const [updateCourse, { loading: updateLoading }] = useMutation(UPDATE_COURSE, {
    onCompleted: (data) => {
      toast.success("Course updated successfully!");
      refetchCourses();
    },
    onError: (error) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });

  // Mutation for deleting course
  const [deleteCourse, { loading: deleteLoading }] = useMutation(DELETE_COURSE, {
    onCompleted: (data) => {
      toast.success("Course deleted successfully!");
      refetchCourses();
    },
    onError: (error) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });

  // Mutation for publishing course
  const [publishCourse, { loading: publishLoading }] = useMutation(PUBLISH_COURSE, {
    onCompleted: (data) => {
      toast.success("Course published successfully!");
      refetchCourses();
    },
    onError: (error) => {
      toast.error(`Failed to publish course: ${error.message}`);
    },
  });

  // Mutation for unpublishing course
  const [unpublishCourse, { loading: unpublishLoading }] = useMutation(UNPUBLISH_COURSE, {
    onCompleted: (data) => {
      toast.success("Course unpublished successfully!");
      refetchCourses();
    },
    onError: (error) => {
      toast.error(`Failed to unpublish course: ${error.message}`);
    },
  });

  // Get course by ID
  const getCourseById = async (courseId: string) => {
    try {
      const { data } = await client.query({
        query: GET_COURSE_BY_ID,
        variables: { id: courseId },
        fetchPolicy: "network-only",
      });
      return data.course;
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to fetch course details");
      return null;
    }
  };

  // Handle course actions
  const handleCourseAction = async (action: string, courseId: string) => {
    switch (action) {
      case "edit":
        // Navigate to edit page with course data
        window.location.href = `/instructor/dashboard/courses/course-creation?edit=${courseId}`;
        break;
      
      case "delete":
        if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
          await deleteCourse({ variables: { id: courseId } });
        }
        break;
      
      case "publish":
        await publishCourse({ variables: { id: courseId } });
        break;
      
      case "unpublish":
        await unpublishCourse({ variables: { id: courseId } });
        break;
      
      case "duplicate":
        // Get course data and navigate to creation page with duplicate flag
        const courseData = await getCourseById(courseId);
        if (courseData) {
          // Store course data in localStorage for duplication
          localStorage.setItem("courseToDuplicate", JSON.stringify(courseData));
          window.location.href = `/instructor/dashboard/courses/course-creation?duplicate=true`;
        }
        break;
      
      case "analytics":
        window.location.href = `/instructor/dashboard/courses/${courseId}/analytics`;
        break;
      
      case "preview":
        window.open(`/courses/${courseId}`, "_blank");
        break;
      
      default:
        console.log(`Action ${action} not implemented`);
    }
  };

  // Update course data
  const updateCourseData = async (courseId: string, input: any) => {
    await updateCourse({
      variables: {
        id: courseId,
        input,
      },
    });
  };

  return {
    courses: coursesData?.getMyCourses || [],
    loading: coursesLoading,
    error: coursesError,
    refetchCourses,
    handleCourseAction,
    updateCourseData,
    getCourseById,
    updateLoading,
    deleteLoading,
    publishLoading,
    unpublishLoading,
  };
}; 