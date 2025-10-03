"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Send,
  X,
  Lightbulb,
  BarChart3,
  Wand2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Search,
  Sparkles,
  MessageSquare,
  BookOpen,
  PenTool,
  Loader2,
  Star,
  Zap,
  FileText,
  Award,
  Clock,
  DollarSign,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { SuggestionType, ContentType } from "../services/aiAssistantService";
import { ContentViewer } from "./ContentViewer";
import { ContentPreviewModal } from "./ContentPreviewModal";
import { toast } from "sonner";

interface SmartAssistantProps {
  data: any;
  updateData: (data: any) => void;
  onClose: () => void;
  contentByLecture?: any;
  currentStep?: number;
}

interface GenerationRequest {
  type: ContentType;
  title: string;
  description: string;
  icon: any;
}

export function SmartAssistant({
  data,
  updateData,
  onClose,
  contentByLecture = {},
  currentStep = 0,
}: SmartAssistantProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [query, setQuery] = useState("");
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    content: any;
    type: string;
    title: string;
  }>({
    isOpen: false,
    content: null,
    type: "",
    title: "",
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isApplyingSuggestionRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const {
    suggestions,
    analysis,
    chatHistory,
    generatedContent,
    selectedSuggestionType,
    loadingStates,
    generateSuggestions,
    analyzeCourse,
    sendChatMessage,
    generateContent,
    removeSuggestion,
    clearStoredData,
    changeSuggestionType,
  } = useAIAssistant();

  const suggestionTypes = [
    {
      type: SuggestionType.GENERAL,
      title: "General Suggestions",
      description: "Comprehensive suggestions for overall course improvement",
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      type: SuggestionType.TITLE,
      title: "Title Optimization",
      description: "Improve your course title for better engagement",
      icon: PenTool,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      type: SuggestionType.DESCRIPTION,
      title: "Description Enhancement",
      description: "Make your course description more compelling",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      type: SuggestionType.STRUCTURE,
      title: "Course Structure",
      description: "Optimize your course organization and flow",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      type: SuggestionType.SEO,
      title: "SEO Optimization",
      description: "Improve search visibility and discoverability",
      icon: Search,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      type: SuggestionType.PRICING,
      title: "Pricing Strategy",
      description: "Get recommendations for optimal pricing",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      type: SuggestionType.CONTENT,
      title: "Content Quality",
      description: "Enhance your course content and materials",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  const generationRequests: GenerationRequest[] = [
    {
      type: ContentType.LECTURE_OUTLINE,
      title: "Lecture Outlines",
      description:
        "Creates comprehensive outlines for each lecture including learning objectives, key topics to cover, estimated duration, and suggested teaching methods. Perfect for structuring your course content.",
      icon: BookOpen,
    },
    {
      type: ContentType.ASSESSMENT_QUESTIONS,
      title: "Assessment Questions",
      description:
        "Generates 10-15 quiz questions with multiple choice, true/false, and short answer formats. Includes correct answers and detailed explanations to help students learn from their mistakes.",
      icon: FileText,
    },
    {
      type: ContentType.SEO_CONTENT,
      title: "SEO Optimization",
      description:
        "Optimizes your course for search engines with relevant keywords, meta descriptions (150-160 chars), optimized title variations, and tags. Increases course discoverability and student enrollment.",
      icon: Search,
    },
    {
      type: ContentType.MARKETING_COPY,
      title: "Marketing Copy",
      description:
        "Creates compelling marketing materials including a catchy course tagline, 3 key benefits, a social media post (280 characters), and 3 email subject line variations to promote your course effectively.",
      icon: TrendingUp,
    },
  ];
  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Reset initialization flag when dialog opens
  useEffect(() => {
    hasInitializedRef.current = false;
  }, []);

  const handleRefreshSuggestions = useCallback(async () => {
    await generateSuggestions(
      selectedSuggestionType,
      data,
      currentStep,
      contentByLecture
    );
  }, [
    generateSuggestions,
    selectedSuggestionType,
    data,
    currentStep,
    contentByLecture,
  ]);

  // Generate initial suggestions on mount and when course data changes (but not when applying suggestions)
  useEffect(() => {
    if (
      data.title &&
      data.description &&
      !isApplyingSuggestionRef.current &&
      !hasInitializedRef.current
    ) {
      // Check if we already have suggestions for the current type
      const hasExistingSuggestions = suggestions.some(
        (suggestion) =>
          suggestion.type === selectedSuggestionType ||
          (selectedSuggestionType === SuggestionType.GENERAL &&
            suggestions.length > 0)
      );

      // Only generate suggestions if we don't have any for the current type
      if (!hasExistingSuggestions) {
        console.log(
          "No existing suggestions found, generating new ones for type:",
          selectedSuggestionType
        );
        const timer = setTimeout(() => {
          generateSuggestions(
            selectedSuggestionType,
            data,
            currentStep,
            contentByLecture
          );
          hasInitializedRef.current = true;
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        console.log(
          "Existing suggestions found, skipping generation for type:",
          selectedSuggestionType
        );
        // Mark as initialized even if we have existing suggestions
        hasInitializedRef.current = true;
      }
    }
  }, [
    data.title,
    data.description,
    data.category,
    generateSuggestions,
    selectedSuggestionType,
    currentStep,
    contentByLecture,
    suggestions,
  ]);

  const handleAnalyzeCourse = useCallback(async () => {
    const result = await analyzeCourse(data, contentByLecture);
    if (result) {
      setActiveTab("analysis");
    }
  }, [analyzeCourse, data, contentByLecture]);

  const handleSendMessage = useCallback(async () => {
    if (!query.trim()) return;

    const message = query;
    setQuery("");
    await sendChatMessage(message, data, currentStep, contentByLecture);
  }, [query, sendChatMessage, data, currentStep, contentByLecture]);

  const handleGenerateContent = useCallback(
    async (type: ContentType) => {
      await generateContent(type, data, currentStep, contentByLecture);
    },
    [generateContent, data, currentStep, contentByLecture]
  );

  const handleApplySuggestion = useCallback(
    (suggestion: any) => {
      let applied = false;
      let appliedContent = "";

      // Set flag to prevent unwanted refresh
      isApplyingSuggestionRef.current = true;

      // Extract the actual content to apply based on suggestion type
      let contentToApply = "";

      switch (suggestion.type) {
        case "title":
          // For title suggestions, try to extract the actual title from the content
          // Look for patterns like "For example: 'Title here'" or similar
          let titleMatch = suggestion.content?.match(
            /For example:\s*['"]([^'"]+)['"]/
          );
          if (!titleMatch) {
            // Try alternative patterns
            titleMatch = suggestion.content?.match(/['"]([^'"]+)['"]/);
          }
          if (titleMatch) {
            contentToApply = titleMatch[1];
          } else if (suggestion.metadata?.title) {
            contentToApply = suggestion.metadata.title;
          } else {
            // Fallback: use the suggestion title if no specific title is found
            contentToApply = suggestion.title;
          }
          updateData({ title: contentToApply });
          appliedContent = "title";
          applied = true;
          break;
        case "description":
          // For description suggestions, try to extract the actual description from the content
          // Look for patterns like "For example:" followed by the description
          let descMatch = suggestion.content?.match(
            /For example:\s*['"]([^'"]+)['"]/
          );
          if (!descMatch) {
            // Try alternative patterns - look for quoted text that might be the description
            descMatch = suggestion.content?.match(/['"]([^'"]{20,})['"]/);
          }
          if (descMatch) {
            contentToApply = descMatch[1];
          } else if (suggestion.metadata?.description) {
            contentToApply = suggestion.metadata.description;
          } else {
            // Fallback: use the suggestion title if no specific description is found
            contentToApply = suggestion.title;
          }
          updateData({ description: contentToApply });
          appliedContent = "description";
          applied = true;
          break;
        case "structure":
          if (suggestion.metadata?.sections) {
            updateData({ sections: suggestion.metadata.sections });
            appliedContent = "course structure";
            applied = true;
          }
          break;
        case "seo":
          if (suggestion.metadata?.tags) {
            updateData({
              settings: {
                ...data.settings,
                seoTags: suggestion.metadata.tags,
                seoDescription:
                  suggestion.metadata.description || suggestion.content,
              },
            });
            appliedContent = "SEO settings";
            applied = true;
          }
          break;
        case "pricing":
          if (suggestion.metadata?.price !== undefined) {
            updateData({ price: suggestion.metadata.price });
            appliedContent = "pricing";
            applied = true;
          }
          break;
        default:
          toast.info("This suggestion type cannot be automatically applied");
          isApplyingSuggestionRef.current = false;
          return;
      }

      if (applied) {
        removeSuggestion(suggestion.id);
        toast.success(
          `${
            appliedContent
              ? appliedContent.charAt(0).toUpperCase() + appliedContent.slice(1)
              : "Suggestion"
          } applied successfully!`
        );
      } else {
        toast.warning(
          "This suggestion could not be applied. Please check the suggestion details."
        );
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isApplyingSuggestionRef.current = false;
      }, 100);
    },
    [updateData, data.settings, removeSuggestion]
  );

  const handleQuickPrompt = useCallback((prompt: string) => {
    setQuery(prompt);
    setActiveTab("chat");
  }, []);

  const handlePreviewContent = useCallback(
    (type: ContentType, title: string) => {
      const content = generatedContent[type];
      if (content) {
        setPreviewModal({
          isOpen: true,
          content: content.content || content,
          type,
          title,
        });
      }
    },
    [generatedContent]
  );

  const handleClosePreview = useCallback(() => {
    setPreviewModal({
      isOpen: false,
      content: null,
      type: "",
      title: "",
    });
  }, []);

  const handleSuggestionTypeChange = useCallback(
    async (type: SuggestionType) => {
      changeSuggestionType(type);

      // Check if we already have suggestions for this specific type
      const hasExistingSuggestions = suggestions.some((suggestion) => {
        if (type === SuggestionType.GENERAL) {
          // For general type, check if we have any suggestions at all
          return suggestions.length > 0;
        } else {
          // For specific types, check for exact type match
          return suggestion.type === type;
        }
      });

      // Only generate new suggestions if we don't have any for this type
      if (!hasExistingSuggestions) {
        console.log(
          "No existing suggestions for type:",
          type,
          "generating new ones"
        );
        await generateSuggestions(type, data, currentStep, contentByLecture);
      } else {
        console.log(
          "Existing suggestions found for type:",
          type,
          "skipping generation"
        );
      }
    },
    [
      changeSuggestionType,
      suggestions,
      generateSuggestions,
      data,
      currentStep,
      contentByLecture,
    ]
  );

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "title":
        return <PenTool className="h-4 w-4" />;
      case "description":
        return <BookOpen className="h-4 w-4" />;
      case "structure":
        return <Target className="h-4 w-4" />;
      case "seo":
        return <Search className="h-4 w-4" />;
      case "pricing":
        return <DollarSign className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const isSuggestionActionable = useCallback((suggestion: any) => {
    // Check if the suggestion has the actionable flag
    if (suggestion.actionable === false) return false;

    // Check if the suggestion type can be automatically applied
    switch (suggestion.type) {
      case "title":
        return !!suggestion.content;
      case "description":
        return !!suggestion.content;
      case "structure":
        return !!suggestion.metadata?.sections;
      case "seo":
        return !!suggestion.metadata?.tags;
      case "pricing":
        return suggestion.metadata?.price !== undefined;
      default:
        return false;
    }
  }, []);

  // Filter suggestions by the selected type
  const getFilteredSuggestions = useCallback(() => {
    if (selectedSuggestionType === SuggestionType.GENERAL) {
      // For general type, show all suggestions
      return suggestions;
    } else {
      // For specific types, show only suggestions of that type
      return suggestions.filter(
        (suggestion) => suggestion.type === selectedSuggestionType
      );
    }
  }, [suggestions, selectedSuggestionType]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col pb-1">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span>AI Course Assistant</span>
            </div>
            <div className="flex items-center gap-2 ml-auto ">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStoredData}
                className="h-8 px-2 text-xs text-gray-500 hover:text-white mr-4 "
                title="Clear all AI Assistant data"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear Data
              </Button>
              {/* <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col min-h-0"
          >
            <TabsList className="grid grid-cols-4 flex-shrink-0">
              <TabsTrigger
                value="suggestions"
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Suggestions
                {suggestions.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-5 text-xs"
                  >
                    {suggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analysis
                {analysis && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden min-h-0">
              {/* SUGGESTIONS TAB */}
              <TabsContent
                value="suggestions"
                className="h-full flex flex-col data-[state=active]:flex data-[state=active]:flex-col min-h-0"
              >
                <div className="flex items-center justify-between flex-shrink-0 p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    AI Suggestions
                  </h3>
                  <Button
                    onClick={handleRefreshSuggestions}
                    disabled={loadingStates.suggestions}
                    variant="outline"
                    size="sm"
                  >
                    {loadingStates.suggestions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Refresh</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 min-h-full space-y-6">
                      {/* Suggestion Type Selector - Now scrolls with content */}
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Suggestion Type:
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {suggestionTypes.map((suggestionType) => {
                              const IconComponent = suggestionType.icon;
                              const isSelected =
                                selectedSuggestionType === suggestionType.type;

                              return (
                                <button
                                  key={suggestionType.type}
                                  onClick={() =>
                                    handleSuggestionTypeChange(
                                      suggestionType.type
                                    )
                                  }
                                  disabled={loadingStates.suggestions}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isSelected
                                      ? `${suggestionType.borderColor} ${suggestionType.bgColor} border-opacity-100 shadow-md`
                                      : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <IconComponent
                                      className={`h-4 w-4 ${
                                        isSelected
                                          ? suggestionType.color
                                          : "text-gray-500"
                                      }`}
                                    />
                                    <span
                                      className={`text-xs font-medium ${
                                        isSelected
                                          ? suggestionType.color
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {suggestionType.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 leading-tight">
                                    {suggestionType.description}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {/* Current Suggestion Type Header */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const currentType = suggestionTypes.find(
                              (t) => t.type === selectedSuggestionType
                            );
                            const IconComponent =
                              currentType?.icon || Lightbulb;
                            return (
                              <>
                                <IconComponent
                                  className={`h-4 w-4 ${
                                    currentType?.color || "text-blue-600"
                                  }`}
                                />
                                <span className="text-sm font-medium text-blue-800">
                                  {currentType?.title || "General Suggestions"}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="ml-auto bg-blue-100 text-blue-700"
                                >
                                  {getFilteredSuggestions().length} suggestions
                                </Badge>
                              </>
                            );
                          })()}
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          {
                            suggestionTypes.find(
                              (t) => t.type === selectedSuggestionType
                            )?.description
                          }
                        </p>
                      </div>

                      {/* Suggestions Content */}
                      {loadingStates.suggestions ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600">
                              Generating{" "}
                              {suggestionTypes
                                .find((t) => t.type === selectedSuggestionType)
                                ?.title.toLowerCase()}
                              ...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              This may take a few moments
                            </p>
                          </div>
                        </div>
                      ) : getFilteredSuggestions().length > 0 ? (
                        <div className="space-y-4">
                          {getFilteredSuggestions().map((suggestion) => (
                            <Card
                              key={suggestion.id}
                              className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    {getSuggestionIcon(suggestion.type)}
                                    {suggestion.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div
                                        className={`w-2 h-2 rounded-full ${getConfidenceColor(
                                          suggestion.confidence
                                        )}`}
                                      />
                                      <span className="text-xs text-gray-500">
                                        {Math.round(
                                          suggestion.confidence * 100
                                        )}
                                        %
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {suggestion.type}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm leading-relaxed">
                                  {suggestion.content}
                                </p>
                                <div className="bg-blue-50 border-l-4 border-l-blue-400 p-3 rounded-r">
                                  <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                                    <Lightbulb className="h-3 w-3" />
                                    Why this helps:
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1">
                                    {suggestion.reasoning}
                                  </p>
                                </div>
                                {isSuggestionActionable(suggestion) && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApplySuggestion(suggestion)
                                    }
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Apply Suggestion
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          {(() => {
                            const currentType = suggestionTypes.find(
                              (t) => t.type === selectedSuggestionType
                            );
                            const IconComponent =
                              currentType?.icon || Lightbulb;
                            return (
                              <>
                                <IconComponent
                                  className={`h-16 w-16 mx-auto mb-4 opacity-30 ${
                                    currentType?.color || "text-gray-400"
                                  }`}
                                />
                                <h4 className="font-medium mb-2">
                                  No {currentType?.title.toLowerCase()}{" "}
                                  available
                                </h4>
                                <p className="text-sm mb-4">
                                  {selectedSuggestionType ===
                                  SuggestionType.GENERAL
                                    ? "Add more course details to get comprehensive AI suggestions."
                                    : `Generate specific ${currentType?.title.toLowerCase()} for your course.`}
                                </p>
                                <Button
                                  onClick={handleRefreshSuggestions}
                                  variant="outline"
                                  disabled={loadingStates.suggestions}
                                  className="bg-white hover:bg-gray-50"
                                >
                                  <Wand2 className="h-4 w-4 mr-2" />
                                  Generate {currentType?.title}
                                </Button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              {/* CHAT TAB */}
              <TabsContent
                value="chat"
                className="h-full flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 space-y-4 min-h-full">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-4 py-3 ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900 border"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.role === "assistant" && (
                                <Bot className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {loadingStates.chat && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-lg px-4 py-3 bg-gray-100 border">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-gray-600">
                                AI is thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-2 p-4 border-t bg-gray-50">
                  <Input
                    placeholder="Ask about course creation, get suggestions, or request specific help..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                    disabled={loadingStates.chat}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!query.trim() || loadingStates.chat}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Help me improve my course title",
                      "What's missing from my course?",
                      "How should I structure this course?",
                      "Suggest a good price for my course",
                    ].map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleQuickPrompt(prompt)}
                        disabled={loadingStates.chat}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              {/* ANALYSIS TAB */}
              <TabsContent
                value="analysis"
                className="h-full flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between flex-shrink-0 p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Course Analysis
                  </h3>
                  <Button
                    onClick={handleAnalyzeCourse}
                    disabled={loadingStates.analysis}
                    variant="outline"
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {loadingStates.analysis ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    {analysis ? "Refresh Analysis" : "Analyze Course"}
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                  {loadingStates.analysis ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                        <p className="text-gray-600">
                          Analyzing your course...
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          This comprehensive analysis may take a moment
                        </p>
                      </div>
                    </div>
                  ) : analysis ? (
                    <ScrollArea className="h-full min-h-0">
                      <div className="p-4 space-y-6 min-h-full">
                        {/* Overall Score Summary */}
                        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-800">
                              <Award className="h-5 w-5" />
                              Overall Course Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div
                                  className={`text-2xl font-bold ${getScoreColor(
                                    analysis.completeness.score
                                  )}`}
                                >
                                  {analysis.completeness.score}%
                                </div>
                                <p className="text-sm text-gray-600">
                                  Completeness
                                </p>
                              </div>
                              <div className="text-center">
                                <div
                                  className={`text-2xl font-bold ${getScoreColor(
                                    analysis.quality.score
                                  )}`}
                                >
                                  {analysis.quality.score}%
                                </div>
                                <p className="text-sm text-gray-600">Quality</p>
                              </div>
                              <div className="text-center">
                                <div
                                  className={`text-2xl font-bold ${getScoreColor(
                                    analysis.marketability.score
                                  )}`}
                                >
                                  {analysis.marketability.score}%
                                </div>
                                <p className="text-sm text-gray-600">
                                  Marketability
                                </p>
                              </div>
                              <div className="text-center">
                                <div
                                  className={`text-2xl font-bold ${getScoreColor(
                                    analysis.seo.score
                                  )}`}
                                >
                                  {analysis.seo.score}%
                                </div>
                                <p className="text-sm text-gray-600">SEO</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Completeness Score */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-blue-600" />
                              Completeness Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Progress
                                value={analysis.completeness.score}
                                className="flex-1"
                              />
                              <span
                                className={`font-bold text-2xl ${getScoreColor(
                                  analysis.completeness.score
                                )}`}
                              >
                                {analysis.completeness.score}%
                              </span>
                            </div>

                            {analysis.completeness.missingElements.length >
                              0 && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Missing Elements:
                                </h4>
                                <ul className="space-y-1">
                                  {analysis.completeness.missingElements.map(
                                    (element, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-red-700"
                                      >
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        {element}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {analysis.completeness.recommendations.length >
                              0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4" />
                                  Recommendations:
                                </h4>
                                <ul className="space-y-1">
                                  {analysis.completeness.recommendations.map(
                                    (rec, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-blue-700"
                                      >
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        {rec}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Quality & Marketability */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-green-600" />
                                Quality Assessment
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Progress
                                  value={analysis.quality.score}
                                  className="flex-1"
                                />
                                <span
                                  className={`font-bold text-xl ${getScoreColor(
                                    analysis.quality.score
                                  )}`}
                                >
                                  {analysis.quality.score}%
                                </span>
                              </div>

                              <div className="space-y-3">
                                {analysis.quality.strengths.length > 0 && (
                                  <div>
                                    <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4" />
                                      Strengths:
                                    </h5>
                                    <ul className="text-xs space-y-1 text-green-600">
                                      {analysis.quality.strengths.map(
                                        (strength, index) => (
                                          <li
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                                            {strength}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {analysis.quality.improvements.length > 0 && (
                                  <div>
                                    <h5 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                                      <Zap className="h-4 w-4" />
                                      Areas for Improvement:
                                    </h5>
                                    <ul className="text-xs space-y-1 text-orange-600">
                                      {analysis.quality.improvements.map(
                                        (improvement, index) => (
                                          <li
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-1 h-1 bg-orange-500 rounded-full" />
                                            {improvement}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                Market Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Progress
                                  value={analysis.marketability.score}
                                  className="flex-1"
                                />
                                <span
                                  className={`font-bold text-xl ${getScoreColor(
                                    analysis.marketability.score
                                  )}`}
                                >
                                  {analysis.marketability.score}%
                                </span>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium mb-1">
                                    Competition Level:
                                  </h5>
                                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    {analysis.marketability.competitiveness}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium mb-2">
                                    Target Audience:
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {analysis.marketability.targetAudience.map(
                                      (audience, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          <Users className="h-3 w-3 mr-1" />
                                          {audience}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>

                                {analysis.marketability
                                  .pricingRecommendation && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <h5 className="text-sm font-medium text-green-800 mb-1">
                                      Recommended Price:
                                    </h5>
                                    <p className="text-lg font-bold text-green-700 flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      {
                                        analysis.marketability
                                          .pricingRecommendation
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* SEO Analysis */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Search className="h-5 w-5 text-indigo-600" />
                              SEO Optimization
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Progress
                                value={analysis.seo.score}
                                className="flex-1"
                              />
                              <span
                                className={`font-bold text-xl ${getScoreColor(
                                  analysis.seo.score
                                )}`}
                              >
                                {analysis.seo.score}%
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Search className="h-4 w-4" />
                                  Recommended Keywords:
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {analysis.seo.keywords.map(
                                    (keyword, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {keyword}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Zap className="h-4 w-4" />
                                  SEO Improvements:
                                </h5>
                                <ul className="text-xs space-y-1">
                                  {analysis.seo.optimizations.map(
                                    (optimization, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2 text-gray-600"
                                      >
                                        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                        {optimization}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h4 className="font-medium mb-2">
                        No analysis available
                      </h4>
                      <p className="text-sm mb-4">
                        Get detailed insights about your course quality,
                        completeness, and marketability.
                      </p>
                      <Button
                        onClick={handleAnalyzeCourse}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={loadingStates.analysis}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analyze Course
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* GENERATE TAB */}

              <TabsContent
                value="generate"
                className="h-full flex flex-col min-h-0"
              >
                <div className="flex items-center gap-2 flex-shrink-0 p-4">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Content Generation</h3>
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full min-h-0">
                    <div className="p-4 space-y-6 min-h-full">
                      {/* Info Banner */}
                      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-purple-900 mb-1">
                                AI-Powered Content Generation
                              </h4>
                              <p className="text-sm text-purple-700">
                                Generate professional course materials
                                instantly. Click any card below to create
                                content, then copy or download the results to
                                use in your course.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Content Generation Cards */}
                      <div className="grid grid-cols-1 gap-4">
                        {generationRequests.map((request) => {
                          const IconComponent = request.icon;
                          const hasContent = generatedContent[request.type];
                          const isLoading = loadingStates[request.type];

                          return (
                            <Card
                              key={request.type}
                              className={`transition-all ${
                                hasContent
                                  ? "border-green-200 bg-green-50"
                                  : "hover:border-purple-200 hover:shadow-md"
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-5 w-5" />
                                    <CardTitle className="text-base">
                                      {request.title}
                                    </CardTitle>
                                  </div>
                                  {hasContent && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-700"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Generated
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {request.description}
                                </p>

                                {!hasContent ? (
                                  <div className="space-y-2">
                                    <Button
                                      className="w-full"
                                      onClick={() =>
                                        handleGenerateContent(request.type)
                                      }
                                      disabled={isLoading}
                                      variant="default"
                                    >
                                      {isLoading ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <Wand2 className="h-4 w-4 mr-2" />
                                          Generate Content
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      disabled={true}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Preview (Generate first)
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                          handlePreviewContent(
                                            request.type,
                                            request.title
                                          )
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                          handleGenerateContent(request.type)
                                        }
                                        disabled={isLoading}
                                      >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Regenerate
                                      </Button>
                                    </div>
                                    <ContentViewer
                                      content={
                                        generatedContent[request.type]
                                          ?.content ||
                                        generatedContent[request.type]
                                      }
                                      type={request.type}
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <Separator />

                      {/* Quick Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              {
                                type: ContentType.TITLE_SUGGESTIONS,
                                icon: Sparkles,
                                color: "yellow",
                                title: "Improve Title",
                                description:
                                  "Get 5 compelling title alternatives",
                              },
                              {
                                type: ContentType.DESCRIPTION_IMPROVEMENT,
                                icon: BookOpen,
                                color: "blue",
                                title: "Expand Description",
                                description: "Create 2-3 enhanced descriptions",
                              },
                              {
                                type: ContentType.LEARNING_OBJECTIVES,
                                icon: Target,
                                color: "green",
                                title: "Learning Objectives",
                                description: "Define 5-8 measurable objectives",
                              },
                              {
                                type: ContentType.TARGET_AUDIENCE,
                                icon: Users,
                                color: "purple",
                                title: "Target Audience",
                                description: "Identify ideal student profile",
                              },
                            ].map((action) => {
                              const ActionIcon = action.icon;
                              const hasContent = generatedContent[action.type];
                              const isLoading = loadingStates[action.type];

                              return (
                                <div
                                  key={action.type}
                                  className="flex flex-col gap-2"
                                >
                                  <div className="space-y-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full h-auto py-3"
                                      style={{ width: "100%" }}
                                      onClick={() =>
                                        handleGenerateContent(action.type)
                                      }
                                      disabled={isLoading}
                                    >
                                      <div className="flex items-center gap-3 text-left">
                                        <ActionIcon
                                          className={`h-5 w-5 text-${action.color}-500 flex-shrink-0`}
                                        />
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">
                                            {action.title}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-0.5">
                                            {action.description}
                                          </div>
                                        </div>
                                      </div>
                                    </Button>
                                    {!hasContent && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        disabled={true}
                                      >
                                        <Eye className="h-3 w-3 mr-2" />
                                        Preview (Generate first)
                                      </Button>
                                    )}
                                  </div>
                                  {hasContent && (
                                    <div className="space-y-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                          handlePreviewContent(
                                            action.type,
                                            action.title
                                          )
                                        }
                                      >
                                        <Eye className="h-3 w-3 mr-2" />
                                        Preview {action.title}
                                      </Button>
                                      <ContentViewer
                                        content={
                                          generatedContent[action.type]
                                            ?.content ||
                                          generatedContent[action.type]
                                        }
                                        type={action.type}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progress Overview */}
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Generation Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span>Content Generated:</span>
                              <span className="font-medium">
                                {Object.keys(generatedContent).length} /{" "}
                                {generationRequests.length + 4}
                              </span>
                            </div>
                            <Progress
                              value={
                                (Object.keys(generatedContent).length /
                                  (generationRequests.length + 4)) *
                                100
                              }
                              className="h-2"
                            />
                            <p className="text-xs text-gray-600">
                              {Object.keys(generatedContent).length ===
                              generationRequests.length + 4
                                ? "All content generated! You're ready to enhance your course."
                                : "Generate more content to build comprehensive course materials."}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>AI Assistant Status: Active</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Connected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Data Persisted</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Step {currentStep + 1} of 4</span>
              <Badge variant="outline" className="text-xs">
                {data.title
                  ? "Course: " + data.title.substring(0, 20) + "..."
                  : "Untitled Course"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Content Preview Modal */}
      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        content={previewModal.content}
        type={previewModal.type}
        title={previewModal.title}
      />
    </Dialog>
  );
}
