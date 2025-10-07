"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Search,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { HelpTopic } from "@/types/aiChatTypes";
import { useAIChatStore } from "@/stores/aiChat.store";

interface HelpTopicsProps {
  onClose?: () => void;
  onSelectQuestion?: (question: string) => void;
}

export const HelpTopics: React.FC<HelpTopicsProps> = ({
  onClose,
  onSelectQuestion,
}) => {
  const { loadHelpTopics, helpTopics, helpExamples, isLoading } =
    useAIChatStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (helpTopics.length === 0) {
      loadHelpTopics();
    }
  }, [helpTopics.length, loadHelpTopics]);

  const filteredTopics = helpTopics.filter((topic) => {
    const matchesSearch =
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.questions.some((q) =>
        q.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuestionClick = (question: string) => {
    if (onSelectQuestion) {
      onSelectQuestion(question);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      "Course Selection": <BookOpen className="w-4 h-4" />,
      "Learning Guidance": <Lightbulb className="w-4 h-4" />,
      "Platform Features": <Settings className="w-4 h-4" />,
      "Career Development": <TrendingUp className="w-4 h-4" />,
      "Technical Support": <HelpCircle className="w-4 h-4" />,
    };
    return icons[category] || <MessageSquare className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Course Selection": "bg-blue-100 text-blue-800 border-blue-200",
      "Learning Guidance": "bg-green-100 text-green-800 border-green-200",
      "Platform Features": "bg-purple-100 text-purple-800 border-purple-200",
      "Career Development": "bg-orange-100 text-orange-800 border-orange-200",
      "Technical Support": "bg-red-100 text-red-800 border-red-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const categories = [...new Set(helpTopics.map((topic) => topic.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading help topics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions and get help
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search help topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Quick Examples */}
      {helpExamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Try asking these questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {helpExamples.slice(0, 6).map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuestionClick(example)}
                  className="justify-start text-xs h-auto p-2 text-left hover:bg-primary/5"
                >
                  <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">{example}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Topics */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium mb-2">No topics found</h4>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or browse all categories
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        getCategoryColor(topic.category)
                      )}
                    >
                      {getCategoryIcon(topic.category)}
                    </div>
                    {topic.category}
                    <Badge variant="secondary" className="ml-auto">
                      {topic.questions.length} questions
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {topic.questions.map((question, qIndex) => (
                      <Button
                        key={qIndex}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuestionClick(question)}
                        className="justify-start text-left h-auto p-3 hover:bg-primary/5 group"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm line-clamp-2 flex-1">
                            {question}
                          </span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Still need help?</h4>
              <p className="text-xs text-muted-foreground">
                Can't find what you're looking for? Ask our AI assistant or
                contact support.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
