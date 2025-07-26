import { useMutation } from "@apollo/client";
import { CREATE_COURSE } from "@/graphql/mutation/course";
import { CourseData } from "../types";

export function useCreateCourseMutation() {
  const [createCourse, { data, loading, error }] = useMutation(CREATE_COURSE);

  const submitCourse = async (courseData: CourseData) => {
    // Prepare input as needed (e.g., remove client-only fields)
    const input = { ...courseData };
    const result = await createCourse({ variables: { input } });
    return result;
  };

  return { submitCourse, data, loading, error };
} 