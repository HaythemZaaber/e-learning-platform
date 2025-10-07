"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquareText,
  X,
  Minimize2,
  Maximize2,
  Bot,
  Target,
  BarChart3,
  Map,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { ChatHeader, ChatMessages, ChatInput } from "./";
import {
  CourseRecommendations,
  LearningInsights,
  LearningPathCreator,
  HelpTopics,
} from "./features";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthStore } from "@/stores/auth.store";

type ChatView =
  | "chat"
  | "recommendations"
  | "insights"
  | "learning-path"
  | "help";

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMinimize?: () => void;
  isMinimized?: boolean;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  onToggleMinimize,
  isMinimized = false,
}) => {
  const [currentView, setCurrentView] = useState<ChatView>("chat");
  const [previousView, setPreviousView] = useState<ChatView>("chat");

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

  const handleSendMessage = async (message: string) => {
    if (!isAuthenticated) return;
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
    setPreviousView(currentView);
    setCurrentView("insights");
  };

  const handleBackToChat = () => {
    setCurrentView(previousView);
  };

  const handleQuestionSelect = (question: string) => {
    setCurrentView("chat");
    handleSendMessage(question);
  };

  const getViewIcon = (view: ChatView) => {
    const icons = {
      chat: MessageSquareText,
      recommendations: Target,
      insights: BarChart3,
      "learning-path": Map,
      help: HelpCircle,
    };
    return icons[view];
  };

  const getViewTitle = (view: ChatView) => {
    const titles = {
      chat: "AI Chat",
      recommendations: "Course Recommendations",
      insights: "Learning Insights",
      "learning-path": "Learning Path Creator",
      help: "Help & Support",
    };
    return titles[view];
  };

  const featureButtons = [
    {
      id: "recommendations" as ChatView,
      label: "Recommendations",
      icon: Target,
      description: "Find courses that match your interests",
      color: "bg-blue-500",
    },
    {
      id: "insights" as ChatView,
      label: "Learning Insights",
      icon: BarChart3,
      description: "Analyze your learning progress",
      color: "bg-green-500",
    },
    {
      id: "learning-path" as ChatView,
      label: "Learning Path",
      icon: Map,
      description: "Create a personalized roadmap",
      color: "bg-purple-500",
    },
    {
      id: "help" as ChatView,
      label: "Help Center",
      icon: HelpCircle,
      description: "Get support and answers",
      color: "bg-orange-500",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Custom backdrop with lighter blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative h-[90vh] sm:h-[85vh] w-[100vw] sm:w-[95vw] md:w-[700px] lg:w-[800px] max-w-none border-0 shadow-2xl bg-background sm:rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back button for non-chat views */}
              {currentView !== "chat" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChat}
                  className="p-2 hover:bg-primary/10 transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}

              {/* AI Avatar with enhanced design */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                {/* Online indicator with pulse */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background shadow-sm">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {getViewTitle(currentView)}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="hidden sm:inline">
                    {currentView === "chat"
                      ? "Your intelligent learning companion"
                      : "Powered by advanced AI"}
                  </span>
                  <span className="sm:hidden">
                    {currentView === "chat" ? "AI Assistant" : "AI Powered"}
                  </span>
                </p>
              </div>
            </div>

            {/* Enhanced Window Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="p-2 hover:bg-primary/10 transition-colors duration-200 rounded-lg"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Compact Feature Navigation (only in chat view) */}
          {currentView === "chat" && (
            <div className="flex-shrink-0 p-3 border-b border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Quick Actions
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {featureButtons.map((button) => {
                    const Icon = button.icon;
                    return (
                      <motion.div
                        key={button.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setCurrentView(button.id)}
                          className="h-12 p-2 flex items-center gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 border group"
                        >
                          <div
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200",
                              button.color
                            )}
                          >
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-xs truncate">
                            {button.label}
                          </span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {currentView === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Messages Container - Properly sized and scrollable */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ChatMessages messages={messages} isTyping={isTyping} />
                  </div>

                  {/* Enhanced Input - Fixed at bottom */}
                  <div className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              )}

              {currentView === "recommendations" && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 overflow-y-auto p-4"
                >
                  <CourseRecommendations />
                </motion.div>
              )}

              {currentView === "insights" && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 overflow-y-auto p-4"
                >
                  <LearningInsights />
                </motion.div>
              )}

              {currentView === "learning-path" && (
                <motion.div
                  key="learning-path"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 overflow-y-auto p-4"
                >
                  <LearningPathCreator />
                </motion.div>
              )}

              {currentView === "help" && (
                <motion.div
                  key="help"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 overflow-y-auto p-4"
                >
                  <HelpTopics onSelectQuestion={handleQuestionSelect} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
