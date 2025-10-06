import { useEffect, useRef } from "react";

interface InstructorSummaryUpdateEvent {
  detail: {
    instructorId: string;
    action: "rating-created" | "rating-updated" | "rating-deleted";
    newRating?: number;
    totalRatings?: number;
    averageRating?: number;
  };
}

export const useInstructorSummaryUpdate = (
  instructorId: string,
  onSummaryUpdate: (data: InstructorSummaryUpdateEvent["detail"]) => void
) => {
  const onSummaryUpdateRef = useRef(onSummaryUpdate);

  // Keep the callback ref up to date
  useEffect(() => {
    onSummaryUpdateRef.current = onSummaryUpdate;
  }, [onSummaryUpdate]);

  useEffect(() => {
    const handleSummaryUpdate = (
      event: CustomEvent<InstructorSummaryUpdateEvent["detail"]>
    ) => {
      // Only handle events for this specific instructor
      if (event.detail.instructorId === instructorId) {
        onSummaryUpdateRef.current(event.detail);
      }
    };

    window.addEventListener(
      "instructor-summary-update",
      handleSummaryUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "instructor-summary-update",
        handleSummaryUpdate as EventListener
      );
    };
  }, [instructorId]);
};
