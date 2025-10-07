"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Bot, Brain, Zap } from "lucide-react";

interface LoadingStatesProps {
  type: "thinking" | "generating" | "analyzing" | "searching";
  message?: string;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type,
  message,
}) => {
  const getLoadingConfig = () => {
    const configs = {
      thinking: {
        icon: Brain,
        title: "AI is thinking...",
        description: message || "Processing your request with advanced AI",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      generating: {
        icon: Sparkles,
        title: "Generating response...",
        description: message || "Creating personalized content for you",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      analyzing: {
        icon: Bot,
        title: "Analyzing data...",
        description: message || "Examining your learning patterns",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      searching: {
        icon: Zap,
        title: "Searching...",
        description: message || "Finding the best recommendations",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
    };
    return configs[type];
  };

  const config = getLoadingConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3 mb-4"
    >
      {/* Enhanced AI Avatar with pulse */}
      <div className="flex-shrink-0 relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-primary/20">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Enhanced Loading Card */}
      <Card className={cn("max-w-md shadow-lg border-2", config.bgColor, config.borderColor)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className={cn("flex-shrink-0", config.color)}
            >
              <Icon className="w-5 h-5" />
            </motion.div>

            <div className="flex-1">
              <h4 className={cn("font-semibold text-sm", config.color)}>
                {config.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>
          </div>

          {/* Enhanced Animated dots */}
          <div className="flex gap-1.5 mt-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full bg-current"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
                style={{
                  color: config.color
                    .replace("text-", "")
                    .replace("-600", "-400"),
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Skeleton loading for message bubbles
export const MessageSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 mb-4"
    >
      {/* Enhanced Avatar skeleton */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-muted to-muted/60 animate-pulse flex-shrink-0 shadow-sm" />

      {/* Enhanced Message skeleton */}
      <div className="flex-1 max-w-md">
        <div className="rounded-2xl px-4 py-3 bg-gradient-to-r from-muted to-muted/60 animate-pulse shadow-sm border border-border/20">
          <div className="space-y-2">
            <motion.div 
              className="h-3 bg-background/20 rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="h-3 bg-background/20 rounded w-1/2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Pulse animation for buttons
export const PulseButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => {
  return (
    <motion.button
      className={cn("relative", className)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-full bg-current opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

// Shimmer effect for loading cards
export const ShimmerCard: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
