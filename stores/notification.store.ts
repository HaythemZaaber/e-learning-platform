import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  Notification,
  NotificationType,
  NotificationPriority,
  WebSocketNotification,
  WebSocketConnectionStatus,
} from "@/types/notificationTypes";
import websocketService from "@/services/websocket.service";

interface NotificationState {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // WebSocket connection
  connectionStatus: WebSocketConnectionStatus;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // WebSocket actions
  connectWebSocket: (token: string) => Promise<void>;
  disconnectWebSocket: () => void;
  setConnectionStatus: (status: WebSocketConnectionStatus) => void;

  // Pagination actions
  setPagination: (page: number, totalPages: number, totalCount: number) => void;
  setCurrentPage: (page: number) => void;

  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility actions
  getNotificationById: (id: string) => Notification | undefined;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
        connectionStatus: {
          connected: false,
          reconnectAttempts: 0,
        },
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,

        // Notification actions
        setNotifications: (notifications) => {
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          set({
            notifications,
            unreadCount,
            error: null,
          });
        },

        addNotification: (notification) => {
          set((state) => {
            // Check if notification already exists to avoid duplicates
            const exists = state.notifications.some(
              (n) => n.id === notification.id
            );
            if (exists) return state;

            const newNotifications = [notification, ...state.notifications];
            const newUnreadCount = notification.isRead
              ? state.unreadCount
              : state.unreadCount + 1;

            return {
              notifications: newNotifications,
              unreadCount: newUnreadCount,
            };
          });
        },

        updateNotification: (id, updates) => {
          set((state) => {
            const updatedNotifications = state.notifications.map(
              (notification) =>
                notification.id === id
                  ? { ...notification, ...updates }
                  : notification
            );

            const unreadCount = updatedNotifications.filter(
              (n) => !n.isRead
            ).length;

            return {
              notifications: updatedNotifications,
              unreadCount,
            };
          });
        },

        markAsRead: (id) => {
          set((state) => {
            const updatedNotifications = state.notifications.map(
              (notification) =>
                notification.id === id
                  ? { ...notification, isRead: true }
                  : notification
            );

            const unreadCount = updatedNotifications.filter(
              (n) => !n.isRead
            ).length;

            return {
              notifications: updatedNotifications,
              unreadCount,
            };
          });
        },

        markAllAsRead: () => {
          set((state) => {
            const updatedNotifications = state.notifications.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            );

            return {
              notifications: updatedNotifications,
              unreadCount: 0,
            };
          });
        },

        removeNotification: (id) => {
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.isRead;

            const updatedNotifications = state.notifications.filter(
              (n) => n.id !== id
            );
            const newUnreadCount = wasUnread
              ? state.unreadCount - 1
              : state.unreadCount;

            return {
              notifications: updatedNotifications,
              unreadCount: Math.max(0, newUnreadCount),
            };
          });
        },

        clearNotifications: () => {
          set({
            notifications: [],
            unreadCount: 0,
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
          });
        },

        // WebSocket actions
        connectWebSocket: async (token) => {
          try {
            set({ isLoading: true, error: null });

            // Set up WebSocket event listeners
            websocketService.on(
              "connectionStatus",
              (status: WebSocketConnectionStatus) => {
                set({ connectionStatus: status });
              }
            );

            websocketService.on(
              "notification",
              (notification: WebSocketNotification) => {
                // Convert WebSocket notification to our Notification type
                const newNotification: Notification = {
                  id: notification.id || `ws_${Date.now()}_${Math.random()}`,
                  userId: "", // Will be set by the backend
                  type: notification.type,
                  title: notification.title,
                  message: notification.message,
                  data: notification.data || {},
                  priority: notification.priority,
                  actionUrl: notification.actionUrl,
                  isRead: notification.isRead || false,
                  createdAt: notification.createdAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                get().addNotification(newNotification);
              }
            );

            websocketService.on(
              "systemAnnouncement",
              (announcement: WebSocketNotification) => {
                // Handle system announcements
                const systemNotification: Notification = {
                  id: `system_${Date.now()}_${Math.random()}`,
                  userId: "",
                  type: NotificationType.SYSTEM_ANNOUNCEMENT,
                  title: announcement.title,
                  message: announcement.message,
                  data: announcement.data || {},
                  priority: announcement.priority,
                  actionUrl: announcement.actionUrl,
                  isRead: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                get().addNotification(systemNotification);
              }
            );

            await websocketService.connect(token);
            set({ isLoading: false });
          } catch (error) {
            console.error("Failed to connect WebSocket:", error);
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to connect to notification service",
            });
          }
        },

        disconnectWebSocket: () => {
          websocketService.disconnect();
          set({
            connectionStatus: {
              connected: false,
              reconnectAttempts: 0,
            },
          });
        },

        setConnectionStatus: (status) => {
          set({ connectionStatus: status });
        },

        // Pagination actions
        setPagination: (page, totalPages, totalCount) => {
          set({ currentPage: page, totalPages, totalCount });
        },

        setCurrentPage: (page) => {
          set({ currentPage: page });
        },

        // Loading and error states
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error });
        },

        // Utility actions
        getNotificationById: (id) => {
          return get().notifications.find((n) => n.id === id);
        },

        getUnreadNotifications: () => {
          return get().notifications.filter((n) => !n.isRead);
        },

        getNotificationsByType: (type) => {
          return get().notifications.filter((n) => n.type === type);
        },
      }),
      {
        name: "notification-store",
        partialize: (state) => ({
          notifications: state.notifications.slice(0, 50), // Keep only recent 50 notifications
          unreadCount: state.unreadCount,
          connectionStatus: state.connectionStatus,
        }),
      }
    ),
    {
      name: "notification-store",
    }
  )
);

// Selectors for better performance
export const useNotificationSelectors = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const connectionStatus = useNotificationStore(
    (state) => state.connectionStatus
  );
  const currentPage = useNotificationStore((state) => state.currentPage);
  const totalPages = useNotificationStore((state) => state.totalPages);
  const totalCount = useNotificationStore((state) => state.totalCount);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    connectionStatus,
    currentPage,
    totalPages,
    totalCount,
  };
};
