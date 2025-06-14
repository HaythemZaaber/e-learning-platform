"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AiAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function AiAssistant({ onClose }: AiAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI teaching assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you create course content based on your teaching materials.",
        "Would you like me to analyze your student engagement data?",
        "I can suggest improvements for your course structure based on learning science.",
        "Let me help you draft responses to student questions.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 md:w-96 shadow-lg glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="h-80 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
