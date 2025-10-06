import { useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  useNotificationStore,
  useNotificationSelectors,
} from "@/stores/notification.store";
import {
  NotificationType,
  NotificationPriority,
} from "@/types/notificationTypes";

export const useNotifications = () => {
  const { getToken, isSignedIn } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    connectionStatus,
    currentPage,
    totalPages,
    totalCount,
  } = useNotificationSelectors();

  const {
    setNotifications,
    addNotification,
    updateNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    connectWebSocket,
    disconnectWebSocket,
    setConnectionStatus,
    setPagination,
    setCurrentPage,
    setLoading,
    setError,
    getNotificationById: getNotificationByIdFromStore,
    getUnreadNotifications: getUnreadNotificationsFromStore,
    getNotificationsByType: getNotificationsByTypeFromStore,
  } = useNotificationStore();

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    const initializeConnection = async () => {
      if (isSignedIn && !connectionStatus.connected) {
        try {
          const token = await getToken();
          if (token) {
            await connectWebSocket(token);
          }
        } catch (error) {
          console.error("Failed to initialize notification connection:", error);
          setError("Failed to connect to notification service");
        }
      }
    };

    initializeConnection();
  }, [
    isSignedIn,
    connectionStatus.connected,
    getToken,
    connectWebSocket,
    setError,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Keep the WS connected across routes while signed in
      if (!isSignedIn) {
        disconnectWebSocket();
      }
    };
  }, [isSignedIn, disconnectWebSocket]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async (page = 1, limit = 20) => {
      if (!isSignedIn) return;

      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendUrl}/notifications?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setPagination(
          data.pagination.page,
          data.pagination.pages,
          data.pagination.total
        );
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      isSignedIn,
      getToken,
      setLoading,
      setError,
      setNotifications,
      setPagination,
      setCurrentPage,
    ]
  );

  // Mark notification as read
  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      if (!isSignedIn) return;

      try {
        const token = await getToken();
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendUrl}/notifications/${notificationId}/read`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          markAsRead(notificationId);
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [isSignedIn, getToken, markAsRead]
  );

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${backendUrl}/notifications/mark-all-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        markAllAsRead();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, [isSignedIn, getToken, markAllAsRead]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      if (!isSignedIn) return;

      try {
        const token = await getToken();
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendUrl}/notifications/${notificationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          removeNotification(notificationId);
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [isSignedIn, getToken, removeNotification]
  );

  // Join course room for course-specific notifications
  const joinCourseRoom = useCallback(
    (courseId: string) => {
      if (connectionStatus.connected) {
        // This would be implemented in the WebSocket service
        console.log(`Joining course room: ${courseId}`);
      }
    },
    [connectionStatus.connected]
  );

  // Leave course room
  const leaveCourseRoom = useCallback(
    (courseId: string) => {
      if (connectionStatus.connected) {
        console.log(`Leaving course room: ${courseId}`);
      }
    },
    [connectionStatus.connected]
  );

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return getNotificationsByTypeFromStore(type);
    },
    [getNotificationsByTypeFromStore]
  );

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return getUnreadNotificationsFromStore();
  }, [getUnreadNotificationsFromStore]);

  // Get notification by ID
  const getNotificationById = useCallback(
    (id: string) => {
      return getNotificationByIdFromStore(id);
    },
    [getNotificationByIdFromStore]
  );

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    connectionStatus,
    currentPage,
    totalPages,
    totalCount,

    // Actions
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    joinCourseRoom,
    leaveCourseRoom,
    clearNotifications,

    // Utilities
    getNotificationsByType,
    getUnreadNotifications,
    getNotificationById,
  };
};

// Hook for notification count only (lightweight)
export const useNotificationCount = () => {
  const { unreadCount, connectionStatus } = useNotificationSelectors();
  return { unreadCount, isConnected: connectionStatus.connected };
};

// Hook for WebSocket connection status
export const useWebSocketConnection = () => {
  const { connectionStatus, isLoading, error } = useNotificationSelectors();
  const { connectWebSocket, disconnectWebSocket } = useNotificationStore();
  const { getToken, isSignedIn } = useAuth();

  const reconnect = useCallback(async () => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          await connectWebSocket(token);
        }
      } catch (error) {
        console.error("Failed to reconnect:", error);
      }
    }
  }, [isSignedIn, getToken, connectWebSocket]);

  return {
    isConnected: connectionStatus.connected,
    isLoading,
    error,
    reconnectAttempts: connectionStatus.reconnectAttempts,
    reconnect,
    disconnect: disconnectWebSocket,
  };
};
