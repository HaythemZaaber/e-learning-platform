"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthStore } from "@/stores/auth.store";
import { AIChatService } from "@/services/aiChat.service";

interface AIChatContextType {
  isAvailable: boolean;
  service: AIChatService | null;
}

const AIChatContext = createContext<AIChatContextType>({
  isAvailable: false,
  service: null,
});

interface AIChatProviderProps {
  children: ReactNode;
}

export const AIChatProvider: React.FC<AIChatProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { getToken } = useAuth();
  const { loadHelpTopics, openChat, setAuthTokenGetter } = useAIChatStore();
  const [service] = React.useState(
    () => new AIChatService(process.env.NEXT_PUBLIC_API_URL || "/api", getToken)
  );
  const [isAvailable, setIsAvailable] = React.useState(false);

  // Set auth token getter in the store
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken, setAuthTokenGetter]);

  // Check AI chat availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await service.checkAvailability();
        setIsAvailable(available);

        if (available) {
          // Preload help topics
          loadHelpTopics();
        }
      } catch (error) {
        console.error("Failed to check AI chat availability:", error);
        setIsAvailable(false);
      }
    };

    checkAvailability();
  }, [service, loadHelpTopics]);

  // Show welcome message for new users
  useEffect(() => {
    if (isAuthenticated && isAvailable) {
      // You could add logic here to show a welcome tooltip or notification
      // about the AI assistant for first-time users
    }
  }, [isAuthenticated, isAvailable]);

  const contextValue: AIChatContextType = {
    isAvailable,
    service,
  };

  return (
    <AIChatContext.Provider value={contextValue}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChatContext = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChatContext must be used within an AIChatProvider");
  }
  return context;
};
