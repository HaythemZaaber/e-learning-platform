import { useCallback } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { UPDATE_LECTURE_DURATION } from '@/features/courses/services/graphql/courseMutations';
import { GET_COURSE_PREVIEW, GET_COURSE_NAVIGATION } from '@/features/courses/services/graphql/courseQueries';
import { toast } from 'sonner';

interface UseVideoDurationReturn {
  updateLectureDuration: (lectureId: string, duration: number, courseId?: string) => Promise<boolean>;
  isUpdating: boolean;
}

export const useVideoDuration = (): UseVideoDurationReturn => {
  const client = useApolloClient();
  const [updateDuration, { loading: isUpdating }] = useMutation(UPDATE_LECTURE_DURATION);

  const updateLectureDuration = useCallback(async (lectureId: string, duration: number, courseId?: string): Promise<boolean> => {
    try {
      const { data } = await updateDuration({
        variables: {
          lectureId,
          duration
        },
        update: (cache, { data: mutationData }) => {
          if (mutationData?.updateLectureDuration?.success && courseId) {
            // Update course preview cache
            try {
              const courseData = cache.readQuery({
                query: GET_COURSE_PREVIEW,
                variables: { courseId },
              }) as any;

              if (courseData?.getCoursePreview) {
                const updatedCourse = {
                  ...courseData.getCoursePreview,
                  sections: courseData.getCoursePreview.sections.map((section: any) => ({
                    ...section,
                    lectures: section.lectures?.map((lecture: any) => 
                      lecture.id === lectureId 
                        ? { ...lecture, duration }
                        : lecture
                    ) || []
                  }))
                };

                cache.writeQuery({
                  query: GET_COURSE_PREVIEW,
                  variables: { courseId },
                  data: { getCoursePreview: updatedCourse },
                });
              }
            } catch (e) {
              console.log("Course preview cache update failed:", e);
            }

            // Update course navigation cache
            try {
              const navigationData = cache.readQuery({
                query: GET_COURSE_NAVIGATION,
                variables: { courseId },
              }) as any;

              if (navigationData?.getCourseNavigation) {
                const updatedNavigation = {
                  ...navigationData.getCourseNavigation,
                  sections: navigationData.getCourseNavigation.sections.map((section: any) => ({
                    ...section,
                    lectures: section.lectures?.map((lecture: any) => 
                      lecture.id === lectureId 
                        ? { ...lecture, duration }
                        : lecture
                    ) || []
                  }))
                };

                cache.writeQuery({
                  query: GET_COURSE_NAVIGATION,
                  variables: { courseId },
                  data: { getCourseNavigation: updatedNavigation },
                });
              }
            } catch (e) {
              console.log("Course navigation cache update failed:", e);
            }

            // Update Zustand store
            try {
              const { useCoursePreviewStore } = require('@/stores/coursePreview.store');
              const { updateLectureDuration: updateStoreDuration } = useCoursePreviewStore.getState();
              updateStoreDuration(lectureId, duration);
            } catch (e) {
              console.log("Zustand store update failed:", e);
            }
          }
        }
      });

      if (data?.updateLectureDuration?.success) {
        console.log('✅ Lecture duration updated:', {
          lectureId,
          duration: `${Math.floor(duration / 60)}m ${duration % 60}s`
        });
        
        return true;
      } else {
        console.error('Failed to update lecture duration:', data?.updateLectureDuration?.errors);
       
        return false;
      }
    } catch (error) {
      console.error('Error updating lecture duration:', error);
     
      return false;
    }
  }, [updateDuration, client]);

  return {
    updateLectureDuration,
    isUpdating
  };
};
