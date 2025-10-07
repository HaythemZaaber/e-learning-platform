"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Bot,
  Clock,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ChatMessage, CourseRecommendation } from "@/types/aiChatTypes";
import Link from "next/link";

interface MessageBubbleProps {
  message: ChatMessage;
  onCopyMessage?: (content: string) => void;
  onRateMessage?: (messageId: string, rating: "up" | "down") => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onCopyMessage,
  onRateMessage,
}) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const hasError = !!message.error;
  const isLoading = message.isLoading;

  const handleCopy = () => {
    if (onCopyMessage) {
      onCopyMessage(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  const handleRate = (rating: "up" | "down") => {
    if (onRateMessage) {
      onRateMessage(message.id, rating);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex gap-3 mb-6 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Enhanced Avatar */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-primary/10">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[85%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Enhanced Message content */}
        <div
          className={cn(
            "rounded-3xl px-5 py-4 shadow-sm border transition-all duration-200 group-hover:shadow-md",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20"
              : hasError
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-card text-card-foreground border-border/50"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {isAssistant &&
          message.suggestions &&
          message.suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 max-w-full">
              {message.suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}

        {/* Related Courses */}
        {isAssistant &&
          message.relatedCourses &&
          message.relatedCourses.length > 0 && (
            <div className="mt-3 space-y-2 max-w-full">
              <p className="text-xs text-muted-foreground font-medium">
                Related courses:
              </p>
              {message.relatedCourses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

        {/* Enhanced Message actions */}
        {isAssistant && !isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="flex items-center gap-1 mt-3 transition-all duration-200"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs hover:bg-primary/10 transition-colors duration-200 rounded-lg"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-green-50 hover:text-green-600 transition-colors duration-200 rounded-lg"
              onClick={() => handleRate("up")}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-lg"
              onClick={() => handleRate("down")}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        {/* Enhanced Timestamp */}
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/70">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Enhanced User avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-primary/10">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Course card component for displaying related courses
const CourseCard: React.FC<{ course: CourseRecommendation }> = ({ course }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {course.thumbnail && (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{course.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{course.avgRating.toFixed(1)}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
              <span className="text-xs font-medium">${course.price}</span>
            </div>
          </div>
        </div>
        <Link href={`/courses/${course.id}`} className="mt-2 block">
          <Button size="sm" className="w-full text-xs">
            View Course
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
