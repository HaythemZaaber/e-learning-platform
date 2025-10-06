import {
  NotificationType,
  NotificationPriority,
  CreateNotificationData,
} from "@/types/notificationTypes";

export const createNotification = (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  options: {
    data?: Record<string, any>;
    priority?: NotificationPriority;
    actionUrl?: string;
  } = {}
): CreateNotificationData => {
  return {
    userId,
    type,
    title,
    message,
    data: options.data,
    priority: options.priority || NotificationPriority.NORMAL,
    actionUrl: options.actionUrl,
  };
};

// Predefined notification templates
export const notificationTemplates = {
  courseUpdate: (courseName: string, lectureTitle: string) => ({
    type: NotificationType.COURSE_UPDATE,
    title: "New Lecture Available",
    message: `A new lecture "${lectureTitle}" has been added to your course "${courseName}"`,
    priority: NotificationPriority.NORMAL,
  }),

  bookingReceived: (studentName: string, sessionTime: string) => ({
    type: NotificationType.BOOKING_RECEIVED,
    title: "New Session Booking",
    message: `${studentName} has booked a session with you for ${sessionTime}`,
    priority: NotificationPriority.HIGH,
  }),

  bookingAccepted: (instructorName: string, sessionTime: string) => ({
    type: NotificationType.BOOKING_ACCEPTED,
    title: "Session Booking Accepted",
    message: `${instructorName} has accepted your session booking for ${sessionTime}`,
    priority: NotificationPriority.NORMAL,
  }),

  bookingRejected: (instructorName: string, reason?: string) => ({
    type: NotificationType.BOOKING_REJECTED,
    title: "Session Booking Rejected",
    message: `${instructorName} has rejected your session booking${
      reason ? `: ${reason}` : ""
    }`,
    priority: NotificationPriority.NORMAL,
  }),

  sessionReminder: (sessionTitle: string, timeUntil: string) => ({
    type: NotificationType.SESSION_REMINDER,
    title: "Session Reminder",
    message: `Your session "${sessionTitle}" starts in ${timeUntil}`,
    priority: NotificationPriority.HIGH,
  }),

  sessionStarting: (sessionTitle: string) => ({
    type: NotificationType.SESSION_STARTING,
    title: "Session Starting Now",
    message: `Your session "${sessionTitle}" is starting now`,
    priority: NotificationPriority.URGENT,
  }),

  sessionCompleted: (sessionTitle: string) => ({
    type: NotificationType.SESSION_COMPLETED,
    title: "Session Completed",
    message: `Your session "${sessionTitle}" has been completed`,
    priority: NotificationPriority.NORMAL,
  }),

  paymentReceived: (amount: number, currency: string = "USD") => ({
    type: NotificationType.PAYMENT_RECEIVED,
    title: "Payment Received",
    message: `You have received a payment of ${currency} ${amount}`,
    priority: NotificationPriority.HIGH,
  }),

  payoutProcessed: (amount: number, currency: string = "USD") => ({
    type: NotificationType.PAYOUT_PROCESSED,
    title: "Payout Processed",
    message: `Your payout of ${currency} ${amount} has been processed`,
    priority: NotificationPriority.NORMAL,
  }),

  newFollower: (followerName: string) => ({
    type: NotificationType.NEW_FOLLOWER,
    title: "New Follower",
    message: `${followerName} started following you`,
    priority: NotificationPriority.LOW,
  }),

  instructorApproved: () => ({
    type: NotificationType.INSTRUCTOR_APPROVED,
    title: "Instructor Application Approved",
    message: "Congratulations! Your instructor application has been approved",
    priority: NotificationPriority.HIGH,
  }),

  certificateEarned: (courseName: string) => ({
    type: NotificationType.CERTIFICATE_EARNED,
    title: "Certificate Earned",
    message: `Congratulations! You have earned a certificate for completing "${courseName}"`,
    priority: NotificationPriority.HIGH,
  }),

  assignmentDue: (
    assignmentTitle: string,
    courseName: string,
    dueDate: string
  ) => ({
    type: NotificationType.ASSIGNMENT_DUE,
    title: "Assignment Due Soon",
    message: `Assignment "${assignmentTitle}" in "${courseName}" is due on ${dueDate}`,
    priority: NotificationPriority.HIGH,
  }),

  discussionReply: (authorName: string, discussionTitle: string) => ({
    type: NotificationType.DISCUSSION_REPLY,
    title: "New Discussion Reply",
    message: `${authorName} replied to "${discussionTitle}"`,
    priority: NotificationPriority.NORMAL,
  }),

  systemAnnouncement: (title: string, message: string) => ({
    type: NotificationType.SYSTEM_ANNOUNCEMENT,
    title,
    message,
    priority: NotificationPriority.NORMAL,
  }),

  aiRecommendation: (recommendation: string) => ({
    type: NotificationType.AI_RECOMMENDATION,
    title: "AI Recommendation",
    message: recommendation,
    priority: NotificationPriority.LOW,
  }),
};

// Helper function to get notification icon
export const getNotificationIcon = (type: NotificationType) => {
  const iconMap: Record<NotificationType, string> = {
    [NotificationType.COURSE_UPDATE]: "📚",
    [NotificationType.NEW_LECTURE]: "📖",
    [NotificationType.ASSIGNMENT_DUE]: "⏰",
    [NotificationType.CERTIFICATE_EARNED]: "🏆",
    [NotificationType.DISCUSSION_REPLY]: "💬",
    [NotificationType.INSTRUCTOR_APPROVED]: "✅",
    [NotificationType.SYSTEM_ANNOUNCEMENT]: "📢",
    [NotificationType.AI_RECOMMENDATION]: "🤖",
    [NotificationType.ENROLLMENT_CONFIRMATION]: "🎓",
    [NotificationType.PAYMENT_CONFIRMATION]: "💳",
    [NotificationType.BOOKING_RECEIVED]: "📅",
    [NotificationType.BOOKING_ACCEPTED]: "✅",
    [NotificationType.BOOKING_REJECTED]: "❌",
    [NotificationType.SESSION_REMINDER]: "⏰",
    [NotificationType.SESSION_STARTING]: "🚀",
    [NotificationType.SESSION_COMPLETED]: "✅",
    [NotificationType.PAYMENT_RECEIVED]: "💰",
    [NotificationType.PAYOUT_PROCESSED]: "💸",
    [NotificationType.TOPIC_APPROVAL_NEEDED]: "⚠️",
    [NotificationType.SCHEDULE_CONFLICT]: "⚠️",
    [NotificationType.NEW_FOLLOWER]: "👥",
    [NotificationType.UNFOLLOWED]: "👥",
  };

  return iconMap[type] || "🔔";
};

// Helper function to get priority color
export const getPriorityColor = (priority: NotificationPriority) => {
  const colorMap: Record<NotificationPriority, string> = {
    [NotificationPriority.URGENT]: "text-red-600 bg-red-50 border-red-200",
    [NotificationPriority.HIGH]:
      "text-orange-600 bg-orange-50 border-orange-200",
    [NotificationPriority.NORMAL]: "text-blue-600 bg-blue-50 border-blue-200",
    [NotificationPriority.LOW]: "text-gray-600 bg-gray-50 border-gray-200",
  };

  return colorMap[priority] || colorMap[NotificationPriority.NORMAL];
};
