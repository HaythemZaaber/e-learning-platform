"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SmartAssistantProps {
  data: any;
  updateData: (data: any) => void;
  onClose: () => void;
}

export function SmartAssistant({
  data,
  updateData,
  onClose,
}: SmartAssistantProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your course creation assistant. How can I help you today?",
    },
  ]);

  const handleSendMessage = () => {
    if (!query.trim()) return;

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: query }]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      let response = "";

      if (query.toLowerCase().includes("description")) {
        response =
          "Based on your course content, here's a suggested description: 'Master the fundamentals and advanced concepts of your subject with this comprehensive course. Perfect for beginners and intermediate learners looking to enhance their skills.'";
      } else if (query.toLowerCase().includes("structure")) {
        response =
          "For your course type, I recommend structuring it with these sections: 1) Introduction & Fundamentals, 2) Core Concepts, 3) Practical Applications, 4) Advanced Techniques, and 5) Final Project & Conclusion.";
      } else if (query.toLowerCase().includes("title")) {
        response =
          "Based on your content, here are some title suggestions: 'Complete Guide to Mastering Your Subject', 'From Beginner to Pro: Comprehensive Course', or 'The Ultimate Learning Path'.";
      } else {
        response =
          "I'm here to help with your course creation. You can ask me for suggestions on course descriptions, structure, titles, or any other aspect of your course.";
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsLoading(false);
    }, 1500);

    setQuery("");
  };

  const handleApplySuggestion = (suggestion: string, type: string) => {
    if (type === "description") {
      updateData({ description: suggestion });
    } else if (type === "title") {
      updateData({ title: suggestion });
    }
  };

  return (
    // <Sheet open={true} onOpenChange={onClose}>
    //   <SheetContent className="w-full sm:max-w-md overflow-y-auto">
    //     <SheetHeader className="mb-6">
    //       <SheetTitle className="text-xl flex items-center gap-2">
    //         <Bot className="h-5 w-5" />
    //         Smart Course Assistant
    //       </SheetTitle>
    //       <Button
    //         variant="ghost"
    //         size="icon"
    //         className="absolute right-4 top-4"
    //         onClick={onClose}
    //       >
    //         <X className="h-4 w-4" />
    //       </Button>
    //     </SheetHeader>
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600  "
            >
              <span className=" text-lg cursor-pointer">X</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Master the fundamentals and advanced concepts of your
                    subject with this comprehensive course. Perfect for
                    beginners and intermediate learners looking to enhance their
                    skills.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleApplySuggestion(
                        "Master the fundamentals and advanced concepts of your subject with this comprehensive course. Perfect for beginners and intermediate learners looking to enhance their skills.",
                        "description"
                      )
                    }
                  >
                    Apply Suggestion
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Course Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 mb-4">
                    <li>• Introduction & Fundamentals</li>
                    <li>• Core Concepts</li>
                    <li>• Practical Applications</li>
                    <li>• Advanced Techniques</li>
                    <li>• Final Project & Conclusion</li>
                  </ul>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply Structure
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Title Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm mb-2">
                      Complete Guide to Mastering Your Subject
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleApplySuggestion(
                          "Complete Guide to Mastering Your Subject",
                          "title"
                        )
                      }
                    >
                      Apply
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm mb-2">
                      From Beginner to Pro: Comprehensive Course
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleApplySuggestion(
                          "From Beginner to Pro: Comprehensive Course",
                          "title"
                        )
                      }
                    >
                      Apply
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm mb-2">The Ultimate Learning Path</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleApplySuggestion(
                          "The Ultimate Learning Path",
                          "title"
                        )
                      }
                    >
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">SEO Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Suggested tags: online learning, education, course,
                    professional development, skills
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply Tags
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="chat"
              className="h-[calc(100vh-12rem)] flex flex-col"
            >
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask for suggestions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!query.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
