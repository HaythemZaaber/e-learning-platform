"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useNotificationStore } from "@/stores/notification.store";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { isSignedIn, getToken } = useAuth();
  const { connectWebSocket, disconnectWebSocket, connectionStatus } =
    useNotificationStore();

  useEffect(() => {
    const initializeNotifications = async () => {
      if (isSignedIn && !connectionStatus.connected) {
        try {
          console.log("🔌 Attempting to connect WebSocket...");

          // Set token provider for reconnections
          const { default: websocketService } = await import(
            "@/services/websocket.service"
          );
          websocketService.setTokenProvider(async () => await getToken());

          const token = await getToken();

          if (token) {
            console.log("✅ Token obtained, connecting...");
            console.log("Token preview:", token.substring(0, 20) + "...");
            await connectWebSocket(token);
            console.log("✅ WebSocket connected successfully");
          } else {
            console.error("❌ No token available");
          }
        } catch (error) {
          console.error("❌ Failed to initialize notifications:", error);
        }
      }
    };

    initializeNotifications();
  }, [isSignedIn, connectionStatus.connected, getToken, connectWebSocket]);

  // Cleanup on unmount or when user signs out
  useEffect(() => {
    if (!isSignedIn && connectionStatus.connected) {
      console.log("👋 User signed out, disconnecting WebSocket");
      disconnectWebSocket();
    }
  }, [isSignedIn, connectionStatus.connected, disconnectWebSocket]);

  // Debug connection status
  useEffect(() => {
    console.log("📡 Connection Status:", connectionStatus);
  }, [connectionStatus]);

  return <>{children}</>;
};
