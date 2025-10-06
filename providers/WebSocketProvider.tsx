"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useNotificationStore } from "@/stores/notification.store";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { isSignedIn, getToken } = useAuth();
  const { connectWebSocket, disconnectWebSocket, connectionStatus } =
    useNotificationStore();

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isSignedIn && !connectionStatus.connected) {
        try {
          // Provide token getter to websocket service to avoid using hooks in service
          import("@/services/websocket.service").then(({ default: ws }) => {
            ws.setTokenProvider(async () => await getToken());
          });

          const token = await getToken();
          if (token) {
            console.log("Initializing WebSocket connection...");
            await connectWebSocket(token);
          }
        } catch (error) {
          console.error("Failed to initialize WebSocket connection:", error);
        }
      }
    };

    initializeWebSocket();
  }, [isSignedIn, connectionStatus.connected, getToken, connectWebSocket]);

  // Cleanup on unmount or when user signs out
  useEffect(() => {
    if (!isSignedIn && connectionStatus.connected) {
      console.log("Disconnecting WebSocket...");
      disconnectWebSocket();
    }
  }, [isSignedIn, connectionStatus.connected, disconnectWebSocket]);

  return <>{children}</>;
};
