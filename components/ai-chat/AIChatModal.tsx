"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquareText,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIChatDrawer } from "./AIChatDrawer";
import { ChatHeader, ChatMessages, ChatInput } from "./";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthStore } from "@/stores/auth.store";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMinimize?: () => void;
  isMinimized?: boolean;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  onToggleMinimize,
  isMinimized = false,
}) => {
  const {
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    clearChat,
    loadChatHistory,
    clearError,
  } = useAIChatStore();

  const { isAuthenticated } = useAuthStore();
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Load chat history when component mounts
  useEffect(() => {
    if (isOpen && isAuthenticated && !hasLoadedHistory) {
      loadChatHistory();
      setHasLoadedHistory(true);
    }
  }, [isOpen, isAuthenticated, hasLoadedHistory, loadChatHistory]);

  const handleSendMessage = async (message: string) => {
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }

    await sendMessage(message);
  };

  const handleClearChat = async () => {
    await clearChat();
  };

  const handleShowHistory = () => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  };

  const handleShowInsights = () => {
    // This will be implemented in the features section
    console.log("Show learning insights");
  };

  if (!isOpen) return null;

  return (
    <AIChatDrawer
      isOpen={isOpen}
      onClose={onClose}
      onToggleMinimize={onToggleMinimize}
      isMinimized={isMinimized}
    />
  );
};

// Floating Chat Button Component
export const FloatingChatButton: React.FC = () => {
  const { isOpen, openChat } = useAIChatStore();
  const { isAuthenticated } = useAuthStore();

  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          onClick={openChat}
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 border-2 border-white/20 backdrop-blur-sm"
        >
          <MessageSquareText className="w-7 h-7" />
        </Button>

        {/* Enhanced Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 -z-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Enhanced Notification badge for unauthenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Minimized Chat Component
export const MinimizedChat: React.FC = () => {
  const { isOpen, isMinimized, openChat, maximizeChat, closeChat } =
    useAIChatStore();
  const { messages } = useAIChatStore();
  const lastMessage = messages[messages.length - 1];

  if (!isOpen || !isMinimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="w-80 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <MessageSquareText className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="font-semibold text-sm">AI Assistant</span>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={maximizeChat}
                className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors duration-200 rounded-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {lastMessage && (
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  <span className="font-medium">
                    {lastMessage.role === "user" ? "You: " : "AI: "}
                  </span>
                  {lastMessage.content}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
