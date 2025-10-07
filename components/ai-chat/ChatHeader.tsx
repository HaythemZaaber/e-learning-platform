"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bot,
  Minimize2,
  Maximize2,
  X,
  MoreVertical,
  MessageSquare,
  Brain,
  BookOpen,
  BarChart3,
  Settings,
  Trash2,
  History,
  Sparkles,
} from "lucide-react";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthSelectors } from "@/stores/auth.store";

interface ChatHeaderProps {
  onMinimize?: () => void;
  onClose?: () => void;
  onClearChat?: () => void;
  onShowHistory?: () => void;
  onShowInsights?: () => void;
  isMinimized?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMinimize,
  onClose,
  onClearChat,
  onShowHistory,
  onShowInsights,
  isMinimized = false,
}) => {
  const { userRole, isStudent, isInstructor, isAdmin } = useAuthSelectors();

  const getRoleBadge = () => {
    if (!userRole) return null;

    const roleConfig = {
      STUDENT: { label: "Student", color: "bg-blue-100 text-blue-800" },
      INSTRUCTOR: {
        label: "Instructor",
        color: "bg-purple-100 text-purple-800",
      },
      ADMIN: { label: "Admin", color: "bg-red-100 text-red-800" },
    };

    const config = roleConfig[userRole as keyof typeof roleConfig];
    if (!config) return null;

    return (
      <Badge className={cn("text-xs", config.color)}>{config.label}</Badge>
    );
  };

  const getRoleDescription = () => {
    if (isStudent) return "Your AI learning companion";
    if (isInstructor) return "Your AI teaching assistant";
    if (isAdmin) return "Your AI platform assistant";
    return "Your AI assistant";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50"
    >
      {/* Left side - AI Info */}
      <div className="flex items-center gap-3">
        {/* AI Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* AI Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            {getRoleBadge()}
          </div>
          <p className="text-xs text-muted-foreground">
            {getRoleDescription()}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1">
        {/* Feature buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {isStudent && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowInsights}
                className="h-8 w-8 p-0"
                title="Learning Insights"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Course Recommendations"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onShowHistory}
            className="h-8 w-8 p-0"
            title="Chat History"
          >
            <History className="w-4 h-4" />
          </Button>
        </div>

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isStudent && (
              <>
                <DropdownMenuItem onClick={onShowInsights}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Learning Insights
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Course Recommendations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={onShowHistory}>
              <History className="mr-2 h-4 w-4" />
              Chat History
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onClearChat} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Window controls */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-8 w-8 p-0"
            title={isMinimized ? "Maximize" : "Minimize"}
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
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            title="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
