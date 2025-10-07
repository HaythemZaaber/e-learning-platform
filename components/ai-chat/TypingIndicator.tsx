"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
  message = "AI is thinking...",
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 mb-6"
    >
      {/* Enhanced AI Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-primary/10">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Enhanced Typing bubble */}
      <div className="flex flex-col">
        <div className="rounded-3xl px-5 py-4 bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <motion.div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: 0,
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: 0.2,
                }}
              />
              <motion.div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: 0.4,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {message}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
