"use client";

import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import {
  GET_COURSE_PREVIEW,
  GET_LECTURE_PREVIEW,
  GET_COURSE_PROGRESS,
  GET_COURSE_NAVIGATION,
} from "../services/graphql/courseQueries";
import {
  TRACK_LECTURE_VIEW,
  MARK_LECTURE_COMPLETE,
  UPDATE_LECTURE_PROGRESS,
  TRACK_LECTURE_INTERACTION,
  SUBMIT_LECTURE_QUIZ,
  DOWNLOAD_LECTURE_RESOURCE,
  TOGGLE_LECTURE_BOOKMARK,
  ADD_LECTURE_NOTE,
  UPDATE_LECTURE_NOTE,
  DELETE_LECTURE_NOTE,
  RATE_LECTURE,
  REPORT_LECTURE_ISSUE,
  REQUEST_LECTURE_ACCESS,
  SHARE_LECTURE,
  GET_LECTURE_TRANSCRIPT,
  GENERATE_LECTURE_SUMMARY,
  CREATE_LECTURE_DISCUSSION,
  REPLY_TO_LECTURE_DISCUSSION,
} from "../services/graphql/courseMutations";
import { Course, CourseLecture, CourseProgress } from "@/types/courseTypes";
import { toast } from "sonner";
import { useMemo, useEffect } from "react";

interface UseCoursePreviewOptions {
  courseId: string;
  lectureId?: string;
  autoTrackView?: boolean;
  autoTrackProgress?: boolean;
}

