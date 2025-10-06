export enum NotificationType {
  // Course-related
  COURSE_UPDATE = "COURSE_UPDATE",
  NEW_LECTURE = "NEW_LECTURE",
  ASSIGNMENT_DUE = "ASSIGNMENT_DUE",
  CERTIFICATE_EARNED = "CERTIFICATE_EARNED",
  DISCUSSION_REPLY = "DISCUSSION_REPLY",
  INSTRUCTOR_APPROVED = "INSTRUCTOR_APPROVED",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
  AI_RECOMMENDATION = "AI_RECOMMENDATION",
  ENROLLMENT_CONFIRMATION = "ENROLLMENT_CONFIRMATION",
  PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",

  // Live Sessions
  BOOKING_RECEIVED = "BOOKING_RECEIVED",
  BOOKING_ACCEPTED = "BOOKING_ACCEPTED",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  SESSION_REMINDER = "SESSION_REMINDER",
  SESSION_STARTING = "SESSION_STARTING",
  SESSION_COMPLETED = "SESSION_COMPLETED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PAYOUT_PROCESSED = "PAYOUT_PROCESSED",
  TOPIC_APPROVAL_NEEDED = "TOPIC_APPROVAL_NEEDED",
  SCHEDULE_CONFLICT = "SCHEDULE_CONFLICT",

  // Follow System
  NEW_FOLLOWER = "NEW_FOLLOWER",
  UNFOLLOWED = "UNFOLLOWED",
}

export enum NotificationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: NotificationPriority;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPriority;
  actionUrl?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WebSocketNotification {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: NotificationPriority;
  actionUrl?: string;
  isRead?: boolean;
  createdAt?: string;
  isRoomNotification?: boolean;
  isSystemAnnouncement?: boolean;
}

export interface WebSocketConnectionStatus {
  connected: boolean;
  userId?: string;
  socketId?: string;
  lastConnected?: string;
  reconnectAttempts: number;
}
