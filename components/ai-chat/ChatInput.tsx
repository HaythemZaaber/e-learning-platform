"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAIChatStore } from "@/stores/aiChat.store";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask me anything about learning, courses, or the platform...",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setCurrentMessage } = useAIChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      // Add haptic feedback if available
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
      onSendMessage(message.trim());
      setMessage("");
      setCurrentMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceRecording = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setCurrentMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const quickActions = [
    { text: "Recommend courses", icon: "🎯" },
    { text: "Study tips", icon: "📚" },
    { text: "Learning path", icon: "🛤️" },
    { text: "Help me", icon: "❓" },
  ];

  const handleQuickAction = (action: string) => {
    // Add haptic feedback if available
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
    setMessage(action);
    setCurrentMessage(action);
  };

  return (
    <div className="border-t border-border/50 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm p-4 sm:p-6">
      {/* Enhanced Quick Actions */}
      <div className="mb-4 flex flex-wrap gap-2 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 hover:bg-primary/10 hover:border-primary/20 transition-all duration-200 rounded-lg border-2 whitespace-nowrap"
              onClick={() => handleQuickAction(action.text)}
              disabled={isLoading || disabled}
            >
              <span className="mr-1.5">{action.icon}</span>
              <span className="hidden sm:inline">{action.text}</span>
              <span className="sm:hidden">{action.text.split(" ")[0]}</span>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-3">
          {/* Enhanced Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setCurrentMessage(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading || disabled}
              className={cn(
                "min-h-[48px] max-h-32 resize-none pr-14 rounded-2xl border-2 focus:border-primary/50 transition-all duration-200 bg-card/50 backdrop-blur-sm",
                "placeholder:text-muted-foreground/60 focus:bg-card focus:shadow-lg"
              )}
              rows={1}
            />

            {/* Enhanced AI Indicator */}
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Voice Recording */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceRecording}
              disabled={isLoading || disabled}
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl transition-all duration-200",
                isRecording
                  ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-lg animate-pulse"
                  : "hover:bg-primary/10 hover:shadow-md"
              )}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>

            {/* Enhanced Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Character count and tips */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span>
            {message.length > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "px-2 py-1 rounded-full transition-colors duration-200 text-xs font-medium",
                  message.length > 500
                    ? "text-orange-600 bg-orange-100"
                    : message.length > 300
                    ? "text-blue-600 bg-blue-100"
                    : "text-muted-foreground bg-muted/50"
                )}
              >
                {message.length} chars
              </motion.span>
            )}
          </span>
          <span className="text-muted-foreground/70 flex items-center gap-1">
            <span className="hidden sm:inline">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className="sm:hidden">Enter to send</span>
          </span>
        </div>
      </form>
    </div>
  );
};