export const useCoursePreview = (options: UseCoursePreviewOptions) => {
  const { courseId, lectureId, autoTrackView = true, autoTrackProgress = true } = options;

  const { user, isAuthenticated } = useAuth();
  const client = useApolloClient();

  // ============================================================================
  // COURSE PREVIEW QUERY
  // ============================================================================

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useQuery(GET_COURSE_PREVIEW, {
    variables: { courseId },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // ============================================================================
  // LECTURE PREVIEW QUERY
  // ============================================================================

  const {
    data: lectureData,
    loading: lectureLoading,
    error: lectureError,
    refetch: refetchLecture,
  } = useQuery(GET_LECTURE_PREVIEW, {
    variables: { courseId, lectureId: lectureId || "" },
    skip: !lectureId,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // ============================================================================
  // COURSE PROGRESS QUERY
  // ============================================================================

  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useQuery(GET_COURSE_PROGRESS, {
    variables: { courseId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      // Silently handle enrollment errors
      if (error.message.includes("not enrolled")) {
        console.log("User not enrolled in course, skipping progress query");
      }
    },
  });

  // ============================================================================
  // COURSE NAVIGATION QUERY
  // ============================================================================

  const {
    data: navigationData,
    loading: navigationLoading,
    error: navigationError,
    refetch: refetchNavigation,
  } = useQuery(GET_COURSE_NAVIGATION, {
    variables: { courseId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      // Silently handle enrollment errors
      if (error.message.includes("not enrolled")) {
        console.log("User not enrolled in course, skipping navigation query");
      }
    },
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const [trackLectureView] = useMutation(TRACK_LECTURE_VIEW, {
    onError: (error) => {
      console.error("Failed to track lecture view:", error);
    },
  });

  const [markLectureComplete] = useMutation(MARK_LECTURE_COMPLETE, {
    onCompleted: (data) => {
      if (data.markLectureComplete.success) {
        refetchProgress();
        refetchNavigation();
      } else {
        toast.error(data.markLectureComplete.message || "Failed to mark lecture complete");
      }
    },
    onError: (error) => {
      toast.error(`Failed to mark lecture complete: ${error.message}`);
    },
  });

  const [updateLectureProgress] = useMutation(UPDATE_LECTURE_PROGRESS, {
    onError: (error) => {
      console.error("Failed to update lecture progress:", error);
    },
  });

  const [trackLectureInteraction] = useMutation(TRACK_LECTURE_INTERACTION, {
    onError: (error) => {
      console.error("Failed to track lecture interaction:", error);
    },
  });

  const [submitLectureQuiz] = useMutation(SUBMIT_LECTURE_QUIZ, {
    onCompleted: (data) => {
      if (data.submitLectureQuiz.success) {
        toast.success(`Quiz completed! Score: ${data.submitLectureQuiz.score}/${data.submitLectureQuiz.totalQuestions}`);
        refetchProgress();
      } else {
        toast.error(data.submitLectureQuiz.message || "Failed to submit quiz");
      }
    },
    onError: (error) => {
      toast.error(`Failed to submit quiz: ${error.message}`);
    },
  });

  const [downloadLectureResource] = useMutation(DOWNLOAD_LECTURE_RESOURCE, {
    onCompleted: (data) => {
      if (data.downloadLectureResource.success) {
        // Trigger download
        const link = document.createElement('a');
        link.href = data.downloadLectureResource.downloadUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Resource downloaded successfully!");
      } else {
        toast.error(data.downloadLectureResource.message || "Failed to download resource");
      }
    },
    onError: (error) => {
      toast.error(`Failed to download resource: ${error.message}`);
    },
  });

  const [toggleLectureBookmark] = useMutation(TOGGLE_LECTURE_BOOKMARK, {
    onCompleted: (data) => {
      if (data.toggleLectureBookmark.success) {
        toast.success(data.toggleLectureBookmark.isBookmarked ? "Lecture bookmarked!" : "Bookmark removed!");
      } else {
        toast.error(data.toggleLectureBookmark.message || "Failed to toggle bookmark");
      }
    },
    onError: (error) => {
      toast.error(`Failed to toggle bookmark: ${error.message}`);
    },
  });

  const [addLectureNote] = useMutation(ADD_LECTURE_NOTE, {
    onCompleted: (data) => {
      if (data.addLectureNote.success) {
        toast.success("Note added successfully!");
      } else {
        toast.error(data.addLectureNote.message || "Failed to add note");
      }
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  const [updateLectureNote] = useMutation(UPDATE_LECTURE_NOTE, {
    onCompleted: (data) => {
      if (data.updateLectureNote.success) {
        toast.success("Note updated successfully!");
      } else {
        toast.error(data.updateLectureNote.message || "Failed to update note");
      }
    },
    onError: (error) => {
      toast.error(`Failed to update note: ${error.message}`);
    },
  });

  const [deleteLectureNote] = useMutation(DELETE_LECTURE_NOTE, {
    onCompleted: (data) => {
      if (data.deleteLectureNote.success) {
        toast.success("Note deleted successfully!");
      } else {
        toast.error(data.deleteLectureNote.message || "Failed to delete note");
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const [rateLecture] = useMutation(RATE_LECTURE, {
    onCompleted: (data) => {
      if (data.rateLecture.success) {
        toast.success("Lecture rated successfully!");
      } else {
        toast.error(data.rateLecture.message || "Failed to rate lecture");
      }
    },
    onError: (error) => {
      toast.error(`Failed to rate lecture: ${error.message}`);
    },
  });

  const [reportLectureIssue] = useMutation(REPORT_LECTURE_ISSUE, {
    onCompleted: (data) => {
      if (data.reportLectureIssue.success) {
        toast.success("Issue reported successfully!");
      } else {
        toast.error(data.reportLectureIssue.message || "Failed to report issue");
      }
    },
    onError: (error) => {
      toast.error(`Failed to report issue: ${error.message}`);
    },
  });

  const [requestLectureAccess] = useMutation(REQUEST_LECTURE_ACCESS, {
    onCompleted: (data) => {
      if (data.requestLectureAccess.success) {
        toast.success("Access request submitted successfully!");
      } else {
        toast.error(data.requestLectureAccess.message || "Failed to request access");
      }
    },
    onError: (error) => {
      toast.error(`Failed to request access: ${error.message}`);
    },
  });

  const [shareLecture] = useMutation(SHARE_LECTURE, {
    onCompleted: (data) => {
      if (data.shareLecture.success) {
        // Copy to clipboard
        navigator.clipboard.writeText(data.shareLecture.shareUrl);
        toast.success("Share link copied to clipboard!");
      } else {
        toast.error(data.shareLecture.message || "Failed to share lecture");
      }
    },
    onError: (error) => {
      toast.error(`Failed to share lecture: ${error.message}`);
    },
  });

  const [getLectureTranscript] = useMutation(GET_LECTURE_TRANSCRIPT, {
    onCompleted: (data) => {
      if (data.getLectureTranscript.success) {
        toast.success("Transcript generated successfully!");
      } else {
        toast.error(data.getLectureTranscript.message || "Failed to generate transcript");
      }
    },
    onError: (error) => {
      toast.error(`Failed to generate transcript: ${error.message}`);
    },
  });

  const [generateLectureSummary] = useMutation(GENERATE_LECTURE_SUMMARY, {
    onCompleted: (data) => {
      if (data.generateLectureSummary.success) {
        toast.success("Summary generated successfully!");
      } else {
        toast.error(data.generateLectureSummary.message || "Failed to generate summary");
      }
    },
    onError: (error) => {
      toast.error(`Failed to generate summary: ${error.message}`);
    },
  });

  const [createLectureDiscussion] = useMutation(CREATE_LECTURE_DISCUSSION, {
    onCompleted: (data) => {
      if (data.createLectureDiscussion.success) {
        toast.success("Discussion created successfully!");
      } else {
        toast.error(data.createLectureDiscussion.message || "Failed to create discussion");
      }
    },
    onError: (error) => {
      toast.error(`Failed to create discussion: ${error.message}`);
    },
  });

  const [replyToLectureDiscussion] = useMutation(REPLY_TO_LECTURE_DISCUSSION, {
    onCompleted: (data) => {
      if (data.replyToLectureDiscussion.success) {
        toast.success("Reply posted successfully!");
      } else {
        toast.error(data.replyToLectureDiscussion.message || "Failed to post reply");
      }
    },
    onError: (error) => {
      toast.error(`Failed to post reply: ${error.message}`);
    },
  });

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  const course = useMemo(() => {
    return courseData?.getCoursePreview as Course;
  }, [courseData]);

  const lecture = useMemo(() => {
    return lectureData?.getLecturePreview as CourseLecture;
  }, [lectureData]);

  const progress = useMemo(() => {
    return progressData?.getCourseProgress as CourseProgress;
  }, [progressData]);

  const navigation = useMemo(() => {
    return navigationData?.getCourseNavigation;
  }, [navigationData]);

  // ============================================================================
  // AUTO-TRACKING EFFECTS
  // ============================================================================

  // Auto-track lecture view
  useEffect(() => {
    if (lectureId && autoTrackView && isAuthenticated) {
      trackLectureView({ variables: { lectureId, courseId } });
    }
  }, [lectureId, autoTrackView, isAuthenticated, trackLectureView, courseId]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleMarkLectureComplete = async (lectureId: string, progress: number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      const result = await markLectureComplete({ 
        variables: { lectureId, courseId, progress },
        update: (cache, { data }) => {
          if (data?.markLectureComplete?.success) {
            // Update the cache immediately to mark lecture as completed
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
                        ? { ...lecture, isCompleted: true }
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
              console.log("Cache update failed, will refetch instead");
            }
          }
        }
      });
      
      // Also refetch to ensure server state is synchronized
      if (result.data?.markLectureComplete?.success) {
        // Small delay before refetch to allow server to process
        setTimeout(async () => {
          await refetchProgress();
          await refetchNavigation();
        }, 500);
      }
    } catch (error) {
      console.error("Failed to mark lecture complete:", error);
      toast.error("Failed to mark lecture as complete");
    }
  };

  const handleUpdateProgress = async (lectureId: string, progress: number, timeSpent: number) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const result = await updateLectureProgress({ variables: { lectureId, courseId, progress, timeSpent } });
      
      // If progress is high enough, also refetch to ensure completion status is updated
      if (progress >= 90 && result.data?.updateLectureProgress?.success) {
        await refetchCourse();
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleTrackInteraction = async (lectureId: string, interactionType: string, metadata?: any) => {
    try {
      await trackLectureInteraction({ 
        variables: { 
          lectureId, 
          courseId, 
          interactionType, 
          metadata: metadata ? JSON.stringify(metadata) : null 
        } 
      });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  const handleSubmitQuiz = async (lectureId: string, answers: any[]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit quizzes");
      return;
    }

    try {
      await submitLectureQuiz({ variables: { lectureId, courseId, answers } });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const handleDownloadResource = async (resourceId: string, lectureId: string) => {
    try {
      await downloadLectureResource({ variables: { resourceId, lectureId } });
    } catch (error) {
      console.error("Failed to download resource:", error);
    }
  };

  const handleToggleBookmark = async (lectureId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark lectures");
      return;
    }

    try {
      await toggleLectureBookmark({ variables: { lectureId, courseId } });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const handleAddNote = async (lectureId: string, content: string, timestamp?: number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add notes");
      return;
    }

    try {
      await addLectureNote({ variables: { lectureId, courseId, content, timestamp } });
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    try {
      await updateLectureNote({ variables: { noteId, content } });
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteLectureNote({ variables: { noteId } });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleRateLecture = async (lectureId: string, rating: number, feedback?: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to rate lectures");
      return;
    }

    try {
      await rateLecture({ variables: { lectureId, courseId, rating, feedback } });
    } catch (error) {
      console.error("Failed to rate lecture:", error);
    }
  };

  const handleReportIssue = async (lectureId: string, issueType: string, description: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to report issues");
      return;
    }

    try {
      await reportLectureIssue({ variables: { lectureId, courseId, issueType, description } });
    } catch (error) {
      console.error("Failed to report issue:", error);
    }
  };

  const handleRequestAccess = async (lectureId: string, reason?: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to request access");
      return;
    }

    try {
      await requestLectureAccess({ variables: { lectureId, courseId, reason } });
    } catch (error) {
      console.error("Failed to request access:", error);
    }
  };

  const handleShareLecture = async (lectureId: string, platform: string, message?: string) => {
    try {
      await shareLecture({ variables: { lectureId, courseId, platform, message } });
    } catch (error) {
      console.error("Failed to share lecture:", error);
    }
  };

  const handleGetTranscript = async (lectureId: string) => {
    try {
      await getLectureTranscript({ variables: { lectureId, courseId } });
    } catch (error) {
      console.error("Failed to get transcript:", error);
    }
  };

  const handleGenerateSummary = async (lectureId: string) => {
    try {
      await generateLectureSummary({ variables: { lectureId, courseId } });
    } catch (error) {
      console.error("Failed to generate summary:", error);
    }
  };

  const handleCreateDiscussion = async (lectureId: string, title: string, content: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to create discussions");
      return;
    }

    try {
      await createLectureDiscussion({ variables: { lectureId, courseId, title, content } });
    } catch (error) {
      console.error("Failed to create discussion:", error);
    }
  };

  const handleReplyToDiscussion = async (discussionId: string, content: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to reply to discussions");
      return;
    }

    try {
      await replyToLectureDiscussion({ variables: { discussionId, content } });
    } catch (error) {
      console.error("Failed to reply to discussion:", error);
    }
  };

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  // Filter out enrollment-related errors from progress and navigation
  const isEnrollmentError = (error: any) => 
    error?.message?.includes("not enrolled") || 
    error?.message?.includes("User not enrolled");

  const filteredProgressError = isEnrollmentError(progressError) ? null : progressError?.message;
  const filteredNavigationError = isEnrollmentError(navigationError) ? null : navigationError?.message;

  return {
    // Data
    course,
    lecture,
    progress,
    navigation,
    
    // Loading states
    isLoading: courseLoading || lectureLoading || progressLoading || navigationLoading,
    isCourseLoading: courseLoading,
    isLectureLoading: lectureLoading,
    isProgressLoading: progressLoading,
    isNavigationLoading: navigationLoading,
    
    // Error states
    error: courseError?.message || lectureError?.message || filteredProgressError || filteredNavigationError,
    courseError: courseError?.message,
    lectureError: lectureError?.message,
    progressError: filteredProgressError,
    navigationError: filteredNavigationError,
    
    // Refetch functions
    refetchCourse,
    refetchLecture,
    refetchProgress,
    refetchNavigation,
    
    // Actions
    handleMarkLectureComplete,
    handleUpdateProgress,
    handleTrackInteraction,
    handleSubmitQuiz,
    handleDownloadResource,
    handleToggleBookmark,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    handleRateLecture,
    handleReportIssue,
    handleRequestAccess,
    handleShareLecture,
    handleGetTranscript,
    handleGenerateSummary,
    handleCreateDiscussion,
    handleReplyToDiscussion,
    
    // Utility
    isEnrolled: !!course?.enrollment,
    isAuthenticated,
  };
};
