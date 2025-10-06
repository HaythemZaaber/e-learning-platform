import { useNotificationStore } from "@/stores/notification.store";

/**
 * Hook to access the WebSocket connection
 * Uses the global socket from notification store to avoid duplicate connections
 */
export function useWebSocket() {
  const { socket, connectionStatus } = useNotificationStore();

  return {
    socket,
    connected: connectionStatus.connected,
  };
}
