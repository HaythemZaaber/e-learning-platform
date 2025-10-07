"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatMessage } from "@/types/aiChatTypes";
import { useAIChatStore } from "@/stores/aiChat.store";
import { ChevronDown, MessageSquareText } from "lucide-react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onCopyMessage?: (content: string) => void;
  onRateMessage?: (messageId: string, rating: "up" | "down") => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  onCopyMessage,
  onRateMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    };

    // Use a small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  // Also scroll on component mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  // Handle scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  // Handle copy to clipboard
  const handleCopyMessage = (content: string) => {
    if (onCopyMessage) {
      onCopyMessage(content);
    } else {
      navigator.clipboard.writeText(content);
      // You could add a toast notification here
    }
  };

  // Handle message rating
  const handleRateMessage = (messageId: string, rating: "up" | "down") => {
    if (onRateMessage) {
      onRateMessage(messageId, rating);
    }
    // You could add analytics tracking here
  };

  return (
    <div className="relative h-full flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquareText className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">
                Ask me anything about learning, courses, or the platform!
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MessageBubble
                message={message}
                onCopyMessage={handleCopyMessage}
                onRateMessage={handleRateMessage}
              />
            </motion.div>
          ))}

          {/* Typing indicator */}
          <TypingIndicator isVisible={isTyping} />
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />

        {/* Enhanced Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-4 right-4 z-10"
            >
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-200 backdrop-blur-sm border-2 border-white/20"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
